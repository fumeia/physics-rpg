// The astro Choudhuri plan: book exercises are sheet questions with due dates, and a due sheet gets into the run.
// Usage: node test/campaign-smoke.mjs
import { createServer } from 'node:http'; import { readFile } from 'node:fs/promises'; import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright-core';
const root = new URL('..', import.meta.url).pathname; const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png' };
const server = createServer(async (q, res) => { try { const p = normalize(decodeURIComponent(new URL(q.url, 'http://x').pathname)); if (p === '/api/ping') { res.writeHead(200); return res.end('{"ok":false}'); } const f = await readFile(join(root, p === '/' ? 'index.html' : p)); res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); res.end(f); } catch { res.writeHead(404); res.end(); } }).listen(0);
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1280, height: 860 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
await p.clock.install({ time: new Date('2026-11-22T10:00:00') }); // Sunday: astro sheet 1 is due Monday
await p.goto(`http://127.0.0.1:${server.address().port}/index.html?test=1&hud=compact`); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForFunction(() => !!window.__game);
let fails = 0; const ck = (n, c, x = '') => { if (!c) fails++; console.log(`${c ? 'PASS' : 'FAIL'} ${n} ${c ? '' : x}`); };
p.on('pageerror', (e) => { fails++; console.log('pageerror', e.message); });
await p.evaluate(() => document.getElementById('tut-skip')?.click());
await p.click('#st-go').catch(() => {}); await p.waitForTimeout(600); await p.evaluate(() => document.getElementById('tut-skip')?.click()); await p.keyboard.press('Escape');
await p.evaluate(() => window.__game.open('astro-book-2-3')); await p.waitForTimeout(800);
const head = await p.evaluate(() => document.querySelector('#panel .sheetlink .ctitle')?.textContent || '');
ck(`a Choudhuri exercise shows its sheet and due date ("${head}")`, /sheet 2, question 3 · due/i.test(head), head);
ck('it keeps its step explanations', await p.evaluate(() => document.querySelectorAll('#panel .dexp').length > 0));
await p.evaluate(() => window.__game.close()); await p.keyboard.press('KeyC'); await p.waitForTimeout(300); await p.waitForTimeout(500); await p.evaluate(() => document.getElementById('cp-setup-ok').click()); await p.waitForTimeout(600);
const stops = await p.evaluate(() => window.__game.runStops());
const astro = stops.filter((s) => s.id.startsWith('astro-book-')); console.log('   astro stops on Sunday:', astro.length);
ck(`today's run contains a Choudhuri sheet question (${astro.map((s) => s.id + ':' + s.kind).join(', ')})`, astro.length >= 1, JSON.stringify(stops));
const bossTxt = await p.evaluate(() => document.getElementById('ov-body').textContent);
ck('the weekly boss list shows the astro sheet', /Astro[^]*sheet 1|Warden of Sheet 1/i.test(bossTxt));
await b.close(); server.close(); console.log(fails ? `${fails} FAILED` : 'ALL OK'); process.exit(fails ? 1 : 0);
