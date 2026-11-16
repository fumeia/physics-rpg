// Sideways phone in a room: closer view, zoom buttons, scene centred beside the open panels; hologram follows the experiment sliders.
// Usage: node test/view-smoke.mjs   (CHROMIUM=/path/to/chromium if needed)
import { spawn } from 'node:child_process'; import { mkdtempSync, existsSync } from 'node:fs'; import { tmpdir } from 'node:os';
import { chromium } from 'playwright-core';
const root = new URL('..', import.meta.url).pathname, port = 19900 + Math.floor(Math.random() * 90);
const srv = spawn('python3', [root + 'serve.py', '--port', String(port)], { env: { ...process.env, PHYSICS_RPG_PROFILES: mkdtempSync(tmpdir() + '/rpg-') }, stdio: 'ignore' }); await new Promise((r) => setTimeout(r, 800));
const exe = process.env.CHROMIUM || ['/opt/pw-browsers/chromium', '/tmp/chr-local/chromium'].find(existsSync);
const b = await chromium.launch({ executablePath: exe, headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
let fails = 0; const ck = (n, c, extra = '') => { if (!c) fails++; console.log(`${c ? 'PASS' : 'FAIL'} ${n}${c ? '' : '  ' + extra}`); }; const errs = [];
const ctx = await b.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true }), p = await ctx.newPage();
p.on('pageerror', (e) => errs.push(e.message));
await p.goto(`http://127.0.0.1:${port}/index.html?test=1&nexus=1`); await p.waitForFunction(() => !!window.__game, null, { timeout: 40000 }); await p.waitForTimeout(800);
const g = (f, a) => p.evaluate(f, a), sleep = (ms) => p.waitForTimeout(ms);
await g(() => window.__game.loadRoom('qm', 'hydrogen-lamp')); await sleep(1200); await g(() => document.getElementById('tut')?.style.display !== 'none' && document.getElementById('tut-skip')?.click());
ck('sideways phone: narrower field of view than upright (closer look)', (await g(() => window.__game.fov())) < 60);
const z0 = await g(() => window.__game.zoom()), f0 = await g(() => window.__game.fov());
await g(() => document.getElementById('t-zin').click()); await sleep(100);
ck('zoom + makes the view narrower', (await g(() => window.__game.fov())) < f0 && (await g(() => window.__game.zoom())) > z0);
await g(() => { document.getElementById('t-zout').click(); document.getElementById('t-zout').click(); }); await sleep(100);
ck('zoom - widens it again', (await g(() => window.__game.fov())) > f0);
await g(() => window.__game.open('qm-hl-L1')); await sleep(1500);
const v = await g(() => window.__game.view());
ck('with the exercise panel open on the right the scene is shifted so its centre stays in the free area', v && v.enabled && v.offsetX > 0, JSON.stringify(v));
await g(() => window.__game.close()); await sleep(900);
ck('panel closed: no shift', !(await g(() => window.__game.view())).enabled || (await g(() => window.__game.view())).offsetX === 0);
// hologram sync: change a slider in the experiment, the hologram of the same experiment gets the value
const holo = await g(() => window.__game.holoParams());
ck('the room has experiment holograms', holo.length > 0, JSON.stringify(holo));
if (holo.length) {
  const id = holo[0].id; await g((id) => window.__game.open(id), id); await sleep(900);
  await sleep(1500); const info = await g(() => { const i = document.querySelector('[data-c]'); return i ? { c: i.dataset.c, min: +i.min, max: +i.max } : null; });
  ck('the experiment panel has sliders', !!info);
  if (info) {
    const before = holo.find((h) => h.id === id).p[info.c], target = info.min + (info.max - info.min) * 0.8;
    await g(({ target }) => { const i = document.querySelector('[data-c]'); i.value = String(target); i.dispatchEvent(new Event('input', { bubbles: true })); }, { target });
    await sleep(300);
    const after = (await g(() => window.__game.holoParams())).find((h) => h.id === id);
    ck('the hologram took over the slider value and is marked live', after && after.live && after.p[info.c] !== before, JSON.stringify(after));
  }
}
// wave-packet lab: the box view greys out nothing it uses, the packet view greys out the width slider
await g(() => window.__game.loadRoom('qm', 'wave-mechanics-basics')); await sleep(1200); await g(() => window.__game.open('lab-qm-wavepacket')); await sleep(900);
const dis = () => g(() => ({ w: document.querySelector('[data-c=w]').disabled, hm: document.querySelector('[data-c=hm]').disabled }));
ck('packet view: width slider greyed, inertia active', JSON.stringify(await dis()) === '{"w":true,"hm":false}');
await g(() => { const i = document.querySelector('[data-c=box]'); i.checked = true; i.dispatchEvent(new Event('input', { bubbles: true })); }); await sleep(300);
ck('box view: both sliders active', JSON.stringify(await dis()) === '{"w":false,"hm":false}');
ck('no page errors', errs.length === 0, errs.join(' | '));
await b.close(); srv.kill(); console.log(fails ? `${fails} FAILED` : 'ALL OK'); process.exit(fails ? 1 : 0);
