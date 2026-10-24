// After a long exercise, a frame error, a lost graphics context or a stale finger you can still move and look. Phone, sideways.
// Usage: node test/resilience-smoke.mjs   (CHROMIUM=/path/to/chromium if needed)
import { spawn } from 'node:child_process'; import { mkdtempSync, existsSync } from 'node:fs'; import { tmpdir } from 'node:os';
import { chromium } from 'playwright-core';
const root = new URL('..', import.meta.url).pathname, port = 19700 + Math.floor(Math.random() * 200);
const srv = spawn('python3', [root + 'serve.py', '--port', String(port)], { env: { ...process.env, PHYSICS_RPG_PROFILES: mkdtempSync(tmpdir() + '/rpg-') }, stdio: 'ignore' }); await new Promise((r) => setTimeout(r, 800));
const exe = process.env.CHROMIUM || ['/opt/pw-browsers/chromium', '/tmp/chr-local/chromium'].find(existsSync);
const b = await chromium.launch({ executablePath: exe, headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
let fails = 0; const ck = (n, c, extra = '') => { if (!c) fails++; console.log(`${c ? 'PASS' : 'FAIL'} ${n}${c ? '' : '  ' + extra}`); }; const errs = [];
const ctx = await b.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true }), p = await ctx.newPage(), cdp = await ctx.newCDPSession(p);
p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && !/frame error \(skipped\)/.test(m.text()) && errs.push(m.text()));
await p.goto(`http://127.0.0.1:${port}/index.html?test=1&nexus=1`); await p.waitForFunction(() => !!window.__game, null, { timeout: 40000 }); await p.waitForTimeout(1000);
const st = () => p.evaluate(() => window.__game.state()), frames = () => p.evaluate(() => window.__game.frames()), sleep = (ms) => p.waitForTimeout(ms);
const touch = (type, x, y, id = 0) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id }] });
const joyBox = () => p.evaluate(() => { const r = document.getElementById('joy').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
const dist = (a, c) => Math.hypot(a[0] - c[0], a[1] - c[1], a[2] - c[2]);
let sign = -1; // forward, then backward, then forward...: in a room a wall stops you if you only ever walk one way
async function push() { const j = await joyBox(), a = (await st()).pos; const off = 40 * sign; sign = -sign; await touch('touchStart', j.x, j.y + off, 1); for (let i = 0; i < 16; i++) { await sleep(250); if (dist((await st()).pos, a) > 1.5) break; } const c = (await st()).pos; await touch('touchEnd', 0, 0); await sleep(200); return dist(a, c); }
async function look() { const y0 = (await st()).yaw; await touch('touchStart', 500, 200, 2); for (let i = 1; i <= 10; i++) await touch('touchMove', 500 + i * 14, 200, 2); await touch('touchEnd', 0, 0); await sleep(200); return Math.abs((await st()).yaw - y0); }
const advancing = async (ms = 1200) => { const f0 = await frames(); await sleep(ms); return (await frames()) > f0; };

ck('baseline: the stick moves and a drag looks around', (await push()) > 1 && (await look()) > 0.3);
// 1. a long exercise, maximized to full screen, then closed
await p.evaluate(() => window.__game.loadRoom('qm', 'wave-mechanics-basics')); await sleep(900); await p.evaluate(() => document.getElementById('tut')?.style.display !== 'none' && document.getElementById('tut-skip')?.click());
await p.evaluate(() => window.__game.open('qm-wm-L1')); await sleep(600); await p.evaluate(() => document.getElementById('side-max').click()); await sleep(400);
const during = await advancing(1500); ck('while an exercise covers the whole screen nothing is drawn (spares the phone)', !during);
for (let i = 0; i < 6; i++) { await p.mouse.move(300 + i, 200); await sleep(3000); }          // about 20 seconds of "long exercise"
await p.evaluate(() => window.__game.close()); await sleep(600);
ck('closed again: the 3D view runs again', await advancing());
ck('...and the stick moves you', (await push()) > 1); ck('...and dragging looks around', (await look()) > 0.3);
// 2. an error inside a frame does not stop the loop
await p.evaluate(() => window.__game.failFrames(6)); await sleep(500);
ck('six frames that throw an error do not stop the loop', await advancing()); ck('...and the stick still moves you', (await push()) > 1);
// 3. a lost graphics context: a banner offers a reload, and when the context returns everything works again
await p.evaluate(() => { window.__ext = window.__game.world().renderer.getContext().getExtension('WEBGL_lose_context'); window.__ext.loseContext(); }); await sleep(1500);
ck('with the graphics context lost the view stops (as on the phone)', !(await advancing(800)));
await p.waitForFunction(() => getComputedStyle(document.getElementById('gl-banner')).display !== 'none', null, { timeout: 12000 }).catch(() => {});
ck('after a few seconds a banner offers "Reload the view"', await p.evaluate(() => getComputedStyle(document.getElementById('gl-banner')).display !== 'none' && document.getElementById('gl-banner').innerText.includes('Reload')));
await p.screenshot({ path: '/tmp/shots/gl-banner.png' });
await p.evaluate(() => window.__ext.restoreContext()); await sleep(2000);
ck('when the context comes back the banner goes away and the view runs again', await p.evaluate(() => getComputedStyle(document.getElementById('gl-banner')).display === 'none') && await advancing());
ck('...and you can move and look again', (await push()) > 1 && (await look()) > 0.3);
// 4. a stale finger on the stick (its "up" never arrived): a new touch takes over
const j = await joyBox(), a0 = (await st()).pos;
await touch('touchStart', j.x, j.y, 1);                                   // finger 1 sits in the middle and never lets go
await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: j.x, y: j.y, id: 1 }, { x: j.x, y: j.y + 45 * sign, id: 2 }] }); sign = -sign;
for (let i = 0; i < 12; i++) { await sleep(250); if (dist((await st()).pos, a0) > 1.5) break; }
ck('a second finger on the stick takes over from a stale one', dist((await st()).pos, a0) > 1.5); await touch('touchEnd', 0, 0); await sleep(300);
// 5. leaving the page and coming back resets the touch state
await p.evaluate(() => document.dispatchEvent(new Event('visibilitychange'))); await sleep(200);
ck('after the page was hidden and shown again the stick works', (await push()) > 1);
ck('no page errors', errs.length === 0); if (errs.length) console.log([...new Set(errs)].slice(0, 5));
await b.close(); srv.kill(); console.log(fails ? `${fails} FAILED` : 'ALL PASSED'); process.exit(fails ? 1 : 0);
