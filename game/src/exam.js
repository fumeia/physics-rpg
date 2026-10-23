// Exam hall: pure exam training per course. A mock exam (multiple-choice part + old-exam problems) with a timer,
// automatic checking of the numeric answers, self-grading of the written key points, points -> Swiss grade, history.
import { M } from './math.js';
import { evaluate, parseNumber, withinTolerance } from './expr.js';
import { buildPool, todayStr, daysToExam } from './missions.js';
import { finish, fmt } from './encounters.js';
import { diagnose } from './diagnose.js';
import { logMistake } from './mistakes.js';
import { DEFAULT_SCALE, swissGrade, pointsForGrade, gradeWord, buildExam, problemFraction, readiness } from './examgrade.js';

const COURSE_NAMES = { qm: 'Quantum mechanics', 'solid-state': 'Solid state physics', astrophysics: 'Astrophysics' };
const fmtT = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const shuffled = (n) => { const a = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const HINT_XP = 5, HINT_PEN = 0.2; // per hint: XP cost, and share of that answer's credit (start hints: 5 % of the problem)
const g2 = (g) => g.toFixed(2).replace(/0$/, '');

export function mountExamHall(host, { catalog, banks, store, onGoto }) {
  let timer = null; const state = { course: store.val('exam-course', 'qm') || 'qm' };
  const scale = () => ({ ...DEFAULT_SCALE, ...(store.val('exam-scale', {}) || {}) });
  const hist = () => store.val('exam-hist', []) || [];
  const courseOf = (id) => catalog.find((c) => c.id === id);
  const bossesOf = (id) => courseOf(id).rooms.flatMap((r) => r.encounters.filter((e) => e.type === 'boss').map((enc) => ({ enc, room: r })));
  const poolOf = (id) => buildPool(catalog, banks).filter((q) => q.course === id && q.kind === 'exam');
  const stop = () => { clearInterval(timer); timer = null; };

  function lobby() {
    stop(); const c = state.course, sc = scale(), h = hist().filter((x) => x.course === c), rd = readiness(hist(), c, sc), bosses = bossesOf(c);
    const done = bosses.filter((b) => store.isSolved(b.enc.id) && !store.hasReview(b.enc.id)).length, d = daysToExam();
    const tabs = catalog.map((x) => `<button class="chip btn${x.id === c ? ' cur' : ''}" data-c="${x.id}">${COURSE_NAMES[x.id] || x.region}</button>`).join(' ');
    const pts = [...h].sort((a, b) => a.t - b.t).slice(-12), W = 420, H = 110, X = (i) => 28 + (pts.length < 2 ? 0 : (i * (W - 40)) / (pts.length - 1)), Y = (p) => H - 10 - (Math.min(100, p) / 100) * (H - 20);
    const chart = `<svg viewBox="0 0 ${W} ${H}" class="exchart"><line x1="26" x2="${W - 8}" y1="${Y(sc.pass)}" y2="${Y(sc.pass)}" stroke="var(--good)" stroke-dasharray="4 3"/><text x="2" y="${Y(sc.pass) + 4}" fill="var(--good)" font-size="10">4.0</text><line x1="26" x2="${W - 8}" y1="${Y(sc.full)}" y2="${Y(sc.full)}" stroke="gold" stroke-dasharray="4 3"/><text x="2" y="${Y(sc.full) + 4}" fill="gold" font-size="10">6.0</text>${pts.length ? `<polyline fill="none" stroke="var(--accent)" stroke-width="2" points="${pts.map((p, i) => `${X(i)},${Y(p.pct)}`).join(' ')}"/>${pts.map((p, i) => `<circle cx="${X(i)}" cy="${Y(p.pct)}" r="3.5" fill="var(--accent)"><title>${p.date}: ${p.pct.toFixed(0)} % = ${g2(p.grade)}</title></circle>`).join('')}` : `<text x="60" y="${H / 2}" fill="currentColor" font-size="12" opacity=".6">no attempts yet: your results will appear here</text>`}</svg>`;
    const advice = !rd ? 'Take a first mock exam to find out where you stand.' : rd.grade.exact < 4 ? `You need about ${(pointsForGrade(4, 100, sc) - rd.pct).toFixed(0)} more percentage points to pass. Redo the failed problems (they respawn) and practise the topics with the lowest scores.` : rd.grade.exact < 5.5 ? `Passing. ${(sc.full - rd.pct).toFixed(0)} more percentage points to the top grade: speed and complete derivations decide now.` : 'At the top level. Keep the variety up and check every unit.';
    host.innerHTML = M(`<div class="exhead"><div><b>Exam hall: ${COURSE_NAMES[c]}</b><div class="src">Real old-exam problems (with timer and points) plus multiple-choice questions. 4.0 at ${sc.pass} % of the points, 6.0 at ${sc.full} %. ${d ? `${d} days to the exams.` : ''}</div></div></div>
      <div class="row">${tabs}</div>
      <div class="cols"><div><h3>Where you stand</h3><p>${rd ? `<b>Estimated grade: ${g2(rd.grade.rounded)}</b> (${gradeWord(rd.grade.exact)}; mean ${rd.pct.toFixed(0)} % of your last ${Math.min(3, rd.n)} mock exams${rd.trend !== null ? `, trend ${rd.trend >= 0 ? '+' : ''}${rd.trend.toFixed(0)} points` : ''})` : '<b>No mock exam yet.</b>'}</p><p class="src">${advice}</p>${chart}<p class="src">Problems practised in the rooms: ${done} of ${bosses.length}. Multiple-choice pool: ${poolOf(c).length} questions.</p></div>
      <div><h3>Start an exam</h3><div class="row"><label class="labrow">duration <select id="ex-min"><option value="60">60 min</option><option value="90">90 min</option><option value="120" selected>120 min</option><option value="180">180 min</option></select></label></div>
      <div class="exmodes"><button class="maprow" data-mode="full"><span class="mt">Full mock exam</span><span class="md">Multiple-choice part and old-exam problems, like the real thing</span></button>
      <button class="maprow" data-mode="problems"><span class="mt">Problems only</span><span class="md">Several real problems on paper, graded by key points</span></button>
      <button class="maprow" data-mode="mc"><span class="mt">Multiple choice only</span><span class="md">Fast round, 1 point per question</span></button></div>
      <h3>One problem</h3><div class="row"><select id="ex-one">${bosses.map((b) => `<option value="${b.enc.id}">${b.enc.title} (${b.enc.minutes} min)</option>`).join('')}</select><button class="go" id="ex-one-go">Start</button></div>
      <p class="src"><label><input type="checkbox" id="ex-hp" ${store.val('exam-hintpen', true) === false ? '' : 'checked'}> Hints cost points (honest grade). Untick for practice mode: hints then only cost XP.</label></p><p class="src">Point weights: as given by the exam, otherwise 1 point per 2 minutes. Grade scale (percent for 4.0 / 6.0): <input id="sc-p" type="number" value="${sc.pass}" min="30" max="70" style="width:56px"> / <input id="sc-f" type="number" step="0.5" value="${sc.full}" min="70" max="100" style="width:60px"></p></div></div>
      <h3>Recent attempts</h3>${h.length ? `<table class="lk-map"><tr><th>Date</th><th>Type</th><th>Points</th><th>%</th><th>Grade</th></tr>${[...h].reverse().slice(0, 8).map((x) => `<tr><td>${x.date}</td><td>${x.mode}, ${x.minutes} min</td><td>${x.pts.toFixed(1)} / ${x.max}</td><td>${x.pct.toFixed(0)} %</td><td><b>${g2(x.grade)}</b></td></tr>`).join('')}</table>` : '<p class="src">none yet</p>'}`);
    host.querySelectorAll('[data-c]').forEach((b) => (b.onclick = () => { state.course = b.dataset.c; store.setVal('exam-course', state.course); lobby(); }));
    const start = (mode, pick) => run(buildExam({ mode, minutes: +host.querySelector('#ex-min').value, bosses, mcPool: poolOf(c), seen: store.val('exam-seen', []) || [], pick }));
    host.querySelectorAll('[data-mode]').forEach((b) => (b.onclick = () => start(b.dataset.mode)));
    host.querySelector('#ex-one-go').onclick = () => start('single', host.querySelector('#ex-one').value);
    host.querySelector('#ex-hp').onchange = (ev) => store.setVal('exam-hintpen', ev.target.checked);
    const sp = host.querySelector('#sc-p'), sf = host.querySelector('#sc-f');
    const saveScale = () => { const p = +sp.value, f = +sf.value; if (p >= 30 && f > p + 5 && f <= 100) { store.setVal('exam-scale', { pass: p, full: f }); lobby(); } };
    sp.onchange = saveScale; sf.onchange = saveScale;
  }


  // ---- socratic hints: content/<course>/hints*.json -> enc.hints = { start: [..], parts: { <answerId>: [..] } }; each costs XP and a few points
  const hintList = (enc, id) => (id === 'start' ? enc.hints?.start : enc.hints?.parts?.[id]) || [];
  const hintBtn = (enc, id, label) => (hintList(enc, id).length ? `<button class="link hintbtn" data-hint="${enc.id}:${id}">${label} (−${HINT_XP} XP)</button>` : '');
  const hintBox = (enc, id) => `<div class="hintbox" data-hbox="${enc.id}:${id}"></div>`;
  const used = {}; // 'encId:answerId' -> number of hints shown
  function wireHints(exam) {
    host.querySelectorAll('[data-hint]').forEach((b) => (b.onclick = () => {
      const key = b.dataset.hint, [encId, id] = [key.slice(0, key.lastIndexOf(':')), key.slice(key.lastIndexOf(':') + 1)];
      const enc = exam.parts.find((p) => p.enc?.id === encId).enc, list = hintList(enc, id), n = (used[key] || 0);
      if (n >= list.length) return;
      used[key] = n + 1; store.addXp(-HINT_XP);
      host.querySelector(`[data-hbox="${key}"]`).innerHTML = M(list.slice(0, n + 1).map((h, i) => `<div class="hint"><b>Hint ${i + 1}/${list.length}:</b> ${h}</div>`).join(''));
      if (n + 1 >= list.length) { b.disabled = true; b.textContent = 'no more hints'; } else b.textContent = `Next hint (−${HINT_XP} XP)`;
      const t = host.querySelector('.examtop .hused'); if (t) t.textContent = `hints used: ${Object.values(used).reduce((s, x) => s + x, 0)}`;
    }));
  }

  function run(exam) {
    Object.keys(used).forEach((k) => delete used[k]);
    const c = state.course, t0 = Date.now(), limit = exam.minutes * 60;
    host.innerHTML = M(`<div class="examtop"><span class="timer" id="ex-t">${fmtT(limit)}</span><span class="src">${COURSE_NAMES[c]} · ${exam.max} points · ${exam.minutes} min · 4.0 from ${pointsForGrade(4, exam.max, scale()).toFixed(1)} points</span><span class="src hused">hints used: 0</span><button class="go" id="ex-submit">Hand in</button> <button class="link" id="ex-abort">cancel</button></div>
      ${exam.parts.map((p, pi) => p.kind === 'mc' ? `<section class="expart" data-p="${pi}"><h3>Part ${pi + 1}: multiple choice (${p.points} points, 1 each)</h3>${p.questions.map((q, qi) => `<div class="exq" data-q="${qi}"><p><b>${qi + 1}.</b> ${q.q}</p><div class="opts">${shuffled(q.options.length).map((o) => `<button class="opt" data-o="${o}">${q.options[o]}</button>`).join('')}</div></div>`).join('')}</section>`
        : `<section class="expart" data-p="${pi}"><h3>Part ${pi + 1}: ${p.enc.title} (${p.points} points, about ${p.enc.minutes} min)</h3><p class="src">Source: ${p.enc.source.file.split('/').pop()}, ${p.enc.source.where}. Work on paper, then enter the final answers.</p>${p.enc.statement.map((l) => `<p>${l}</p>`).join('')}${hintBtn(p.enc, 'start', 'Where do I start? (hint)')}${p.enc.finalAnswers.map((f) => `<div class="step"><div>${f.prompt}</div><div class="row"><input type="text" data-fa="${p.enc.id}:${f.id}" autocomplete="off"><span class="msg" data-fm="${p.enc.id}:${f.id}"></span>${hintBtn(p.enc, f.id, 'Hint')}</div>${hintBox(p.enc, f.id)}</div>`).join('')}${hintBox(p.enc, 'start')}</section>`).join('')}
      <div class="row"><button class="go" id="ex-submit2">Hand in</button></div><div id="ex-res"></div>`);
    host.querySelectorAll('input').forEach((i) => (i.onkeydown = (e) => e.stopPropagation()));
    host.querySelectorAll('.exq .opt').forEach((b) => (b.onclick = () => { b.parentElement.querySelectorAll('.opt').forEach((x) => x.classList.remove('sel')); b.classList.add('sel'); }));
    const tEl = host.querySelector('#ex-t');
    timer = setInterval(() => { if (!tEl.isConnected) return stop(); const left = limit - (Date.now() - t0) / 1000; tEl.textContent = left > 0 ? fmtT(left) : `-${fmtT(-left)}`; tEl.classList.toggle('low', left < 600); }, 500);
    wireHints(exam);
    host.querySelector('#ex-abort').onclick = lobby;
    const submit = () => { stop(); host.querySelectorAll('#ex-submit,#ex-submit2').forEach((b) => (b.disabled = true)); grade(exam, Math.round((Date.now() - t0) / 1000)); };
    host.querySelector('#ex-submit').onclick = submit; host.querySelector('#ex-submit2').onclick = submit;
  }

  function grade(exam, secs) {
    const res = host.querySelector('#ex-res'), parts = [];
    // multiple choice: automatic
    exam.parts.forEach((p, pi) => {
      const sec = host.querySelector(`[data-p="${pi}"]`);
      if (p.kind === 'mc') {
        let right = 0; const wrong = [];
        p.questions.forEach((q, qi) => {
          const box = sec.querySelector(`[data-q="${qi}"]`), sel = box.querySelector('.opt.sel'), ok = sel && +sel.dataset.o === q.correct; if (ok) right++; else wrong.push(q);
          box.querySelectorAll('.opt').forEach((b) => { b.disabled = true; if (+b.dataset.o === q.correct) b.classList.add('right'); else if (b.classList.contains('sel')) b.classList.add('wrong'); });
          box.insertAdjacentHTML('beforeend', M(`<div class="msg ${ok ? 'good' : 'bad'}">${ok ? 'Correct.' : 'Wrong.'} ${q.explain || ''}</div>`));
        });
        parts.push({ id: `mc${pi}`, title: 'Multiple choice', max: p.points, frac: right / p.points, detail: `${right} / ${p.points} correct`, pending: false });
      } else {
        let right = 0, hintsN = 0; const pen = store.val('exam-hintpen', true) !== false; p.enc.finalAnswers.forEach((f) => {
          const exp = evaluate(f.answer, f.vars || {}), x = parseNumber(sec.querySelector(`[data-fa="${p.enc.id}:${f.id}"]`).value), ok = withinTolerance(x, exp, f), h = used[`${p.enc.id}:${f.id}`] || 0; hintsN += h; if (ok) right += pen ? Math.max(0, 1 - HINT_PEN * h) : 1;
          const m = sec.querySelector(`[data-fm="${p.enc.id}:${f.id}"]`); m.className = 'msg ' + (ok ? 'good' : 'bad'); const dg = ok ? null : diagnose(x, exp);
          if (!ok && !Number.isNaN(x)) logMistake({ encId: p.enc.id, step: f.id, prompt: f.prompt, given: sec.querySelector(`[data-fa="${p.enc.id}:${f.id}"]`).value, expected: fmt(exp), diag: dg });
          if (dg) m.innerHTML = M(`Expected ${fmt(exp)}. <span class="diag">Likely slip: ${dg}</span>`); else m.textContent = ok ? `Correct (${fmt(exp)})` : `Expected ${fmt(exp)}`;
        });
        sec.insertAdjacentHTML('beforeend', M(`<div class="kpbox"><h4>Self-grade the written parts: tick every key point you really had on paper</h4><ul class="key" style="list-style:none;padding:0">${p.enc.keyPoints.map((k) => `<li><label><input type="checkbox" class="kp"> ${k}</label></li>`).join('')}</ul></div>`));
        const sN = used[`${p.enc.id}:start`] || 0; hintsN += sN;
        parts.push({ id: p.enc.id, title: p.enc.title, enc: p.enc, room: p.room, max: p.points, right, n: p.enc.finalAnswers.length, sec, pending: true, hints: hintsN, startPen: pen ? Math.min(0.5, 0.05 * sN) : 0 });
      }
    });
    res.innerHTML = M('<p class="src">Numeric answers and multiple choice are checked. Now tick your key points above, then:</p><button class="go" id="ex-final">Compute my grade</button>');
    res.querySelector('#ex-final').onclick = () => finalize(exam, parts, secs);
  }

  function finalize(exam, parts, secs) {
    const sc = scale(), c = state.course;
    for (const p of parts) if (p.pending) { const boxes = [...p.sec.querySelectorAll('.kp')]; p.kp = boxes.filter((b) => b.checked).length; p.frac = problemFraction(p.right, p.n, p.kp, boxes.length) * (1 - p.startPen); p.detail = `${+p.right.toFixed(1)}/${p.n} numeric answers, ${p.kp}/${boxes.length} key points${p.hints ? `, ${p.hints} hint${p.hints > 1 ? 's' : ''} used` : ''}`; boxes.forEach((b) => (b.disabled = true)); }
    const pts = parts.reduce((s, p) => s + p.frac * p.max, 0), pct = (100 * pts) / exam.max, g = swissGrade(pct, sc), over = secs > exam.minutes * 60;
    for (const p of parts) if (p.enc) finish(p.enc, p.frac >= 0.6, Math.round(p.frac * (p.enc.xp || 60) * 0.5)); // failed problems respawn; XP is half of the boss fight
    const entry = { hints: Object.values(used).reduce((s, x) => s + x, 0), t: Date.now(), date: todayStr(), course: c, mode: exam.mode, minutes: exam.minutes, used: secs, pts, max: exam.max, pct, grade: g.rounded, parts: parts.map((p) => ({ id: p.id, title: p.title, pts: +(p.frac * p.max).toFixed(2), max: p.max })) };
    store.setVal('exam-hist', [...hist(), entry].slice(-200));
    store.setVal('exam-seen', [...new Set([...(store.val('exam-seen', []) || []), ...exam.parts.flatMap((p) => (p.kind === 'mc' ? p.questions.map((q) => q.id) : [p.enc.id]))])].slice(-300));
    const need4 = Math.max(0, pointsForGrade(4, exam.max, sc) - pts), need6 = Math.max(0, pointsForGrade(6, exam.max, sc) - pts);
    const weak = parts.filter((p) => p.frac < 0.6 && p.room);
    const rd = readiness(hist(), c, sc);
    host.querySelector('#ex-res').innerHTML = M(`<div class="examres ${g.exact >= 4 ? 'good' : 'bad'}"><div class="bigg">${g2(g.rounded)}</div><div><b>${pts.toFixed(1)} of ${exam.max} points = ${pct.toFixed(0)} %</b>: ${gradeWord(g.exact)} (exact ${g.exact.toFixed(2)})<div class="src">Time used ${fmtT(secs)} of ${exam.minutes}:00${over ? ' (over time; in the real exam the extra part would not count)' : ''}. ${g.exact >= 4 ? '' : `${need4.toFixed(1)} more points to pass. `}${g.exact >= 6 ? 'Top grade.' : `${need6.toFixed(1)} more points to a 6.0.`}</div>${rd ? `<div class="src">Estimated exam grade (mean of last ${Math.min(3, rd.n)} mocks): <b>${g2(rd.grade.rounded)}</b></div>` : ''}</div></div>
      <table class="lk-map"><tr><th>Part</th><th>Points</th><th>Detail</th></tr>${parts.map((p) => `<tr><td>${p.title}</td><td>${(p.frac * p.max).toFixed(1)} / ${p.max}</td><td>${p.detail}</td></tr>`).join('')}</table>
      ${weak.length ? `<h3>Practise these next (they respawn for review)</h3><div class="maplist">${weak.map((p) => `<button class="maprow" data-goto="${c}/${p.room.slug}"><span class="mt">${p.title}</span><span class="mp">${(p.frac * 100).toFixed(0)} %</span><span class="md">${p.room.title}</span></button>`).join('')}</div>` : '<p class="src">All problems at 60 % or more. Next time try a longer exam or other problems.</p>'}
      <div class="row"><button class="go" id="ex-again">Back to the exam hall</button></div>`);
    host.querySelector('#ex-again').onclick = lobby;
    host.querySelectorAll('[data-goto]').forEach((b) => (b.onclick = () => onGoto(b.dataset.goto)));
    host.querySelector('#ex-res').scrollIntoView({ block: 'start' });
  }
  lobby();
  return stop;
}
