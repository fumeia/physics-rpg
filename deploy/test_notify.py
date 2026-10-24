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
        self.assertEqual(m['click'], f"https://rpg.example.com/?open={step['enc']['id']}")
        self.assertRegex(m['message'], r'83 days|Exam in 83'); self.assertLessEqual(len(m['message'].split('\n')), 5)

    def test_due_respawns_come_first_and_the_tap_starts_a_quick_session(self):
        solved = {'qm-wm-Q1': {'at': ms(NOW) - 2 * 86400e3}}
        s = state(solved=solved, reviews={'qm-wm-Q1': {'box': 0, 'due': ms(NOW) - 1000, 'fails': 1}})
        m, _ = notify.message(prog(s), 'morning', 'https://rpg.example.com')
        self.assertIn('1 respawn due', m['message']); self.assertIn('clear them first', m['message']); self.assertTrue(m['click'].endswith('/?quick=1'))
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


if __name__ == '__main__':
    unittest.main(verbosity=1)
