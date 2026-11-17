// Guided reading: the run starts a week with its script reading; the second pass through the script feeds earlier weeks.
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
const stops = await p.evaluate(() => [...document.querySelectorAll('.cp-node')].map((x) => x.dataset.stop + ':' + x.className));
ck('the run starts the solid-state week with its script reading', stops.some((s) => /^ss-read-\d+:.*\bread\b/.test(s)), stops.join(' | '));
ck('second-pass control on the solid-state track', await p.isVisible('[data-rrstart="solid-state"]'));
ck('second-pass control on the QM track too (QM has reading cards)', await p.isVisible('[data-rrstart="qm"]'));
await p.selectOption('[data-rrfrom="solid-state"]', '1'); await p.click('[data-rrstart="solid-state"]'); await p.waitForTimeout(400);
const stops2 = await p.evaluate(() => [...document.querySelectorAll('.cp-node')].map((x) => x.dataset.stop + ':' + x.className));
ck('second pass puts week 1 reading into the run', stops2.some((s) => s.startsWith('ss-read-01:') && /reread/.test(s)), stops2.join(' | '));
await p.click('.cp-node[data-stop="ss-read-01"]'); await p.waitForTimeout(800);
const card = await p.evaluate(() => ({ h: document.querySelector('#panel h2')?.textContent, kinds: [...document.querySelectorAll('#panel .callout .ctitle')].map((x) => x.textContent), det: document.querySelectorAll('#panel details').length }));
ck('reading card shows before / read / think blocks with hidden answers', card.kinds.some((k) => /Before you read/.test(k)) && card.kinds.some((k) => /Now read/.test(k)) && card.det >= 2, JSON.stringify(card));
await p.evaluate(() => window.__game.finish('ss-read-01', true, 15)); await p.evaluate(() => window.__game.close()); await p.keyboard.press('Escape'); await p.waitForTimeout(200);
await p.keyboard.press('KeyC'); await p.waitForTimeout(400);
const rr = await p.textContent('.cp-reread.cur').catch(() => '');
ck('second-pass counter moves to 1 read', /1 of \d+ read/.test(rr), rr);
await p.setViewportSize({ width: 390, height: 844 }); await p.evaluate(() => window.__game.open('ss-read-17')); await p.waitForTimeout(1200);
await p.evaluate(() => document.querySelector('#panel details')?.setAttribute('open', '')); if (process.env.SHOT) await p.screenshot({ path: process.env.SHOT });
ck('no page errors', errs.length === 0, errs.join(' | '));
console.log(fails ? `${fails} FAILED` : 'ALL OK'); await b.close(); server.close(); process.exit(fails ? 1 : 0);
