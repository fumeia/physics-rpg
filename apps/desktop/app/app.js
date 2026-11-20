// Physics RPG desktop app (Electron). The game runs from a copy on this computer; only progress goes over the network.
//
//   Game files   ~/.local/share/physics-rpg/game/<version>/     served to the window as rpg://game/...
//   Progress     the window's localStorage (Electron profile in ~/.config/physics-rpg), synced by the game's own sync.js
//                (offline-first, three-way merge, the server refuses stale saves), through rpg://game/api/... -> your server
//   Updates      every 10 minutes (and at start, and when the network comes back) the app asks the server which files exist
//                (/api/manifest), downloads only the changed ones into a new version folder, checks every size, and then
//                switches to it in one step (an atomic rename of the "current" pointer). Nothing half-downloaded is ever used.
//                The app's own code updates the same way (/api/manifest?part=desktop) and takes effect at the next start.
//   Login        the server's basic-auth login is added by this process to every request; the password is kept encrypted
//                with the system keyring (GNOME Keyring) when available.
const { app, BrowserWindow, protocol, net, ipcMain, shell, Menu, safeStorage, powerMonitor } = require('electron');
const path = require('path'), fs = require('fs'), fsp = fs.promises;

const VERSION = require('./package.json').version;
let CTX = null; // {coreDir, builtinDir, home}
const P = {}; // paths
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.gif': 'image/gif', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
  '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8', '.pdf': 'application/pdf', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.mp4': 'video/mp4', '.wasm': 'application/wasm', '.ico': 'image/x-icon' };
const log = (...a) => { const line = `[${new Date().toISOString()}] ${a.join(' ')}\n`; process.stdout.write(line); try { fs.appendFileSync(P.log, line); } catch { /* ignore */ } };

// ---------------------------------------------------------------- config (address, login)
function readConf() { try { return JSON.parse(fs.readFileSync(P.conf, 'utf8')); } catch { return {}; } }
function writeConf(c) { fs.mkdirSync(path.dirname(P.conf), { recursive: true }); const t = P.conf + '.tmp'; fs.writeFileSync(t, JSON.stringify(c, null, 1), { mode: 0o600 }); fs.renameSync(t, P.conf); }
function password(c) {
  if (c.passEnc && safeStorage.isEncryptionAvailable()) { try { return safeStorage.decryptString(Buffer.from(c.passEnc, 'base64')); } catch { return ''; } }
  return c.password || '';
}
function setLogin(c, user, pass) {
  c.user = user || ''; delete c.password; delete c.passEnc;
  if (pass) { if (safeStorage.isEncryptionAvailable()) c.passEnc = safeStorage.encryptString(pass).toString('base64'); else c.password = pass; }
}
let conf = {};
const server = () => (conf.url || '').replace(/\/+$/, '');
const authHeader = () => (conf.user ? { Authorization: 'Basic ' + Buffer.from(`${conf.user}:${password(conf)}`).toString('base64') } : {});

// fetch from the server with the login and a timeout; throws when offline
async function sfetch(p, opt = {}, ms = 15000) {
  const ac = new AbortController(), t = setTimeout(() => ac.abort(), ms);
  try { return await net.fetch(server() + p, { ...opt, headers: { ...(opt.headers || {}), ...authHeader() }, signal: ac.signal, bypassCustomProtocolHandlers: true }); }
  finally { clearTimeout(t); }
}

// ---------------------------------------------------------------- the local game copy
const readText = (f) => { try { return fs.readFileSync(f, 'utf8').trim(); } catch { return ''; } };
const currentGame = () => { const v = readText(path.join(P.game, 'current')); return v && fs.existsSync(path.join(P.game, v, 'index.html')) ? path.join(P.game, v) : null; };
let servedDir = null; // the version the open page was loaded from (a page never mixes two versions)

function swapPointer(dir, name) { const t = path.join(dir, 'current.tmp'); fs.writeFileSync(t, name); fs.renameSync(t, path.join(dir, 'current')); } // atomic

const status = { phase: 'idle', done: 0, total: 0, msg: '', lastCheck: 0, lastOk: 0, error: '' };
let updating = null;
// bring a folder copy up to date with a server manifest: changed files are downloaded, unchanged ones hard-linked from the
// current version, every size checked; only a complete copy becomes current
async function syncCopy({ root, manifestPath, prefix, onProgress }) {
  const r = await sfetch(manifestPath);
  if (r.status === 401) throw Object.assign(new Error('the server refused the login'), { login: true });
  if (!r.ok) throw new Error(`manifest: HTTP ${r.status}`);
  const files = (await r.json()).files || {}, names = Object.keys(files).filter((k) => k.startsWith(prefix));
  if (!names.length) throw new Error('the server listed no files');
  fs.mkdirSync(root, { recursive: true });
  const curName = readText(path.join(root, 'current')), cur = curName ? path.join(root, curName) : null;
  let old = {}; try { old = JSON.parse(fs.readFileSync(path.join(cur, '.manifest.json'), 'utf8')); } catch { /* first copy */ }
  const same = (k) => old[k] && old[k][0] === files[k][0] && old[k][1] === files[k][1];
  if (cur && fs.existsSync(cur) && names.length === Object.keys(old).length && names.every(same)) return { changed: 0, version: curName };
  const name = `v${Date.now()}`, dir = path.join(root, name + '.part');
  const todo = [];
  for (const k of names) {
    const rel = k.slice(prefix.length), dst = path.join(dir, rel);
    if (rel.includes('..')) continue;
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    if (cur && same(k)) { try { fs.linkSync(path.join(cur, rel), dst); continue; } catch { try { fs.copyFileSync(path.join(cur, rel), dst); continue; } catch { /* download it */ } } }
    todo.push(k);
  }
  let done = 0; onProgress?.(0, todo.length);
  const one = async (k) => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await sfetch(k.split('/').map(encodeURIComponent).join('/'), {}, 60000);
        if (!res.ok) throw new Error(`HTTP ${res.status} ${k}`);
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length !== files[k][1]) throw new Error(`size of ${k}: ${buf.length} instead of ${files[k][1]}`);
        await fsp.writeFile(path.join(dir, k.slice(prefix.length)), buf); onProgress?.(++done, todo.length); return;
      } catch (e) { if (attempt === 2) throw e; await new Promise((ok) => setTimeout(ok, 800 * (attempt + 1))); }
    }
  };
  try {
    let i = 0; await Promise.all(Array.from({ length: 6 }, async () => { while (i < todo.length) await one(todo[i++]); }));
  } catch (e) { fs.rmSync(dir, { recursive: true, force: true }); throw e; }
  fs.writeFileSync(path.join(dir, '.manifest.json'), JSON.stringify(Object.fromEntries(names.map((k) => [k, files[k]]))));
  fs.renameSync(dir, path.join(root, name)); swapPointer(root, name);
  // keep the previous version (the open window may still be reading it); remove the older ones and leftovers
  for (const d of fs.readdirSync(root)) { const full = path.join(root, d); if (d === name || d === curName || d === 'current' || !fs.statSync(full).isDirectory()) continue; if (full === servedDir) continue; fs.rmSync(full, { recursive: true, force: true }); }
  return { changed: todo.length, version: name };
}

async function updateAll(reason) {
  if (!server()) return;
  if (updating) return updating;
  updating = (async () => {
    status.lastCheck = Date.now();
    try {
      const first = !currentGame();
      status.phase = 'game'; status.error = '';
      const g = await syncCopy({ root: P.game, manifestPath: '/api/manifest', prefix: '/', onProgress: (d, t) => { status.done = d; status.total = t; if (first) sendStatus(`Downloading the game: ${d} / ${t} files`); } });
      if (g.changed) log(`game updated (${reason}): ${g.changed} files -> ${g.version}`);
      status.phase = 'core';
      let c = { changed: 0 };
      try { c = await syncCopy({ root: P.core, manifestPath: '/api/manifest?part=desktop', prefix: '/downloads/desktop/app/' }); if (c.changed) log(`app code updated: ${c.changed} files -> ${c.version}`); }
      catch (e) { log('app code update skipped:', e.message); }
      status.phase = 'idle'; status.lastOk = Date.now();
      if (first) openGame();
      else if (g.changed) offerReload(`The game was updated (${g.changed} file${g.changed === 1 ? '' : 's'}).`);
      if (c.changed) offerReload('The app itself was updated: it takes effect at the next start.', true);
    } catch (e) {
      status.phase = 'idle'; status.error = e.message; log(`update failed (${reason}): ${e.message}`);
      if (e.login) askSetup('The server refused the login. Check it below.');
      else if (!currentGame()) sendStatus(`Could not download the game: ${e.message}. It needs the internet once; retrying every 30 s.`, true);
    } finally { updating = null; }
  })();
  return updating;
}

// ---------------------------------------------------------------- the window
let win = null, setupWin = null, pendingReload = false;
function sendStatus(msg, err) { status.msg = msg; if (win && !win.isDestroyed() && win.webContents.getURL().startsWith('file:')) win.webContents.send('status', { msg, err: !!err }); }
function offerReload(text, restartOnly) {
  if (!win || win.isDestroyed()) return;
  if (!restartOnly) pendingReload = true;
  const js = `(() => { let b = document.getElementById('rpg-update'); if (!b) { b = document.createElement('div'); b.id = 'rpg-update'; b.style.cssText = 'position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:99999;background:#14203a;color:#e8eefc;border:1px solid #6cb6ff;border-radius:10px;padding:9px 14px;font:14px system-ui,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.5);display:flex;gap:10px;align-items:center'; document.body.appendChild(b); }
    b.innerHTML = ${JSON.stringify(text)} + ${restartOnly ? "''" : "' <button id=rpg-upd-go style=\"background:#6cb6ff;color:#08101e;border:0;border-radius:6px;padding:4px 10px;font-weight:700;cursor:pointer\">Load it now</button>'"} + ' <button id=rpg-upd-x style=\"background:none;color:#9cc0ff;border:0;cursor:pointer\">later</button>';
    const g = document.getElementById('rpg-upd-go'); if (g) g.onclick = () => { b.remove(); window.__game && window.__game.syncNow ? Promise.resolve(window.__game.syncNow()).finally(() => location.reload()) : location.reload(); };
    document.getElementById('rpg-upd-x').onclick = () => b.remove(); })()`;
  win.webContents.executeJavaScript(js).catch(() => {});
}
function openGame() {
  if (!win || win.isDestroyed()) return createWindow();
  const q = process.argv.includes('--lite') ? '?lite=1' : '';
  servedDir = currentGame(); pendingReload = false;
  win.loadURL(`rpg://game/index.html${q}`);
}
function createWindow() {
  win = new BrowserWindow({ width: 1366, height: 860, minWidth: 900, minHeight: 600, backgroundColor: '#070a12', title: 'Physics RPG', icon: path.join(CTX.builtinDir, 'icon.png'), autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: false, spellcheck: false } });
  Menu.setApplicationMenu(null);
  win.webContents.setUserAgent(win.webContents.getUserAgent() + ` PhysicsRPG-Electron/${VERSION}`);
  win.webContents.on('before-input-event', (ev, i) => {
    if (i.type !== 'keyDown') return; const k = i.key.toLowerCase();
    if (i.key === 'F11') { win.setFullScreen(!win.isFullScreen()); ev.preventDefault(); }
    else if (i.control && k === 'r') { ev.preventDefault(); currentGame() ? openGame() : win.reload(); }
    else if (i.control && i.shift && k === 'i') { win.webContents.toggleDevTools(); ev.preventDefault(); }
    else if (i.control && (k === ',' || i.code === 'Comma')) { askSetup(); ev.preventDefault(); }
    else if (i.control && k === 'q') { ev.preventDefault(); quitSoftly(); }
    else if (i.control && k === 'u') { ev.preventDefault(); updateAll('by hand').then(() => { if (!pendingReload) offerReload(status.error ? `Update check failed: ${status.error}` : 'Everything is up to date.', true); }); }
  });
  // links: the game and its pages stay in the app, everything else opens in the normal browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('rpg://')) return { action: 'allow', overrideBrowserWindowOptions: { autoHideMenuBar: true, backgroundColor: '#070a12', icon: path.join(CTX.builtinDir, 'icon.png') } };
    if (/^https?:\/\//.test(url)) shell.openExternal(url); return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (ev, url) => { if (!url.startsWith('rpg://') && !url.startsWith('file://')) { ev.preventDefault(); if (/^https?:/.test(url)) shell.openExternal(url); } });
  win.webContents.on('did-start-navigation', (ev) => { if (ev.isMainFrame && !ev.isSameDocument && String(ev.url).startsWith('rpg://')) { servedDir = currentGame(); pendingReload = false; } });
  win.webContents.on('console-message', (ev) => { const m = ev.message ?? ev; if (ev.level === 'error' || ev.level === 3) log('page:', String(m).slice(0, 400)); });
  win.webContents.on('render-process-gone', (_e, d) => log('the page crashed:', d.reason));
  win.on('focus', () => { win.webContents.executeJavaScript("try{window.dispatchEvent(new Event('online'))}catch(e){}").catch(() => {}); });
  win.on('close', (ev) => { if (quitting) return; ev.preventDefault(); quitSoftly(); });
  win.once('ready-to-show', () => win.show());
  win.webContents.once('did-finish-load', markStarted);
  if (currentGame()) openGame(); else { win.loadFile(path.join(__dirname, 'status.html')); }
}
// the app code started cleanly: the loader may use this version again
function markStarted() { try { fs.rmSync(path.join(CTX.coreDir, '.starting'), { force: true }); } catch { /* ignore */ } }
let quitting = false;
async function quitSoftly() { // one last sync of the progress (at most 4 s), then quit
  if (quitting) return; quitting = true;
  try { await Promise.race([win.webContents.executeJavaScript('window.__game && window.__game.syncNow ? Promise.resolve(window.__game.syncNow()).then(() => true) : true'), new Promise((ok) => setTimeout(ok, 4000))]); } catch { /* ignore */ }
  app.quit();
}

// ---------------------------------------------------------------- first start / server settings
function askSetup(note) {
  if (setupWin && !setupWin.isDestroyed()) { setupWin.focus(); return; }
  setupWin = new BrowserWindow({ width: 560, height: 560, parent: win || undefined, modal: !!win, resizable: false, backgroundColor: '#0d1322', title: 'Physics RPG: your server', icon: path.join(CTX.builtinDir, 'icon.png'), autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: false } });
  setupWin.loadFile(path.join(__dirname, 'setup.html'), { query: { note: note || '', url: conf.url || '', user: conf.user || '' } });
  setupWin.on('closed', () => { setupWin = null; if (!server()) app.quit(); });
}
ipcMain.handle('setup:save', async (_e, { url, user, pass }) => {
  let u = String(url || '').trim(); if (!/^https?:\/\//.test(u)) u = 'https://' + u.replace(/^\/+/, ''); u = u.replace(/\/+$/, '');
  const next = { ...conf, url: u }; setLogin(next, String(user || '').trim(), pass || (user === conf.user ? password(conf) : ''));
  const old = conf; conf = next;
  try {
    const r = await sfetch('/api/ping', {}, 10000);
    if (r.status === 401) { conf = old; return { ok: false, msg: 'The server refused this login.' }; }
    const j = await r.json().catch(() => ({})); if (!j.ok) { conf = old; return { ok: false, msg: `This address answers, but it is not the Physics RPG server (HTTP ${r.status}).` }; }
  } catch (e) { conf = old; return { ok: false, msg: `Could not reach the server: ${e.message}` }; }
  writeConf(conf); setTimeout(() => { if (setupWin) setupWin.close(); updateAll('setup'); if (!win) createWindow(); }, 300);
  return { ok: true };
});
ipcMain.handle('status:get', () => ({ ...status, version: VERSION }));
ipcMain.handle('status:retry', () => { updateAll('retry'); return true; });

// ---------------------------------------------------------------- rpg://game/... : local files, /api/ to the server
// a graphics driver that Chromium blocks: draw the 3D view in software instead of failing (slower, but it works)
app.commandLine.appendSwitch('enable-unsafe-swiftshader');
protocol.registerSchemesAsPrivileged([{ scheme: 'rpg', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true, codeCache: true, allowServiceWorkers: false } }]);
async function handle(req) {
  const u = new URL(req.url); let p = decodeURIComponent(u.pathname);
  if (p.startsWith('/api/')) { // progress sync, reminders: to the server, with the login
    try {
      const body = ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.from(await req.arrayBuffer());
      const h = {}; for (const [k, v] of req.headers) if (!['host', 'origin', 'referer', 'cookie', 'authorization'].includes(k.toLowerCase())) h[k] = v;
      const r = await sfetch(p + u.search, { method: req.method, headers: h, body }, 12000);
      if (r.status === 401 && !h['x-token'] && !h['X-Token']) askSetupSoon();
      return new Response(await r.arrayBuffer(), { status: r.status, headers: { 'Content-Type': r.headers.get('content-type') || 'application/json', 'Cache-Control': 'no-store' } });
    } catch { return new Response('{"error":"offline"}', { status: 502, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }); }
  }
  const dir = servedDir || currentGame(); if (!dir) return new Response('not downloaded yet', { status: 503 });
  if (p === '/' || p === '') p = '/index.html';
  const f = path.normalize(path.join(dir, p)); if (!f.startsWith(dir + path.sep)) return new Response('no', { status: 403 });
  try { const data = await fsp.readFile(f); return new Response(data, { status: 200, headers: { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' } }); }
  catch {
    try { const r = await sfetch(p.split('/').map(encodeURIComponent).join('/'), {}, 15000); if (r.ok) return new Response(await r.arrayBuffer(), { status: 200, headers: { 'Content-Type': r.headers.get('content-type') || 'application/octet-stream' } }); } catch { /* offline */ }
    return new Response('not found', { status: 404 });
  }
}
let setupSoon = 0; function askSetupSoon() { if (Date.now() - setupSoon < 60000) return; setupSoon = Date.now(); setTimeout(() => askSetup('The server refused the saved login. Check it below.'), 200); }

// ---------------------------------------------------------------- start
exports.start = (ctx) => {
  CTX = ctx;
  P.home = ctx.home; P.game = path.join(ctx.home, 'game'); P.core = path.join(ctx.home, 'core'); P.log = path.join(ctx.home, 'app.log');
  app.setName('physics-rpg'); app.setPath('userData', path.join(process.env.XDG_CONFIG_HOME || path.join(require('os').homedir(), '.config'), 'physics-rpg-app'));
  P.conf = path.join(app.getPath('userData'), 'server.json');
  fs.mkdirSync(P.home, { recursive: true }); try { if (fs.statSync(P.log).size > 2e6) fs.renameSync(P.log, P.log + '.old'); } catch { /* new */ }
  if (!app.requestSingleInstanceLock()) { app.quit(); return; }
  app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
  app.whenReady().then(() => {
    log(`start ${VERSION} from ${ctx.coreDir}`);
    protocol.handle('rpg', handle);
    // the menu entry points at ~/.local/share/physics-rpg/icon.png (written by the installer): keep it equal to the app's own icon,
    // so a new icon arrives with an app update, without reinstalling
    try { const src = path.join(__dirname, 'icon.png'), dst = path.join(P.home, 'icon.png'); if (!fs.existsSync(dst) || !fs.readFileSync(dst).equals(fs.readFileSync(src))) fs.copyFileSync(src, dst); } catch { /* ignore */ }
    conf = readConf();
    if (!server()) { // coming from the earlier GTK app: take its address and login over
      try { const o = JSON.parse(fs.readFileSync(path.join(process.env.XDG_CONFIG_HOME || path.join(require('os').homedir(), '.config'), 'physics-rpg', 'config.json'), 'utf8'));
        if (o.url) { conf = { url: String(o.url).replace(/\/+$/, '') }; setLogin(conf, o.user, o.password); writeConf(conf); log('took the server settings over from the earlier app'); } } catch { /* none */ }
    }
    if (!server()) askSetup(); else { createWindow(); updateAll('start'); }
    setInterval(() => updateAll('timer'), 10 * 60 * 1000);
    setInterval(() => { if (!currentGame() && !updating && server()) updateAll('retry'); }, 30000);
    powerMonitor.on('resume', () => setTimeout(() => updateAll('wake'), 5000));
    const t = process.argv.find((a) => a.startsWith('--test='));
    if (t) setTimeout(async () => { // (tests) print what loaded, then quit
      let rep = {}; try { rep = await win.webContents.executeJavaScript("({game: !!window.__game, courses: window.__game ? window.__game.catalog().length : 0, sync: window.__game ? window.__game.syncState().status : null, xp: window.__game ? window.__game.state().xp : null, webgl: !!document.createElement('canvas').getContext('webgl2'), url: location.href, marker: document.documentElement.dataset.marker || null})"); } catch (e) { rep = { error: e.message }; }
      console.log('REPORT ' + JSON.stringify({ ...rep, game: rep.game, version: VERSION, core: ctx.coreDir, current: readText(path.join(P.game, 'current')), status }));
      quitting = true; app.quit();
    }, Number(t.split('=')[1]) * 1000);
  });
  app.on('window-all-closed', () => app.quit());
};
