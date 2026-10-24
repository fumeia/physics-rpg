// The PC experience: keyboard and mouse, no touch controls, every shortcut, both panels side by side, light theme, local run without notifications.
// Usage: node test/desktop-smoke.mjs   (CHROMIUM=/path/to/chromium if needed)
import { spawn } from 'node:child_process'; import { mkdtempSync, existsSync } from 'node:fs'; import { tmpdir } from 'node:os';
import { chromium } from 'playwright-core';
const root = new URL('..', import.meta.url).pathname, port = 19400 + Math.floor(Math.random() * 300);
const env = { ...process.env, PHYSICS_RPG_PROFILES: mkdtempSync(tmpdir() + '/rpg-') }; for (const k of Object.keys(env)) if (k.startsWith('NTFY_')) delete env[k];
const srv = spawn('python3', [root + 'serve.py', '--port', String(port)], { env, stdio: 'ignore' }); await new Promise((r) => setTimeout(r, 800));
const exe = process.env.CHROMIUM || ['/opt/pw-browsers/chromium', '/tmp/chr-local/chromium'].find(existsSync);
const b = await chromium.launch({ executablePath: exe, headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
let fails = 0; const ck = (n, c, extra = '') => { if (!c) fails++; console.log(`${c ? 'PASS' : 'FAIL'} ${n}${c ? '' : '  ' + extra}`); }; const errs = [];
const day = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const now = Date.now(), seeded = { updated: now + 60000, xp: 200, solved: { 'qm-wm-L1': { at: now - 3600e3 } }, reviews: { 'qm-wm-Q1': { box: 0, due: now - 1000, fails: 1 } }, flags: { study: { [day(0)]: 300 } }, streak: { last: day(-1), count: 4 } };
async function open(w, h, q = '?test=1', state, theme) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } }), p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto(`http://127.0.0.1:${port}/index.html${q}`);
  await p.evaluate(([s, t]) => { if (s) localStorage.setItem('physics-rpg-v1', JSON.stringify(s)); if (t) localStorage.setItem('physics-rpg-theme', t); }, [state, theme]); await p.reload();
  await p.waitForFunction(() => !!window.__game); await p.waitForTimeout(800); await p.evaluate(() => document.getElementById('tut')?.style.display !== 'none' && document.getElementById('tut-skip')?.click()); return p;
}
const vis = (p, sel) => p.evaluate((s) => { const e = document.querySelector(s); return !!e && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0; }, sel);
const st = (p) => p.evaluate(() => window.__game.state());
const key = async (p, k) => { await p.keyboard.press(k); await p.waitForTimeout(350); };

let p = await open(1280, 800, '?test=1', seeded);
ck('PC: keyboard-and-mouse layout (no stick, no touch classes)', await p.evaluate(() => !document.body.classList.contains('touch') && !document.getElementById('touch') && !document.getElementById('joy')));
ck('PC: the full toolbar is there (Study, Exam hall, Missions, Map, Formulas, Nexus)', (await Promise.all(['#btn-pile', '#btn-exam', '#btn-missions', '#btn-map', '#btn-codex', '#btn-nexus'].map((s) => vis(p, s)))).every(Boolean));
ck('PC: the touch-only buttons and the rotate hint are hidden', !(await vis(p, '#btn-fs')) && !(await vis(p, '#side-max')) && !(await vis(p, '#rotate-hint')));
ck('PC: the key hint line mentions the quick session', (await p.textContent('#hint')).includes('Q quick session'));
// walking with WASD
const p0 = (await st(p)).pos; await p.keyboard.down('KeyW'); for (let i = 0; i < 20; i++) { await p.waitForTimeout(250); const q = (await st(p)).pos; if (Math.hypot(q[0] - p0[0], q[2] - p0[2]) > 1) break; } await p.keyboard.up('KeyW'); const p1 = (await st(p)).pos; // hold until it has moved: a slow frame rate must not fail the test
ck(`PC: W walks (${Math.hypot(p1[0] - p0[0], p1[2] - p0[2]).toFixed(2)} m)`, Math.hypot(p1[0] - p0[0], p1[2] - p0[2]) > 0.8);
// every shortcut
await key(p, 'KeyB'); ck('PC: B opens the formulas', (await st(p)).codex); await key(p, 'KeyB'); ck('PC: B closes them', !(await st(p)).codex);
await key(p, 'KeyM'); ck('PC: M opens the map', (await st(p)).overlay === 'map'); await key(p, 'Escape'); ck('PC: Esc closes it', (await st(p)).overlay === null);
await key(p, 'KeyT'); ck('PC: T opens the missions (goal bar, freeze, quick button)', await p.evaluate(() => { const t = document.getElementById('ov-body').innerText; return t.includes('Daily goal: 5 of 20 min') && t.includes('Weekly freeze ready') && !!document.getElementById('quick-go'); })); await key(p, 'Escape');
await key(p, 'KeyV'); await p.evaluate(() => document.querySelector('[data-stab="week"]').click()); await p.waitForTimeout(300); ck('PC: V opens the study hub (This week)', (await p.evaluate(() => document.getElementById('ov-body').innerText)).includes('Progress per course')); await key(p, 'Escape');
await key(p, 'KeyX'); ck('PC: X opens the exam hall', (await st(p)).overlay === 'exam'); await key(p, 'Escape');
await key(p, 'KeyP'); ck('PC: P opens the profile with theme, controls, goal, sound and vibration', await p.evaluate(() => ['set-theme', 'set-ctl', 'set-goal', 'set-sound', 'set-haptics'].every((i) => !!document.getElementById(i)))); await key(p, 'Escape');
await key(p, 'F1'); ck('PC: F1 help lists the Q shortcut', (await p.evaluate(() => document.getElementById('ov-body').innerText)).includes('Q quick session')); await key(p, 'Escape');
await key(p, 'KeyQ'); await p.waitForFunction(() => window.__game.state().panelOpen && document.querySelector('.pilebar'), null, { timeout: 20000 }).catch(() => {}); const q = await p.evaluate(() => ({ open: window.__game.state().panelOpen, bar: document.querySelector('.pilebar')?.innerText || '' }));
ck(`PC: Q starts the quick session (${q.bar.replace(/\n/g, ' ')})`, q.open && /Quick session 1 \/ \d/.test(q.bar));
await p.evaluate(() => window.__game.close()); await key(p, 'KeyK'); ck('PC: K opens the connections of the room', await p.evaluate(() => window.__game.state().panelOpen && document.getElementById('panel').innerText.includes('Connections of')));
await p.evaluate(() => window.__game.close()); await key(p, 'KeyN'); await p.waitForTimeout(900); await p.evaluate(() => document.getElementById('tut')?.style.display !== 'none' && document.getElementById('tut-skip')?.click()); await p.waitForTimeout(300); await key(p, 'KeyK'); ck('PC: K in the Nexus opens the connections (of the star you face, else all of them)', await p.evaluate(() => /All connections|Connections of/.test(document.getElementById('panel').innerText)));
await p.evaluate(() => window.__game.close()); await key(p, 'KeyN'); await p.waitForTimeout(900); ck('PC: N flies to the Nexus', await p.evaluate(() => !!window.__game.nexus()));
await p.context().close();

// both panels at once at a normal laptop width: formulas left, exercise right, not on top of each other
p = await open(1100, 700); await p.evaluate(() => window.__game.loadRoom('qm', 'wave-mechanics-basics')); await p.waitForTimeout(800); await p.evaluate(() => document.getElementById('tut')?.style.display !== 'none' && document.getElementById('tut-skip')?.click());
await p.evaluate(() => window.__game.open('qm-wm-L1')); await p.waitForTimeout(700); await key(p, 'KeyB');
const r = await p.evaluate(() => { const a = document.getElementById('cx').getBoundingClientRect(), s = document.getElementById('side').getBoundingClientRect(); return { cxRight: a.right, sideLeft: s.left, cxLeft: a.left, sideRight: s.right, w: innerWidth }; });
ck(`PC: formulas (left) and exercise (right) side by side at 1100 px (${Math.round(r.cxRight)} <= ${Math.round(r.sideLeft)})`, r.cxLeft < 5 && r.cxRight <= r.sideLeft + 1 && r.sideRight > r.w - 5);
await p.screenshot({ path: '/tmp/shots/pc-both.png' });
// the Nexus card scrolls with the mouse wheel
await p.evaluate(() => window.__game.enterNexus()); await p.waitForTimeout(900);
let scrolled = false; const count = await p.evaluate(() => window.__game.set().nodes.length);
for (let i = 0; i < Math.min(count, 40) && !scrolled; i++) {
  const spot = await p.evaluate((k) => { const n = window.__game.set().nodes[k], q = n.pos || n.mesh?.position || n.group?.position; return { x: q.x, y: q.y, z: q.z }; }, i);
  await p.evaluate((s) => window.__game.flyTo(s.x, s.y, s.z + 9, 0, 0), spot); await p.waitForTimeout(450);
  const c = await p.evaluate(() => { const e = document.getElementById('nx-card'), r = e.getBoundingClientRect(); return { show: getComputedStyle(e).display !== 'none', over: e.scrollHeight > e.clientHeight + 5, x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  if (c.show && c.over) { await p.mouse.move(c.x, c.y); await p.mouse.wheel(0, 300); await p.waitForTimeout(300); scrolled = (await p.evaluate(() => document.getElementById('nx-card').scrollTop)) > 20; }
}
ck('PC: the Nexus room card scrolls with the mouse wheel', scrolled); await p.context().close();

// light theme on the PC
p = await open(1280, 800, '?test=1', seeded, 'light');
ck('PC light: white page, inverted 3D view, dark text', await p.evaluate(() => getComputedStyle(document.body).backgroundColor === 'rgb(255, 255, 255)' && getComputedStyle(document.getElementById('view')).filter.includes('invert') && getComputedStyle(document.getElementById('hud')).color !== 'rgb(255, 255, 255)'));
await key(p, 'KeyT'); await p.screenshot({ path: '/tmp/shots/pc-light-missions.png' }); await key(p, 'Escape');
await p.evaluate(() => window.__game.loadRoom('astrophysics', 'photometry-radiation')); await p.waitForTimeout(700); await p.evaluate(() => document.getElementById('tut')?.style.display !== 'none' && document.getElementById('tut-skip')?.click());
await p.evaluate(() => window.__game.open('lab-astro-blackbody')); await p.waitForTimeout(900); await p.screenshot({ path: '/tmp/shots/pc-light-lab.png' });
await p.context().close();

// a plain local run (python3 serve.py on a PC, no notifications): the game works, the chooser explains what is missing
p = await open(1280, 800, '?suggest=quick');
ck('PC local: no notification setup needed to play (the chooser opens, the game runs)', await p.evaluate(() => getComputedStyle(document.getElementById('overlay')).display !== 'none'));
await p.screenshot({ path: '/tmp/shots/pc-chooser.png' }); await p.context().close();
ck('no page errors', errs.length === 0); if (errs.length) console.log([...new Set(errs)].slice(0, 5));
await b.close(); srv.kill(); console.log(fails ? `${fails} FAILED` : 'ALL PASSED'); process.exit(fails ? 1 : 0);
