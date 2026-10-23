// Shared helpers for the astrophysics content build (node notes/astrophysics/build/build.mjs).
// Room modules write TeX with String.raw (t`...`) so backslashes are written once.
export const t = String.raw;
export const K = { // exam constants table (SI), plus derived units; passed via `vars` because expr.js is engine-owned
  G: 6.6743e-11, kB: 1.380649e-23, h: 6.62607015e-34, c: 2.99792458e8, mp: 1.67262192369e-27,
  Msun: 1.9884e30, Rsun: 6.957e8, pc: 3.085677581e16, sigT: 6.652458e-29, AU: 1.495e11, yr: 3.15576e7,
  Lsun: 3.828e26, me: 9.1093837015e-31, eV: 1.602176634e-19, sigSB: 5.670374419e-8, aB: 7.565733e-16,
};
export const pick = (...n) => Object.fromEntries(n.map((k) => [k, K[k]]));
export const S = (id, prompt, answer, unit, units, tol, hint, extra = {}) => ({ id, prompt, answer, unit, units, tol, hint, ...extra });
export const EXAM = {
  w25: 'Astro_I_2025_Winter_Session_with_Solutions.pdf',
  p25: 'Astro_I_2025_Practice_Exam_with_Solutions.pdf',
  w24: 'Astro_I_2024_Winter_Session_with_Solutions.pdf',
  s24: 'Astro_I_2024_Summer_Session_with_Solutions.pdf',
};
export const LABEL = { w25: 'HS25 winter', p25: 'HS25 practice', w24: 'HS24 winter', s24: 'HS24 summer' };
export const exam = (k, where) => ({ file: `materials/astrophysics/old-exams/${EXAM[k]}`, where: `${LABEL[k]}: ${where}` });
export const choud = (where) => ({ file: 'materials/astrophysics/scripts/Choudhuri_Textbook.pdf', where: `Choudhuri ${where}` });
export const notes = (f) => ({ file: `notes/astrophysics/${f}`, where: 'transcription, formulas and checks' });

// Lesson blocks: text, eq (display TeX), intuition, pitfall, figure (described in words), exam (how it is asked)
export const P = (html) => ({ kind: 'text', html });
export const EQ = (tex, label) => ({ kind: 'eq', tex, ...(label ? { label } : {}) });
export const INT = (html) => ({ kind: 'intuition', html });
export const PIT = (html) => ({ kind: 'pitfall', html });
export const FIG = (html) => ({ kind: 'figure', html });
export const EXQ = (html) => ({ kind: 'exam', html });
// multiple-choice item (used in lesson checks and quizzes); `correct` is an index
export const MC = (q, options, correct, explain, source) => ({ q, options, correct, explain, ...(source ? { source } : {}) });
