// Lecture concept questions (content/solid-state/slide-quizzes.json): rooms exist, ids are unique, every question has 2+ options,
// a valid key, an explanation that teaches, a slide citation, existing figures with alt text, and LaTeX that renders.
// Options are shuffled in the game, so no option may refer to another by position. Usage: node test/slide-quiz-check.mjs
import { readFileSync, existsSync } from 'node:fs';
import katex from '../vendor/katex/katex.mjs';
let fails = 0, n = 0; const ok = (name, c, x = '') => { if (!c) { fails++; console.log(`FAIL ${name} ${x}`); } };
const C = (p) => new URL('../content/solid-state/' + p, import.meta.url);
const idx = JSON.parse(readFileSync(C('index.json'))); ok('listed in extras', idx.extras.includes('slide-quizzes.json'));
const ids = new Set(); for (const r of idx.rooms) for (const e of JSON.parse(readFileSync(C(`${r}.json`))).encounters) ids.add(e.id);
const { items } = JSON.parse(readFileSync(C('slide-quizzes.json')));
for (const { room, enc } of items) {
  ok(`${enc.id}: room`, idx.rooms.includes(room), room); ok(`${enc.id}: unique`, !ids.has(enc.id)); ids.add(enc.id);
  ok(`${enc.id}: quiz`, enc.type === 'quiz' && enc.questions.length >= 5 && enc.passMark > 0 && enc.xp > 0 && enc.source?.length);
  enc.questions.forEach((q, i) => {
    n++; const k = `${enc.id}[${i}]`;
    ok(`${k}: options and key`, q.options.length >= 2 && Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.options.length && new Set(q.options).size === q.options.length);
    ok(`${k}: explanation`, (q.explain || '').length > 80, q.explain?.length); ok(`${k}: slide cited`, /slide \d+/.test(q.source?.where || '') && /Week0\d/.test(q.source?.file || ''));
    for (const o of q.options) ok(`${k}: option does not refer to positions`, !/\b(above|below|both 1|1 and 2|answer \d)\b/i.test(o), o);
    for (const m of q.q.matchAll(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"/g)) { ok(`${k}: figure ${m[1]}`, existsSync(new URL('../' + m[1], import.meta.url))); ok(`${k}: alt text`, m[2].length > 30); }
    for (const t of [q.q, q.explain, ...q.options]) {
      ok(`${k}: balanced $`, (t.match(/\$/g) || []).length % 2 === 0, t.slice(0, 50));
      for (const m of t.replace(/<img[^>]*>/g, '').matchAll(/\$([^$]+)\$/g)) { try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }); } catch (err) { ok(`${k}: LaTeX`, false, `${m[1].slice(0, 50)} -> ${err.message.slice(0, 80)}`); } }
    }
  });
}
ok('74 questions', n === 74, n);
console.log(`${n} lecture questions checked`); console.log(fails ? `${fails} FAILED` : 'ALL OK'); process.exit(fails ? 1 : 0);
