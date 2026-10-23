// Every numeric calc fight / boss gets a "What if?" explorer: coverage and consistency with the exercise's own answers.
import { readFileSync } from 'node:fs';
import { buildTargets } from '../src/explorer.js';
import { evaluate } from '../src/expr.js';
const J = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
let total = 0, covered = 0, bad = 0; const uncovered = [];
for (const dir of ['qm', 'solid-state', 'astrophysics']) {
  const idx = J(`../content/${dir}/index.json`);
  for (const slug of idx.rooms) for (const enc of J(`../content/${dir}/${slug}.json`).encounters) {
    if (enc.type !== 'calc' && enc.type !== 'boss') continue;
    const numeric = enc.type === 'boss' ? (enc.finalAnswers || []).length > 0 : enc.steps.some((s) => !s.kind || s.kind === 'numeric');
    if (!numeric) continue; total++;
    const ts = buildTargets(enc);
    if (!ts.length) { uncovered.push(enc.id); continue; } covered++;
    for (const t of ts) {
      const y = t.f(t.vars);
      // consistency: the same value as evaluating the step / final answer directly
      let ref; if (enc.type === 'boss') ref = evaluate(enc.finalAnswers.find((f) => f.id === t.id).answer, enc.finalAnswers.find((f) => f.id === t.id).vars || {});
      else { const scope = { ...(enc.vars || {}) }; for (const s of enc.steps.filter((s) => !s.kind || s.kind === 'numeric')) { scope[s.id] = evaluate(s.answer, scope); if (s.id === t.id) { ref = scope[s.id]; break; } } }
      if (!(Number.isFinite(y) && Math.abs(y - ref) <= 1e-9 * Math.abs(ref || 1))) { bad++; console.log('MISMATCH', enc.id, t.id, y, ref); }
    }
  }
}
console.log(`numeric exercises: ${total}, with explorer: ${covered}, mismatches: ${bad}`);
console.log('without explorer (no positive free parameter):', uncovered.join(', ') || 'none');
process.exit(bad ? 1 : 0);
