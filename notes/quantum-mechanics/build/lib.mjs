// Helpers for writing QM rooms as JS (String.raw keeps LaTeX readable), built to JSON by build.mjs.
// Conventions: options are created with the correct one FIRST in the source; place() puts it at a deterministic
// pseudo-random position and re-keys the explanations (why / whyWrong maps use the final option indexes).
export const SCRIPT = 'materials/quantum-mechanics/scripts/QM25.Kap1+2+3+4+5+6+7+8+9+10+11.pdf';
export const src = {
  script: (where) => ({ file: SCRIPT, where }),
  ex: (n, where) => ({ file: `materials/quantum-mechanics/exercises/Exercises ${n}.pdf`, where }),
  sol: (n, where) => ({ file: `materials/quantum-mechanics/solutions/Solutions ${n}.pdf`, where }),
  exam: (name, where) => ({ file: `materials/quantum-mechanics/old-exams/${name}.pdf`, where }),
  examSol: (name, where) => ({ file: `materials/quantum-mechanics/solutions/${name}.pdf`, where }),
  notes: (name, where = '') => ({ file: `notes/quantum-mechanics/${name}.md`, where: where || 'transcription and worked solutions' }),
};
let counter = 0;
export function place(correctText, wrongs, salt = '') {
  // wrongs: [[text, why], ...]; returns {options, correct, why}
  const n = wrongs.length + 1;
  counter += 1;
  let h = counter * 7 + salt.length * 3; h = (h * 2654435761) >>> 0;
  const pos = h % n;
  const options = []; const why = {};
  let wi = 0;
  for (let i = 0; i < n; i++) {
    if (i === pos) options.push(correctText);
    else { options.push(wrongs[wi][0]); if (wrongs[wi][1]) why[i] = wrongs[wi][1]; wi++; }
  }
  return { options, correct: pos, why };
}
// calc step: choice
export const choice = (id, prompt, right, wrongs, after) => { const p = place(right, wrongs, id); return { id, kind: 'choice', prompt, options: p.options, correct: p.correct, why: p.why, ...(after ? { after } : {}) }; };
// quiz question / lesson check
export const qz = (q, right, wrongs, explain, source) => { const p = place(right, wrongs, q); return { q, options: p.options, correct: p.correct, explain, ...(source ? { source } : {}) }; };
export const sym = (id, prompt, answer, symbols, unit, units, latex, hint, extra = {}) => ({ id, kind: 'symbolic', prompt, answer, symbols, units, unit, latex, hint, ...extra });
export const order = (id, prompt, items, hint) => ({ id, kind: 'order', prompt, items, hint });
export const num = (id, prompt, answer, unit, units, tol, hint, extra = {}) => ({ id, kind: 'numeric', prompt, answer, unit, units, tol, hint, ...extra });
// blocks
export const T = (html) => ({ kind: 'text', html });
export const EQ = (tex, label) => ({ kind: 'eq', tex, ...(label ? { label } : {}) });
export const I = (html) => ({ kind: 'intuition', html });
export const P = (html) => ({ kind: 'pitfall', html });
export const F = (html) => ({ kind: 'figure', html });
export const X = (html) => ({ kind: 'exam', html });
export const lesson = (o) => ({ type: 'lesson', tier: 'theory', minutes: 12, xp: 20, ...o });
export const quiz = (o) => ({ type: 'quiz', xp: 30, passMark: 0.75, ...o });
export const derive = (o) => ({ type: 'derive', xp: 30, ...o });
export const calc = (o) => ({ type: 'calc', fight: 'normal', xp: 50, ...o });
export const boss = (o) => ({ type: 'boss', xp: 120, ...o });
export const room = (o) => ({ region: 'QM Interference Labs', course: 'quantum-mechanics', exhibit: 'set', ...o });
