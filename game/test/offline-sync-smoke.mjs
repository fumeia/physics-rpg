// Offline play on two devices: the game loads without a network (service worker copy), each device saves on its own copy,
// and once online again both merge on the server without losing anything.  Usage: node test/offline-sync-smoke.mjs
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process'; import { mkdtempSync, readFileSync } from 'node:fs'; import { tmpdir } from 'node:os'; import { join } from 'node:path';
const root = new URL('..', import.meta.url).pathname, prof = mkdtempSync(join(tmpdir(), 'rpg-prof-')), port = 18000 + Math.floor(Math.random() * 2000);
const srv = spawn('python3', [join(root, 'serve.py'), '--port', String(port)], { env: { ...process.env, PHYSICS_RPG_PROFILES: prof, PHYSICS_RPG_TOKEN: '' }, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
let bad = 0; const ck = (m, ok) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${m}`); if (!ok) bad++; };
const URL0 = `http://127.0.0.1:${port}/index.html?test=1&hud=compact&sw=1`;
async function device(name) {
  const ctx = await b.newContext({ viewport: { width: 1100, height: 760 } }), p = await ctx.newPage();
  p.on('pageerror', (e) => console.log(name, 'pageerror', e.message));
  await p.goto(URL0); await p.waitForFunction(() => !!window.__game, null, { timeout: 60000 });
  await p.waitForFunction(() => navigator.serviceWorker?.controller || navigator.serviceWorker?.ready.then(() => true), null, { timeout: 30000 });
  if (!(await p.evaluate(() => !!navigator.serviceWorker.controller))) { await p.reload(); await p.waitForFunction(() => !!window.__game, null, { timeout: 60000 }); }
  // wait until the copy is complete
  await p.waitForFunction(async () => { const c = await caches.open('rpg-static-v2'), m = await c.match('/__rpg_manifest__'), l = await (await fetch('/api/precache')).json(); if (!m) return false; const have = await m.json(); return Object.keys(l.files).every((k) => k in have); }, null, { timeout: 120000, polling: 1500 });
  return { ctx, p };
}
const ids = [];
const A = await device('A');
ids.push(...(await A.p.evaluate(() => window.__game.catalog().flatMap((c) => c.rooms.flatMap((r) => r.encounters)).filter((e) => e.type === 'quiz').slice(0, 4).map((e) => e.id))));
await A.p.evaluate((id) => window.__game.finish(id, true, 10), ids[0]); await A.p.evaluate(() => window.__game.syncNow()); await A.p.waitForTimeout(500);
const B = await device('B');
ck('a second device picks up the progress of the first', (await B.p.evaluate(() => window.__game.solvedIds())).includes(ids[0]));
const xp0 = await B.p.evaluate(() => window.__game.state().xp);
// both offline: reload works from the copy, and each does something different
for (const d of [A, B]) await d.ctx.setOffline(true);
await A.p.reload(); await A.p.waitForFunction(() => !!window.__game, null, { timeout: 60000 });
ck('the game starts offline (from the service worker copy)', await A.p.evaluate(() => window.__game.catalog().length >= 3));
ck('offline is shown as "saved here"', /offline/.test(await A.p.evaluate(() => window.__game.syncState().status)));
await A.p.evaluate((id) => window.__game.finish(id, true, 10), ids[1]);
await B.p.evaluate((id) => window.__game.finish(id, true, 10), ids[2]);
const xa = await A.p.evaluate(() => window.__game.state().xp), xb = await B.p.evaluate(() => window.__game.state().xp);
// back online
const fileXp = () => { try { return JSON.parse(readFileSync(join(prof, 'default.json'), 'utf8')).state.xp; } catch { return null; } };
for (const d of [A, B]) await d.ctx.setOffline(false);
await A.p.evaluate(() => window.__game.syncNow()); console.log('after A', fileXp(), await A.p.evaluate(() => window.__game.syncState().status));
await B.p.evaluate(() => window.__game.syncNow()); console.log('after B', fileXp(), await B.p.evaluate(() => window.__game.syncState().status));
await A.p.evaluate(() => window.__game.syncNow()); await A.p.waitForTimeout(500); console.log('after A2', fileXp());
const saved = JSON.parse(readFileSync(join(prof, 'default.json'), 'utf8')).state;
ck('the server has the work of both devices', [ids[0], ids[1], ids[2]].every((id) => saved.solved[id]));
ck(`XP of both offline sessions add up (${saved.xp} = ${xa} + ${xb} - ${xp0})`, saved.xp === xa + xb - xp0);
for (const d of [A, B]) { const s = await d.p.evaluate(() => window.__game.solvedIds()); ck('each device now has everything', [ids[0], ids[1], ids[2]].every((id) => s.includes(id))); }
// a stale save without merging is refused by the server
const r = await A.p.evaluate(async () => (await fetch('/api/profile/default', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ updated: Date.now(), base: 1, state: { xp: 0, solved: {} } }) })).status);
ck('the server refuses a save based on an old copy (409)', r === 409);
await b.close(); srv.kill(); console.log(bad ? `${bad} FAILED` : 'ALL OK'); process.exit(bad ? 1 : 0);
