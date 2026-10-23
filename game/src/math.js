import katex from '../vendor/katex/katex.mjs';

// Replace $...$ (inline) and $$...$$ (display) in an HTML string with rendered KaTeX.
const GREEK = { α: 'alpha', β: 'beta', γ: 'gamma', δ: 'delta', ε: 'varepsilon', ζ: 'zeta', η: 'eta', θ: 'theta', κ: 'kappa', λ: 'lambda', μ: 'mu', ν: 'nu', ξ: 'xi', π: 'pi', ρ: 'rho', σ: 'sigma', τ: 'tau', φ: 'varphi', χ: 'chi', ψ: 'psi', ω: 'omega', Γ: 'Gamma', Δ: 'Delta', Θ: 'Theta', Λ: 'Lambda', Ξ: 'Xi', Π: 'Pi', Σ: 'Sigma', Φ: 'Phi', Ψ: 'Psi', Ω: 'Omega', ℏ: 'hbar', '∞': 'infty' };
// Greek letters typed as plain unicode outside $...$ are typeset as math too (headings, titles, labels)
const greekToMath = (s) => s.replace(/[α-ωΑ-Ωℏ∞]+/g, (run) => '$' + [...run].map((c) => (GREEK[c] ? `\\${GREEK[c]}` : c)).join(' ') + '$');
export function M(html) {
  html = String(html).split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/).map((p) => (p.startsWith('$') ? p : p.replace(/(<[^>]*>)|([^<]+)/g, (m, tag, txt) => (tag ? tag : greekToMath(txt))))).join('');
  const r = (m, display) => katex.renderToString(m, { displayMode: display, throwOnError: false, strict: 'ignore' });
  return String(html)
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => r(m, true))
    .replace(/\$([^$\n]+?)\$/g, (_, m) => r(m, false));
}

// Safety net for descriptions typed with Unicode pseudo-math ("a·a* = 2π", "√(2k/M)", "k_i", "ε²"): typeset them.
const SUP = { '²': '2', '³': '3', '⁻': '-', '¹': '1', '⁰': '0', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
const texSub = (s) => s.replace(/([A-Za-z])_([A-Za-z0-9]+)/g, (_, a, b) => `${a}_{${/^[A-Za-z]{2,}$/.test(b) ? '\\mathrm{' + b + '}' : b}}`);
function prettyPlain(t) {
  t = t.replace(/\b([A-Za-z])·([A-Za-z])(\*?)/g, (_, a, b, st) => `$${a}\\cdot ${b}${st ? '^*' : ''}$`);
  t = t.replace(/√\(([^()]*)\)/g, (_, a) => `$\\sqrt{${texSub(a)}}$`)
    .replace(/(^|[^A-Za-z\\$])([A-Za-z])_([A-Za-z0-9]+)/g, (_, pre, a, b) => `${pre}$${a}_{${/^[A-Za-z]{2,}$/.test(b) ? '\\mathrm{' + b + '}' : b}}$`)
    .replace(/([A-Za-z0-9α-ωΑ-Ω])([²³⁻¹⁰⁴⁵⁶⁷⁸⁹]+)/g, (_, a, sup) => `$${a}^{${[...sup].map((c) => SUP[c]).join('')}}$`)
    .replace(/(^|[^A-Za-z\\$])([A-Za-z])\*/g, (_, pre, a) => `${pre}$${a}^*$`)
    .replace(/·/g, () => '$\\cdot$').replace(/→/g, () => '$\\to$').replace(/≈/g, () => '$\\approx$').replace(/∝/g, () => '$\\propto$').replace(/≤/g, () => '$\\le$').replace(/≥/g, () => '$\\ge$').replace(/≠/g, () => '$\\ne$');
  for (let i = 0; i < 6; i++) t = t.replace(/\$([^$\n]*)\$(\s*)\$([^$\n]*)\$/g, (_, a, sp, b) => `$${a} ${b}$`);
  return t;
}
export function prettyText(s) {
  return String(s).split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/).map((p) => (p.startsWith('$') ? p : prettyPlain(p))).join('');
}
