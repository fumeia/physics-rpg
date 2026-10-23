// Touch mode in a phone-sized browser: stick, drag-to-look, action button, both panels at once (portrait and landscape).
// Usage: node test/touch-smoke.mjs   (CHROMIUM=/path/to/chromium if it is not at /opt/pw-browsers/chromium or /tmp/chr-local/chromium)
import { spawn } from 'node:child_process'; import { mkdtempSync, mkdirSync, existsSync } from 'node:fs'; import { tmpdir } from 'node:os';
import { chromium } from 'playwright-core';
const root = new URL('..', import.meta.url).pathname, port = 18123 + Math.floor(Math.random() * 500), shots = process.env.SHOTS || '/tmp/shots'; mkdirSync(shots, { recursive: true });
const srv = spawn('python3', [root + 'serve.py', '--port', String(port)], { env: { ...process.env, PHYSICS_RPG_PROFILES: mkdtempSync(tmpdir() + '/rpg-') }, stdio: 'ignore' });
const exe = process.env.CHROMIUM || ['/opt/pw-browsers/chromium', '/tmp/chr-local/chromium'].find(existsSync);
const b = await chromium.launch({ executablePath: exe, headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await b.newContext({ viewport: { width: 390, height: 780 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
const p = await ctx.newPage(), cdp = await ctx.newCDPSession(p), errs = [];
p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
let fails = 0; const ck = (n, c) => { if (!c) fails++; console.log(`${c ? 'PASS' : 'FAIL'} ${n}`); };
const st = () => p.evaluate(() => window.__game.state());
const box = async (sel) => p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return cs.display === 'none' || !r.width ? null : { x: r.x, y: r.y, w: r.width, h: r.height, r: r.right, b: r.bottom }; }, sel);
const touch = (type, x, y, id = 0) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id }] });
const sleep = (ms) => p.waitForTimeout(ms);

await p.goto(`http://127.0.0.1:${port}/index.html`); await p.evaluate(() => localStorage.clear()); await p.reload();
await p.waitForFunction(() => !!window.__game); await sleep(600);
ck('touch mode is on by default on a phone', await p.evaluate(() => document.body.classList.contains('touch') && !document.body.classList.contains('lite')));
ck('on-screen stick exists', !!(await box('#joy')));
ck('menu button visible', !!(await box('#btn-menu')));
ck('no menu overlay is forced open', await p.evaluate(() => document.getElementById('overlay').style.display === 'none'));
await p.touchscreen.tap(195, 400); await sleep(1000); // tap the start screen; a new profile gets the profile picker first
if (await box('#overlay')) { await p.click('#ov-close'); await sleep(300); }
if (await box('#tut')) { await p.touchscreen.tap(...(await (async () => { const c = await box('#tut-skip'); return [c.x + c.w / 2, c.y + c.h / 2]; })())); await sleep(300); }
ck('start screen is gone and the tutorial finished', !(await box('#start')) && !(await box('#tut')));
await p.screenshot({ path: `${shots}/touch-1-nexus.png` });

// move stick: hold it pushed forward for a moment
const j = await box('#joy'), jx = j.x + j.w / 2, jy = j.y + j.h / 2, a = await st();
await touch('touchStart', jx, jy, 1); await touch('touchMove', jx, jy - 40, 1); await sleep(700);
const mid = await st(); await touch('touchEnd', 0, 0);
const dist = Math.hypot(mid.pos[0] - a.pos[0], mid.pos[1] - a.pos[1], mid.pos[2] - a.pos[2]); await sleep(400);
const settled = await st(); await sleep(400); const after = await st(); const rest = Math.hypot(after.pos[0] - settled.pos[0], after.pos[1] - settled.pos[1], after.pos[2] - settled.pos[2]);
ck(`stick moves the player (${dist.toFixed(2)})`, dist > 1);
ck(`releasing the stick stops the player (${rest.toFixed(2)})`, rest < 0.5);
// look: drag a finger on the 3D view
const y0 = (await st()).yaw; await touch('touchStart', 200, 300, 2); for (let i = 1; i <= 8; i++) await touch('touchMove', 200 + i * 15, 300, 2); await touch('touchEnd', 0, 0);
const y1 = (await st()).yaw; ck(`dragging looks around (${(y0 - y1).toFixed(2)} rad)`, y0 - y1 > 0.3);
ck('Nexus shows the fly buttons', !!(await box('#t-up')) && !!(await box('#t-fast')));

// a room: the action button appears in front of a console and opens the panel
await p.evaluate(() => window.__game.loadRoom('qm', 'wave-mechanics-basics')); await sleep(900);
if (await box('#tut')) { await p.touchscreen.tap(...(await (async () => { const c = await box('#tut-skip'); return [c.x + c.w / 2, c.y + c.h / 2]; })())); await sleep(300); }
ck('fly buttons are hidden inside a room', !(await box('#t-up')));
await p.evaluate(() => { const g = window.__game, it = g.world().interactables.find((i) => i.type === 'terminal'); const x = it.pos.x, z = it.pos.z + 2; g.teleport(x, z, 0, 0); });
await sleep(400);
ck('action button shows up at a console', !!(await box('#t-act')) && (await p.textContent('#t-act')).length > 3);
const ab = await box('#t-act'); await p.touchscreen.tap(ab.x + ab.w / 2, ab.y + ab.h / 2); await sleep(500);
ck('tapping it opens the exercise panel', (await st()).panelOpen && !!(await box('#side')));
await p.screenshot({ path: `${shots}/touch-2-panel.png` });
const sb1 = await box('#side'); ck(`upright: panel is a bottom sheet with the 3D view visible above (${Math.round(sb1.y)}px)`, sb1.y > 150 && sb1.w >= 380);

// both panels at once, upright: formulas above, exercise below, no overlap
await p.touchscreen.tap(...(await (async () => { const c = await box('#btn-codex'); return [c.x + c.w / 2, c.y + c.h / 2]; })())); await sleep(500);
const cx = await box('#cx'), sd = await box('#side');
ck('both panels open at once (upright)', !!cx && !!sd);
ck('formulas on top, exercise below, no overlap (upright)', cx.b <= sd.y + 1 && cx.y < 5);
await p.screenshot({ path: `${shots}/touch-3-both-portrait.png` });
// maximise the exercise, then restore
await p.touchscreen.tap(...(await (async () => { const c = await box('#side-max'); return [c.x + c.w / 2, c.y + c.h / 2]; })())); await sleep(300);
const mx = await box('#side'); ck(`maximise fills the screen (${mx.w}x${mx.h} at ${mx.x},${mx.y})`, mx.w >= 389 && mx.h >= 770);
await p.touchscreen.tap(...(await (async () => { const c = await box('#side-max'); return [c.x + c.w / 2, c.y + c.h / 2]; })())); await sleep(300);
const rs = await box('#side'); ck('second tap restores it', rs.h < 700);

// landscape: formulas left, exercise right
await p.setViewportSize({ width: 844, height: 390 }); await sleep(600);
const lc = await box('#cx'), ls = await box('#side');
ck('both panels side by side (landscape)', lc && ls && lc.r <= ls.x + 1 && lc.x < 5 && ls.r > 840);
await p.screenshot({ path: `${shots}/touch-4-both-landscape.png` });
const lj = await box('#joy'); ck('stick still on screen in landscape', lj && lj.b <= 390 && lj.x >= 0);
// closing one panel leaves the other
await p.click('#cx-close'); await sleep(300); ck('closing formulas keeps the exercise', !(await box('#cx')) && !!(await box('#side')));
await p.click('#close'); await sleep(300);
await p.touchscreen.tap(...(await (async () => { const c = await box('#btn-menu'); return [c.x + c.w / 2, c.y + c.h / 2]; })())); await sleep(400);
ck('menu opens', await p.evaluate(() => getComputedStyle(document.getElementById('overlay')).display !== 'none' && document.getElementById('ov-body').innerText.includes('Daily missions')));
await p.screenshot({ path: `${shots}/touch-5-menu.png` });
ck('no page errors', errs.length === 0); if (errs.length) console.log(errs.slice(0, 5));
await b.close(); srv.kill(); console.log(fails ? `${fails} FAILED` : 'ALL PASSED'); process.exit(fails ? 1 : 0);
