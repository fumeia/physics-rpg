// Dark / light theme and the control-mode preference. The choice lives in this browser (localStorage), the page applies it before the
// first paint (inline script in index.html) so there is no flash.
//
// Light mode ("white room"): the DOM uses CSS variables (style.css). The 3D view is rendered dark as always and inverted by a CSS filter on the
// canvas. Plots are 2D canvases in the DOM: every colour they set is remapped here (lightness flipped), so the existing plot code needs no change.
// Canvases that are not in the page (textures for the 3D world) are left alone: the CSS filter already handles them.
const get = (k, d = null) => { try { return localStorage.getItem(k) ?? d; } catch { return d; } };
const set = (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } };

export const themeChoice = () => get('physics-rpg-theme', 'dark'); // dark | light | auto
export const isLight = () => document.documentElement.dataset.theme === 'light';
export function resolveTheme(choice = themeChoice()) { return choice === 'light' || (choice === 'auto' && matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark'; }
export function applyTheme() {
  document.documentElement.dataset.theme = resolveTheme();
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', isLight() ? '#ffffff' : '#070a12');
}
export function setThemeChoice(c) { set('physics-rpg-theme', c); applyTheme(); }

// controls: auto (by input device) | touch | desktop (keyboard and mouse)
export const controlsChoice = () => get('physics-rpg-controls', 'auto');
export const setControlsChoice = (c) => set('physics-rpg-controls', c);
export const landscapePref = () => get('physics-rpg-landscape', '0') === '1';
export const setLandscapePref = (on) => set('physics-rpg-landscape', on ? '1' : '0');

// ---- colour remap for plots in light mode
const cache = new Map();
let scratch = null, fillDesc = null;
function normalise(str) { // any CSS colour -> [r, g, b, a] (0..255, 0..1), read back through a scratch canvas
  scratch = scratch || document.createElement('canvas').getContext('2d');
  fillDesc(scratch, '#000000'); fillDesc(scratch, str);
  const v = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, '__fill').get.call(scratch);
  if (v[0] === '#') return [parseInt(v.slice(1, 3), 16), parseInt(v.slice(3, 5), 16), parseInt(v.slice(5, 7), 16), 1];
  const m = v.match(/[\d.]+/g).map(Number); return [m[0], m[1], m[2], m[3] ?? 1];
}
function lighten(str) {
  if (cache.has(str)) return cache.get(str);
  let out = str;
  try {
    let [r, g, b, a] = normalise(str); r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
    let h = 0, s = 0;
    if (d) { s = d / (1 - Math.abs(2 * l - 1)); h = mx === r ? ((g - b) / d + 6) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; }
    const l2 = l < 0.12 ? 1 : 1 - l, s2 = l < 0.3 ? s * 0.15 : s; // the darkest backgrounds become white, other dark tones light grey, without a blue cast
    const c = (1 - Math.abs(2 * l2 - 1)) * s2, x = c * (1 - Math.abs((h % 2) - 1)), m = l2 - c / 2;
    const [r1, g1, b1] = h < 1 ? [c, x, 0] : h < 2 ? [x, c, 0] : h < 3 ? [0, c, x] : h < 4 ? [0, x, c] : h < 5 ? [x, 0, c] : [c, 0, x];
    out = `rgba(${Math.round((r1 + m) * 255)},${Math.round((g1 + m) * 255)},${Math.round((b1 + m) * 255)},${a})`;
  } catch { /* keep the original */ }
  cache.set(str, out); return out;
}
function installPlotRemap() {
  const proto = CanvasRenderingContext2D.prototype;
  for (const prop of ['fillStyle', 'strokeStyle']) {
    const d = Object.getOwnPropertyDescriptor(proto, prop);
    if (prop === 'fillStyle') { Object.defineProperty(proto, '__fill', d); fillDesc = (ctx, v) => d.set.call(ctx, v); }
    Object.defineProperty(proto, prop, { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, typeof v === 'string' && this.canvas?.isConnected ? lighten(v) : v); } });
  }
}
applyTheme();
if (isLight()) installPlotRemap();
