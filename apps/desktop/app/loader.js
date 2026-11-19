// Physics RPG desktop: the part that never changes. It starts the app code (app.js), preferring the newest version that the
// app downloaded from your server (~/.local/share/physics-rpg/core/<version>/), and falls back to the installed copy next to this
// file if that one is missing or did not start cleanly last time (a broken update can never lock you out).
const path = require('path'), fs = require('fs'), os = require('os');
const HOME = path.join(process.env.XDG_DATA_HOME || path.join(os.homedir(), '.local', 'share'), 'physics-rpg');
const CORE = path.join(HOME, 'core'), BUILTIN = __dirname;
function pick() {
  try {
    const cur = fs.readFileSync(path.join(CORE, 'current'), 'utf8').trim(), dir = path.join(CORE, cur);
    const bad = fs.existsSync(path.join(dir, '.bad'));
    const starting = path.join(dir, '.starting'); // set before a start, removed by app.js once the window is up
    if (!bad && fs.existsSync(starting)) { fs.writeFileSync(path.join(dir, '.bad'), 'did not start cleanly'); return BUILTIN; }
    if (!bad && fs.existsSync(path.join(dir, 'app.js'))) { fs.writeFileSync(starting, String(Date.now())); return dir; }
  } catch { /* no update yet */ }
  return BUILTIN;
}
let dir = pick();
try { require(path.join(dir, 'app.js')).start({ coreDir: dir, builtinDir: BUILTIN, home: HOME }); }
catch (e) {
  console.error('app code failed, starting the installed copy:', e);
  try { fs.writeFileSync(path.join(dir, '.bad'), String(e && e.stack || e)); } catch { /* ignore */ }
  if (dir !== BUILTIN) require(path.join(BUILTIN, 'app.js')).start({ coreDir: BUILTIN, builtinDir: BUILTIN, home: HOME });
  else throw e;
}
