// Several runs a day: the finished run stays listed under the new one, undo restores it.
// Usage: node test/campaign-runs.mjs
import { createServer } from 'node:http'; import { readFile } from 'node:fs/promises'; import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright-core';
const root = new URL('..', import.meta.url).pathname; const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png' };
const server = createServer(async (q, res) => { try { const p = normalize(decodeURIComponent(new URL(q.url, 'http://x').pathname)); if (p === '/api/ping') { res.writeHead(200); return res.end('{"ok":false}'); } const f = await readFile(join(root, p === '/' ? 'index.html' : p)); res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); res.end(f); } catch { res.writeHead(404); res.end(); } }).listen(0);
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1280, height: 860 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
await p.goto(`http://127.0.0.1:${server.address().port}/index.html?test=1&hud=compact`); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForFunction(() => !!window.__game);
let fails = 0; const ck = (n, c, x = '') => { if (!c) fails++; console.log(`${c ? 'PASS' : 'FAIL'} ${n} ${c ? '' : x}`); };

await p.evaluate(() => document.getElementById('tut-skip')?.click());
await p.click('#st-go').catch(() => {}); await p.waitForTimeout(600); await p.evaluate(() => document.getElementById('tut-skip')?.click()); await p.keyboard.press('Escape');
await p.keyboard.press('KeyC'); await p.waitForTimeout(300); await p.click('#cp-setup-ok'); await p.waitForTimeout(300);
const ids = new Set(await p.evaluate(() => window.__game.catalog().flatMap((c) => c.rooms.flatMap((r) => r.encounters.map((e) => e.id)))));
for (let round = 0; round < 12; round++) {
  const stops = await p.evaluate(() => [...document.querySelectorAll('.cp-node')].map((x) => ({ id: x.dataset.stop, open: !/ done| failed/.test(x.className) })));
  const nx = stops.find((s) => s.open); if (!nx) break;
  if (ids.has(nx.id)) { await p.click(`.cp-node[data-stop="${nx.id}"]`); await p.waitForTimeout(400); await p.evaluate((id) => window.__game.finish(id, true, 10), nx.id); }
  else { await p.click(`.cp-node[data-stop="${nx.id}"]`); await p.waitForTimeout(300); }
  await p.evaluate(() => window.__game.close()); await p.keyboard.press('Escape'); await p.waitForTimeout(200); await p.keyboard.press('KeyC'); await p.waitForTimeout(400);
}
ck('first run complete, "Plan another run" offered', await p.isVisible('#cp-again'));
await p.click('#cp-again'); await p.waitForTimeout(400);
ck('earlier run listed under the new run', await p.isVisible('.cp-earlier') && /Run #1/.test(await p.textContent('.cp-earlier')), await p.evaluate(() => document.querySelector('.cp-earlier')?.textContent.slice(0, 120)));
ck('new run is #2', /run #2/i.test(await p.textContent('.cp-runhead h3')));
ck('undo offered', await p.isVisible('#cp-undo'));
await p.click('#cp-undo'); await p.waitForTimeout(400);
ck('undo brings back the finished run', await p.isVisible('#cp-again') && !(await p.isVisible('.cp-earlier')));
ck('no page errors', errs.length === 0, errs.join(' | '));
console.log(fails ? `${fails} FAILED` : 'ALL OK'); await b.close(); server.close(); process.exit(fails ? 1 : 0);
