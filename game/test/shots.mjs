// Screenshots of chosen rooms: node test/shots.mjs qm/tunneling-bridge solid-state/lattice-gate ... (-> /tmp/shots/s-<course>-<room>.png)
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
execFileSync('sh', [fileURLToPath(new URL('./setup-chromium.sh', import.meta.url))]);
const root = fileURLToPath(new URL('..', import.meta.url));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => { try { const p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)); if (p === '/api/ping') { res.writeHead(200, { 'content-type': 'application/json' }); return res.end('{"ok":false,"static":true}'); }
    const f = await readFile(join(root, p === '/' ? 'index.html' : p)); res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); res.end(f); } catch { res.writeHead(404); res.end('nf'); } }).listen(0);
await mkdir('/tmp/shots', { recursive: true });
const browser = await chromium.launch({ executablePath: '/tmp/chr-local/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(`http://127.0.0.1:${server.address().port}/index.html?test=1`);
await page.evaluate(() => localStorage.clear()); await page.reload();
await page.waitForFunction(() => !!window.__game);
for (const ref of process.argv.slice(2)) {
  const [c, r] = ref.split('/');
  await page.evaluate(([c, r]) => window.__game.loadRoom(c, r), [c, r]);
  await page.evaluate(() => { const t = document.getElementById('tut'); if (t.style.display !== 'none') document.getElementById('tut-skip').click(); window.__game.teleport(0, 8.2, 0, 0.02); });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `/tmp/shots/s-${c}-${r}.png` }); console.log('shot', ref);
}
if (errors.length) console.log('ERRORS', errors.slice(0, 5));
await browser.close(); server.close();
