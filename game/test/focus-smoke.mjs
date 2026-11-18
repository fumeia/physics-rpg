// focus at 0: an exercise waits behind a gate (theory / break / push on); pushing on caps the grade
import { createServer } from 'node:http'; import { readFile } from 'node:fs/promises'; import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright-core';
const root = new URL('..', import.meta.url).pathname; const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png' };
const server = createServer(async (q, res) => { try { const p = normalize(decodeURIComponent(new URL(q.url, 'http://x').pathname)); if (p === '/api/ping') { res.writeHead(200); return res.end('{"ok":false}'); } const f = await readFile(join(root, p === '/' ? 'index.html' : p)); res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); res.end(f); } catch { res.writeHead(404); res.end(); } }).listen(0);
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } }); let bad = 0; const ck = (m, ok) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${m}`); if (!ok) bad++; };
p.on('pageerror', (e) => { console.log('pageerror', e.message); bad++; });
await p.goto(`http://127.0.0.1:${server.address().port}/index.html?test=1&hud=compact`); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForFunction(() => !!window.__game);
const today = await p.evaluate(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; });
await p.evaluate((date) => { const k = 'physics-rpg-v1', s = JSON.parse(localStorage.getItem(k) || '{"xp":0,"solved":{},"reviews":{},"flags":{}}'); s.flags = { ...(s.flags || {}), focus: { date, v: 0 } }; localStorage.setItem(k, JSON.stringify(s)); }, today);
await p.reload(); await p.waitForFunction(() => !!window.__game);
const ids = await p.evaluate(() => { const all = window.__game.catalog().flatMap((c) => c.rooms.flatMap((r) => r.encounters)); return { calc: all.find((e) => e.type === 'calc' && !e.synthetic).id, lesson: all.find((e) => e.type === 'lesson').id }; });
await p.evaluate((id) => window.__game.open(id), ids.calc); await p.waitForTimeout(400);
ck('an exercise at 0 focus shows the gate', await p.locator('.bt-gate').count() === 1 && await p.evaluate(() => document.getElementById('panel').classList.contains('bt-out')));
ck('the gate offers theory, break and push on', await p.locator('.bt-gate [data-brk]').count() === 1 && await p.locator('.bt-gate [data-push]').count() === 1 && await p.locator('.bt-gate [data-rc]').count() === 1);
await p.click('.bt-gate [data-brk]'); await p.waitForTimeout(300);
ck('a break shows a countdown', /On a break: [45]:\d\d/.test(await p.locator('.bt-gate').innerText()));
await p.click('.bt-gate [data-push]'); await p.waitForTimeout(300);
ck('push on lifts the gate', await p.locator('.bt-gate').count() === 0 && !(await p.evaluate(() => document.getElementById('panel').classList.contains('bt-out'))));
await p.evaluate((id) => window.__game.open(id), ids.calc); await p.waitForTimeout(300);
await p.click('.bt-gate [data-rc]'); await p.waitForTimeout(400);
ck('"go back to the theory" opens a lesson without a gate', await p.locator('.bt-gate').count() === 0 && await p.evaluate(() => !!document.querySelector('.battle')));
// a finished break refills to 60
await p.evaluate((date) => { const k = 'physics-rpg-v1', s = JSON.parse(localStorage.getItem(k)); s.flags.focus = { date, v: 0 }; s.flags.focusBreak = { date, until: Date.now() - 1 }; localStorage.setItem(k, JSON.stringify(s)); }, today);
await p.reload(); await p.waitForFunction(() => !!window.__game); await p.evaluate((id) => window.__game.open(id), ids.calc); await p.waitForTimeout(400);
ck('after the break: focus 60, no gate', (await p.locator('.bt-fv').innerText()).startsWith('60') && await p.locator('.bt-gate').count() === 0);
await b.close(); server.close(); console.log(bad ? `${bad} FAILED` : 'ALL OK'); process.exit(bad ? 1 : 0);
