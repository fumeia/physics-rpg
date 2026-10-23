// Extension point for lab widgets. Every module exports `default (kit) => ({ widgetName: { controls, draw(ctx,p,t), info(p), animated? } })`.
// kit = { axes, curve, lin, logsp, label, fmt, W, H, LM } (the helpers of labs.js; LM = labmodels.js). Add one import line per module.
import qm from './qm.js';
import astro from './astro.js';
import solidState from './solid-state.js';
export const EXT = [
  solidState,
  qm,
  astro,
  // (modules are added here, one line each: import x from './qm.js'; ... EXT.push(x))
];
