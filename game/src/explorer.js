import { evaluate } from './expr.js';
import { M } from './math.js';

// "What if?" explorer for any numeric exercise: sliders for the problem's parameters, the live result, a log-log plot of the
// result against one parameter, and the local scaling exponent d ln(result) / d ln(parameter) for every parameter.
const CONSTS = new Set(['G', 'c', 'h', 'hbar', 'kB', 'k_B', 'me', 'mp', 'mn', 'mH', 'Msun', 'Rsun', 'Lsun', 'sigT', 'sigSB', 'sigma_SB', 'pc', 'AU', 'eV', 'u', 'e', 'mu0', 'eps0', 'muB', 'Ry', 'a0', 'pi', 'yr', 'Gyr', 'Mpc', 'kpc', 'NA', 'a_B', 'aB', 'Mch', 'MeV', 'keV']);
const fmt = (v, d = 4) => (!Number.isFinite(v) ? '—' : v !== 0 && (Math.abs(v) < 1e-3 || Math.abs(v) >= 1e5) ? v.toExponential(d - 1) : Number(v.toPrecision(d)).toString());

/** targets: [{ id, label, unit, vars: {name: number}, f(values) -> number }] */
export function buildTargets(enc) {
  const out = [];
  if (enc.type === 'calc') {
    const num = enc.steps.filter((s) => !s.kind || s.kind === 'numeric');
    num.forEach((s) => out.push({ id: s.id, label: String(s.prompt).replace(/<[^>]+>/g, '').replace(/\$/g, '').slice(0, 70), unit: s.unit, vars: { ...(enc.vars || {}) },
      f: (values) => { const scope = { ...values }; let last = NaN; for (const st of num) { last = evaluate(st.answer, scope); scope[st.id] = last; if (st.id === s.id) return last; } return last; } }));
  } else if (enc.type === 'boss') {
    for (const fa of enc.finalAnswers || []) out.push({ id: fa.id, label: String(fa.prompt).replace(/<[^>]+>/g, '').replace(/\$/g, '').slice(0, 70), unit: '', vars: { ...(fa.vars || {}) }, f: (values) => evaluate(fa.answer, values) });
  }
  return out.filter((t) => Object.entries(t.vars).some(([k, v]) => !CONSTS.has(k) && typeof v === 'number' && v > 0));
}

export function mountExplorer(host, targets) {
  if (!targets.length) return;
  let ti = targets.length - 1, plotVar = null, values = {};
  host.innerHTML = M(`<details class="explorer"><summary><b>What if? Explore the formula</b> <span class="src">(sliders for every parameter of this exercise)</span></summary>
    <div class="ex-body"><label class="src">quantity to watch: <select class="ex-target"></select></label>
    <div class="ex-sliders"></div><div class="ex-read"></div><canvas class="ex-cv" width="560" height="260"></canvas><div class="ex-note src"></div>
    <table class="lk-map ex-tab"></table></div></details>`);
  const $ = (s) => host.querySelector(s), sel = $('.ex-target'), sl = $('.ex-sliders'), read = $('.ex-read'), tab = $('.ex-tab'), cv = $('.ex-cv'), note = $('.ex-note');
  targets.forEach((t, i) => { const o = document.createElement('option'); o.value = i; o.textContent = `${t.id}: ${t.label}`; sel.appendChild(o); });
  sel.value = ti;
  const params = () => Object.entries(targets[ti].vars).filter(([k, v]) => !CONSTS.has(k) && typeof v === 'number' && v > 0).map(([k]) => k);
  const f = (vals) => { try { return targets[ti].f(vals); } catch { return NaN; } };
  function setup() {
    values = { ...targets[ti].vars }; const ps = params(); if (!ps.includes(plotVar)) plotVar = ps[0];
    sl.innerHTML = ps.map((k) => `<div class="labrow"><span>$${k.replace(/_(\w+)/, '_{$1}')}$ <span class="src">(×0.1 … ×10)</span> = <b data-val="${k}"></b></span><input type="range" data-p="${k}" min="-1" max="1" step="0.01" value="0"></div>`).join('') + '<button class="link" data-reset>reset to the exercise values</button>';
    sl.querySelectorAll('input').forEach((i) => (i.oninput = () => { values[i.dataset.p] = targets[ti].vars[i.dataset.p] * Math.pow(10, +i.value); plotVar = i.dataset.p; update(); }));
    sl.querySelector('[data-reset]').onclick = () => { sl.querySelectorAll('input').forEach((i) => (i.value = 0)); values = { ...targets[ti].vars }; update(); };
    update();
  }
  function update() {
    const t = targets[ti], y0 = f(t.vars), y = f(values), ps = params();
    sl.querySelectorAll('[data-val]').forEach((b) => (b.textContent = fmt(values[b.dataset.val], 3)));
    read.innerHTML = M(`<p>Result: <b>${fmt(y)}</b> ${t.unit || ''} ${Number.isFinite(y) && Number.isFinite(y0) && y0 !== 0 ? `(<b>×${fmt(y / y0, 3)}</b> compared with the exercise)` : ''}</p>`);
    // scaling exponents by symmetric log differences
    const exps = ps.map((k) => { const d = 0.05, a = { ...values, [k]: values[k] * (1 - d) }, b = { ...values, [k]: values[k] * (1 + d) }, fa = f(a), fb = f(b); return [k, fa > 0 && fb > 0 ? (Math.log(fb) - Math.log(fa)) / (Math.log(1 + d) - Math.log(1 - d)) : NaN]; });
    tab.innerHTML = '<tr><th>parameter</th><th>result ∝ parameter<sup>p</sup></th></tr>' + exps.map(([k, p]) => `<tr data-k="${k}" class="${k === plotVar ? 'sel' : ''}"><td>${k}</td><td>${Number.isFinite(p) ? (Math.abs(p) < 0.02 ? 'p ≈ 0: no dependence here' : `p ≈ ${fmt(p, 3)}`) : 'not a power law here'}</td></tr>`).join('');
    tab.querySelectorAll('tr[data-k]').forEach((tr) => (tr.onclick = () => { plotVar = tr.dataset.k; update(); }));
    plot(ps);
  }
  function plot(ps) {
    const ctx = cv.getContext('2d'), W = cv.width, H = cv.height; ctx.fillStyle = '#0b1220'; ctx.fillRect(0, 0, W, H);
    if (!plotVar) return; const base = values[plotVar], xs = Array.from({ length: 80 }, (_, i) => base * Math.pow(10, -1 + (2 * i) / 79)), ys = xs.map((x) => f({ ...values, [plotVar]: x }));
    const good = ys.filter((v) => v > 0 && Number.isFinite(v)); if (good.length < 5) { ctx.fillStyle = '#9fb0d0'; ctx.fillText('no positive result to plot', 20, 30); return; }
    const lx0 = Math.log10(xs[0]), lx1 = Math.log10(xs[79]), ly0 = Math.log10(Math.min(...good)), ly1 = Math.log10(Math.max(...good)), pad = (ly1 - ly0 || 1) * 0.08, L = 52, R = 12, T = 14, B = 30;
    const X = (x) => L + ((Math.log10(x) - lx0) / (lx1 - lx0)) * (W - L - R), Y = (y) => H - B - ((Math.log10(y) - (ly0 - pad)) / (ly1 - ly0 + 2 * pad)) * (H - T - B);
    ctx.strokeStyle = '#1e2a40'; ctx.fillStyle = '#7f8aa6'; ctx.font = '11px system-ui'; ctx.strokeRect(L, T, W - L - R, H - T - B);
    ctx.textAlign = 'center'; ctx.fillText(`${fmt(xs[0], 2)}`, L, H - 12); ctx.fillText(`${plotVar} (log scale)`, (L + W) / 2, H - 6); ctx.fillText(`${fmt(xs[79], 2)}`, W - R, H - 12);
    ctx.textAlign = 'right'; ctx.fillText(fmt(Math.max(...good), 2), L - 4, T + 10); ctx.fillText(fmt(Math.min(...good), 2), L - 4, H - B);
    ctx.strokeStyle = '#6cb6ff'; ctx.lineWidth = 2.4; ctx.beginPath(); let pen = false; xs.forEach((x, i) => { if (!(ys[i] > 0)) { pen = false; return; } const px = X(x), py = Y(ys[i]); pen ? ctx.lineTo(px, py) : ctx.moveTo(px, py); pen = true; }); ctx.stroke();
    const y = f(values); if (y > 0) { ctx.fillStyle = '#ffd86b'; ctx.beginPath(); ctx.arc(X(base), Y(y), 5, 0, 7); ctx.fill(); }
    note.textContent = `Log–log plot of the result against ${plotVar}: a straight line means a power law (slope = the exponent p in the table). Click a parameter row to plot it.`;
  }
  sel.onchange = () => { ti = +sel.value; plotVar = null; setup(); };
  setup();
}
