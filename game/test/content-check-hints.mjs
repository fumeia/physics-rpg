// Exam-hall hints: every boss has socratic hints (start: 2+, per final answer: exactly 3), valid KaTeX, no leaked final answers.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import katex from '../vendor/katex/katex.mjs';
import { evaluate } from '../src/expr.js';
const courses = ['qm', 'solid-state', 'astrophysics'], only = process.argv[2];
let fails = 0, nBoss = 0, nHints = 0; const bad = (m) => { console.log('FAIL', m); fails++; };
const read = (f) => (existsSync(f) ? JSON.parse(readFileSync(f)) : {});
const rendersOk = (t) => { const parts = t.split('$'); if (parts.length % 2 === 0) return false; try { parts.forEach((p, i) => { if (i % 2) katex.renderToString(p, { throwOnError: true, strict: 'ignore' }); }); return true; } catch { return false; } };
for (const c of courses) {
  if (only && c !== only) continue;
  const hints = { ...read(`content/${c}/hints.json`), ...read(`content/${c}/hints-2.json`) }, ids = new Set();
  for (const f of readdirSync(`content/${c}`)) {
    if (!f.endsWith('.json') || /^(index|codex|blitz|hints)/.test(f)) continue;
    for (const e of read(`content/${c}/${f}`).encounters || []) {
      if (e.type !== 'boss') continue; nBoss++; ids.add(e.id); const h = hints[e.id];
      if (!h) { bad(`${e.id}: no hints`); continue; }
      if (!Array.isArray(h.start) || h.start.length < 2) bad(`${e.id}: start needs 2+ hints`);
      for (const f2 of e.finalAnswers) {
        const list = h.parts?.[f2.id]; if (!Array.isArray(list) || list.length !== 3) { bad(`${e.id}.${f2.id}: needs exactly 3 hints`); continue; }
        let val = NaN; try { val = evaluate(f2.answer, f2.vars || {}); } catch { /* symbolic */ }
        const num = Number.isFinite(val) && Math.abs(val) > 10 ? val.toPrecision(3) : Number.isFinite(val) && !Number.isInteger(val * 100) ? val.toPrecision(3) : null;
        list.forEach((t, i) => { if (num && t.replace(/[,\s]/g, '').includes(num.replace(/\.?0+$/, ''))) bad(`${e.id}.${f2.id} hint ${i + 1} leaks the answer ${num}`); });
      }
      const all = [...(h.start || []), ...Object.values(h.parts || {}).flat()];
      for (const t of all) { nHints++; if (typeof t !== 'string' || t.length < 20 || t.length > 420) bad(`${e.id}: hint length ${t?.length}: ${String(t).slice(0, 40)}`); else if (!rendersOk(t)) bad(`${e.id}: KaTeX/dollar problem in: ${t.slice(0, 70)}`); }
      for (const k of Object.keys(h.parts || {})) if (!e.finalAnswers.some((x) => x.id === k)) bad(`${e.id}: hints for unknown answer ${k}`);
    }
  }
  for (const id of Object.keys(hints)) if (!ids.has(id)) bad(`${c}: hints for unknown boss ${id}`);
}
console.log(fails ? `${fails} FAILED` : `OK: ${nBoss} bosses, ${nHints} hints`); process.exit(fails ? 1 : 0);
