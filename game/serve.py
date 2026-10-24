#!/usr/bin/env python3
"""Serves the game and saves profiles as JSON files, so progress survives cleared cookies and moving to another server.

  python3 serve.py                       # http://127.0.0.1:8123, profiles in ./profiles/<name>.json
  python3 serve.py --port 9000 --host 0.0.0.0   # on a server (set PHYSICS_RPG_TOKEN=secret to require a token)

API: GET /api/ping, GET /api/profiles, GET /api/profile/<name>, PUT /api/profile/<name>  (JSON body),
     GET /api/notify-config, POST /api/remind ("remind me later" through ntfy; only when the server notifications are set up, see deploy/notify-setup.sh).
Names: letters, digits, _ and - (max 40). Writes are atomic and the last 5 versions are kept as backups.
"""
import argparse, datetime, glob, http.server, json, mimetypes, os, re, shutil, sys, tempfile, time

for ext, typ in (('.mjs', 'text/javascript'), ('.js', 'text/javascript'), ('.json', 'application/json'), ('.woff2', 'font/woff2'), ('.webmanifest', 'application/manifest+json')):
    mimetypes.add_type(typ, ext)  # older Pythons serve .mjs as octet-stream, which browsers refuse for modules

ROOT = os.path.dirname(os.path.abspath(__file__))
PROFILES = os.environ.get('PHYSICS_RPG_PROFILES', os.path.join(ROOT, 'profiles'))
TOKEN = os.environ.get('PHYSICS_RPG_TOKEN', '')
NAME = re.compile(r'^[A-Za-z0-9_-]{1,40}$')
MAX_BYTES = 4 * 1024 * 1024


def _notify_cfg():  # set by deploy/notify-setup.sh (EnvironmentFile of the service); absent on a plain local run
    topic = os.environ.get('NTFY_TOPIC')
    return {'topic': topic, 'url': os.environ.get('NTFY_URL') or 'https://ntfy.sh', 'token': os.environ.get('NTFY_TOKEN') or None, 'base': os.environ.get('GAME_URL', ''), 'tz': os.environ.get('NOTIFY_TZ') or 'Europe/Zurich'} if topic else None


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def log_message(self, fmt, *args):  # keep the console quiet for the frequent autosaves
        if '/api/' not in (args[0] if args else ''):
            super().log_message(fmt, *args)

    def end_headers(self):  # static files: always revalidate, so a game update shows up on the phone right after the next load
        if not self.path.startswith('/api/') and self.command in ('GET', 'HEAD'):
            self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def _send(self, code, obj):
        body = json.dumps(obj).encode()
        self.send_response(code); self.send_header('Content-Type', 'application/json'); self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store'); self.end_headers(); self.wfile.write(body)

    def _authorized(self):
        return not TOKEN or self.headers.get('X-Token') == TOKEN

    def _path(self, name):
        return os.path.join(PROFILES, name + '.json')

    def do_GET(self):
        if self.path.startswith('/api/'):
            if not self._authorized(): return self._send(401, {'error': 'token required'})
            if self.path == '/api/ping': return self._send(200, {'ok': True, 'token': bool(TOKEN)})
            if self.path == '/api/notify-config': return self._send(200, {'configured': bool(_notify_cfg())})
            if self.path == '/api/profiles':
                out = []
                for f in sorted(glob.glob(os.path.join(PROFILES, '*.json'))):
                    try:
                        with open(f) as fh: d = json.load(fh)
                        out.append({'name': os.path.basename(f)[:-5], 'updated': d.get('updated', 0), 'xp': d.get('state', {}).get('xp', 0)})
                    except Exception: pass
                return self._send(200, {'profiles': out})
            m = re.match(r'^/api/profile/([^/?]+)$', self.path)
            if m and NAME.match(m.group(1)):
                p = self._path(m.group(1))
                if not os.path.exists(p): return self._send(404, {'error': 'no such profile'})
                with open(p) as fh: return self._send(200, json.load(fh))
            return self._send(400, {'error': 'bad request'})
        return super().do_GET()

    def _remind(self):
        """POST /api/remind {spec: 'quick' | 'open:<id>', what, minutes | at: 'HH:MM'}: ntfy delivers the reminder later (its delay feature, up to 3 days)."""
        cfg = _notify_cfg()
        if not cfg: return self._send(503, {'error': 'notifications are not set up on this server'})
        try:
            sys.path.insert(0, os.path.join(ROOT, '..', 'deploy')); import notify
            n = int(self.headers.get('Content-Length') or 0)
            if n <= 0 or n > 4096: return self._send(413, {'error': 'size'})
            d = json.loads(self.rfile.read(n)); spec = str(d.get('spec', '')); what = str(d.get('what', ''))[:200] or 'Study session'
            if not re.match(r'^(quick|open:[A-Za-z0-9_.-]{1,80})$', spec): return self._send(400, {'error': 'bad spec'})
            now = notify.now_in(cfg['tz'])
            if d.get('minutes') is not None:
                minutes = int(d['minutes'])
                if not 1 <= minutes <= 4300: return self._send(400, {'error': 'minutes must be 1 to 4300'})
                when = now + datetime.timedelta(minutes=minutes)
            else:
                hh, mm = map(int, re.match(r'^(\d{1,2}):(\d{2})$', str(d.get('at', ''))).groups())
                when = now.replace(hour=hh, minute=mm, second=0, microsecond=0)
                if when <= now + datetime.timedelta(seconds=30): when += datetime.timedelta(days=1)
        except (ValueError, AttributeError, TypeError, ImportError) as e:
            return self._send(400 if not isinstance(e, ImportError) else 503, {'error': 'bad request' if not isinstance(e, ImportError) else 'notify.py is not installed next to the game'})
        ts = max(int(when.timestamp()), int(time.time()) + 10)
        try: notify.send(notify.snooze_payload(what, spec, cfg['base'], cfg, ts), cfg['topic'], cfg['url'], cfg['token'])
        except Exception as e: return self._send(502, {'error': f'could not reach the notification server: {e}'})
        return self._send(200, {'ok': True, 'at': when.strftime('%H:%M'), 'day': 'today' if when.date() == now.date() else 'tomorrow'})

    def do_PUT(self):
        if self.path == '/api/remind':
            if not self._authorized(): return self._send(401, {'error': 'token required'})
            return self._remind()
        m = re.match(r'^/api/profile/([^/?]+)$', self.path)
        if not m or not NAME.match(m.group(1)): return self._send(400, {'error': 'bad profile name'})
        if not self._authorized(): return self._send(401, {'error': 'token required'})
        n = int(self.headers.get('Content-Length') or 0)
        if n <= 0 or n > MAX_BYTES: return self._send(413, {'error': 'size'})
        try:
            data = json.loads(self.rfile.read(n))
            assert isinstance(data, dict) and isinstance(data.get('state'), dict)
        except Exception:
            return self._send(400, {'error': 'invalid json'})
        os.makedirs(PROFILES, exist_ok=True)
        p = self._path(m.group(1))
        if os.path.exists(p):  # rolling backups
            for i in range(4, 0, -1):
                if os.path.exists(f'{p}.bak{i}'): shutil.move(f'{p}.bak{i}', f'{p}.bak{i + 1}')
            shutil.copy2(p, p + '.bak1')
        fd, tmp = tempfile.mkstemp(dir=PROFILES, suffix='.tmp')
        with os.fdopen(fd, 'w') as fh: json.dump(data, fh)
        os.replace(tmp, p)
        return self._send(200, {'ok': True, 'saved': time.time()})

    do_POST = do_PUT  # navigator.sendBeacon (last save when the tab closes) uses POST


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--host', default='127.0.0.1'); ap.add_argument('--port', type=int, default=8123)
    a = ap.parse_args()
    os.makedirs(PROFILES, exist_ok=True)
    srv = http.server.ThreadingHTTPServer((a.host, a.port), Handler)
    print(f'Physics RPG on http://{a.host}:{a.port}  (profiles saved in {PROFILES})' + ('  [token required]' if TOKEN else ''))
    try: srv.serve_forever()
    except KeyboardInterrupt: print('\nbye')
