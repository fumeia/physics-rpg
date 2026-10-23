// Loads every room of every course in the real game, builds its 3D set piece, opens every encounter and checks that
// the panel renders (no JS errors, no KaTeX errors, every encounter shows something). Screenshots to /tmp/shots/rooms-*.png.
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

execFileSync('sh', [fileURLToPath(new URL('./setup-chromium.sh', import.meta.url))]);
const root = fileURLToPath(new URL('..', import.meta.url));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => {
  try { const p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)); if (p === '/api/ping') { res.writeHead(200, { 'content-type': 'application/json' }); return res.end('{"ok":false,"static":true}'); }
    const f = await readFile(join(root, p === '/' ? 'index.html' : p)); res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); res.end(f); }
  catch { res.writeHead(404); res.end('nf'); }
}).listen(0);
const port = server.address().port;
await mkdir('/tmp/shots', { recursive: true });
const browser = await chromium.launch({ executablePath: '/tmp/chr-local/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
page.on('requestfailed', (r) => errors.push('requestfailed: ' + r.url()));
let fails = 0, checks = 0;
const ok = (name, cond, extra = '') => { checks++; if (!cond) { fails++; console.log(`FAIL ${name} ${extra}`); } };

await page.goto(`http://127.0.0.1:${port}/index.html?test=1`);
await page.evaluate(() => localStorage.clear()); await page.goto(`http://127.0.0.1:${port}/index.html?test=1`);
await page.waitForFunction(() => !!window.__game);
const catalog = await page.evaluate(() => window.__game.catalog());
const only = process.argv[2]; // optional: course id filter
let shots = 0;
for (const c of catalog) {
  if (only && c.id !== only) continue;
  for (const r of c.rooms) {
    await page.evaluate(([c, r]) => window.__game.loadRoom(c, r), [c.id, r.id]);
    ok(`${c.id}/${r.id} loaded`, (await page.evaluate(() => window.__game.currentRoom())) === `${c.id}/${r.id}`);
    const groups = await page.evaluate(() => window.__game.groups());
    ok(`${r.id}: console groups`, groups.length >= 1 && groups.length <= 6, JSON.stringify(groups));
    await page.waitForTimeout(250);
    if (shots < 6 || r.id === c.rooms[0].id) { await page.evaluate(() => window.__game.teleport(0, 8.0, 0, 0.0)); await page.waitForTimeout(250); await page.screenshot({ path: `/tmp/shots/rooms-${c.id}-${r.id}.png` }); shots++; }
    let n = 0;
    for (const e of r.encounters) {
      await page.evaluate((id) => window.__game.open(id), e.id);
      await page.waitForTimeout(30);
      const info = await page.evaluate(() => ({ len: document.getElementById('panel').innerText.length, katexErr: document.querySelectorAll('.katex-error').length, shown: !document.getElementById('side').classList.contains('hidden') }));
      ok(`${e.id} (${e.type}) renders`, info.shown && info.len > 40, JSON.stringify(info));
      ok(`${e.id} has no KaTeX errors`, info.katexErr === 0, `${info.katexErr} errors`);
      if (e.type === 'lab') {
        const res = await page.evaluate(async () => {
          const cv = document.querySelector('canvas.labcv'), ctx = cv.getContext('2d'), px = ctx.getImageData(0, 0, cv.width, cv.height).data; let distinct = new Set();
          for (let i = 0; i < px.length; i += 4 * 97) distinct.add(px[i] + ',' + px[i + 1] + ',' + px[i + 2]);
          const before = document.getElementById('labinfo').textContent;
          let changed = 0;
          for (const inp of document.querySelectorAll('[data-c]')) {
            if (inp.type === 'checkbox') { inp.checked = !inp.checked; inp.dispatchEvent(new Event('input')); await new Promise((r) => setTimeout(r, 30)); }
            else for (const v of [inp.min, inp.max]) { inp.value = v; inp.dispatchEvent(new Event('input')); await new Promise((r) => setTimeout(r, 30)); if (document.getElementById('labinfo').textContent !== before) changed++; }
          }
          return { colors: distinct.size, info: before.length, changed, controls: document.querySelectorAll('[data-c]').length };
        });
        ok(`${e.id} canvas is drawn and controls respond`, res.colors > 6 && res.info > 40 && res.changed > 0, JSON.stringify(res));
      }
      n++;
    }
    await page.evaluate(() => window.__game.close());
    process.stdout.write(`${c.id}/${r.id}: ${n} encounters ok\n`);
  }
}
ok('no browser errors', errors.length === 0, errors.slice(0, 5).join(' | '));
console.log(fails ? `${fails} of ${checks} FAILED` : `ALL PASS (${checks} checks)`);
await browser.close(); server.close(); process.exit(fails ? 1 : 0);
