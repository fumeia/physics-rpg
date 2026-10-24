// Tapping a notification opens "start now or remind me later"; the reminder is handed to ntfy with a delay. Phone and PC.
// Usage: node test/remind-smoke.mjs   (CHROMIUM=/path/to/chromium if needed)
import { spawn } from 'node:child_process'; import { createServer } from 'node:http'; import { mkdtempSync, existsSync } from 'node:fs'; import { tmpdir } from 'node:os';
import { chromium } from 'playwright-core';
const root = new URL('..', import.meta.url).pathname; let fails = 0; const ck = (n, c, extra = '') => { if (!c) fails++; console.log(`${c ? 'PASS' : 'FAIL'} ${n}${c ? '' : '  ' + extra}`); };
const got = []; const ntfy = createServer((q, r) => { let b = ''; q.on('data', (d) => (b += d)); q.on('end', () => { got.push(JSON.parse(b)); r.writeHead(200); r.end('{}'); }); }); await new Promise((r) => ntfy.listen(0, '127.0.0.1', r));
const free = () => new Promise((r) => { const s = createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => r(p)); }); });
async function serve(env) {
  const port = await free(), base = { ...process.env }; for (const k of Object.keys(base)) if (k.startsWith('NTFY_')) delete base[k];
  const p = spawn('python3', [root + 'serve.py', '--port', String(port)], { env: { ...base, PHYSICS_RPG_PROFILES: mkdtempSync(tmpdir() + '/rpg-'), ...env }, stdio: 'ignore' }); await new Promise((r) => setTimeout(r, 800)); return { port, p };
}
const configured = await serve({ NTFY_TOPIC: 'rpg-t', NTFY_URL: `http://127.0.0.1:${ntfy.address().port}`, GAME_URL: 'https://rpg.example.com', NOTIFY_TZ: 'Europe/Zurich' }), plain = await serve({});
const exe = process.env.CHROMIUM || ['/opt/pw-browsers/chromium', '/tmp/chr-local/chromium'].find(existsSync);
const b = await chromium.launch({ executablePath: exe, headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
const open = async (opts, port, q) => { const ctx = await b.newContext({ timezoneId: 'Europe/Zurich', ...opts }), p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message)); await p.goto(`http://127.0.0.1:${port}/index.html${q}`); await p.waitForFunction(() => !!window.__game, null, { timeout: 40000 }); await p.waitForTimeout(500); if (q.includes('suggest=') && !q.includes('does-not-exist')) await p.waitForSelector('#sg-now', { state: 'visible', timeout: 30000 }); return p; };
const hhmm = (ms) => new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Zurich', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(ms));
const phone = { viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true }, desk = { viewport: { width: 1200, height: 750 } };

for (const [name, opts] of [['phone', phone], ['PC', desk]]) {
  let p = await open(opts, configured.port, '?suggest=open:qm-wm-L1');
  const ov = await p.evaluate(() => ({ shown: getComputedStyle(document.getElementById('overlay')).display !== 'none', title: document.getElementById('ov-title').textContent, text: document.getElementById('ov-body').innerText, start: getComputedStyle(document.getElementById('start')).display }));
  ck(`${name}: tapping a notification opens the chooser instead of the start screen`, ov.shown && ov.title === 'Ready?' && ov.start === 'none');
  ck(`${name}: it names the exercise and offers start / 5 / 10 / 30 / 60 min / a time`, /Lesson/.test(ov.text) && ['Start now', 'in 5 min', 'in 10 min', 'in 30 min', 'in 1 hour', 'Remind me then'].every((t) => ov.text.includes(t)));
  const t0 = Date.now(); got.length = 0;
  await p.evaluate(() => document.querySelector('.sg-later[data-min="10"]').click()); await p.waitForFunction(() => /Okay|Could not|need/.test(document.getElementById('sg-msg').textContent), null, { timeout: 20000 });
  const msg = await p.evaluate(() => document.getElementById('sg-msg').textContent);
  ck(`${name}: "in 10 min" confirms the time (${msg})`, msg.includes(hhmm(t0 + 600e3)) || msg.includes(hhmm(t0 + 660e3)));
  const body = got[0]; ck(`${name}: ntfy got a delayed message with a link back to the chooser`, body && body.topic === 'rpg-t' && Math.abs(+body.delay - (t0 / 1000 + 600)) < 10 && body.click === 'https://rpg.example.com/?suggest=open:qm-wm-L1' && body.title.startsWith('Reminder:'));
  ck(`${name}: the buttons are used up after setting a reminder`, await p.evaluate(() => [...document.querySelectorAll('.sg-later')].every((x) => x.disabled)));
  await p.context().close();

  p = await open(opts, configured.port, '?suggest=quick'); got.length = 0;
  ck(`${name}: ?suggest=quick offers the quick session`, (await p.evaluate(() => document.getElementById('ov-body').innerText)).includes('Quick session'));
  const target = hhmm(Date.now() + 3 * 3600e3); await p.evaluate((v) => { document.getElementById('sg-time').value = v; document.getElementById('sg-at').click(); }, target); await p.waitForFunction(() => /Okay|Could not|need/.test(document.getElementById('sg-msg').textContent), null, { timeout: 20000 });
  ck(`${name}: "remind me at <time>" confirms ${target}`, (await p.evaluate(() => document.getElementById('sg-msg').textContent)).includes(target) && got.length === 1 && Math.abs(+got[0].delay - (Date.now() / 1000 + 3 * 3600)) < 150);
  await p.context().close();

  p = await open(opts, configured.port, '?suggest=open:qm-wm-L1');
  await p.evaluate(() => document.getElementById('sg-now').click()); await p.waitForFunction(() => window.__game.state().panelOpen, null, { timeout: 20000 }).catch(() => {}); await p.waitForTimeout(300);
  ck(`${name}: "Start now" opens the exercise`, await p.evaluate(() => window.__game.state().panelOpen && getComputedStyle(document.getElementById('overlay')).display === 'none'));
  await p.context().close();
}
// a plain run (a PC without the server notifications): says what is missing
let p = await open(desk, plain.port, '?suggest=quick'); await p.evaluate(() => document.querySelector('.sg-later[data-min="5"]').click()); await p.waitForTimeout(800);
ck('without server notifications the chooser says how to turn them on', (await p.evaluate(() => document.getElementById('sg-msg').textContent)).includes('notify-setup.sh'));
await p.context().close();
// unknown exercise: no chooser, no crash
p = await open(desk, configured.port, '?suggest=open:does-not-exist');
ck('an unknown suggestion opens no chooser', await p.evaluate(() => getComputedStyle(document.getElementById('overlay')).display === 'none')); await p.context().close();
ck('no page errors', errs.length === 0); if (errs.length) console.log(errs.slice(0, 4));
await b.close(); configured.p.kill(); plain.p.kill(); ntfy.close(); console.log(fails ? `${fails} FAILED` : 'ALL PASSED'); process.exit(fails ? 1 : 0);
