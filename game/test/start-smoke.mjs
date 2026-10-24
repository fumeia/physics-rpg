// The start screen: visible at once with a progress bar, ONE tap enters the Nexus (a tap during loading is remembered), no forced tutorial, no profile picker.
// Usage: node test/start-smoke.mjs   (CHROMIUM=/path/to/chromium if needed)
import { spawn } from 'node:child_process'; import { mkdtempSync, existsSync } from 'node:fs'; import { tmpdir } from 'node:os';
import { chromium } from 'playwright-core';
const root = new URL('..', import.meta.url).pathname, port = 19500 + Math.floor(Math.random() * 300);
const srv = spawn('python3', [root + 'serve.py', '--port', String(port)], { env: { ...process.env, PHYSICS_RPG_PROFILES: mkdtempSync(tmpdir() + '/rpg-') }, stdio: 'ignore' }); await new Promise((r) => setTimeout(r, 800));
const exe = process.env.CHROMIUM || ['/opt/pw-browsers/chromium', '/tmp/chr-local/chromium'].find(existsSync);
const b = await chromium.launch({ executablePath: exe, headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
let fails = 0; const ck = (n, c, extra = '') => { if (!c) fails++; console.log(`${c ? 'PASS' : 'FAIL'} ${n}${c ? '' : '  ' + extra}`); }; const errs = [];
const url = `http://127.0.0.1:${port}/index.html`;
async function open(opts, { slow = 0, state, theme } = {}) {
  const ctx = await b.newContext(opts), p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  if (state || theme) { await p.goto(url); await p.evaluate(([s, t]) => { if (s) localStorage.setItem('physics-rpg-v1', JSON.stringify(s)); if (t) localStorage.setItem('physics-rpg-theme', t); }, [state, theme]); }
  if (slow) await p.route('**/content/**', async (route) => { await new Promise((r) => setTimeout(r, slow)); route.continue(); });
  return { ctx, p };
}
const vis = (p, sel) => p.evaluate((s) => { const e = document.querySelector(s); return !!e && getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden' && e.getBoundingClientRect().width > 0; }, sel);
const gone = (p) => p.evaluate(() => getComputedStyle(document.getElementById('start')).display === 'none');
const phone = { viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: true }, land = { viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true }, desk = { viewport: { width: 1280, height: 800 } };

// ---- phone, slow loading: the screen is there at once, a progress bar fills, ONE tap during loading starts the game when it is ready
{
  const { ctx, p } = await open(phone, { slow: 120 }); await p.goto(url, { waitUntil: 'commit' }); await p.waitForSelector('#st-go', { state: 'visible', timeout: 5000 });
  ck('the start screen is visible at once, with the title, a Start button and a progress bar', await vis(p, '#start') && await vis(p, '#st-go') && await vis(p, '#st-bar') && (await p.textContent('#start h1')) === 'Physics RPG');
  ck('no key bindings on a phone', !(await vis(p, '.st-keys')));
  await p.screenshot({ path: '/tmp/shots/start-loading.png' });
  const widths = []; for (let i = 0; i < 6; i++) { widths.push(await p.evaluate(() => parseFloat(document.getElementById('st-fill').style.width) || 0)); await p.waitForTimeout(250); }
  await p.touchscreen.tap(195, 300);                                       // the ONE tap, while the game is still loading
  const tapped = await p.evaluate(() => ({ status: document.getElementById('st-status').textContent, go: document.getElementById('st-go').textContent, dis: document.getElementById('st-go').disabled }));
  ck(`one early tap is remembered: "${tapped.status}"`, /Starting/.test(tapped.status + tapped.go) && tapped.dis);
  await p.waitForFunction(() => getComputedStyle(document.getElementById('start')).display === 'none', null, { timeout: 40000 });
  ck('the progress bar only moved forward', widths.every((w, i) => i === 0 || w >= widths[i - 1] - 0.5));
  const after = await p.evaluate(() => ({ nexus: !!window.__game.nexus(), overlay: getComputedStyle(document.getElementById('overlay')).display, tut: getComputedStyle(document.getElementById('tut')).display, chip: getComputedStyle(document.getElementById('tour-chip')).display }));
  ck('after that one tap the game is in the Nexus: no overlay, no blocking tutorial', after.nexus && after.overlay === 'none' && after.tut === 'none');
  ck('a new player is offered the 30-second tour (not forced)', after.chip !== 'none');
  await p.screenshot({ path: '/tmp/shots/start-in-nexus.png' });
  await p.evaluate(() => document.getElementById('tour-go').click()); await p.waitForTimeout(400);
  ck('tapping "Take the 30-second tour" starts it', await p.evaluate(() => getComputedStyle(document.getElementById('tut')).display !== 'none' && getComputedStyle(document.getElementById('tour-chip')).display === 'none'));
  await ctx.close();
}
// ---- phone, no tap until it is ready: the button is ready, ONE tap enters
{
  const { ctx, p } = await open(phone); await p.goto(url); await p.waitForFunction(() => !!window.__game && document.getElementById('st-go') && !document.getElementById('st-go').disabled && document.getElementById('st-bar').classList.contains('done'), null, { timeout: 40000 });
  ck('when loaded the bar is gone and Start is ready', !(await vis(p, '#st-bar')) && (await p.textContent('#st-go')) === 'Start' && await vis(p, '#start'));
  const stats = await p.textContent('#st-stats'); ck(`the player's level, XP and the exam countdown are shown (${stats.trim()})`, /Level \d/.test(stats) && /\d+ XP/.test(stats) && /days to the exam/.test(stats));
  ck('the profile is named, with a way to change it', (await p.textContent('#start-profile')).includes('Profile:') && await vis(p, '#st-profile'));
  await p.screenshot({ path: '/tmp/shots/start-ready.png' });
  await p.touchscreen.tap(195, 120); await p.waitForTimeout(900);
  ck('one tap anywhere enters (the start screen is gone, the Nexus is there)', await gone(p) && await p.evaluate(() => !!window.__game.nexus() && getComputedStyle(document.getElementById('overlay')).display === 'none'));
  await p.evaluate(() => document.getElementById('tour-x').click()); await p.waitForTimeout(200);
  await p.reload(); await p.waitForFunction(() => !!window.__game); await p.waitForTimeout(500); await p.touchscreen.tap(195, 120); await p.waitForTimeout(900);
  ck('dismissing the tour once means it is not offered again', await p.evaluate(() => getComputedStyle(document.getElementById('tour-chip')).display === 'none'));
  await ctx.close();
}
// ---- landscape phone: everything fits on the screen
{
  const { ctx, p } = await open(land); await p.goto(url); await p.waitForFunction(() => !!window.__game, null, { timeout: 40000 }); await p.waitForTimeout(500);
  const fits = await p.evaluate(() => { const r = document.querySelector('.st-card').getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight + 1; }); ck('landscape: the whole start card fits the screen', fits);
  await p.screenshot({ path: '/tmp/shots/start-landscape.png' }); await ctx.close();
}
// ---- continue where you left off
{
  const now = Date.now(), { ctx, p } = await open(phone, { state: { updated: now + 6 * 3600e3, xp: 300, solved: {}, reviews: {}, flags: {}, last: { course: 'qm', room: 'tunneling-bridge' } } });
  await p.goto(url); await p.waitForFunction(() => !!window.__game && !document.getElementById('st-go').disabled); await p.waitForTimeout(400);
  ck('a "Continue in <room>" button appears when you were somewhere', (await p.textContent('#resume')).includes('Continue in') && await vis(p, '#resume'));
  await p.evaluate(() => document.getElementById('resume').click()); await p.waitForFunction(() => window.__game.currentRoom() === 'qm/tunneling-bridge' && getComputedStyle(document.getElementById('start')).display === 'none', null, { timeout: 30000 }).catch(() => {});
  ck('and it takes you there with one tap', await gone(p) && (await p.evaluate(() => window.__game.currentRoom())) === 'qm/tunneling-bridge'); await ctx.close();
}
// ---- PC: keys line shown, a click enters, light theme looks right
{
  const { ctx, p } = await open(desk); await p.goto(url); await p.waitForFunction(() => !!window.__game, null, { timeout: 40000 });
  ck('on a PC the key line is shown', await vis(p, '.st-keys') && (await p.textContent('.st-keys')).includes('WASD'));
  await p.mouse.click(640, 200); await p.waitForTimeout(900); ck('PC: one click enters', await gone(p) && await p.evaluate(() => !!window.__game.nexus())); await ctx.close();
  const l = await open(desk, { theme: 'light' }); await l.p.goto(url); await l.p.waitForFunction(() => !!window.__game); await l.p.waitForTimeout(500);
  ck('light theme: white start screen with a black Start button', await l.p.evaluate(() => getComputedStyle(document.getElementById('start')).backgroundColor === 'rgb(255, 255, 255)' && getComputedStyle(document.getElementById('st-go')).backgroundColor === 'rgb(17, 17, 17)'));
  await l.p.screenshot({ path: '/tmp/shots/start-light.png' }); await l.ctx.close();
}
ck('no page errors', errs.length === 0); if (errs.length) console.log([...new Set(errs)].slice(0, 5));
await b.close(); srv.kill(); console.log(fails ? `${fails} FAILED` : 'ALL PASSED'); process.exit(fails ? 1 : 0);
