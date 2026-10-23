// Screenshots + checks of the Nexus hub: node test/nexus-shots.mjs  (-> /tmp/shots/nx-*.png)
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
const errors = []; page.on('pageerror', (e) => errors.push(e.stack || e.message)); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(`http://127.0.0.1:${server.address().port}/index.html?test=1&nexus=1`);
await page.evaluate(() => localStorage.clear()); await page.reload();
await page.waitForFunction(() => !!window.__game);
await page.waitForFunction(() => window.__game.nexus());
console.log('nexus', JSON.stringify(await page.evaluate(() => window.__game.nexus())));
await page.waitForTimeout(2500); await page.screenshot({ path: '/tmp/shots/nx-1-overview.png' });
// fly to the first QM star
const pos = await page.evaluate(() => { const g = window.__game; const n = g.world().scene.getObjectByName('nexus'); return null; });
for (const [name, x, y, z, yaw, pitch] of [['qm', -29, 7, 0.5, 0.2, -0.05], ['links', -12, 16, -12, 0, 0.0], ['astro', 4, 16, -46, 0.1, -0.1]]) {
  await page.evaluate(([x, y, z, yaw, pitch]) => window.__game.flyTo(x, y, z, yaw, pitch), [x, y, z, yaw, pitch]);
  await page.waitForTimeout(2500); await page.screenshot({ path: `/tmp/shots/nx-2-${name}.png` });
  console.log(name, JSON.stringify(await page.evaluate(() => window.__game.nexus())));
}
console.log('errors', errors.slice(0, 5));
await browser.close(); server.close();
