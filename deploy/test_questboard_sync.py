#!/usr/bin/env python3
"""Checks deploy/questboard_sync.py against a small stand-in for Questboard's server (same /api/state and /api/sync rules:
last writer wins per record). Run: python3 deploy/test_questboard_sync.py  (or QB_SERVER=/path/to/questboard/server to use the real one)."""
import datetime as dt, json, os, subprocess, sys, tempfile, threading, time, urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import questboard_sync as qs

TOKEN = 'testtoken_testtoken_x'
DB = {}  # (coll, id) -> record


class Mock(BaseHTTPRequestHandler):
    def log_message(self, *a): pass

    def _s(self, code, o):
        b = json.dumps(o).encode(); self.send_response(code); self.send_header('Content-Length', str(len(b))); self.end_headers(); self.wfile.write(b)

    def _ok(self): return self.headers.get('Authorization') == f'Bearer {TOKEN}'

    def do_GET(self):
        if not self._ok(): return self._s(401, {})
        coll = self.path.split('coll=')[1]
        self._s(200, {coll: [r for (c, _), r in DB.items() if c == coll]})

    def do_POST(self):
        if not self._ok(): return self._s(401, {})
        body = json.loads(self.rfile.read(int(self.headers['Content-Length'])))
        n = 0
        for ch in body['changes']:
            k = (ch['c'], ch['r']['id']); old = DB.get(k)
            if not old or ch['r']['updatedAt'] > old['updatedAt']: DB[k] = ch['r']; n += 1
        self._s(200, {'accepted': n, 'rejected': 0})


def start():
    real = os.environ.get('QB_SERVER')
    if not real:
        srv = ThreadingHTTPServer(('127.0.0.1', 0), Mock); threading.Thread(target=srv.serve_forever, daemon=True).start()
        return f'http://127.0.0.1:{srv.server_address[1]}', None, None
    d = tempfile.mkdtemp(); port = 18791
    p = subprocess.Popen([sys.executable, os.path.join(real, 'qb_server.py')], env=dict(os.environ, QB_DATA=d, QB_TOKEN=TOKEN, QB_PORT=str(port)),
                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(50):
        try: urllib.request.urlopen(f'http://127.0.0.1:{port}/api/health'); break
        except OSError: time.sleep(0.1)
    return f'http://127.0.0.1:{port}', p, d


URL, PROC, _ = start()
qb = qs.QB(URL, TOKEN)
tmp = tempfile.mkdtemp(); PROFILE = os.path.join(tmp, 'default.json'); STATE = os.path.join(tmp, 'state.json')
os.environ.update(QB_URL=URL, QB_TOKEN=TOKEN, QB_TZ='Europe/Zurich', GAME_URL='https://rpg.example.com')
for k in ('QB_TOPIC_QM', 'QB_TOPIC_SOLID_STATE', 'QB_TOPIC_ASTROPHYSICS'): os.environ.pop(k, None)

tz = qs.tzinfo()
NOW = int(dt.datetime(2026, 11, 5, 18, 0, tzinfo=tz).timestamp() * 1000)
at = lambda day, h=15: int(dt.datetime.fromisoformat(f'{day}T{h:02d}:00').replace(tzinfo=tz).timestamp() * 1000)
idx = qs.course_index()
QM = next(e for e, c in idx.items() if c == 'qm'); SS = next(e for e, c in idx.items() if c == 'solid-state'); AS = next(e for e, c in idx.items() if c == 'astrophysics')
state = {
    'xp': 1000,
    'xpLog': {'2026-09-01': 30, '2026-11-03': 100, '2026-11-04': 50, '2026-11-05': -5},
    'solved': {QM: {'at': 1}, SS: {'at': 2}, AS: {'at': 3}, 'gone-id': {'at': 4}},
    'last': {'course': 'astrophysics', 'room': 'x'},
    'flags': {'activity': [{'t': at('2026-11-03'), 'id': QM, 'xp': 30}, {'t': at('2026-11-03', 16), 'id': SS, 'xp': 10},
                           {'t': at('2026-11-05'), 'id': SS, 'xp': 0, 'ok': False}]},
}


def save(): json.dump({'updated': NOW, 'state': state}, open(PROFILE, 'w'))
def run(*extra, now=NOW): return qs.main(['--profile-file', PROFILE, '--state-file', STATE, '--now-ms', str(now), *extra])
def ledger(): return {l['id']: l['amount'] for l in qb.state('ledger')}
def quests(): return {q['id']: q for q in qb.state('quests')}
def check(cond, what):
    print(('ok   ' if cond else 'FAIL ') + what)
    if not cond: global FAILED; FAILED = True


FAILED = False
save()
NOWG = NOW - 86400000
qb.push([{'c': 'goals', 'r': {'id': 'g-qm', 'title': '5.5 in QM 1', 'done': False, 'createdAt': NOWG, 'updatedAt': NOWG}},
         {'c': 'goals', 'r': {'id': 'g-ss', 'title': '5.0 in Festkörperphysik', 'done': False, 'createdAt': NOWG, 'updatedAt': NOWG}},
         {'c': 'goals', 'r': {'id': 'g-old', 'title': 'Astro Vorkurs', 'done': True, 'createdAt': 1, 'updatedAt': NOWG}},
         {'c': 'goals', 'r': {'id': 'g-as', 'title': '5.5 in Astro', 'done': False, 'createdAt': NOWG, 'updatedAt': NOWG}},
         {'c': 'goals', 'r': {'id': 'g-x', 'title': 'Liposome Microrobots Project', 'done': False, 'createdAt': NOWG, 'updatedAt': NOWG}}])
check(qs.split(10, {'qm': 1, 'solid-state': 1, 'astrophysics': 1}) == {'qm': 4, 'solid-state': 3, 'astrophysics': 3}, 'split adds up exactly')
check(run() == 0, 'first run succeeds')
L = ledger()
check(L['rpg.qm.2026-11-03'] == 75 and L['rpg.solid-state.2026-11-03'] == 25, 'a day is split by the XP of its exercises (30:10 of 100)')
check(L['rpg.astrophysics.2026-11-04'] == 50, 'a day without exercises goes to the course you were in last')
check(L.get('rpg.solid-state.2026-11-05', 0) == 0 and not any(v < 0 for v in L.values()), 'a day with negative net XP (hints) pays nothing')
check(sum(v for k, v in L.items() if k.startswith('rpg.')) == 1000, 'everything sent adds up to the game total (1000)')
check(sum(v for k, v in L.items() if k.endswith('.earlier')) == 1000 - 30 - 150, 'XP from before the daily log lands in "earlier"')
Q = quests()
check({k for k in Q if not k.endswith('.respawn')} == {'rpg.qm', 'rpg.solid-state', 'rpg.astrophysics'}, 'three course quests, one per course')
check(all(Q[f'rpg.{c}.respawn']['done'] and not Q[f'rpg.{c}.respawn']['inMatrix'] for c in ('qm', 'solid-state', 'astrophysics')),
      'no respawns due: the respawn quests are done and out of the matrix')
check(Q['rpg.qm']['inMatrix'] is False, 'the course quest is a tracker: out of the matrix, lives in its goal')
check(Q['rpg.qm']['topic'] == 'Quantenmechanik' and Q['rpg.solid-state']['title'] == 'Physics RPG · Festkörperphysik' and Q['rpg.astrophysics']['topic'] == 'Astrophysik', 'German topic names by default')
check(Q['rpg.qm']['link'] == 'https://rpg.example.com' and Q['rpg.qm']['quadrant'] == 'q2' and Q['rpg.qm']['done'] is False, 'quests link to the game, sit in Schedule, open')
check(Q['rpg.qm']['goalId'] == 'g-qm' and Q['rpg.solid-state']['goalId'] == 'g-ss' and Q['rpg.astrophysics']['goalId'] == 'g-as', 'each quest is linked to the open goal that names its course')
content = qs.load_content()
qm_total = sum(len([e for e in r['encounters'] if e.get('type') != 'sandbox' and not (e.get('book') or e.get('sim') or e.get('sheet'))]) for c in content['catalog'] if c['id'] == 'qm' for r in c['rooms'])  # the core, like the map
pq = Q['rpg.qm']['progress']
check(pq['total'] == qm_total and pq['done'] == 1 and 'exercises' in pq['text'] and 'rooms cleared' in pq['text'], f"progress: QM exercises passed of all ({pq['text']})")
check(Q['rpg.solid-state']['progress']['done'] == 1 and Q['rpg.astrophysics']['progress']['done'] == 1, 'one passed exercise per course is counted')
ledger_before = dict(L)

# nothing changed -> nothing sent
mark = {k: r['updatedAt'] for k, r in quests().items()}
check(run() == 0 and quests() == {k: v for k, v in quests().items()} and {k: r['updatedAt'] for k, r in quests().items()} == mark and ledger() == ledger_before, 'a second run without new XP changes nothing')

# the user moves and ticks a quest, renames another, deletes the third
r = dict(Q['rpg.qm'], quadrant='q1', done=True, doneAt=NOW, updatedAt=NOW + 10)
r2 = dict(Q['rpg.solid-state'], title='Festkörper im Spiel', updatedAt=NOW + 10)
qb.push([{'c': 'quests', 'r': r}, {'c': 'quests', 'r': r2}, {'c': 'quests', 'r': {'id': 'rpg.astrophysics', 'deleted': True, 'updatedAt': NOW + 10}}])
# a failed QM exercise is due now → one respawn quest in the matrix
state['reviews'] = {QM: {'due': NOW - 1000, 'box': 0, 'fails': 1}}; save()
run(now=NOW + 200000)
Q = quests()
check(Q['rpg.qm.respawn']['inMatrix'] is True and Q['rpg.qm.respawn']['done'] is False and '1 respawn due' in Q['rpg.qm.respawn']['title'],
      'a due respawn puts one quest in the matrix')
check(Q['rpg.qm.respawn'].get('goalId') is None, 'respawn quests are not counted in the goal')
check('1 respawns' not in Q['rpg.qm.respawn']['title'], 'singular for one')
check(Q['rpg.qm.respawn'].get('respawns') == 1 and Q['rpg.solid-state.respawn'].get('respawns') == 0, 'the count is a field too (Questboard shows it as a chip)')
state['reviews'] = {}; save()
run(now=NOW + 300000)
check(quests()['rpg.qm.respawn']['inMatrix'] is False and quests()['rpg.qm.respawn']['done'] is True, 'when none are due it leaves the matrix again')
# study time: 40 min on 2026-11-04 (30 min tagged QM derivations, 6 min drills without a course, 4 min untagged); 2026-11-03 untagged 10 min
state['flags']['active-since'] = '2026-11-01'
state['flags']['active'] = {'2026-11-03': 600, '2026-11-04': 2400}
state['flags']['activeBy'] = {'2026-11-04': {'qm|derivation': 1800, 'mixed|drills': 360}}
save(); run(now=NOW + 400000)
S = {s['id']: s for s in qb.state('sessions') if s['id'].startswith('rpgtime.')}
check(S['rpgtime.qm.2026-11-04.derivation']['durationMs'] == 1800000 and S['rpgtime.qm.2026-11-04.derivation']['questId'] == 'rpg.qm',
      'tagged time lands on its course quest and kind (30 min QM derivations)')
check(S['rpgtime.qm.2026-11-04.derivation']['topic'] == 'Quantenmechanik' and S['rpgtime.qm.2026-11-04.derivation']['date'] == '2026-11-04', 'with topic and date')
check(sum(s['durationMs'] for s in S.values()) == 3000000, 'all 50 minutes arrive, nothing twice')
check(S['rpgtime.astrophysics.2026-11-04.drills']['durationMs'] == 360000, 'time without a course follows the day (no exercise that day: last course)')
check(S['rpgtime.qm.2026-11-03.other']['durationMs'] + S['rpgtime.solid-state.2026-11-03.other']['durationMs'] == 600000,
      'untagged time is split like the day\'s XP (QM 30 : SS 10)')
qq = quests()['rpg.qm']
check('38m studied' in qq['progress']['text'] and 'derivations 30m' in qq['notes'] and qq['progress']['studyByKind']['derivation'] == 1800000,
      f"the quest shows the time and the kinds ({qq['progress']['text']})")
before = {k: v['updatedAt'] for k, v in S.items()}
run(now=NOW + 500000)
check({s['id']: s['updatedAt'] for s in qb.state('sessions') if s['id'].startswith('rpgtime.')} == before, 'unchanged time is not sent again')
state['flags']['activeBy']['2026-11-04']['qm|derivation'] = 2000; state['flags']['active']['2026-11-04'] = 2600; save(); run(now=NOW + 600000)
check({s['id']: s for s in qb.state('sessions')}['rpgtime.qm.2026-11-04.derivation']['durationMs'] == 2000000, 'more time updates the same record')
total_before = sum(s['durationMs'] for s in qb.state('sessions') if s['id'].startswith('rpgtime.'))
# the game now also knows WHEN: stretches replace that day's per-kind totals, at their real times
t14 = at('2026-11-04', 14); t15 = at('2026-11-04', 15)
state['flags']['activeLog'] = [{'s': t14, 'e': t14 + 2000000, 'c': 'qm', 'k': 'derivation'}, {'s': t15, 'e': t15 + 360000, 'c': 'mixed', 'k': 'drills'}]
save(); run(now=NOW + 700000)
S = {s['id']: s for s in qb.state('sessions') if s['id'].startswith('rpgtime.')}
blk = S.get(f'rpgtime.qm.2026-11-04.derivation.{t14 // 1000}')
check(blk is not None and blk['start'] == t14 and blk['end'] == t14 + 2000000 and blk.get('exact') is True, 'a stretch arrives at its real start and end (a calendar block)')
check(S['rpgtime.qm.2026-11-04.derivation']['durationMs'] == 0, 'the day\'s old per-kind total for that day is replaced, not counted twice')
check(sum(s['durationMs'] for s in S.values()) == total_before, f'the time in total stays the same ({total_before // 60000} min)')
check(S[f'rpgtime.astrophysics.2026-11-04.drills.{t15 // 1000}']['durationMs'] == 360000, 'a stretch without a course goes to the day\'s main course')
# the user unlinks the QM quest from its goal: it stays unlinked
qb.push([{'c': 'quests', 'r': dict(quests()['rpg.qm'], goalId=None, updatedAt=quests()['rpg.qm']['updatedAt'] + 1)}])
# new XP today in solid state
state['xp'] += 40; state['xpLog']['2026-11-05'] = 35; state['flags']['activity'].append({'t': at('2026-11-05', 17), 'id': SS, 'xp': 40}); save()
check(run(now=NOW + 60000) == 0, 'run after new XP succeeds')
L = ledger(); Q = quests()
check(L['rpg.solid-state.2026-11-05'] == 35, "today's XP lands on today (net 35 after the hint)")
check(sum(v for k, v in L.items() if k.startswith('rpg.')) == 1040, 'the total follows the game (1040)')
check(Q['rpg.qm']['quadrant'] == 'q1' and Q['rpg.qm']['done'] is True, 'your quadrant and tick are kept')
check(Q['rpg.solid-state']['title'] == 'Festkörper im Spiel' and '35 today' in Q['rpg.solid-state']['notes'], 'your title is kept, the notes show the XP')
check(Q['rpg.qm'].get('goalId') is None, 'a goal link you removed is not made again')
check(Q['rpg.astrophysics'].get('deleted') is True, 'a quest you deleted stays deleted')

# the memory file is lost (reinstall): nothing is paid twice
os.remove(STATE)
check(run(now=NOW + 120000) == 0 and sum(v for k, v in ledger().items() if k.startswith('rpg.')) == 1040, 'losing the memory file does not double the XP')
check(quests()['rpg.qm'].get('goalId') is None, '...and does not undo your goal unlinking')

# 30 days later the game has forgotten the old days; what was sent for them stays and the total still matches
later = NOW + 30 * 86400000
state['xpLog'] = {'2026-12-05': 20}; state['flags']['activity'] = [{'t': later - 3600000, 'id': AS, 'xp': 20}]; state['xp'] += 20; save()
check(run(now=later) == 0, 'run a month later succeeds')
L = ledger()
check(L['rpg.qm.2026-11-03'] == 75 and L['rpg.astrophysics.2026-12-05'] == 20, 'old days stay as sent, new days are added')
check(sum(v for k, v in L.items() if k.startswith('rpg.')) == 1060, 'the total still equals the game (1060)')

# custom topic names
os.environ['QB_TOPIC_QM'] = 'QM I'
check(run(now=later + 60000) == 0 and quests()['rpg.qm']['topic'] == 'QM I', 'topic names can be changed in the settings')

# wrong token
os.environ['QB_TOKEN'] = 'wrong'
check(qs.main(['--check']) == 1, '--check reports a wrong token')
if PROC: PROC.terminate()
print('FAILED' if FAILED else 'all passed'); sys.exit(1 if FAILED else 0)
