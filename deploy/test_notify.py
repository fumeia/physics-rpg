#!/usr/bin/env python3
"""Tests for notify.py: wording per situation, skip rules, the ntfy request, the sent-today memory.  python3 deploy/test_notify.py"""
import datetime as dt, json, os, sys, tempfile, threading, unittest
from http.server import BaseHTTPRequestHandler, HTTPServer
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import notify

CONTENT = notify.load_content()
TZ = dt.timezone(dt.timedelta(hours=2))
def at(date, hh=8, mm=15): return dt.datetime.fromisoformat(f'{date}T{hh:02d}:{mm:02d}:00').replace(tzinfo=TZ)
def ms(t): return int(t.timestamp() * 1000)
NOW = at('2026-10-24')                      # Saturday
TODAY, YEST, BEFORE = '2026-10-24', '2026-10-23', '2026-10-22'
def prog(state=None, now=NOW): return notify.Progress(state or {}, CONTENT, now)
def state(**kw): return {'updated': ms(NOW) - 5 * 3600e3, 'xp': 0, 'solved': {}, 'reviews': {}, 'flags': {}, **kw}


class Wording(unittest.TestCase):
    def test_fresh_profile_morning_names_the_first_exercise(self):
        m, why = notify.message(prog(state()), 'morning', 'https://rpg.example.com')
        step = prog(state()).next_step()
        self.assertEqual(why, 'ok'); self.assertIn(step['enc']['title'].split(':')[0][:20], m['title'] + m['message'])
        self.assertEqual(m['click'], f"https://rpg.example.com/?suggest=open:{step['enc']['id']}")          # tapping opens the chooser
        self.assertEqual(m['actions'][0]['url'], f"https://rpg.example.com/?open={step['enc']['id']}")      # the first button starts it
        self.assertRegex(m['message'], r'83 days|Exam in 83'); self.assertLessEqual(len(m['message'].split('\n')), 5)

    def test_due_respawns_come_first_and_the_tap_starts_a_quick_session(self):
        solved = {'qm-wm-Q1': {'at': ms(NOW) - 2 * 86400e3}}
        s = state(solved=solved, reviews={'qm-wm-Q1': {'box': 0, 'due': ms(NOW) - 1000, 'fails': 1}})
        m, _ = notify.message(prog(s), 'morning', 'https://rpg.example.com')
        self.assertIn('1 respawn due', m['message']); self.assertIn('clear them first', m['message']); self.assertTrue(m['click'].endswith('/?suggest=quick')); self.assertTrue(m['actions'][0]['url'].endswith('/?quick=1'))
        self.assertEqual(prog(s).quick_ids()[0], 'qm-wm-Q1')

    def test_midday_is_skipped_once_you_studied(self):
        m, why = notify.message(prog(state(flags={'study': {TODAY: 600}})), 'midday', None); self.assertIsNone(m); self.assertIn('already', why)
        m, why = notify.message(prog(state(missions={TODAY: {'done': {'x': True}, 'xp': 5}})), 'midday', None); self.assertIsNone(m)
        m, _ = notify.message(prog(state()), 'midday', 'https://x'); self.assertIn('Quick session', m['message'])

    def test_evening_protects_the_streak_and_is_skipped_when_the_goal_is_reached(self):
        s = state(streak={'last': YEST, 'count': 6})
        m, _ = notify.message(prog(s), 'evening', 'https://x'); self.assertIn('6-day streak', m['title']); self.assertEqual(m['priority'], 4)
        m, why = notify.message(prog(state(streak={'last': YEST, 'count': 6}, flags={'study': {TODAY: 21 * 60}})), 'evening', None); self.assertIsNone(m); self.assertIn('goal', why)
        m, _ = notify.message(prog(state()), 'evening', 'https://x'); self.assertEqual(m['priority'], 3)

    def test_the_weekly_freeze_is_mentioned_when_it_is_what_keeps_the_streak(self):
        m, _ = notify.message(prog(state(streak={'last': BEFORE, 'count': 9})), 'evening', 'https://x')
        self.assertIn('weekly freeze', m['message']); self.assertIn('9-day streak', m['title'])
        used = state(streak={'last': BEFORE, 'count': 9}, freeze={'week': notify.week_key(TODAY)})
        m, _ = notify.message(prog(used), 'evening', 'https://x'); self.assertNotIn('9-day', m['title'])    # freeze gone: the streak is over

    def test_goal_setting_changes_the_numbers(self):
        s = state(flags={'settings': {'goal': 'intense'}, 'study': {TODAY: 600}})
        m, _ = notify.message(prog(s), 'evening', 'https://x'); self.assertIn('10 of 40 min', m['message'])

    def test_weekly_review_has_the_facts(self):
        s = state(solved={'qm-wm-L1': {'at': ms(NOW) - 86400e3}, 'qm-wm-L2': {'at': ms(NOW) - 20 * 86400e3}}, flags={'study': {TODAY: 1800, YEST: 600}})
        m, _ = notify.message(prog(s), 'weekly', 'https://x')
        self.assertIn('Week in review: 40 min, 1 exercises', m['title']); self.assertIn('2 of the last 7 days', m['message']); self.assertIn('Strongest', m['message'])

    def test_finished_route_points_to_the_exam_hall(self):
        solved = {id: {'at': 1} for id in CONTENT['index']}
        m, _ = notify.message(prog(state(solved=solved)), 'morning', 'https://x'); self.assertIn('mock exam', m['message']); self.assertEqual(m['title'], 'Exam training day')

    def test_latex_is_stripped_from_titles(self):
        self.assertEqual(notify.plain(r'The $\psi$ box and $E=\hbar\omega$'), 'The box and E=')
        self.assertTrue(len(notify.plain('word ' * 40, 64)) <= 65)


class Buttons(unittest.TestCase):
    CFG = {'topic': 'rpg-test', 'url': 'https://ntfy.sh', 'token': None}
    def test_three_buttons_start_now_ten_minutes_later(self):
        m, _ = notify.message(prog(state()), 'morning', 'https://rpg.example.com', self.CFG)
        self.assertEqual([a['label'] for a in m['actions']], ['Start now', 'In 10 min', 'Later\u2026'])
        start, snooze, later = m['actions']
        self.assertEqual(start['action'], 'view'); self.assertIn('?open=', start['url']); self.assertEqual(later['url'], m['click'])
        self.assertEqual((snooze['action'], snooze['method'], snooze['url']), ('http', 'POST', 'https://ntfy.sh/'))
        body = json.loads(snooze['body'])                      # what ntfy is asked to deliver in 10 minutes
        self.assertEqual((body['topic'], body['delay']), ('rpg-test', '10m')); self.assertTrue(body['title'].startswith('Reminder: ')); self.assertEqual(body['click'], m['click'])
        self.assertEqual([a['label'] for a in body['actions']], ['Start now', 'Later\u2026'])   # no endless chain of snooze buttons
        self.assertIn('Start it, or move it again', body['message'])
    def test_no_one_tap_button_on_a_protected_topic(self):
        m, _ = notify.message(prog(state()), 'morning', 'https://rpg.example.com', dict(self.CFG, token='tk_x'))
        self.assertEqual([a['label'] for a in m['actions']], ['Start now', 'Later\u2026'])    # the http button could not authenticate
    def test_quick_session_suggestions_use_the_quick_link(self):
        m, _ = notify.message(prog(state()), 'midday', 'https://rpg.example.com', self.CFG)
        self.assertTrue(m['click'].endswith('?suggest=quick')); self.assertTrue(m['actions'][0]['url'].endswith('?quick=1'))
        self.assertIn('Quick session', json.loads(m['actions'][1]['body'])['message'])
    def test_no_buttons_without_a_game_address(self):
        m, _ = notify.message(prog(state()), 'morning', '', self.CFG); self.assertNotIn('actions', m); self.assertNotIn('click', m)


class Rules(unittest.TestCase):
    def test_auto_slot(self):
        self.assertEqual(notify.auto_slot(at(TODAY, 8)), 'morning'); self.assertEqual(notify.auto_slot(at(TODAY, 13)), 'midday'); self.assertEqual(notify.auto_slot(at(TODAY, 19)), 'evening')
        self.assertEqual(notify.auto_slot(at('2026-10-25', 19)), 'weekly')   # Sunday evening
    def test_week_keys_agree_with_the_game(self):
        self.assertEqual([notify.week_key(d) for d in ('2026-10-19', '2026-10-25', '2026-10-26', '2027-01-01', '2024-12-30')], ['2026-W43', '2026-W43', '2026-W44', '2026-W53', '2025-W01'])


class Handler(BaseHTTPRequestHandler):
    got = []
    def do_POST(self):
        Handler.got.append((self.path, dict(self.headers), json.loads(self.rfile.read(int(self.headers['Content-Length']))))); self.send_response(200); self.end_headers(); self.wfile.write(b'{}')
    def log_message(self, *a): pass


class Sending(unittest.TestCase):
    def setUp(self):
        Handler.got = []; self.srv = HTTPServer(('127.0.0.1', 0), Handler); threading.Thread(target=self.srv.serve_forever, daemon=True).start()
        self.dir = tempfile.mkdtemp(); self.profile = os.path.join(self.dir, 'default.json'); json.dump({'state': state()}, open(self.profile, 'w'))
        self.env = {'NTFY_TOPIC': 'rpg-test', 'NTFY_URL': f'http://127.0.0.1:{self.srv.server_port}', 'GAME_URL': 'https://rpg.example.com', 'NOTIFY_STATE': os.path.join(self.dir, 'memo.json'), 'NOTIFY_TZ': 'Europe/Zurich', 'NTFY_TOKEN': 'tk_secret'}
    def tearDown(self): self.srv.shutdown()
    def run_main(self, *args):
        old = dict(os.environ); os.environ.update(self.env)
        try: return notify.main(['--profile-file', self.profile, '--now', '2026-10-24T08:15:00+02:00', *args])
        finally: os.environ.clear(); os.environ.update(old)

    def test_sends_json_with_title_click_actions_and_token(self):
        self.assertEqual(self.run_main('--slot', 'morning'), 0)
        path, headers, body = Handler.got[0]
        self.assertEqual(body['topic'], 'rpg-test'); self.assertTrue(body['title']); self.assertIn('click', body); self.assertEqual(body['actions'][0]['action'], 'view')
        self.assertEqual(headers['Authorization'], 'Bearer tk_secret'); self.assertIn('\n', body['message'])
    def test_does_not_send_twice_for_the_same_slot_and_day(self):
        self.run_main('--slot', 'morning'); self.run_main('--slot', 'morning'); self.assertEqual(len(Handler.got), 1)
        self.run_main('--slot', 'morning', '--force'); self.assertEqual(len(Handler.got), 2)
    def test_stays_quiet_while_you_are_studying(self):
        json.dump({'state': state(updated=ms(NOW) - 600e3)}, open(self.profile, 'w')); self.run_main('--slot', 'morning'); self.assertEqual(Handler.got, [])
    def test_dry_run_sends_nothing(self):
        self.run_main('--slot', 'morning', '--dry-run'); self.assertEqual(Handler.got, [])
    def test_test_message(self):
        old = dict(os.environ); os.environ.update(self.env)
        try: self.assertEqual(notify.main(['--test']), 0)
        finally: os.environ.clear(); os.environ.update(old)
        self.assertIn('work', Handler.got[0][2]['title'])
    def test_missing_profile_is_not_a_crash(self):
        self.profile = os.path.join(self.dir, 'nope.json'); self.assertEqual(self.run_main('--slot', 'morning'), 1)


class RemindEndpoint(unittest.TestCase):
    """game/serve.py POST /api/remind: schedules the reminder through ntfy's delay feature"""
    def setUp(self):
        import subprocess, time, urllib.request
        Handler.got = []; self.ntfy = HTTPServer(('127.0.0.1', 0), Handler); threading.Thread(target=self.ntfy.serve_forever, daemon=True).start()
        self.dir = tempfile.mkdtemp(); self.procs = []
        self.base_env = dict(os.environ, PHYSICS_RPG_PROFILES=self.dir)
        self.cfg = dict(NTFY_TOPIC='rpg-test', NTFY_URL=f'http://127.0.0.1:{self.ntfy.server_port}', GAME_URL='https://rpg.example.com', NOTIFY_TZ='Europe/Zurich')
    def tearDown(self):
        self.ntfy.shutdown()
        for p in self.procs: p.terminate()
    def serve(self, **extra):
        import subprocess, time, urllib.request, socket
        s = socket.socket(); s.bind(('127.0.0.1', 0)); port = s.getsockname()[1]; s.close()
        env = {k: v for k, v in self.base_env.items() if not k.startswith(('NTFY_', 'PHYSICS_RPG_TOKEN'))}; env.update(extra)
        p = subprocess.Popen([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'game', 'serve.py'), '--port', str(port)], env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); self.procs.append(p)
        for _ in range(50):
            try: urllib.request.urlopen(f'http://127.0.0.1:{port}/api/ping', timeout=1); break
            except Exception: time.sleep(0.1)
        return port
    def post(self, port, body, headers=None):
        import urllib.request, urllib.error
        req = urllib.request.Request(f'http://127.0.0.1:{port}/api/remind', data=json.dumps(body).encode(), method='POST', headers=dict({'Content-Type': 'application/json'}, **(headers or {})))
        try:
            with urllib.request.urlopen(req, timeout=10) as r: return r.status, json.loads(r.read())
        except urllib.error.HTTPError as e: return e.code, json.loads(e.read())
    def test_minutes_become_an_ntfy_delay_timestamp(self):
        import time
        port = self.serve(**self.cfg); t0 = time.time()
        status, out = self.post(port, {'minutes': 30, 'spec': 'open:qm-wm-L1', 'what': 'Lesson X in Room Y, ~10 min'})
        self.assertEqual(status, 200); self.assertTrue(out['ok'])
        body = Handler.got[-1][2]
        self.assertEqual(body['topic'], 'rpg-test'); self.assertTrue(body['title'].startswith('Reminder:')); self.assertIn('Lesson X', body['message'])
        self.assertAlmostEqual(int(body['delay']), t0 + 1800, delta=8)
        self.assertEqual(body['click'], 'https://rpg.example.com/?suggest=open:qm-wm-L1'); self.assertEqual(body['actions'][0]['url'], 'https://rpg.example.com/?open=qm-wm-L1')
    def test_a_clock_time_means_the_next_time_it_is_that_time(self):
        import time
        port = self.serve(**self.cfg)
        now = notify.now_in('Europe/Zurich'); later = (now + dt.timedelta(hours=2)).strftime('%H:%M'); earlier = (now - dt.timedelta(hours=2)).strftime('%H:%M')
        s1, o1 = self.post(port, {'at': later, 'spec': 'quick', 'what': 'Quick session'}); s2, o2 = self.post(port, {'at': earlier, 'spec': 'quick', 'what': 'Quick session'})
        self.assertEqual((s1, s2), (200, 200)); self.assertEqual(o1['at'], later)
        d1, d2 = int(Handler.got[-2][2]['delay']), int(Handler.got[-1][2]['delay'])
        self.assertTrue(0 < d1 - time.time() <= 2 * 3600 + 90); self.assertTrue(22 * 3600 - 90 <= d2 - time.time() <= 22 * 3600 + 90)       # 2 hours earlier = about 22 hours from now
        self.assertEqual(o2['day'], 'tomorrow')
    def test_validation(self):
        port = self.serve(**self.cfg)
        self.assertEqual(self.post(port, {'minutes': 0, 'spec': 'quick'})[0], 400); self.assertEqual(self.post(port, {'minutes': 99999, 'spec': 'quick'})[0], 400)
        self.assertEqual(self.post(port, {'minutes': 5, 'spec': 'rm -rf'})[0], 400); self.assertEqual(self.post(port, {'at': '25x', 'spec': 'quick'})[0], 400)
        self.assertEqual(Handler.got, [])
    def test_not_set_up_gives_a_clear_503(self):
        port = self.serve(); status, out = self.post(port, {'minutes': 5, 'spec': 'quick'})
        self.assertEqual(status, 503); self.assertIn('not set up', out['error'])
    def test_config_endpoint_and_token(self):
        import urllib.request, urllib.error
        port = self.serve(**self.cfg, PHYSICS_RPG_TOKEN='secret')
        self.assertEqual(self.post(port, {'minutes': 5, 'spec': 'quick'})[0], 401)
        self.assertEqual(self.post(port, {'minutes': 5, 'spec': 'quick'}, {'X-Token': 'secret'})[0], 200)
        req = urllib.request.Request(f'http://127.0.0.1:{port}/api/notify-config', headers={'X-Token': 'secret'}); self.assertTrue(json.load(urllib.request.urlopen(req))['configured'])
        self.assertFalse(json.load(urllib.request.urlopen(f'http://127.0.0.1:{self.serve()}/api/notify-config'))['configured'])
    def test_unreachable_ntfy_is_a_502_not_a_crash(self):
        port = self.serve(**dict(self.cfg, NTFY_URL='http://127.0.0.1:9')); status, out = self.post(port, {'minutes': 5, 'spec': 'quick'})
        self.assertEqual(status, 502); self.assertIn('could not reach', out['error'])


if __name__ == '__main__':
    unittest.main(verbosity=1)
