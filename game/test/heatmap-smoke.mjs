// Stats heatmap: a tap on a day shows its minutes, exercises and minutes per course.
// Usage: node test/campaign-smoke.mjs
import { createServer } from 'node:http'; import { readFile } from 'node:fs/promises'; import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright-core';
const root = new URL('..', import.meta.url).pathname; const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png' };
const server = createServer(async (q, res) => { try { const p = normalize(decodeURIComponent(new URL(q.url, 'http://x').pathname)); if (p === '/api/ping') { res.writeHead(200); return res.end('{"ok":false}'); } const f = await readFile(join(root, p === '/' ? 'index.html' : p)); res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); res.end(f); } catch { res.writeHead(404); res.end(); } }).listen(0);
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1280, height: 860 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
await p.goto(`http://127.0.0.1:${server.address().port}/index.html?test=1&hud=compact`); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForFunction(() => !!window.__game);
let fails = 0; const ck = (n, c, x = '') => { if (!c) fails++; console.log(`${c ? 'PASS' : 'FAIL'} ${n} ${c ? '' : x}`); };
p.on('pageerror', (e) => { fails++; console.log('pageerror', e.message); });
const ds = (o) => { const d = new Date(); d.setDate(d.getDate() + o); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const y = ds(-1);
await p.evaluate(([y]) => { const k = 'physics-rpg-v1', s = JSON.parse(localStorage.getItem(k) || '{"xp":0,"solved":{},"reviews":{},"flags":{}}');
  s.flags = { ...(s.flags || {}), active: { [y]: 2820 }, 'active-since': y, activeBy: { [y]: { 'qm|calc': 1800, 'solid-state|read': 1020 } }, activity: [{ t: Date.parse(y + 'T10:00:00'), id: 'qm-wm-L1', title: 'x', type: 'lesson', ok: true }, { t: Date.parse(y + 'T11:00:00'), id: 'qm-wm-Q1', title: 'y', type: 'quiz', ok: false }] };
  localStorage.setItem(k, JSON.stringify(s)); }, [y]);
await p.reload(); await p.waitForFunction(() => !!window.__game);
await p.evaluate(() => document.getElementById('tut-skip')?.click()); await p.keyboard.press('KeyC'); await p.waitForTimeout(500); await p.evaluate(() => document.getElementById('cp-setup-ok')?.click()); await p.waitForTimeout(600);
ck('the heatmap starts with today', /\(today\)/.test(await p.evaluate(() => document.getElementById('st-dayinfo')?.innerText || '')));
await p.evaluate((y) => document.querySelector(`.st-c[data-day="${y}"]`).click(), y); await p.waitForTimeout(200);
const t = await p.evaluate(() => document.getElementById('st-dayinfo').innerText); console.log('   ', t.replace(/\n/g, ' | '));
ck('a tap on yesterday shows its minutes, exercises and courses', /47 min studied/.test(t) && /1 exercise passed, 1 to retry/.test(t) && /30 min/.test(t) && /17 min/.test(t), t);
ck('the tapped day is marked', await p.evaluate((y) => document.querySelector(`.st-c[data-day="${y}"]`).classList.contains('sel'), y));
await b.close(); server.close(); console.log(fails ? `${fails} FAILED` : 'ALL OK'); process.exit(fails ? 1 : 0);
