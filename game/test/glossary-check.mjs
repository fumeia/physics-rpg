// Symbol glossary ("where a = ...") picks meanings by context and does not explain vectors with scalar meanings.
// Usage: node test/glossary-check.mjs
import { readFileSync } from 'node:fs';
globalThis.fetch = async (u) => ({ json: async () => JSON.parse(readFileSync(new URL(u))) });
const gl = await import('../src/glossary.js'); await gl.loadGlossary();
let fails = 0; const ok = (n, c) => { if (!c) fails++; console.log(`${c ? 'PASS' : 'FAIL'} ${n}`); };
const has = (tex, ctx, sym, re) => gl.symbolList(tex, ctx).some(([s, t]) => s === sym && (!re || re.test(t)));
gl.setGlossaryCourse('qm');
ok('vector a, b, n get no scalar meaning', !['a', 'b', 'n'].some((s) => has('(\\vec\\sigma\\cdot\\vec a)(\\vec\\sigma\\cdot\\vec b)=\\vec a\\cdot\\vec b,\\ (\\vec n\\cdot\\vec\\sigma)^2=1', 'Spin 1/2: Pauli matrices', s)));
ok('a is the lowering operator in the oscillator', has('a=\\frac1{\\sqrt2}(x+\\partial_x)', 'Ladder operators', 'a', /annihilation/));
ok('a is the half-width in a well', has('k\\tan(k a)=\\kappa', 'Bound states in a well', 'a', /half-width/));
ok('l is the orbital quantum number in hydrogen', has('E_n,\\ l<n', 'Hydrogen: radial equation', 'l', /orbital/));
ok('L in su(2) is angular momentum, not a barrier width', has('[L_3,L^2]=0', 'The su(2) algebra', 'L', /angular/));
ok('m is the magnetic quantum number in su(2)', has('J_3|j,m\\rangle=\\hbar m|j,m\\rangle', 'The su(2) algebra', 'm', /magnetic/));
gl.setGlossaryCourse('solid-state');
ok('subscripted vectors still match (k_i)', has('\\vec k_f-\\vec k_i=\\vec G', 'Diffraction', 'k_{i}'));
ok('Miller indices next to vectors still match', has('\\vec G=h\\vec a^*+k\\vec b^*+l\\vec c^*', 'Lattice', 'h'));
ok('vector B keeps "magnetic field"', has('\\vec v\\times\\vec B', 'Drude', 'B', /field/));
console.log(fails ? `${fails} FAILED` : 'ALL OK'); process.exit(fails ? 1 : 0);
