// Screenshot every astro set piece in headless Chromium: node test/astro-scenes.mjs  → /tmp/shots/astro-*.png
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { ROOM_IDS } from '../src/rooms/astrophysics.js';

execFileSync('sh', [fileURLToPath(new URL('./setup-chromium.sh', import.meta.url))]);
const root = fileURLToPath(new URL('..', import.meta.url));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json' };
const server = createServer(async (req, res) => {
  try { const p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, ''); const f = await readFile(join(root, p)); res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); res.end(f); } catch { res.writeHead(404); res.end(); }
}).listen(0);
await mkdir('/tmp/shots', { recursive: true });
const browser = await chromium.launch({ executablePath: '/tmp/chr-local/chromium', headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
let fails = 0;
for (const id of ROOM_IDS) {
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await page.goto(`http://127.0.0.1:${server.address().port}/test/astro-preview.html?room=${id}`);
  await page.waitForFunction('window.__ready === true', null, { timeout: 30000 }).catch(() => errs.push('timeout'));
  await page.screenshot({ path: `/tmp/shots/${id}.png` });
  console.log(`${errs.length ? 'FAIL' : 'PASS'} ${id} ${errs.join('; ')}`); if (errs.length) fails++;
  await page.close();
}
await browser.close(); server.close();
console.log(fails ? `${fails} FAILED` : 'ALL PASS'); process.exit(fails ? 1 : 0);
