// Validates the blitz question banks (daily missions) of all three courses.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import katex from '../vendor/katex/katex.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const C = path.join(here, '..', 'content');
const bad = [];
const err = (m) => bad.push(m);

// physical constants (CODATA / IAU)
const c = 2.99792458e8, G = 6.6743e-11, h = 6.62607015e-34, hbar = h / (2 * Math.PI), kB = 1.380649e-23,
  e = 1.602176634e-19, me = 9.1093837e-31, mp = 1.67262192e-27, mn = 1.67492750e-27, sigT = 6.6524587e-29,
  sigSB = 5.670374e-8, Msun = 1.98841e30, AU = 1.495978707e11, Rsun = 6.957e8, muB = 9.2740101e-24, pc = 3.0857e16;
const yr = 3.15576e7, eV = e, alpha = 1 / 137.035999;
const near = (a, b, tol = 0.06) => Math.abs(a - b) <= tol * Math.abs(b);

// explicit recomputation of the estimate questions: id number -> value in the units used in the correct option
const kF = (n) => Math.cbrt(3 * Math.PI ** 2 * n);
const EFcu = hbar ** 2 * kF(8.47e28) ** 2 / (2 * me) / eV;
const EST = {
  astrophysics: {
    27: 4 * Math.PI * AU ** 2 * 1361,
    28: Math.pow(3.83e26 / (4 * Math.PI * (6.96e8) ** 2 * sigSB), 0.25),
    29: 2.898e-3 / 5772 * 1e9,
    30: 0.1 * 0.007 * Msun * c ** 2 / 3.83e26 / yr,
    31: 2 * G * Msun / c ** 2 / 1e3,
    32: Msun / (4 / 3 * Math.PI * 6.37e6 ** 3),
    33: 4 * Math.PI * G * 1e8 * Msun * mp * c / sigT,
    34: 2.998e5 / 70,
    35: Math.sqrt(2 * G * Msun / Rsun) / 1e3,
    36: (220e3) ** 2 * 8e3 * pc / G / Msun,
  },
  'solid-state': {
    27: EFcu,
    28: EFcu * eV / kB,
    29: Math.asin(0.154 / (2 * 0.20)) * 180 / Math.PI,
    30: me / (8.47e28 * e ** 2 * 1.7e-8),
    31: 1 / (8.47e28 * e),
    32: h * c / (1.12 * eV) * 1e6,
    33: Math.exp(-1.12 / (2 * 0.02585)),
    34: 3 * 8.314462,
    35: 4 * Math.PI ** 4 / 5 * (1 / 20) ** 3,
    36: Math.PI ** 2 / 3 * (kB / e) ** 2 * 5.9e7 * 300,
  },
  qm: {
    27: h / Math.sqrt(2 * me * 100 * eV) * 1e9,
    28: 1 / (1.0973731568e7 * (1 / 4 - 1 / 9)) * 1e9,
    29: Math.exp(-2 * Math.sqrt(2 * me * 1 * eV) / hbar * 0.5e-9),
    30: hbar * Math.sqrt(1860 / 1.14e-26) / eV,
    31: hbar ** 2 / (8 * me * 1e-20) / eV,
    32: Math.PI ** 2 * hbar ** 2 / (2 * me * 1e-18) / eV,
    33: 2 * muB * 1 / h / 1e9,
    34: alpha ** 2 * 13.605693 / 16,
    35: hbar / (me * c),
    36: h / Math.sqrt(3 * mn * kB * 300) * 1e9,
  },
};
// extra numeric claims (whatif/exam)
const kap = Math.sqrt(2 * me * 4.5 * eV) / hbar;
const EXTRA = [
  ['STM current factor ~9', near(1 / Math.exp(-2 * kap * 0.1e-9), 9, 0.1)],
  ['2.5 log10 4 = 1.5', near(2.5 * Math.log10(4), 1.5, 0.02)],
  ['2^-2.5 ~ 1/6', near(Math.pow(2, -2.5), 1 / 6, 0.07)],
  ['1.1^4 = 1.46, 1.1^16 = 4.6', near(1.1 ** 4, 1.46, 0.01) && near(1.1 ** 16, 4.6, 0.01)],
  ['2^1.5 = 2.8, 2^(-2/3) = 0.63', near(2 ** 1.5, 2.8, 0.02) && near(2 ** (-2 / 3), 0.63, 0.01)],
  ['10^0.2 = 1.58', near(10 ** 0.2, 1.6, 0.02)],
  ['1-exp(-2)=0.86', near(1 - Math.exp(-2), 0.86, 0.01)],
  ['z=0.5, a=0.67', near(984.5 / 656.3, 1.5, 0.001) && near(1 / 1.5, 0.67, 0.01)],
  ['mag 5 = 100', near(10 ** (0.4 * 5), 100, 0.001)],
  ['Si p = ni^2/ND', near(1e20 / 1e16, 1e4, 0.001)],
  ['Debye theta ~ M^-1/2', near(Math.pow(4, -0.5), 0.5, 0.001)],
  ['Lorenz 2.44e-8', near(Math.PI ** 2 / 3 * (kB / e) ** 2, 2.44e-8, 0.01)],
  ['BCC packing', near(Math.PI * Math.sqrt(3) / 8, 0.68, 0.01)],
  ['2^(2/3)=1.6', near(2 ** (2 / 3), 1.6, 0.01)],
];
for (const [n, ok] of EXTRA) if (!ok) err('extra check failed: ' + n);

function parseNum(s) {
  let m = s.match(/(\d+(?:\.\d+)?)\s*\\times\s*10\^\{?(-?\d+)\}?/);
  if (m) return parseFloat(m[1]) * 10 ** parseInt(m[2]);
  m = s.match(/10\^\{(-?\d+)\}/); if (m) return 10 ** parseInt(m[1]);
  m = s.match(/(\d+(?:\.\d+)?)/); return m ? parseFloat(m[1]) : NaN;
}
function strings(o, out = []) { if (typeof o === 'string') out.push(o); else if (o && typeof o === 'object') for (const v of Object.values(o)) strings(v, out); return out; }

const KINDS = ['concept', 'whatif', 'estimate', 'exam'];
const summary = [];
for (const course of ['astrophysics', 'solid-state', 'qm']) {
  const dir = path.join(C, course);
  const data = JSON.parse(fs.readFileSync(path.join(dir, 'blitz.json'), 'utf8'));
  if (data.course !== course) err(course + ': wrong course field');
  const rooms = new Set(JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8')).rooms);
  const existing = new Set();
  for (const f of fs.readdirSync(dir)) if (f.endsWith('.json') && f !== 'blitz.json' && f !== 'index.json') {
    try { for (const s of strings(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))) existing.add(s.trim()); } catch {}
  }
  const qs = data.questions, ids = new Set(), counts = Object.fromEntries(KINDS.map(k => [k, 0])), pos = [0, 0, 0, 0];
  if (qs.length < 45) err(course + ': fewer than 45 questions (' + qs.length + ')');
  qs.forEach((q, i) => {
    const t = `${course}#${i + 1}`;
    if (q.id !== `blitz-${course}-${String(i + 1).padStart(2, '0')}`) err(t + ': id ' + q.id);
    if (ids.has(q.id)) err(t + ': duplicate id'); ids.add(q.id);
    if (!(q.room === 'general' || rooms.has(q.room))) err(t + ': unknown room ' + q.room);
    if (!KINDS.includes(q.kind)) err(t + ': bad kind'); else counts[q.kind]++;
    for (const f of ['q', 'explain', 'source']) if (typeof q[f] !== 'string' || !q[f].trim()) err(t + ': missing ' + f);
    if (!Array.isArray(q.options) || q.options.length !== 4 || new Set(q.options).size !== 4) err(t + ': options must be 4 distinct strings');
    if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct > 3) err(t + ': correct index'); else pos[q.correct]++;
    if (existing.has(q.q.trim())) err(t + ': duplicates an existing question');
    const nsent = (q.explain.match(/[.!?](\s|$)/g) || []).length; if (nsent < 1 || nsent > 6) err(t + ': explain sentence count ' + nsent);
    for (const s of [q.q, q.explain, ...q.options]) {
      if ((s.match(/\$/g) || []).length % 2) err(t + ': odd number of $ in ' + s.slice(0, 40));
      for (const m of s.matchAll(/\$([^$]+)\$/g)) {
        try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }); } catch (x) { err(t + ': KaTeX ' + x.message.slice(0, 80) + ' in ' + m[1].slice(0, 50)); }
      }
    }
    if (q.kind === 'estimate') {
      const want = EST[course][i + 1];
      if (want === undefined) err(t + ': no formula for estimate');
      else {
        const vals = q.options.map(parseNum);
        if (!near(vals[q.correct], want, 0.06)) err(`${t}: correct option ${vals[q.correct]} != computed ${want}`);
        vals.forEach((v, j) => { if (j !== q.correct && !(Math.max(v, want) / Math.min(v, want) >= 1.8)) err(`${t}: distractor ${v} too close to ${want}`); });
      }
    }
  });
  pos.forEach((n, p) => { if (n / qs.length > 0.4) err(`${course}: position ${p} holds ${n}/${qs.length}`); });
  for (const k of KINDS) if (counts[k] < Math.floor(qs.length * 0.18)) err(`${course}: too few ${k}`);
  for (const k of Object.keys(EST[course])) if (qs[k - 1]?.kind !== 'estimate') err(`${course}: formula ${k} not on an estimate`);
  summary.push(`${course}: ${qs.length} questions ${JSON.stringify(counts)} positions ${pos}`);
}
console.log(summary.join('\n'));
if (bad.length) { console.error(bad.length + ' FAILURES:\n' + bad.join('\n')); process.exit(1); }
console.log('content-check-blitz: OK');
