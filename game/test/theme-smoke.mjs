// Theme (dark / light), controls mode (touch / keyboard and mouse) and deep links, in the browser.
// Usage: node test/theme-smoke.mjs   (CHROMIUM=/path/to/chromium if needed)
import { spawn } from 'node:child_process'; import { mkdtempSync, existsSync } from 'node:fs'; import { tmpdir } from 'node:os';
import { chromium } from 'playwright-core';
const root = new URL('..', import.meta.url).pathname, port = 18700 + Math.floor(Math.random() * 500);
const srv = spawn('python3', [root + 'serve.py', '--port', String(port)], { env: { ...process.env, PHYSICS_RPG_PROFILES: mkdtempSync(tmpdir() + '/rpg-') }, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 700));
const exe = process.env.CHROMIUM || ['/opt/pw-browsers/chromium', '/tmp/chr-local/chromium'].find(existsSync);
const b = await chromium.launch({ executablePath: exe, headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
let fails = 0; const ck = (n, c) => { if (!c) fails++; console.log(`${c ? 'PASS' : 'FAIL'} ${n}`); };
const url = (q = '') => `http://127.0.0.1:${port}/index.html${q}`, errs = [];
async function page(opts, init) {
  const ctx = await b.newContext(opts); if (init) await ctx.addInitScript(init);
  const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text())); return p;
}
const ready = async (p) => { await p.waitForFunction(() => !!window.__game); await p.waitForTimeout(700); await p.evaluate(() => document.getElementById('tut')?.style.display !== 'none' && document.getElementById('tut-skip')?.click()); };
const plotPixel = (p) => p.evaluate(() => { const c = document.querySelector('.labcv'); const d = c.getContext('2d').getImageData(3, 3, 1, 1).data; return [d[0], d[1], d[2]]; });
const desk = { viewport: { width: 1100, height: 700 } }, phone = { viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true };

// dark is the default; the plot background is dark
let p = await page(desk); await p.goto(url('?test=1')); await ready(p);
ck('default theme is dark', await p.evaluate(() => document.documentElement.dataset.theme === 'dark'));
await p.evaluate(() => window.__game.loadRoom('astrophysics', 'photometry-radiation')); await p.waitForTimeout(600); await p.evaluate(() => document.getElementById('tut')?.style.display !== 'none' && document.getElementById('tut-skip')?.click());
await p.evaluate(() => window.__game.open('lab-astro-blackbody')); await p.waitForTimeout(800);
const dk = await plotPixel(p); ck(`dark plot background is dark (${dk})`, dk[0] + dk[1] + dk[2] < 150);
ck('canvas is not inverted in dark', await p.evaluate(() => getComputedStyle(document.getElementById('view')).filter === 'none'));
await p.context().close();

// light via the stored choice
p = await page(desk); await p.goto(url('?test=1')); await p.evaluate(() => localStorage.setItem('physics-rpg-theme', 'light')); await p.reload(); await ready(p);
ck('light theme from the stored choice', await p.evaluate(() => document.documentElement.dataset.theme === 'light' && getComputedStyle(document.body).backgroundColor === 'rgb(255, 255, 255)'));
ck('3D view is inverted in light', await p.evaluate(() => getComputedStyle(document.getElementById('view')).filter.includes('invert')));
await p.evaluate(() => window.__game.loadRoom('astrophysics', 'photometry-radiation')); await p.waitForTimeout(600); await p.evaluate(() => document.getElementById('tut')?.style.display !== 'none' && document.getElementById('tut-skip')?.click());
await p.evaluate(() => window.__game.open('lab-astro-blackbody')); await p.waitForTimeout(800);
const lt = await plotPixel(p); ck(`light plot background is white (${lt})`, lt[0] + lt[1] + lt[2] > 740);
// the profile settings switch the theme (reloads) and keep the choice
await p.keyboard.press('Escape'); await p.evaluate(() => window.__game.close()); await p.keyboard.press('KeyP'); await p.waitForTimeout(500);
await Promise.all([p.waitForNavigation(), p.selectOption('#set-theme', 'dark')]); await ready(p);
ck('theme select switches to dark and persists', await p.evaluate(() => document.documentElement.dataset.theme === 'dark' && localStorage.getItem('physics-rpg-theme') === 'dark'));
await p.context().close();

// controls mode: desktop layout on a phone, touch layout on a desktop
p = await page(phone, () => localStorage.setItem('physics-rpg-controls', 'desktop')); await p.goto(url('?test=1')); await ready(p);
ck('phone with controls=desktop has no touch layout', await p.evaluate(() => !document.body.classList.contains('touch') && !document.getElementById('touch')));
await p.context().close();
p = await page(desk, () => localStorage.setItem('physics-rpg-controls', 'touch')); await p.goto(url('?test=1')); await ready(p);
ck('desktop with controls=touch gets the stick', await p.evaluate(() => document.body.classList.contains('touch') && !!document.getElementById('joy')));
await p.context().close();
// the Menu switches (and remembers) the controls
p = await page(phone); await p.goto(url('?test=1')); await ready(p); await p.click('#btn-menu'); await p.waitForTimeout(300);
ck('menu offers theme, controls and sideways', await p.evaluate(() => { const t = document.getElementById('ov-body').innerText; return t.includes('Theme:') && t.includes('Controls:') && t.includes('Play sideways'); }));
await Promise.all([p.waitForNavigation(), p.click('[data-m="controls"]')]); await ready(p);
ck('menu: switching controls reloads in the keyboard layout', await p.evaluate(() => localStorage.getItem('physics-rpg-controls') === 'desktop' && !document.body.classList.contains('touch')));
await p.context().close();

// deep link from a notification: ?open=<exercise id> opens it, ?room= enters the room
p = await page(desk); await p.goto(url('?open=qm-tunnel-L1')); await p.waitForFunction(() => window.__game?.state().panelOpen, null, { timeout: 20000 }).catch(() => {});
ck('?open= opens that exercise', await p.evaluate(() => window.__game.state().panelOpen && document.getElementById('panel').innerText.includes('Stationary states')));
ck('start screen is skipped by a deep link', await p.evaluate(() => getComputedStyle(document.getElementById('start')).display === 'none'));
await p.context().close();
p = await page(desk); await p.goto(url('?room=solid-state/lattice-gate')); await p.waitForFunction(() => window.__game?.currentRoom() === 'solid-state/lattice-gate', null, { timeout: 20000 }).catch(() => {});
ck('?room= enters that room', await p.evaluate(() => window.__game.currentRoom()) === 'solid-state/lattice-gate');
await p.context().close();

ck('manifest and service worker are served', await (async () => { const a = await fetch(url().replace('index.html', 'manifest.webmanifest')), s = await fetch(url().replace('index.html', 'sw.js')); return a.ok && s.ok && (a.headers.get('content-type') || '').includes('manifest'); })());
ck('no page errors', errs.length === 0); if (errs.length) console.log(errs.slice(0, 5));
await b.close(); srv.kill(); console.log(fails ? `${fails} FAILED` : 'ALL PASSED'); process.exit(fails ? 1 : 0);
