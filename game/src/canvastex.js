// Typeset text on a 2D canvas: "$...$" segments are KaTeX, the rest is normal text. Used by the experiment plots (axes, legends), also on the holograms.
// An equation is rasterised once (SVG foreignObject, like mathtex.js) and cached; until it is ready a plain-text stand-in is drawn, and the
// window event "tex-ready" tells the plots to redraw.
import katex from '../vendor/katex/katex.mjs';
import { loadFonts, BASE_FONTS, OPTIONAL } from './mathtex.js';

const cache = new Map(); let pendingEvent = false;
const plain = (s) => String(s).replace(/\\[a-zA-Z]+/g, '').replace(/[{}^_$]/g, '');
const hasDom = typeof document !== 'undefined' && typeof Image !== 'undefined';
const notify = () => { if (pendingEvent) return; pendingEvent = true; setTimeout(() => { pendingEvent = false; window.dispatchEvent(new Event('tex-ready')); }, 30); };

function entry(latex, px, color) {
  const key = `${px}|${color}|${latex}`; let e = cache.get(key); if (e) return e;
  e = { img: null, w: 0, h: 0, base: 0 }; cache.set(key, e);
  const html = katex.renderToString(latex, { throwOnError: false, strict: 'ignore' });
  // measure in the page once its KaTeX fonts are loaded (before that the widths are those of a fallback font)
  loadFonts().then(async (fc) => {
    const probe = document.createElement('div'); probe.style.cssText = `position:absolute;left:-9999px;top:0;visibility:hidden;white-space:nowrap;font:${px}px system-ui;line-height:1.3`;
    probe.innerHTML = `<span>${html}</span><span style="display:inline-block;width:0;height:0;vertical-align:baseline"></span>`; document.body.appendChild(probe);
    try { await document.fonts.ready; } catch { /* ignore */ }
    const kt = probe.querySelector('.katex') || probe.children[0], sp = kt.getBoundingClientRect(), st = probe.children[1].getBoundingClientRect(), pr = probe.getBoundingClientRect();
    let right = sp.right, top = sp.top, bot = sp.bottom; probe.querySelectorAll('.katex *').forEach((n) => { if (n.closest('svg, .hide-tail, .svg-align')) return; const q = n.getBoundingClientRect(); if (q.width) { right = Math.max(right, q.right); top = Math.min(top, q.top); bot = Math.max(bot, q.bottom); } });
    const P = 4; e.pad = P; e.w = Math.ceil(right - sp.left) + 2 * P + 6; e.h = Math.ceil(Math.max(pr.height, bot - pr.top)) + 2 * P; e.base = st.top - pr.top + P; probe.remove();
    const { layout, rules } = fc;
    const needed = new Set(BASE_FONTS); for (const [cls, f] of Object.entries(OPTIONAL)) if (html.includes(cls)) needed.add(f);
    const style = layout + [...needed].map((n) => rules[n]).filter(Boolean).join(''), R = 3;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${e.w * R}" height="${e.h * R}"><foreignObject width="${e.w * R}" height="${e.h * R}"><style>${style}</style><div xmlns="http://www.w3.org/1999/xhtml" style="padding:${e.pad}px;box-sizing:border-box;transform:scale(${R});transform-origin:0 0;color:${color};font:${px}px system-ui;line-height:1.3;white-space:nowrap">${html}</div></foreignObject></svg>`;
    const img = new Image(); img.onload = () => { e.img = img; notify(); }; img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
  return e;
}

const split = (text) => String(text).split(/(\$[^$]+\$)/).filter(Boolean).map((s) => (s.length > 2 && s[0] === '$' && s.at(-1) === '$' ? { m: s.slice(1, -1) } : { t: s }));

/** width in px of the typeset text (stand-in width while an equation loads) */
export function richWidth(ctx, text, px = 12) {
  let w = 0; for (const s of split(text)) { if (s.t !== undefined) w += ctx.measureText(s.t).width; else { const e = hasDom ? entry(s.m, px, ctx.fillStyle) : null; w += (e?.img ? e.w - 2 * e.pad - 5 : ctx.measureText(plain(s.m)).width) + 2; } }
  return w;
}

/** draw text with $..$ typeset. x,y = baseline position, align as in canvas ('left' | 'center' | 'right'); angle in radians rotates about (x,y) */
export function richText(ctx, text, x, y, { px = 12, align = 'left', color = ctx.fillStyle, angle = 0, maxW = 0 } = {}) {
  ctx.save(); if (maxW && hasDom) { ctx.font = `${px}px system-ui`; while (px > 8 && richWidth(ctx, text, px) > maxW) { px -= 0.5; ctx.font = `${px}px system-ui`; } } ctx.font = `${px}px system-ui`; ctx.fillStyle = color; ctx.textAlign = 'left';
  if (!hasDom || !String(text).includes('$')) { ctx.translate(x, y); if (angle) ctx.rotate(angle); ctx.textAlign = align; ctx.fillText(String(text).replace(/\$/g, ''), 0, 0); ctx.restore(); return; }
  const segs = split(text), total = richWidth(ctx, text, px); ctx.translate(x, y); if (angle) ctx.rotate(angle);
  let cx = align === 'center' ? -total / 2 : align === 'right' ? -total : 0;
  for (const s of segs) {
    if (s.t !== undefined) { ctx.fillText(s.t, cx, 0); cx += ctx.measureText(s.t).width; continue; }
    const e = entry(s.m, px, color);
    if (e.img) { ctx.drawImage(e.img, cx - e.pad, -e.base, e.w, e.h); cx += e.w - 2 * e.pad - 3; } else { const t = plain(s.m); ctx.fillText(t, cx, 0); cx += ctx.measureText(t).width + 2; }
  }
  ctx.restore();
}
