import { M } from './math.js';

// Symbol glossary: explains the symbols that appear in a formula ("where tau = optical depth, ...").
// content/glossary.json: { global: {key: meaning}, <course>: {key: meaning | [{when: regex over context, text}, {text}]} }
// A key is a LaTeX symbol such as \tau, T_eff, F_nu. Meanings may contain $...$ math.
let data = null, course = '';

const GREEK = new Set(['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'varepsilon', 'zeta', 'eta', 'theta', 'lambda', 'mu', 'nu', 'xi', 'pi', 'rho', 'sigma', 'tau', 'phi', 'chi', 'psi', 'omega', 'Omega', 'Delta', 'Lambda', 'Phi', 'Psi', 'Theta']);

// Reduce a LaTeX string to a comparable form: subscripts kept (without braces/backslashes), exponents dropped.
export function norm(tex) {
  return String(tex)
    .replace(/\\(mathrm|rm|text|mathbf|boldsymbol|vec|hat|bar|left|right|big|Big|displaystyle|tfrac|dfrac|frac|operatorname|dot)\b/g, ' ')
    .replace(/\\(,|;|!|:|quad|qquad| )/g, ' ')
    .replace(/_\{([^{}]*)\}/g, (m, a) => '_' + a.replace(/\\(?=[A-Za-z])/g, '').replace(/\s+/g, ''))
    .replace(/_\\([A-Za-z]+)/g, '_$1')
    .replace(/_([A-Za-z0-9]+)/g, '_$1')
    .replace(/\^\{[^{}]*\}/g, '^')
    .replace(/([a-zA-Z])_B([A-Za-z])/g, '$1_B $2')
    .replace(/[{}]/g, ' ');
}
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export async function loadGlossary() {
  const raw = await (await fetch(new URL('../content/glossary.json', import.meta.url))).json();
  data = {};
  for (const [sect, d] of Object.entries(raw)) {
    data[sect] = {};
    for (const [k, v] of Object.entries(d)) data[sect][norm(k)] = { display: k, meaning: v };
  }
}
export function setGlossaryCourse(id) { course = id; }

// subscript-friendly LaTeX for display of a key such as tau_KH, F_nu, rho_M,0
function display(key) {
  return key.replace(/_([A-Za-z0-9,\\]+)/g, (m, a) => {
    if (GREEK.has(a)) return `_{\\${a}}`;
    if (/^[A-Za-z]{2,}$/.test(a)) return `_{\\rm ${a}}`;
    return `_{${a}}`;
  }).replace(/(^|[^\\A-Za-z])(nu|lambda|gamma)(?![A-Za-z])/g, '$1\\$2');
}

function resolve(entry, ctx) {
  const m = entry.meaning;
  if (typeof m === 'string') return m;
  for (const r of m) if (!r.when || new RegExp(r.when, 'i').test(ctx)) return r.text;
  return null;
}

/** Symbols found in `tex` with their meaning in this course/context: [[latex, meaning]] */
export function symbolList(tex, ctx = '') {
  if (!data) return [];
  const table = { ...(data.global || {}), ...(data[course] || {}) };
  let work = ' ' + norm(tex) + ' ';
  const found = [];
  for (const key of Object.keys(table).sort((a, b) => b.length - a.length)) {
    if (!key) continue;
    const letterStart = /^[A-Za-z]/.test(key);
    // boundaries: plain symbols must not sit inside words/subscripts; a bare d before a symbol is a differential
    const tail = key.includes('_') ? (/[0-9]$/.test(key) ? '(?![0-9])' : '(?![A-Za-z0-9])') : key === 'd' ? '(?![A-Za-z_\\\\\u0001])' : '(?![A-Za-z_])';
    const re = new RegExp((letterStart ? '(?<![A-Za-z\\\\_])' : '') + esc(key) + tail, 'g');
    let first = Infinity, m;
    while ((m = re.exec(work))) first = Math.min(first, m.index);
    if (first === Infinity) continue;
    work = work.replace(re, '\u0001');
    const meaning = resolve(table[key], ctx);
    if (meaning) found.push([first, table[key].display, meaning]);
  }
  return found.sort((a, b) => a[0] - b[0]).filter(([, d]) => d !== '\\pi').map(([, d, t]) => [display(d), t]);
}

/** One-line "where ..." explanation under a formula (HTML, math to be rendered by M()). */
export function whereHtml(tex, ctx = '') {
  const list = symbolList(tex, ctx);
  if (!list.length) return '';
  return `<div class="where"><b>where</b> ${list.map(([s, t]) => `$${s}$ = ${t}`).join('; ')}</div>`;
}
export const whereRendered = (tex, ctx) => M(whereHtml(tex, ctx));
