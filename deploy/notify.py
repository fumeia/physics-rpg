#!/usr/bin/env python3
"""Study notifications through ntfy (https://ntfy.sh or your own ntfy server).

Reads the saved profile and the game's content on the server, works out what is worth doing next (due respawns, the guided route,
the daily goal, the streak, the exam countdown) and sends a short message that names the exact exercise. Tapping it opens that
exercise in the game (?open=<id>, ?quick=1).

  notify.py --slot auto          # what the timer runs: morning / midday / evening (Sunday evening = week in review)
  notify.py --slot morning --dry-run      # print instead of sending
  notify.py --test               # send a test message
  notify.py --json               # the facts and every slot's message as JSON (used by the tests)

Settings come from environment variables (deploy/notify-setup.sh writes /etc/physics-rpg/notify.env):
  NTFY_TOPIC (required), NTFY_URL (default https://ntfy.sh), NTFY_TOKEN (optional access token), GAME_URL (for the tap links),
  PHYSICS_RPG_PROFILES (folder with the profile files), PHYSICS_RPG_PROFILE (default "default"), NOTIFY_TZ (default Europe/Zurich),
  NOTIFY_STATE (file that remembers what was sent today).

The logic mirrors game/src/main.js (nextRouteStep, routeDone, quickIds), game/src/store.js (streak, freeze) and missions.js
(examPlan); test/notify-parity.mjs checks that the browser and this script agree.
"""
import argparse, datetime as dt, json, math, os, random, re, sys, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
GAME = os.path.join(HERE, '..', 'game')
CONTENT = os.path.join(GAME, 'content')
COURSES = [('qm', 'Quantum Mechanics'), ('solid-state', 'Solid State'), ('astrophysics', 'Astrophysics')]
TYPE_NAME = {'lesson': 'Lesson', 'quiz': 'Quiz', 'derive': 'Derivation', 'calc': 'Calculation fight', 'lab': 'Experiment', 'predict-observe': 'Station', 'boss': 'Exam problem'}
EST = {'lesson': 10, 'quiz': 8, 'derive': 15, 'calc': 15, 'lab': 12, 'predict-observe': 10, 'boss': 30, 'sandbox': 5}
GOALS = {'light': 10, 'normal': 20, 'intense': 40}
GUIDE_SKIP = ('sandbox', 'boss')


# ------------------------------------------------------------------ content (same shape the game builds in boot())
def load_content():
    jl = lambda *p: json.load(open(os.path.join(CONTENT, *p), encoding='utf-8'))
    labs = []
    for f in ('labs', 'labs-qm', 'labs-solid-state', 'labs-astrophysics'):
        try: labs += jl(f + '.json')['labs']
        except (OSError, ValueError, KeyError): pass
    catalog = []
    for cid, _ in COURSES:
        idx = jl(cid, 'index.json')
        rooms = []
        for slug in idx['rooms']:
            r = jl(cid, slug + '.json'); r['slug'] = slug; rooms.append(r)
        for l in labs:
            lc, ls = l['room'].split('/')
            if lc != cid: continue
            r = next((x for x in rooms if x['slug'] == ls), None)
            if not r: continue
            at = 0
            for i, e in enumerate(r['encounters']):
                if e['type'] == 'lesson': at = i + 1
            r['encounters'].insert(at, l['enc'])
        catalog.append({'id': cid, 'region': idx.get('region', cid), 'rooms': rooms})
    index = {}
    for c in catalog:
        for r in c['rooms']:
            for e in r['encounters']: index[e['id']] = {'course': c['id'], 'room': r, 'enc': e}
    route = jl('path.json')['route']
    return {'catalog': catalog, 'index': index, 'route': route}


def exam_date():
    try: return re.search(r"EXAM_DATE\s*=\s*'(\d{4}-\d{2}-\d{2})'", open(os.path.join(GAME, 'src', 'missions.js'), encoding='utf-8').read()).group(1)
    except (OSError, AttributeError): return '2027-01-15'


# ------------------------------------------------------------------ progress (mirrors store.js)
def week_key(date):
    y, m, d = map(int, date.split('-'))
    t = dt.date(y, m, d); t = t - dt.timedelta(days=t.weekday()) + dt.timedelta(days=3)  # the Thursday of this week decides the year
    first = dt.date(t.year, 1, 4)
    wk = 1 + round(((t - first).days - 3 + first.weekday()) / 7)
    return f'{t.year}-W{wk:02d}'


class Progress:
    def __init__(self, state, content, now):
        self.s, self.c, self.now = state or {}, content, now
        self.today = now.date().isoformat()
        self.yesterday = (now.date() - dt.timedelta(days=1)).isoformat()
        self.before = (now.date() - dt.timedelta(days=2)).isoformat()

    flags = property(lambda self: self.s.get('flags') or {})
    def solved(self, id): return bool((self.s.get('solved') or {}).get(id))
    def passed(self, id): x = (self.s.get('solved') or {}).get(id); return bool(x) and not x.get('failed')
    def locked(self, e): return bool(e.get('requires')) and not self.passed(e['requires'])
    def settings(self): return self.flags.get('settings') or {}
    def goal_min(self): return GOALS.get(self.settings().get('goal'), GOALS['normal'])
    def study_min(self, date): return int(round(((self.flags.get('study') or {}).get(date) or 0) / 60))
    def missions_done(self, date): return len(((self.s.get('missions') or {}).get(date) or {}).get('done') or {})
    def updated(self): return (self.s.get('updated') or 0) / 1000

    def due(self):
        ms = self.now.timestamp() * 1000
        rows = [(r.get('due', 0), id) for id, r in (self.s.get('reviews') or {}).items() if r.get('due', 0) <= ms and id in self.c['index']]
        return [id for _, id in sorted(rows, key=lambda r: r[0])]  # most overdue first (stable: ties keep the saved order, like the game)

    def freeze_available(self, date): return ((self.s.get('freeze') or {}).get('week') or '') != week_key(date)

    def streak(self):
        st = self.s.get('streak') or {'last': None, 'count': 0}
        if st.get('last') in (self.today, self.yesterday): return {'count': st['count'], 'alive': True, 'saved': False, 'today': st['last'] == self.today}
        if st.get('last') == self.before and self.freeze_available(self.today): return {'count': st['count'], 'alive': True, 'saved': True, 'today': False}
        return {'count': 0, 'alive': False, 'saved': False, 'today': False}

    # ---- the guided route (main.js nextRouteStep / routeDone)
    def route_done(self, room):
        es = [e for e in room['encounters'] if e['type'] not in ('sandbox', 'boss', 'lab')]
        return not es or sum(1 for e in es if self.passed(e['id'])) / len(es) >= 0.75

    def find_room(self, key):
        c, slug = key.split('/')
        for course in self.c['catalog']:
            if course['id'] == c:
                for r in course['rooms']:
                    if r['slug'] == slug: return course, r
        return None, None

    def next_step(self):
        for item in self.c['route']:
            course, room = self.find_room(item['key'])
            if not room or self.route_done(room): continue
            enc = next((e for e in room['encounters'] if e['type'] not in GUIDE_SKIP and not self.solved(e['id']) and not self.locked(e)), None) \
                or next((e for e in room['encounters'] if e['type'] != 'sandbox' and not self.passed(e['id']) and not self.locked(e)), None)
            return {'key': item['key'], 'course': course['id'], 'room': room, 'enc': enc}
        return None

    def exam_plan(self):
        total = done = 0
        for c in self.c['catalog']:
            for r in c['rooms']:
                for e in r['encounters']:
                    if e['type'] != 'sandbox':
                        total += 1; done += self.passed(e['id'])
        y, m, d = map(int, exam_date().split('-'))
        days = max(0, (dt.date(y, m, d) - self.now.date()).days); left = total - done
        return {'days': days, 'total': total, 'done': done, 'left': left, 'perDay': math.ceil(left / days) if days > 0 else left}

    def weak_rooms(self, limit=2):
        score = {}
        idx = self.c['index']; nowms = self.now.timestamp() * 1000
        for m in self.flags.get('errlog') or []:
            ref = idx.get(m.get('encId'))
            if ref and m.get('open'): k = f"{ref['course']}/{ref['room']['slug']}"; score[k] = score.get(k, 0) + max(0.3, 1 - (nowms - m.get('t', 0)) / (60 * 86400000))
        for id, r in (self.s.get('reviews') or {}).items():
            ref = idx.get(id)
            if ref: k = f"{ref['course']}/{ref['room']['slug']}"; score[k] = score.get(k, 0) + 1 + 0.5 * (r.get('fails') or 1)
        return [k for k, _ in sorted(score.items(), key=lambda kv: -kv[1])[:limit]]

    def week(self):
        days = [(self.now.date() - dt.timedelta(days=6 - i)).isoformat() for i in range(7)]
        minutes = [self.study_min(d) for d in days]; cutoff = (self.now.timestamp() - 7 * 86400) * 1000; idx = self.c['index']
        ex = sum(1 for id, v in (self.s.get('solved') or {}).items() if id in idx and v.get('at', 0) >= cutoff and not v.get('failed'))
        courses = []
        for c in self.c['catalog']:
            allx = [e for r in c['rooms'] for e in r['encounters'] if e['type'] != 'sandbox']
            courses.append({'id': c['id'], 'passed': sum(1 for e in allx if self.passed(e['id'])), 'total': len(allx)})
        return {'minutes': sum(minutes), 'studied': sum(1 for x in minutes if x > 0), 'exercises': ex, 'missions': sum(self.missions_done(d) for d in days), 'courses': courses}

    def quick_ids(self):
        out = []
        est = lambda id: EST.get(self.c['index'][id]['enc']['type'], 10)
        mins = lambda: sum(est(i) for i in out)
        for id in self.due()[:2]:
            if id not in out: out.append(id)
        n = self.next_step()
        if n:
            if n['enc'] and n['enc']['id'] not in out: out.append(n['enc']['id'])
            for e in n['room']['encounters']:
                if mins() >= 10 or len(out) >= 3: break
                if e['type'] not in ('sandbox', 'boss') and not self.passed(e['id']) and not self.locked(e) and EST.get(e['type'], 10) + mins() <= 14 and e['id'] not in out: out.append(e['id'])
        return out[:3]


# ------------------------------------------------------------------ wording
def plain(t, n=64):
    t = re.sub(r'\\[A-Za-z]+', '', str(t or '').replace('$', '')); t = re.sub(r'\s+', ' ', t).strip()
    if len(t) <= n: return t
    cut = t[:n].rsplit(' ', 1)[0].rstrip(',;:-')
    return cut + '…'

def plural(n, w): return f'{n} {w}' + ('' if n == 1 else 's')

def short_course(cid): return dict(COURSES).get(cid, cid)


def step_line(P, step):
    if not step: return None
    e = step['enc']
    if not e: return f"Next room: {plain(step['room']['title'])}"
    return f"{TYPE_NAME.get(e['type'], e['type'])} \u201c{plain(e.get('title') or e['id'])}\u201d in {plain(step['room']['title'], 40)}, ~{EST.get(e['type'], 10)} min"


def link(base, **q):
    if not base: return None
    qs = '&'.join(f'{k}={v}' for k, v in q.items())
    return base.rstrip('/') + '/' + (f'?{qs}' if qs else '')


def message(P, slot, base):
    """-> (message dict | None, reason). Plain text, a few short lines, specific to the current state."""
    rnd = random.Random(f'{P.today}:{slot}'); pick = lambda xs: xs[rnd.randrange(len(xs))]
    step, due, st, plan = P.next_step(), P.due(), P.streak(), P.exam_plan()
    today_min, goal = P.study_min(P.today), P.goal_min()
    done_today = today_min >= goal
    lines, tags, prio = [], [], 3
    nxt = step_line(P, step); quick = len(P.quick_ids())
    open_next = link(base, open=step['enc']['id']) if step and step['enc'] else link(base)
    quick_url = link(base, quick=1)

    if slot == 'morning':
        title = f"{short_course(step['course'])}: {plain(step['enc']['title'], 42)}" if step and step['enc'] else 'Exam training day'
        lines.append(pick(['Fresh head, best time to learn. Start with this one.', 'Ten focused minutes now make the rest of the day easier.',
                           'Do the first exercise before anything else. Momentum does the rest.', 'Small and steady beats big and rare. Here is your first step.']))
        if due: lines.append(f"{plural(len(due), 'respawn')} due ({plain(P.c['index'][due[0]]['enc'].get('title') or due[0], 40)}{', ...' if len(due) > 1 else ''}): clear them first, they lock in what you already learned.")
        lines.append(f'Then: {nxt}' if due and nxt else (nxt or 'The guided route is finished: do a mock exam in the Exam hall today.'))
        lines.append(pick([f"{plan['days']} days to the exam. {plan['perDay']} a day keeps you on pace.", f"Exam in {plan['days']} days: {plan['left']} items to go, about {plan['perDay']} a day."]))
        if st['alive'] and not st['today']: lines.append(f"Streak: {st['count']} days. One mission keeps it.")
        tags = ['books']; click = quick_url if due else open_next
        actions = [('Open exercise', open_next), ('Quick session', quick_url)]
    elif slot == 'midday':
        if today_min >= 5 or P.missions_done(P.today): return None, 'already studied today'
        title = pick(['Ten minutes, right now', 'A quick win before the afternoon', 'Nothing studied yet today'])
        lines.append(f"Quick session: {plural(quick, 'exercise') if quick else 'nothing due'}, about 10 minutes." if quick else 'Nothing is due. One new exercise is enough.')
        if due: lines.append(f"{plural(len(due), 'respawn')} due. They are the cheapest points you can collect.")
        if nxt: lines.append(f'Next: {nxt}')
        if st['alive'] and not st['today']: lines.append(f"Streak: {st['count']} days. Do not let it end today.")
        tags = ['hourglass_flowing_sand']; click = quick_url; actions = [('Quick session', quick_url), ('Open exercise', open_next)]
    elif slot == 'evening':
        if done_today: return None, 'daily goal reached'
        left = max(1, goal - today_min)
        if st['saved']: title = f"Your {st['count']}-day streak needs one mission today"
        elif st['alive'] and not st['today']: title = f"Protect your {st['count']}-day streak"
        elif st['today']: title = f'{left} min to your daily goal'
        else: title = pick(['Start a streak tonight', 'One mission tonight'])
        if st['saved']: lines.append('Your weekly freeze is covering yesterday. Do one mission today and the streak survives.')
        elif st['alive'] and not st['today']: lines.append('One mission is enough to keep it.')
        elif st['today']: lines.append('The streak is safe for today. The rest is a bonus.')
        else: lines.append('One mission today starts a new streak.')
        lines.append(f"Today: {today_min} of {goal} min.")
        lines.append(f'Easiest start: {nxt}' if nxt else 'The route is finished: a mock exam is the best use of time.')
        prio = 4 if st['alive'] and not st['today'] else 3; tags = ['fire'] if st['alive'] else ['seedling']; click = quick_url; actions = [('Quick session', quick_url), ('Open exercise', open_next)]
    elif slot == 'weekly':
        w = P.week(); best = max(w['courses'], key=lambda c: c['passed'] / max(1, c['total'])); weak = P.weak_rooms(1)
        title = f"Week in review: {w['minutes']} min, {w['exercises']} exercises"
        lines.append(f"You studied on {w['studied']} of the last 7 days and finished {plural(w['missions'], 'mission')}.")
        lines.append(f"Strongest: {short_course(best['id'])} ({best['passed']}/{best['total']})." + (f" Needs work: {plain(P.find_room(weak[0])[1]['title'], 40)}." if weak else ''))
        lines.append(f"{plan['days']} days to the exam, {plan['left']} items to go: about {plan['perDay']} a day.")
        if nxt: lines.append(f'Start next week with: {nxt}')
        tags = ['bar_chart']; click = open_next; actions = [('Open exercise', open_next), ('Quick session', quick_url)]
    else:
        return None, f'unknown slot {slot}'
    msg = {'title': title, 'message': '\n'.join(lines), 'priority': prio, 'tags': tags}
    if click: msg['click'] = click
    acts = [{'action': 'view', 'label': l, 'url': u} for l, u in actions if u]
    if acts: msg['actions'] = acts[:2]
    return msg, 'ok'


def auto_slot(now):
    if now.hour < 11: return 'morning'
    if now.hour < 16: return 'midday'
    return 'weekly' if now.weekday() == 6 else 'evening'


# ------------------------------------------------------------------ sending
def send(msg, topic, url='https://ntfy.sh', token=None):
    body = dict(msg, topic=topic)
    req = urllib.request.Request(url.rstrip('/') + '/', data=json.dumps(body).encode('utf-8'), method='POST', headers={'Content-Type': 'application/json'})
    if token: req.add_header('Authorization', f'Bearer {token}')
    with urllib.request.urlopen(req, timeout=20) as r: return r.status


def now_in(tzname, iso=None):
    try:
        from zoneinfo import ZoneInfo
        tz = ZoneInfo(tzname)
    except Exception:
        tz = None
    n = dt.datetime.fromisoformat(iso) if iso else dt.datetime.now(dt.timezone.utc)
    if n.tzinfo is None: n = n.replace(tzinfo=tz) if tz else n
    return n.astimezone(tz) if tz else n


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--slot', default='auto', choices=['auto', 'morning', 'midday', 'evening', 'weekly'])
    ap.add_argument('--dry-run', action='store_true'); ap.add_argument('--force', action='store_true', help='ignore the skip rules and the sent-today memory')
    ap.add_argument('--test', action='store_true'); ap.add_argument('--json', action='store_true')
    ap.add_argument('--profile-file'); ap.add_argument('--now', help='ISO time, for tests')
    a = ap.parse_args(argv); env = os.environ.get
    now = now_in(env('NOTIFY_TZ', 'Europe/Zurich'), a.now)
    topic, url, token, base = env('NTFY_TOPIC'), env('NTFY_URL', 'https://ntfy.sh'), env('NTFY_TOKEN'), env('GAME_URL', '')
    if a.test:
        msg = {'title': 'Physics RPG: notifications work', 'message': 'This is a test. Study reminders will arrive here, each naming the exact exercise to do next.', 'priority': 3, 'tags': ['white_check_mark']}
        if base: msg['click'] = base
        if not topic: print('NTFY_TOPIC is not set', file=sys.stderr); return 2
        print('sent' if send(msg, topic, url, token) == 200 else 'failed'); return 0
    pdir = env('PHYSICS_RPG_PROFILES', os.path.join(GAME, 'profiles')); pfile = a.profile_file or os.path.join(pdir, env('PHYSICS_RPG_PROFILE', 'default') + '.json')
    try: state = json.load(open(pfile, encoding='utf-8')).get('state') or {}
    except (OSError, ValueError): print(f'no readable profile at {pfile}', file=sys.stderr); return 1
    P = Progress(state, load_content(), now)
    if a.json:
        step = P.next_step(); week = P.week()
        out = {'today': P.today, 'next': {'key': step['key'], 'enc': step['enc']['id'] if step['enc'] else None} if step else None, 'due': P.due(), 'quick': P.quick_ids(), 'streak': P.streak(),
               'minutesToday': P.study_min(P.today), 'goal': P.goal_min(), 'plan': P.exam_plan(), 'week': week, 'weak': P.weak_rooms(2),
               'messages': {s: dict(zip(('message', 'reason'), message(P, s, base))) for s in ('morning', 'midday', 'evening', 'weekly')}}
        print(json.dumps(out, indent=1, ensure_ascii=False)); return 0
    slot = auto_slot(now) if a.slot == 'auto' else a.slot
    skey = f'{P.today}:{slot}'; sfile = env('NOTIFY_STATE', '/var/lib/physics-rpg/notify-state.json')
    try: memo = json.load(open(sfile))
    except (OSError, ValueError): memo = {}
    if not a.force and skey in memo.get('sent', {}): print(f'{slot}: already sent today'); return 0
    if not a.force and slot != 'weekly' and now.timestamp() - P.updated() < 3600: print(f'{slot}: skipped, you were studying a moment ago'); return 0
    msg, why = message(P, slot, base)
    if not msg: print(f'{slot}: skipped ({why})'); return 0
    if a.dry_run or not topic:
        print(f"[{slot}] {msg['title']}\n{msg['message']}\n-> {msg.get('click', '')}  priority {msg['priority']}  tags {msg['tags']}" + ('' if topic or a.dry_run else '\n(NTFY_TOPIC is not set: nothing sent)')); return 0
    status = send(msg, topic, url, token); print(f'{slot}: sent ({status})')
    memo.setdefault('sent', {})[skey] = int(now.timestamp()); memo['sent'] = dict(sorted(memo['sent'].items())[-30:])
    try:
        os.makedirs(os.path.dirname(sfile), exist_ok=True); json.dump(memo, open(sfile, 'w'))
    except OSError as e: print(f'could not save {sfile}: {e}', file=sys.stderr)
    return 0


if __name__ == '__main__':
    sys.exit(main())
