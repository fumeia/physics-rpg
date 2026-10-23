import * as THREE from 'three';
import katex from '../vendor/katex/katex.mjs';

// Pretty LaTeX in the 3D world. A label is a list of lines; text between $...$ is typeset by KaTeX.
// The HTML is rasterised through an SVG <foreignObject> (fonts embedded as data URIs) onto a canvas texture.
// The texture object is returned immediately and filled in a moment later (it is cached by content).
const cssUrl = new URL('../vendor/katex/katex.min.css', import.meta.url);
let fontCss = null, fontPromise = null;
const BASE_FONTS = ['Main-Regular', 'Main-Italic', 'Main-Bold', 'Math-Italic', 'AMS-Regular', 'Size1-Regular', 'Size2-Regular'];
const OPTIONAL = { mathcal: 'Caligraphic-Regular', mathbb: 'AMS-Regular', mathfrak: 'Fraktur-Regular', mathsf: 'SansSerif-Regular', mathtt: 'Typewriter-Regular', size3: 'Size3-Regular', size4: 'Size4-Regular', mathscr: 'Script-Regular', 'mathbf mathit': 'Main-BoldItalic', boldsymbol: 'Math-BoldItalic' };

async function loadFonts() {
  if (fontCss) return fontCss;
  fontPromise ??= (async () => {
    const css = await (await fetch(cssUrl)).text();
    const faces = {}; // font file name -> {rule}
    for (const m of css.matchAll(/@font-face\{([^}]*)\}/g)) {
      const body = m[1], fam = /font-family:([^;]+)/.exec(body)?.[1].replace(/"/g, ''), style = /font-style:(\w+)/.exec(body)?.[1] || 'normal', weight = /font-weight:(\w+)/.exec(body)?.[1] || 'normal';
      const file = /url\(fonts\/([^)]+)\.woff2\)/.exec(body)?.[1];
      if (file) faces[file.replace('KaTeX_', '')] = { fam, style, weight, file };
    }
    const b64 = async (file) => {
      const buf = new Uint8Array(await (await fetch(new URL(`../vendor/katex/fonts/${file}.woff2`, import.meta.url))).arrayBuffer());
      let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
      return btoa(s);
    };
    const rules = {};
    await Promise.all(Object.entries(faces).map(async ([name, f]) => { rules[name] = `@font-face{font-family:${f.fam};font-style:${f.style};font-weight:${f.weight};src:url(data:font/woff2;base64,${await b64(f.file)}) format("woff2")}`; }));
    // layout CSS of KaTeX without its @font-face rules; font rules are added per label
    fontCss = { layout: css.replace(/@font-face\{[^}]*\}/g, ''), rules };
    return fontCss;
  })();
  return fontPromise;
}

const cache = new Map();
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
function lineHtml(text) {
  // split into math and text segments
  return String(text).split(/(\$[^$]+\$)/).map((seg) => (seg.startsWith('$') && seg.endsWith('$') && seg.length > 2
    ? katex.renderToString(seg.slice(1, -1), { throwOnError: false, strict: 'ignore' }) : esc(seg))).join('');
}

/**
 * lines: [title, ...rest]; an item is a string or {text, color}. Returns a THREE.CanvasTexture.
 * opts: {w, h, bg, fg, accent, border, size (title px), small (body px), align}
 */
export function mathTexture(lines, opts = {}) {
  if (typeof document === 'undefined') return new THREE.Texture(); // Node smoke tests have no DOM
  const o = { w: 512, h: 320, bg: '#0b1a2b', fg: '#9fd8ff', accent: '#ffd86b', border: '#9fd8ff', size: 40, small: 30, align: 'left', ...opts };
  const key = JSON.stringify([lines, o]);
  if (cache.has(key)) return cache.get(key);
  const R = 2, canvas = document.createElement('canvas'); canvas.width = o.w * R; canvas.height = o.h * R;
  const g = canvas.getContext('2d'); g.fillStyle = o.bg; g.fillRect(0, 0, canvas.width, canvas.height);
  g.strokeStyle = o.border; g.lineWidth = 6 * R; g.strokeRect(3 * R, 3 * R, canvas.width - 6 * R, canvas.height - 6 * R);
  const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  cache.set(key, tex);
  const body = lines.map((l, i) => {
    const t = typeof l === 'string' ? l : l.text, color = i === 0 ? o.accent : (typeof l === 'object' && l.color) || o.fg;
    return `<div style="color:${color};font:${i === 0 ? 'bold ' + o.size : o.small}px/1.25 system-ui,'DejaVu Sans',sans-serif;margin:0 0 ${i === 0 ? 8 : 4}px;text-align:${o.align}">${lineHtml(t)}</div>`;
  }).join('');
  tex.userData.ready = loadFonts().then(({ layout, rules }) => {
    const html = `<div xmlns="http://www.w3.org/1999/xhtml" style="width:${o.w}px;height:${o.h}px;box-sizing:border-box;padding:22px 26px;transform:scale(${R});transform-origin:0 0;overflow:hidden">${body}</div>`;
    const needed = new Set(BASE_FONTS);
    for (const [cls, f] of Object.entries(OPTIONAL)) if (body.includes(`class="${cls}`) || body.includes(` ${cls}"`) || body.includes(`${cls} `)) needed.add(f);
    const style = layout + [...needed].map((n) => rules[n]).filter(Boolean).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}"><foreignObject x="0" y="0" width="${canvas.width}" height="${canvas.height}"><style>${style}</style>${html}</foreignObject></svg>`;
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => { g.drawImage(img, 0, 0); tex.needsUpdate = true; resolve(true); };
      img.onerror = () => resolve(false);
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  });
  return tex;
}
