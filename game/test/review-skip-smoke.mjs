// A sheet question you missed goes into the review schedule (3, 7, 16, 35 days); the next runs move on to the next questions.
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
await p.evaluate(() => document.getElementById('tut-skip')?.click());
await p.click('#st-go').catch(() => {}); await p.waitForTimeout(600); await p.evaluate(() => document.getElementById('tut-skip')?.click()); await p.keyboard.press('Escape');
await p.keyboard.press('KeyC'); await p.waitForTimeout(300); await p.click('#cp-setup-ok'); await p.waitForTimeout(300);
const replan = async () => { await p.evaluate(() => window.__game.close?.()); await p.keyboard.press('Escape'); await p.keyboard.press('KeyC'); await p.waitForTimeout(300); await p.evaluate(() => [...document.querySelectorAll('[data-len]')].find((b) => b.classList.contains('cur'))?.click()); await p.waitForTimeout(400); return p.evaluate(() => window.__game.runStops()); };
await p.evaluate(() => { const bs = [...document.querySelectorAll('[data-len]')]; bs.sort((a, b) => +b.dataset.len - +a.dataset.len)[0].click(); }); await p.waitForTimeout(400); // the long run
const s0 = await p.evaluate(() => window.__game.runStops()), q = s0.find((s) => s.kind === 'sheet');
ck('the run has a sheet question', !!q, JSON.stringify(s0));
await p.evaluate((id) => window.__game.finish(id, false, 0), q.id);
const s1 = await replan();
ck(`a missed question (${q.id}) is not in the next run`, !s1.some((s) => s.id === q.id), JSON.stringify(s1));
ck('it is scheduled as a review instead', await p.evaluate((id) => window.__game.state().due.includes(id) === false, q.id));
const q2 = s1.find((s) => s.kind === 'sheet');
ck(`the run moves on to another question (${q2?.id})`, !!q2 && q2.id !== q.id);
// on its review day it comes back, at the end of the run
await p.evaluate((id) => { const k = 'physics-rpg-v1', s = JSON.parse(localStorage.getItem(k)); s.reviews[id].due = Date.now() - 1000; localStorage.setItem(k, JSON.stringify(s)); }, q.id);
await p.reload(); await p.waitForFunction(() => !!window.__game); await p.evaluate(() => document.getElementById('tut-skip')?.click());
const s2 = await replan(), at = s2.findIndex((s) => s.id === q.id);
ck('on its review day it is back as a review', at >= 0 && s2[at].kind === 'warmup', JSON.stringify(s2));
ck('reviews come after the new material', at > s2.findIndex((s) => ['read', 'theory', 'sheet'].includes(s.kind)));
await b.close(); server.close(); console.log(fails ? `${fails} FAILED` : 'ALL OK'); process.exit(fails ? 1 : 0);
