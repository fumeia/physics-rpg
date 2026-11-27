import { evaluate } from './expr.js';
import { M } from './math.js';

// "What if?" explorer for any numeric exercise: sliders for the problem's parameters, the live result, a log-log plot of the
// result against one parameter, and the local scaling exponent d ln(result) / d ln(parameter) for every parameter.
const CONSTS = new Set(['G', 'c', 'h', 'hbar', 'kB', 'k_B', 'me', 'mp', 'mn', 'mH', 'Msun', 'Rsun', 'Lsun', 'sigT', 'sigSB', 'sigma_SB', 'pc', 'AU', 'eV', 'u', 'e', 'mu0', 'eps0', 'muB', 'Ry', 'a0', 'pi', 'yr', 'Gyr', 'Mpc', 'kpc', 'NA', 'a_B', 'aB', 'Mch', 'MeV', 'keV']);
const fmt = (v, d = 4) => (!Number.isFinite(v) ? '—' : v !== 0 && (Math.abs(v) < 1e-3 || Math.abs(v) >= 1e5) ? v.toExponential(d - 1) : Number(v.toPrecision(d)).toString());

// TeX to readable plain text, for places that cannot render math (the options of a native dropdown): \omega -> ω, \sqrt{x} -> √(x), M_1 -> M₁
const GREEK = { alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', Delta: 'Δ', epsilon: 'ε', varepsilon: 'ε', eta: 'η', theta: 'θ', kappa: 'κ', lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ',
  pi: 'π', rho: 'ρ', sigma: 'σ', tau: 'τ', phi: 'φ', varphi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω', Omega: 'Ω', Gamma: 'Γ', Lambda: 'Λ', Phi: 'Φ', Psi: 'Ψ', hbar: 'ħ', ell: 'ℓ',
  approx: '≈', cdot: '·', times: '×', pm: '±', mp: '∓', le: '≤', ge: '≥', leq: '≤', geq: '≥', propto: '∝', infty: '∞', to: '→', rightarrow: '→', sim: '~', partial: '∂', nabla: '∇', langle: '⟨', rangle: '⟩' };
const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉', '+': '₊', '-': '₋' }, SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '-': '⁻', '+': '⁺' };
export function texToText(t) {
  const map = (str, tbl) => ([...str].every((ch) => tbl[ch]) ? [...str].map((ch) => tbl[ch]).join('') : null);
  let x = String(t).replace(/<[^>]+>/g, '').replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\^\{([0-9+-]+)\}|\^([0-9]+)/g, (m, a, b) => map(a ?? b, SUP) ?? m).replace(/_\{([0-9+-]+)\}/g, (m, a) => map(a, SUB) ?? m);
  for (let i = 0; i < 4; i++) x = x.replace(/\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '($1)/($2)').replace(/\\[dt]?frac\s*(\w)\s*\{([^{}]*)\}/g, '$1/($2)').replace(/\\[dt]?frac\s*(\w)(\w)/g, '$1/$2')
    .replace(/\\sqrt\s*\{([^{}]*)\}/g, '√($1)').replace(/\\(?:mathrm|text|rm|mathbf|boldsymbol|operatorname)\s*\{([^{}]*)\}/g, '$1');
  x = x.replace(/\\([A-Za-z]+)/g, (m, w) => GREEK[w] ?? (['left', 'right', 'big', 'Big', 'bigg', 'quad', 'qquad', 'displaystyle'].includes(w) ? '' : w))
    .replace(/_\{?([0-9+-])\}?/g, (m, d) => SUB[d] || m).replace(/\^\{?([0-9+-])\}?(?![0-9])/g, (m, d) => SUP[d] || m)
    .replace(/\\[,;!: ]/g, ' ').replace(/[{}$]/g, '').replace(/\(([^()\s]{1,3})\)\/\(([^()\s]{1,3})\)/g, '$1/$2').replace(/\((\w{1,3})\)\//g, '$1/').replace(/\s+/g, ' ').trim();
  return x;
}
/** targets: [{ id, label, unit, vars: {name: number}, f(values) -> number }] */
export function buildTargets(enc) {
  const out = [];
  if (enc.type === 'calc') {
    const num = enc.steps.filter((s) => !s.kind || s.kind === 'numeric');
    num.forEach((s) => out.push({ id: s.id, label: String(s.prompt).replace(/<[^>]+>/g, '').slice(0, 400), unit: s.unit, vars: { ...(enc.vars || {}) },
      f: (values) => { const scope = { ...values }; let last = NaN; for (const st of num) { last = evaluate(st.answer, scope); scope[st.id] = last; if (st.id === s.id) return last; } return last; } }));
  } else if (enc.type === 'boss') {
    for (const fa of enc.finalAnswers || []) out.push({ id: fa.id, label: String(fa.prompt).replace(/<[^>]+>/g, '').slice(0, 400), unit: '', vars: { ...(fa.vars || {}) }, f: (values) => evaluate(fa.answer, values) });
  }
  return out.filter((t) => Object.entries(t.vars).some(([k, v]) => !CONSTS.has(k) && typeof v === 'number' && v > 0));
}

// "What if?" for every numeric exercise. Three parts:
//  - sliders (×0.1 … ×10 of the exercise value) with a plot on FIXED axes: result ÷ exercise result against the factor of the parameter
//    you moved, so the curve tilts with the exponent and the dot really moves (a log-log plot with self-scaling axes showed nothing);
//  - "what matters": one bar per parameter, its exponent, and in words "×2 → ×1.41";
//  - "predict": the ratio questions examiners like ("double M₂: the frequency changes by …?"), generated from the formula itself;
//    answer first, then the slider jumps to that value and you see it.
const COLORS = ['#6cb6ff', '#ffd86b', '#7dffb0', '#ff8a5b', '#ff6b9a', '#c9a7ff', '#9fe8ff'];
const texName = (k) => (k === 'hbar' ? '\\hbar' : k.replace(/_(\w+)/, '_{$1}').replace(/^([A-Za-z]+)(\d+)$/, '$1_{$2}'));
const ratioText = (r) => (!Number.isFinite(r) ? '—' : Math.abs(r - 1) < 0.005 ? 'unchanged (×1)' : `×${fmt(r, 3)}`);

export function mountExplorer(host, targets) {
  if (!targets.length) return;
  let ti = targets.length - 1, plotVar = null, values = {}, quiz = null, yr = [0.1, 10];
  host.innerHTML = M(`<details class="explorer"><summary><b>What if? Explore the formula</b> <span class="src">(predict how the result scales, then try it with the sliders)</span></summary>
    <div class="ex-body"><label class="src">quantity to watch: <select class="ex-target"></select></label>
    <div class="ex-quiz"></div>
    <div class="ex-sliders"></div><div class="ex-read"></div><canvas class="ex-cv" width="560" height="280"></canvas><div class="ex-note src"></div>
    <div class="ex-bars"></div></div></details>`);
  const $ = (s) => host.querySelector(s), sel = $('.ex-target'), sl = $('.ex-sliders'), read = $('.ex-read'), bars = $('.ex-bars'), cv = $('.ex-cv'), note = $('.ex-note'), qz = $('.ex-quiz');
  targets.forEach((t, i) => { const o = document.createElement('option'); o.value = i; { const tx = texToText(t.label); o.textContent = tx.length > 110 ? tx.slice(0, 108) + '…' : tx; o.title = tx; } sel.appendChild(o); });
  sel.value = ti;
  const params = () => Object.entries(targets[ti].vars).filter(([k, v]) => !CONSTS.has(k) && typeof v === 'number' && v > 0).map(([k]) => k);
  const f = (vals) => { try { return targets[ti].f(vals); } catch { return NaN; } };
  const exponent = (k, at) => { const d = 0.05, a = f({ ...at, [k]: at[k] * (1 - d) }), b = f({ ...at, [k]: at[k] * (1 + d) }); return a > 0 && b > 0 ? (Math.log(b) - Math.log(a)) / (Math.log(1 + d) - Math.log(1 - d)) : NaN; };
  const factorOf = (k) => values[k] / targets[ti].vars[k];
  function setSlider(k, factor) { const i = sl.querySelector(`input[data-p="${k}"]`); if (i) i.value = Math.log10(factor); values[k] = targets[ti].vars[k] * factor; plotVar = k; update(); }
  function setup() {
    values = { ...targets[ti].vars }; quiz = null; const ps = params(); if (!ps.includes(plotVar)) plotVar = ps[0];
    { const y0 = f(values); let lo = 0.5, hi = 2; for (const k of ps) for (let i = 0; i <= 20; i++) { const r = f({ ...values, [k]: values[k] * Math.pow(10, -1 + i / 10) }) / y0; if (r > 0 && Number.isFinite(r)) { lo = Math.min(lo, r); hi = Math.max(hi, r); } }
      yr = [Math.max(1e-4, Math.pow(10, Math.floor(Math.log10(lo) * 2) / 2)), Math.min(1e4, Math.pow(10, Math.ceil(Math.log10(hi) * 2) / 2))]; } // fixed for this quantity: the dot moves, the axes do not
    sl.innerHTML = M(ps.map((k, n) => `<div class="labrow"><span><i class="ex-sw" style="background:${COLORS[n % COLORS.length]}"></i>$${texName(k)}$ <span class="src">(×0.1 … ×10)</span> = <b data-val="${k}"></b> <span class="src" data-fac="${k}"></span></span><input type="range" data-p="${k}" min="-1" max="1" step="0.01" value="0"></div>`).join('') + '<button class="link" data-reset>reset to the exercise values</button>');
    sl.querySelectorAll('input').forEach((i) => (i.oninput = () => { values[i.dataset.p] = targets[ti].vars[i.dataset.p] * Math.pow(10, +i.value); plotVar = i.dataset.p; update(); }));
    sl.querySelector('[data-reset]').onclick = () => { sl.querySelectorAll('input').forEach((i) => (i.value = 0)); values = { ...targets[ti].vars }; update(); };
    renderQuiz(); update();
  }
  // ---- predict: pick a parameter the result really depends on and a simple factor; four ratios to choose from
  function newQuiz() {
    sl.querySelectorAll('input').forEach((i) => (i.value = 0)); values = { ...targets[ti].vars }; update(); // every prediction starts from the exercise
    const ps = params().map((k) => [k, exponent(k, values)]).filter(([, p]) => Number.isFinite(p) && Math.abs(p) > 0.04);
    if (!ps.length) { quiz = { none: true }; return; }
    const [k, p] = ps[Math.floor(Math.random() * ps.length)], fac = [2, 2, 3, 0.5, 4, 10][Math.floor(Math.random() * 6)];
    const y = f(values), right = f({ ...values, [k]: values[k] * fac }) / y;
    const cands = [right, Math.pow(fac, -p), Math.pow(fac, 2 * p), Math.pow(fac, p / 2), fac, 1 / fac, 1, Math.pow(fac, -2 * p), Math.pow(fac, 1.5 * p)];
    const opts = []; for (const c of cands) if (Number.isFinite(c) && c > 0 && opts.every((o) => Math.abs(Math.log(o / c)) > 0.04)) opts.push(c);
    const four = opts.slice(0, 4).sort(() => Math.random() - 0.5);
    quiz = { k, fac, right, opts: four, picked: null };
  }
  function renderQuiz() {
    const t = targets[ti];
    if (!quiz) { qz.innerHTML = `<div class="row"><button class="chip btn" data-qnew>Predict a change</button><span class="src">exam-style ratio question from this formula; answer first, then see it on the sliders</span></div>`; qz.querySelector('[data-qnew]').onclick = () => { newQuiz(); renderQuiz(); }; return; }
    if (quiz.none) { qz.innerHTML = '<p class="src">This result does not change in a simple way with the parameters here.</p>'; return; }
    const lbl = texToText(t.label).slice(0, 90), verb = quiz.fac >= 1 ? `multiply $${texName(quiz.k)}$ by ${quiz.fac}` : `halve $${texName(quiz.k)}$`;
    qz.innerHTML = M(`<div class="ex-q"><p><b>Predict:</b> you ${verb} (starting from the exercise values). By what factor does the result change?<br><span class="src">${lbl}</span></p>
      <div class="row wrap">${quiz.opts.map((o, n) => `<button class="opt${quiz.picked !== null ? (Math.abs(o / quiz.right - 1) < 0.01 ? ' right' : n === quiz.picked ? ' wrong' : '') : ''}" data-qo="${n}" ${quiz.picked !== null ? 'disabled' : ''}>×${fmt(o, 3)}</button>`).join('')}</div>
      ${quiz.picked !== null ? `<p class="msg ${quiz.ok ? 'good' : 'bad'}">${quiz.ok ? 'Right.' : `It is ×${fmt(quiz.right, 3)}.`} ${(() => { const pe = Math.log(quiz.right) / Math.log(quiz.fac), pl = exponent(quiz.k, quiz.before), pow = Math.abs(pe - pl) < 0.03; return pow ? `The result goes like $${texName(quiz.k)}^{${fmt(pe, 2)}}$, so $${quiz.fac}^{${fmt(pe, 2)}}\\approx ${fmt(quiz.right, 3)}$.` : `Not a pure power law: the slope is $${fmt(pl, 2)}$ at the start but changes over the step, on average $${fmt(pe, 2)}$ ($${quiz.fac}^{${fmt(pe, 2)}}\\approx ${fmt(quiz.right, 3)}$). Look at the bending curve.`; })()} The slider moved: see the dot.</p><button class="chip btn" data-qnew>Next prediction</button>` : ''}</div>`);
    qz.querySelectorAll('[data-qo]').forEach((b) => (b.onclick = () => {
      const n = +b.dataset.qo; quiz.picked = n; quiz.ok = Math.abs(quiz.opts[n] / quiz.right - 1) < 0.01; quiz.before = { ...values };
      try { const st = JSON.parse(localStorage.getItem('physics-rpg-whatif') || '{"n":0,"ok":0}'); st.n++; if (quiz.ok) st.ok++; localStorage.setItem('physics-rpg-whatif', JSON.stringify(st)); } catch { /* ignore */ }
      const target = Math.min(10, Math.max(0.1, factorOf(quiz.k) * quiz.fac)); setSlider(quiz.k, target); renderQuiz();
    }));
    const nx = qz.querySelector('[data-qnew]'); if (nx) nx.onclick = () => { newQuiz(); renderQuiz(); };
  }
  function update() {
    const t = targets[ti], y0 = f(t.vars), y = f(values), ps = params();
    sl.querySelectorAll('[data-val]').forEach((b) => (b.textContent = fmt(values[b.dataset.val], 3)));
    sl.querySelectorAll('[data-fac]').forEach((b) => { const r = factorOf(b.dataset.fac); b.textContent = Math.abs(r - 1) < 0.005 ? '' : `(×${fmt(r, 2)})`; });
    read.innerHTML = M(`<p>Result: <b>${fmt(y)}</b> ${t.unit || ''} ${Number.isFinite(y) && Number.isFinite(y0) && y0 !== 0 ? `= <b>${ratioText(y / y0)}</b> compared with the exercise` : ''}</p>`);
    // what matters: exponent bars (at the current values) and the effect of doubling each parameter
    const exps = ps.map((k) => [k, exponent(k, values)]), maxp = Math.max(1, ...exps.map(([, p]) => (Number.isFinite(p) ? Math.abs(p) : 0)));
    bars.innerHTML = M(`<div class="src">What matters: result $\\propto$ parameter$^p$ (bar = $p$; right: grows with it, left: falls)</div>` + exps.map(([k, p], n) => {
      const ok = Number.isFinite(p), w = ok ? (50 * Math.abs(p)) / maxp : 0, flat = ok && Math.abs(p) < 0.02;
      return `<div class="ex-bar" data-k="${k}"><span class="ex-bn">$${texName(k)}$</span><span class="ex-track"><i style="${p >= 0 ? `left:50%` : `right:50%`};width:${w}%;background:${COLORS[n % COLORS.length]}"></i></span><span class="ex-bt">${!ok ? 'not a power law here' : flat ? 'no effect' : `p ≈ ${fmt(p, 2)} · ×2 → ${ratioText(Math.pow(2, p))}`}</span></div>`; }).join(''));
    bars.querySelectorAll('[data-k]').forEach((r) => (r.onclick = () => { plotVar = r.dataset.k; update(); }));
    plot(ps, y0);
  }
  // fixed axes: x = factor of a parameter (×0.1 … ×10), y = result ÷ exercise result (×0.01 … ×100), both logarithmic
  function plot(ps, y0) {
    const ctx = cv.getContext('2d'), W = cv.width, H = cv.height, L = 56, R = 12, T = 14, B = 34; ctx.fillStyle = '#0b1220'; ctx.fillRect(0, 0, W, H);
    if (!plotVar || !(y0 > 0)) { ctx.fillStyle = '#9fb0d0'; ctx.font = '12px system-ui'; ctx.fillText('no positive result to plot', 20, 30); return; }
    const X = (fx) => L + ((Math.log10(fx) + 1) / 2) * (W - L - R), ly0 = Math.log10(yr[0]), ly1 = Math.log10(yr[1]), Y = (r) => H - B - ((Math.log10(Math.min(yr[1], Math.max(yr[0], r))) - ly0) / (ly1 - ly0)) * (H - T - B);
    ctx.font = '11px system-ui'; ctx.lineWidth = 1;
    for (const g of [0.1, 0.3, 1, 3, 10]) { ctx.strokeStyle = g === 1 ? '#3a4a6a' : '#1e2a40'; ctx.beginPath(); ctx.moveTo(X(g), T); ctx.lineTo(X(g), H - B); ctx.stroke(); ctx.fillStyle = '#9fb0d0'; ctx.textAlign = 'center'; ctx.fillText(`×${g}`, X(g), H - B + 14); }
    for (const g of [1e-4, 1e-3, 0.01, 0.03, 0.1, 0.3, 0.5, 1, 2, 3, 10, 30, 100, 1e3, 1e4].filter((g) => g >= yr[0] && g <= yr[1] && (ly1 - ly0 < 2.5 || [1e-4, 1e-3, 0.01, 0.1, 1, 10, 100, 1e3, 1e4].includes(g)))) { ctx.strokeStyle = g === 1 ? '#3a4a6a' : '#1e2a40'; ctx.beginPath(); ctx.moveTo(L, Y(g)); ctx.lineTo(W - R, Y(g)); ctx.stroke(); ctx.fillStyle = '#9fb0d0'; ctx.textAlign = 'right'; ctx.fillText(`×${g}`, L - 4, Y(g) + 4); }
    ctx.textAlign = 'center'; ctx.fillText('factor applied to the parameter', (L + W - R) / 2, H - 4);
    ctx.save(); ctx.translate(12, (T + H - B) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('result ÷ exercise result', 0, 0); ctx.restore();
    const fx = Array.from({ length: 81 }, (_, i) => Math.pow(10, -1 + i / 40));
    ps.forEach((k, n) => { // each parameter alone (the others at their current values): its own slope
      const sel = k === plotVar; ctx.strokeStyle = COLORS[n % COLORS.length]; ctx.globalAlpha = sel ? 1 : 0.35; ctx.lineWidth = sel ? 2.6 : 1.4; ctx.beginPath(); let pen = false;
      for (const x of fx) { const r = f({ ...values, [k]: targets[ti].vars[k] * x }) / y0; if (!(r > 0) || !Number.isFinite(r) || r < yr[0] * 0.98 || r > yr[1] * 1.02) { pen = false; continue; } /* off the plot: the curve leaves instead of running along the edge */ pen ? ctx.lineTo(X(x), Y(r)) : ctx.moveTo(X(x), Y(r)); pen = true; }
      ctx.stroke(); });
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#9fb0d0'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(X(1), Y(1), 5, 0, 7); ctx.stroke(); // the exercise itself
    const r = f(values) / y0; if (r > 0) { const px = X(Math.min(10, Math.max(0.1, factorOf(plotVar)))); ctx.fillStyle = '#ffd86b'; ctx.beginPath(); ctx.arc(px, Y(r), 6, 0, 7); ctx.fill(); }
    note.textContent = `Ring: the exercise. Dot: your current setting, on the curve of the parameter you moved last (${plotVar}). Steeper curve = that parameter matters more; falling curve = the result shrinks when it grows.`;
  }
  sel.onchange = () => { ti = +sel.value; plotVar = null; setup(); };
  setup();
}
