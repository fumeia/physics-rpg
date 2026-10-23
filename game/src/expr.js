// Evaluate quest answer expressions such as "sqrt(2*me*(V-E)*eV)/hbar*1e-9".
// Content files are the user's own data; the scope is passed in as named arguments.
export const CONSTANTS = {
  me: 9.1093837015e-31, // kg
  hbar: 1.054571817e-34, // J s
  eV: 1.602176634e-19, // J
  pi: Math.PI,
  // SI constants for the other courses (a quest's `vars` override these)
  kB: 1.380649e-23, h: 6.62607015e-34, e: 1.602176634e-19, c: 299792458, u: 1.66053906660e-27,
  mn: 1.67492749804e-27, mH: 1.6735575e-27, mp: 1.67262192369e-27, G: 6.6743e-11, Msun: 1.9884e30, Rsun: 6.957e8,
  mu0: 1.25663706212e-6, eps0: 8.8541878128e-12, muB: 9.2740100783e-24, Ry: 13.605693123 * 1.602176634e-19,
  a0: 5.29177210903e-11, pc: 3.0856775814913673e16, AU: 1.495978707e11,
};
const FUNCS = {
  sqrt: Math.sqrt, exp: Math.exp, log: Math.log, log10: Math.log10, sinh: Math.sinh, cosh: Math.cosh,
  sin: Math.sin, cos: Math.cos, tan: Math.tan, abs: Math.abs,
  asin: Math.asin, acos: Math.acos, atan: Math.atan, atan2: Math.atan2,
};
export function evaluate(expr, vars = {}) {
  const scope = { ...CONSTANTS, ...FUNCS, ...vars };
  const names = Object.keys(scope);
  // eslint-disable-next-line no-new-func
  const fn = new Function(...names, `"use strict"; return (${expr});`);
  return fn(...names.map((n) => scope[n]));
}
// Parse what a player types: "5.4e-4", "5,4e-4", "5.4×10^-4", "5.4 x 10^-4".
export function parseNumber(text) {
  const t = String(text).trim().replace(',', '.');
  const m = t.match(/^([-+]?\d*\.?\d+)\s*[×x*·]\s*10\s*\^?\s*\(?([-+]?\d+)\)?$/i);
  if (m) return parseFloat(m[1]) * Math.pow(10, parseInt(m[2], 10));
  return /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(t) ? parseFloat(t) : NaN;
}
// tolType "rel": |x/a - 1| <= tol ; "log": |log10(x/a)| <= tol (for numbers spanning decades).
export function withinTolerance(x, answer, { tolType = 'rel', tol = 0.03 } = {}) {
  if (!Number.isFinite(x) || !Number.isFinite(answer)) return false;
  if (tolType === 'log') return x > 0 && answer > 0 && Math.abs(Math.log10(x / answer)) <= tol;
  return Math.abs(x - answer) <= tol * Math.abs(answer);
}

// ---- symbolic answers -------------------------------------------------------------------
// The player types an expression such as "sqrt(2*m*(V0-E))/hbar". It is accepted when it equals the
// reference expression at several random points (all symbols are independent positive numbers, so
// constants like hbar are symbols here, not SI values). Algebraically equal forms are accepted.
const SAFE = /^[0-9a-zA-Z_+\-*/^().,\s]*$/;
export function normaliseExpr(text) {
  // JS rejects a unary minus directly before **: -x^2 becomes -(x**2)
  return String(text).trim().replace(/\^/g, '**').replace(/(^|[(*\/+\-,])\s*-\s*([A-Za-z0-9_.]+)\s*\*\*\s*([A-Za-z0-9_.]+)/g, '$1-($2**$3)').replace(/×|·/g, '*').replace(/−/g, '-').replace(/√/g, 'sqrt');
}
// spec: { symbols: {name: [min, max]}, constraint?: (v) => bool }
export function checkSymbolic(userText, reference, spec, rng = Math.random) {
  if (!SAFE.test(userText)) return { ok: false, error: 'Only numbers, symbols, + - * / ^ ( ) and functions are allowed.' };
  const names = Object.keys(spec.symbols);
  const user = normaliseExpr(userText);
  if (!user) return { ok: false, error: 'Type an expression.' };
  const used = new Set((user.match(/[A-Za-z_][A-Za-z_0-9]*/g) || []));
  const known = new Set([...names, 'sqrt', 'exp', 'log', 'log10', 'sinh', 'cosh', 'sin', 'cos', 'tan', 'abs', 'pi']);
  for (const u of used) if (!known.has(u)) return { ok: false, error: `Unknown symbol "${u}". Available: ${names.join(', ')}.` };
  let tested = 0, guard = 0;
  while (tested < 6 && guard++ < 200) {
    const v = {};
    for (const n of names) { const [a, b] = spec.symbols[n]; v[n] = a + (b - a) * rng(); }
    if (spec.constraint && !spec.constraint(v)) continue;
    let got, want;
    try { got = evaluate(user, v); want = evaluate(reference, v); } catch { return { ok: false, error: 'Could not read that expression (check brackets, use * for multiplication).' }; }
    if (!Number.isFinite(got)) return { ok: false, error: 'The expression is not a finite number for valid inputs.' };
    if (Math.abs(got - want) > 1e-6 * Math.max(1e-12, Math.abs(want))) return { ok: false, error: 'Not equal to the expected expression.' };
    tested++;
  }
  return { ok: tested >= 6, error: tested >= 6 ? '' : 'Could not sample valid inputs.' };
}
