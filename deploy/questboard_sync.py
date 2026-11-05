#!/usr/bin/env python3
"""Copies the game's XP into Questboard (github.com/fumeia/questboard), so it counts there too.

Questboard gets one quest per course, "Physics RPG · <course>", whose topic is the course (so it sits next to the Notion
quests of that module), and one XP entry per course and day. Questboard's own sync then carries it to the desktop and the phone.
The game itself is not changed and shows nothing of Questboard.

  questboard_sync.py              # what the timer runs: push what changed since the last run
  questboard_sync.py --dry-run    # print the records instead of sending them
  questboard_sync.py --check      # test the connection to Questboard (token, address)

Settings (deploy/questboard-setup.sh writes /etc/physics-rpg/questboard.env):
  QB_URL, QB_TOKEN (required: Questboard's server address and token, the QB_TOKEN of its .env),
  QB_TOPIC_QM, QB_TOPIC_SOLID_STATE, QB_TOPIC_ASTROPHYSICS (topic names, default Quantenmechanik / Festkörperphysik / Astrophysik),
  GAME_URL (the quest's link), PHYSICS_RPG_PROFILES, PHYSICS_RPG_PROFILE (default "default"),
  QB_TZ (day boundaries, default Europe/Zurich), QB_SYNC_STATE (what was sent, default /var/lib/physics-rpg/questboard-state.json).

How the XP is split over the courses. The game keeps one XP total and the net XP per day (store.js, xpLog) plus the list of finished
exercises (flags.activity, with the XP each one gave). Per day, the day's XP is split in proportion to the XP of that day's exercises per
course, so XP without a course (missions bonus, drills, streak bonus, minus hints) follows the course you worked on. A day without any
exercise in the list goes to the course you were in last. XP from before the per-day log ("earlier") is split by finished exercises per course.
The sum of everything sent always equals the game's XP total.

Records (Questboard's docs/DATA_MODEL.md): quests `rpg.<course>`, ledger `rpg.<course>.<YYYY-MM-DD>` and `rpg.<course>.earlier`, kind "rpg".
The ids are fixed, so running this twice, or on two servers, never pays twice. Your own changes to the quests in Questboard
(quadrant, ticked, schedule, steps, a new title) are kept; a quest you delete in Questboard stays deleted.
"""
import argparse, datetime as dt, json, os, sys, time, urllib.error, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
GAME = os.path.join(HERE, '..', 'game')
COURSES = ('qm', 'solid-state', 'astrophysics')
DEFAULT_TOPICS = {'qm': 'Quantenmechanik', 'solid-state': 'Festkörperphysik', 'astrophysics': 'Astrophysik'}
WINDOW_DAYS = 14        # days that are re-checked every run (XP only lands on today, older days only change through a late sync from an offline phone)
QUADRANT = 'q2'         # "Schedule": important, not urgent


def env(k, d=None): v = os.environ.get(k); return v if v else d


def topics():
    return {c: env('QB_TOPIC_' + c.upper().replace('-', '_'), DEFAULT_TOPICS[c]) for c in COURSES}


def tzinfo():
    try:
        from zoneinfo import ZoneInfo
        return ZoneInfo(env('QB_TZ', env('NOTIFY_TZ', 'Europe/Zurich')))
    except Exception:
        return None


def day_of(ms, tz): return dt.datetime.fromtimestamp(ms / 1000, tz).date().isoformat()


def noon_ms(day, tz):  # ledger time of a day's entry: noon, so every client puts it on the same date whatever its time zone offset
    y, m, d = map(int, day.split('-'))
    return int(dt.datetime(y, m, d, 12, tzinfo=tz).timestamp() * 1000)


def course_index():
    """exercise id -> course id, from the game's content (same rooms and labs the game and notify.py load)."""
    sys.path.insert(0, HERE)
    import notify
    return {eid: v['course'] for eid, v in notify.load_content()['index'].items()}


def course_of(eid, index):
    if eid in index: return index[eid]
    for c in COURSES:  # missions, drills and other generated ids usually carry the course or an exercise id inside
        if eid.startswith(c + '-') or eid.startswith(c + '.') or eid.startswith(c + ':'): return c
    for part in eid.replace(':', '.').split('.'):
        if part in index: return index[part]
    return None


def split(total, weights):
    """Split an integer total in proportion to weights {course: w>=0} (largest remainder, so the parts add up exactly)."""
    s = sum(weights.values())
    if total <= 0 or s <= 0: return {}
    raw = {c: total * w / s for c, w in weights.items() if w > 0}
    out = {c: int(v) for c, v in raw.items()}
    for c in sorted(raw, key=lambda c: (-(raw[c] - out[c]), COURSES.index(c)))[:total - sum(out.values())]: out[c] += 1
    return {c: v for c, v in out.items() if v}


def amounts(state, index, tz, today):
    """{ledger id: amount} for every day of the game's XP log, plus the 'earlier' bucket (computed later, needs what is already sent)."""
    flags = state.get('flags') or {}
    by_day = {}  # day -> {course: [xp, count]}
    for a in flags.get('activity') or []:
        c = course_of(str(a.get('id', '')), index)
        if not c or not a.get('t'): continue
        w = by_day.setdefault(day_of(a['t'], tz), {}).setdefault(c, [0, 0])
        w[0] += max(0, int(a.get('xp') or 0)); w[1] += 1
    last = (state.get('last') or {}).get('course')
    fallback = last if last in COURSES else 'qm'
    out = {}
    for day, net in (state.get('xpLog') or {}).items():
        if day > today: continue
        total = max(0, int(net))
        acts = by_day.get(day, {})
        weights = {c: v[0] for c, v in acts.items()}
        if not sum(weights.values()): weights = {c: v[1] for c, v in acts.items()}
        if not sum(weights.values()): weights = {fallback: 1}
        parts = split(total, weights)
        for c in COURSES: out[f'rpg.{c}.{day}'] = parts.get(c, 0)
    return out


def earlier_split(state, index, total):
    w = {}
    for eid in (state.get('solved') or {}):
        c = course_of(eid, index)
        if c: w[c] = w.get(c, 0) + 1
    last = (state.get('last') or {}).get('course')
    return split(total, w or {last if last in COURSES else 'qm': 1})


# ------------------------------------------------------------------ Questboard API (server/qb_server.py)
class QB:
    def __init__(self, url, token):
        self.url, self.token = url.rstrip('/'), token

    def call(self, method, path, body=None):
        req = urllib.request.Request(self.url + path, method=method, data=json.dumps(body).encode() if body is not None else None,
                                     headers={'Authorization': f'Bearer {self.token}', 'Content-Type': 'application/json', 'User-Agent': 'physics-rpg-bridge'})
        with urllib.request.urlopen(req, timeout=30) as r: return json.loads(r.read() or b'{}')

    def state(self, coll): return self.call('GET', f'/api/state?coll={coll}').get(coll, [])

    def push(self, changes):
        # since = far future: we only write, pulling Questboard's whole record set is not needed
        return self.call('POST', '/api/sync', {'device': 'physics-rpg', 'platform': 'physics-rpg', 'name': 'Physics RPG (server)',
                                              'version': '1', 'since': 2 ** 53, 'changes': changes})


def quest_record(cid, topic, link, notes, existing, now):
    """Our fields on top of whatever Questboard has (the user's quadrant, done, schedule, steps, title are kept)."""
    if existing and existing.get('deleted'): return None
    rec = dict(existing) if existing else {'id': f'rpg.{cid}', 'title': f'Physics RPG · {topic}', 'quadrant': QUADRANT, 'done': False, 'createdAt': now}
    mine = {'topic': topic, 'source': 'physics-rpg', 'notes': notes}
    if link: mine['link'] = link
    if all(rec.get(k) == v for k, v in mine.items()) and existing: return None
    rec.update(mine); rec['updatedAt'] = max(now, int(rec.get('updatedAt') or 0) + 1)
    return rec


def run(args):
    url, token = env('QB_URL'), env('QB_TOKEN')
    if not (url and token) and not args.dry_run: print('QB_URL and QB_TOKEN must be set (see deploy/questboard-setup.sh)', file=sys.stderr); return 2
    qb = QB(url or 'http://localhost', token or '')
    if args.check:
        try: n = len(qb.state('quests'))
        except urllib.error.HTTPError as e: print(f'Questboard answered {e.code}' + (' (wrong token)' if e.code == 401 else ''), file=sys.stderr); return 1
        except (urllib.error.URLError, OSError) as e: print(f'cannot reach Questboard at {url}: {e}', file=sys.stderr); return 1
        print(f'ok: Questboard at {url} answers ({n} quests)'); return 0

    pfile = args.profile_file or os.path.join(env('PHYSICS_RPG_PROFILES', os.path.join(GAME, 'profiles')), env('PHYSICS_RPG_PROFILE', 'default') + '.json')
    try: state = json.load(open(pfile, encoding='utf-8')).get('state') or {}
    except (OSError, ValueError): print(f'no readable profile at {pfile}', file=sys.stderr); return 1
    sfile = args.state_file or env('QB_SYNC_STATE', '/var/lib/physics-rpg/questboard-state.json')
    try: memo = json.load(open(sfile))
    except (OSError, ValueError): memo = {}
    tz, now = tzinfo(), int(args.now_ms or time.time() * 1000)
    today = day_of(now, tz); top = topics(); link = env('GAME_URL', '')
    sent = memo.get('sent')
    if sent is None and not args.dry_run:  # first run (or the memory file was lost): learn what Questboard already has, so nothing is counted twice
        sent = {l['id']: l.get('amount', 0) for l in qb.state('ledger') if str(l.get('id', '')).startswith('rpg.') and not l.get('deleted')}
    sent = dict(sent or {})

    index = course_index()
    want = amounts(state, index, tz, today)
    first_day = min((k.rsplit('.', 1)[1] for k in want), default=today)
    since = (dt.date.fromisoformat(today) - dt.timedelta(days=WINDOW_DAYS)).isoformat()
    # older days that were already sent stay as they are (the game forgets per-day XP after 60 days and its exercise list after 45)
    for k in list(want):
        d = k.rsplit('.', 1)[1]
        if d < since and k in sent: want[k] = sent[k]
    days_total = sum(v for k, v in {**{k: v for k, v in sent.items() if not k.endswith('.earlier')}, **want}.items())
    early = earlier_split(state, index, max(0, int(state.get('xp') or 0) - days_total))
    for c in COURSES: want[f'rpg.{c}.earlier'] = early.get(c, 0)

    changes = []
    for k, amt in sorted(want.items()):
        if sent.get(k, 0) == amt and (k in sent or amt == 0): continue
        cid, day = k[4:].rsplit('.', 1)
        at = noon_ms(first_day, tz) - 86400000 if day == 'earlier' else noon_ms(day, tz)  # "earlier" sits on the day before the log starts
        changes.append({'c': 'ledger', 'r': {'id': k, 'updatedAt': now, 'at': at, 'amount': amt, 'kind': 'rpg', 'ref': f'rpg.{cid}',
                                             'note': f'Physics RPG · {top[cid]}' + (' (before the daily log)' if day == 'earlier' else '')}})

    totals = {c: sum(v for k, v in {**sent, **want}.items() if k.startswith(f'rpg.{c}.')) for c in COURSES}
    todays = {c: want.get(f'rpg.{c}.{today}', 0) for c in COURSES}
    qmemo = memo.get('quests', {})
    existing = {}
    for cid in COURSES:
        notes = f'XP from the Physics RPG in {top[cid]}: {totals[cid]} in total, {todays[cid]} today. Updated automatically; open the game with the link.'
        if qmemo.get(cid) == [notes, top[cid], link]: continue
        if not existing and not args.dry_run: existing = {q['id']: q for q in qb.state('quests') if str(q.get('id', '')).startswith('rpg.')}
        rec = quest_record(cid, top[cid], link, notes, existing.get(f'rpg.{cid}'), now)
        if rec: changes.append({'c': 'quests', 'r': rec})
        qmemo[cid] = [notes, top[cid], link]

    if args.dry_run:
        print(json.dumps({'totals': totals, 'today': todays, 'changes': changes}, indent=1, ensure_ascii=False)); return 0
    if changes:
        res = qb.push(changes)
        if res.get('rejected'): print(f"Questboard rejected {res['rejected']} records", file=sys.stderr); return 1
    for ch in changes:
        if ch['c'] == 'ledger': sent[ch['r']['id']] = ch['r']['amount']
    memo = {'sent': sent, 'quests': qmemo, 'at': now}
    try:
        os.makedirs(os.path.dirname(sfile) or '.', exist_ok=True)
        tmp = sfile + '.tmp'; json.dump(memo, open(tmp, 'w')); os.replace(tmp, sfile)
    except OSError as e: print(f'could not save {sfile}: {e}', file=sys.stderr)
    print(f"{len(changes)} change(s) sent. XP: " + ', '.join(f'{top[c]} {totals[c]}' for c in COURSES) if changes else 'nothing new')
    return 0


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--dry-run', action='store_true'); ap.add_argument('--check', action='store_true')
    ap.add_argument('--profile-file'); ap.add_argument('--state-file'); ap.add_argument('--now-ms', type=int, help='for tests')
    try: return run(ap.parse_args(argv))
    except (urllib.error.URLError, OSError) as e: print(f'Questboard not reachable: {e}', file=sys.stderr); return 1


if __name__ == '__main__':
    sys.exit(main())
