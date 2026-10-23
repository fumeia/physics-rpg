// Drills hub: spot the error, limiting cases, sketch trainer; interleaved practice over the rooms you have worked in;
// calibration (confidence bets) and the exam radar. Content: content/<course>/drills.json, content/radar.json.
import { M } from './math.js';
import { store } from './store.js';
import { confBar, recordConf, calibHtml } from './confidence.js';
import { logMistake } from './mistakes.js';

const KINDS = [['spot', 'Spot the error'], ['limits', 'Limiting cases'], ['sketch', 'Sketch trainer']];
const shuffled = (n) => { const a = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const plain = (s) => String(s).replace(/<[^>]+>/g, '').replace(/\$/g, '');
const done = () => store.val('drills-done', {}) || {};
const mark = (id, ok) => { const d = done(), e = d[id] || { n: 0, ok: 0 }; const first = !(e.ok > 0); d[id] = { n: e.n + 1, ok: e.ok + (ok ? 1 : 0), last: ok, t: Date.now() }; store.setVal('drills-done', d); if (ok && first) { store.addXp(6); return true; } return false; };
export const drillData = { items: [], radar: null };

export function setDrillData(courseId, d) { for (const kind of ['spot', 'limits', 'sketch']) for (const it of d[kind] || []) drillData.items.push({ ...it, kind, course: courseId }); }

// ------------------------------------------------------------------ cards
export function mountCard(host, it, onDone, { required = true, encId = null } = {}) {
  host.innerHTML = '';
  const body = document.createElement('div'); host.appendChild(body);
  if (it.kind === 'sketch') return mountSketch(body, it, onDone);
  const conf = confBar(host, { required }); host.prepend(conf.bar);
  const meta = (given, expected) => ({ encId: encId || it.encId, step: it.id, prompt: it.prompt || it.title, given, expected });
  const finish = (ok, given, expected) => { recordConf(conf.get(), ok, meta(given, expected)); host.querySelectorAll('button.opt, button.stepbtn').forEach((b) => (b.disabled = true)); conf.bar.querySelectorAll('button').forEach((b) => (b.disabled = true)); onDone({ ok, conf: conf.get() }); };
  if (it.kind === 'spot') {
    body.innerHTML = M(`<h3>${it.title}</h3><p>${it.intro}</p><p class="src">One of these steps contains a mistake. Click it.</p><ol class="spot">${it.steps.map((s, i) => `<li><button class="stepbtn opt" data-i="${i}">${s}</button></li>`).join('')}</ol><div class="msg" id="spot-msg"></div>`);
    body.querySelectorAll('.stepbtn').forEach((b) => (b.onclick = () => {
      if (!conf.need()) return; const i = +b.dataset.i, ok = i === it.error; b.classList.add(ok ? 'right' : 'wrong'); if (!ok) body.querySelector(`[data-i="${it.error}"]`).classList.add('right');
      body.querySelector('#spot-msg').innerHTML = M(`<p class="${ok ? 'good' : 'bad'}">${ok ? 'Found it.' : `Not that one: the mistake is in step ${it.error + 1}.`}</p><p>${it.why}</p><p><b>Correct step:</b> ${it.fix}</p>`);
      finish(ok, plain(it.steps[i]), plain(it.steps[it.error]));
    }));
  } else { // limits / mc
    const order = shuffled(it.options.length);
    body.innerHTML = M(`<h3>${it.title || ''}</h3>${it.formula ? `<p class="limformula">${it.formula}</p>` : ''}<p><b>${it.prompt || it.q}</b></p><div class="opts">${order.map((o) => `<button class="opt" data-o="${o}">${it.options[o]}</button>`).join('')}</div><div class="msg" id="mc-msg"></div>`);
    body.querySelectorAll('.opt').forEach((b) => (b.onclick = () => {
      if (!conf.need()) return; const o = +b.dataset.o, ok = o === it.correct;
      body.querySelectorAll('.opt').forEach((x) => { if (+x.dataset.o === it.correct) x.classList.add('right'); });
      if (!ok) b.classList.add('wrong'); body.querySelector('#mc-msg').innerHTML = M(`<p class="${ok ? 'good' : 'bad'}">${ok ? 'Correct.' : 'Not quite.'}</p><p>${it.explain || ''}</p>`);
      finish(ok, plain(it.options[o]), plain(it.options[it.correct]));
    }));
  }
}
function mountSketch(el, it, onDone) {
  const W = 640, H = 340, L = 56, R = 14, T = 12, B = 38, strokes = [];
  el.innerHTML = M(`<h3>${it.title}</h3><p>${it.task}</p><p class="src">Draw with the mouse or your finger. Nobody checks the pixels: compare with the reference and tick the features your sketch has.</p>
    <canvas class="sketchcv" width="${W}" height="${H}"></canvas><div class="row"><button class="link" id="sk-clear">clear</button><button class="go" id="sk-show">Show the reference</button></div><div id="sk-res"></div>`);
  const cv = el.querySelector('canvas'), ctx = cv.getContext('2d'), fx = (a, v) => (a.log ? Math.log10(v) : v);
  const X = (x) => L + ((fx(it.x, x) - fx(it.x, it.x.min)) / (fx(it.x, it.x.max) - fx(it.x, it.x.min))) * (W - L - R), Y = (y) => H - B - ((fy(y) - fy(it.y.min)) / (fy(it.y.max) - fy(it.y.min))) * (H - T - B), fy = (v) => fx(it.y, v);
  const draw = (withRef) => {
    ctx.fillStyle = '#0b1220'; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = '#3a4a6a'; ctx.strokeRect(L, T, W - L - R, H - T - B);
    ctx.fillStyle = '#9fb0d0'; ctx.font = '12px system-ui'; ctx.textAlign = 'center'; ctx.fillText(it.x.label, (L + W - R) / 2, H - 8); ctx.save(); ctx.translate(14, (T + H - B) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(it.y.label, 0, 0); ctx.restore();
    ctx.textAlign = 'right'; ctx.fillText(String(it.y.max), L - 4, T + 10); ctx.fillText(String(it.y.min), L - 4, H - B); ctx.textAlign = 'left'; ctx.fillText(String(it.x.min), L, H - B + 14); ctx.textAlign = 'right'; ctx.fillText(String(it.x.max), W - R, H - B + 14);
    if (withRef) it.curves.forEach((c, k) => { ctx.strokeStyle = ['#6cd8ff', '#7dffb0', '#ffd86b', '#ff9bd0'][k % 4]; ctx.lineWidth = 2.5; ctx.beginPath(); c.points.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)))); ctx.stroke(); ctx.fillStyle = ctx.strokeStyle; ctx.textAlign = 'left'; ctx.fillText(c.label, L + 8, T + 16 + k * 16); });
    ctx.strokeStyle = '#ff8a5b'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; for (const s of strokes) { ctx.beginPath(); s.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); }
  };
  draw(false); let pen = null, shown = false;
  const pos = (e) => { const r = cv.getBoundingClientRect(); return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * H) / r.height]; };
  cv.onpointerdown = (e) => { if (shown) return; cv.setPointerCapture(e.pointerId); pen = [pos(e)]; strokes.push(pen); draw(false); };
  cv.onpointermove = (e) => { if (!pen) return; pen.push(pos(e)); draw(false); };
  cv.onpointerup = () => { pen = null; };
  el.querySelector('#sk-clear').onclick = () => { if (shown) return; strokes.length = 0; draw(false); };
  el.querySelector('#sk-show').onclick = () => {
    if (shown) return; shown = true; draw(true); el.querySelector('#sk-show').disabled = true;
    el.querySelector('#sk-res').innerHTML = M(`<p class="src">Blue/green/yellow: the reference. Orange: your sketch. Tick every feature your sketch really had:</p><ul class="key" style="list-style:none;padding:0">${it.features.map((f) => `<li><label><input type="checkbox" class="skf"> ${f}</label></li>`).join('')}</ul>${it.tips ? `<p class="src">${it.tips}</p>` : ''}<button class="go" id="sk-done">Done</button><div id="sk-out"></div>`);
    el.querySelector('#sk-done').onclick = () => { const got = [...el.querySelectorAll('.skf')].filter((c) => c.checked).length, n = it.features.length, ok = got >= Math.ceil(0.6 * n); el.querySelector('#sk-done').disabled = true; el.querySelector('#sk-out').innerHTML = M(`<p class="${ok ? 'good' : 'bad'}">${got} of ${n} features.${ok ? '' : ' The ones you missed are what an examiner looks for first.'}</p>`); onDone({ ok, conf: null }); };
  };
}

// ------------------------------------------------------------------ the hub tabs
export function renderDrillTab(tab, host, ctx) {
  if (tab === 'drills') return drillsTab(host, ctx);
  if (tab === 'mix') return mixTab(host, ctx);
  if (tab === 'calib') { host.innerHTML = M(calibHtml()); return; }
  if (tab === 'radar') return radarTab(host, ctx);
}
const roomOf = (ctx, it) => ctx.findRoom(it.course, it.room);
const worked = (ctx, it) => { const r = roomOf(ctx, it); return r && ctx.roomProgress(r).done > 0; };

function drillsTab(host, ctx) {
  const st = (store.val('drills-ui', {}) || {}); let kind = st.kind || 'spot', onlyWorked = st.onlyWorked !== false;
  const items = () => drillData.items.filter((it) => it.kind === kind && (!onlyWorked || worked(ctx, it)));
  const pick = () => { const d = done(), pool = items(); return pool.sort((a, b) => ((d[a.id]?.last ? 2 : d[a.id] ? 0 : 1) - (d[b.id]?.last ? 2 : d[b.id] ? 0 : 1)) || Math.random() - 0.5)[0]; };
  const draw = () => {
    store.setVal('drills-ui', { kind, onlyWorked }); const total = drillData.items.filter((it) => it.kind === kind).length, d = done(), solved = drillData.items.filter((it) => it.kind === kind && d[it.id]?.ok > 0).length;
    host.innerHTML = M(`<p class="src">Short exam-skill drills. Spot the error trains the eye you need to check your own solutions; limiting cases are the typical short exam questions; the sketch trainer is for "sketch the dispersion / DOS / curve" tasks.</p>
      <div class="row">${KINDS.map(([k, l]) => `<button class="chip btn${k === kind ? ' cur' : ''}" data-k="${k}">${l}</button>`).join('')}<label class="labrow"><input type="checkbox" id="dr-w" ${onlyWorked ? 'checked' : ''}> only rooms I have worked in</label></div>
      <p class="src">${solved} of ${total} solved. ${items().length} available${onlyWorked ? ' in your rooms' : ''}.</p><div id="dr-card"></div><div id="dr-next"></div>`);
    host.querySelectorAll('[data-k]').forEach((b) => (b.onclick = () => { kind = b.dataset.k; draw(); }));
    host.querySelector('#dr-w').onchange = (e) => { onlyWorked = e.target.checked; draw(); };
    const it = pick(); const card = host.querySelector('#dr-card');
    if (!it) { card.innerHTML = '<p>Nothing available yet: work through a few exercises in a room first, or untick the filter.</p>'; return; }
    card.insertAdjacentHTML('beforebegin', `<p class="src">${roomOf(ctx, it)?.title || ''} · ${it.source.file.split('/').pop()}, ${it.source.where}</p>`);
    mountCard(card, it, ({ ok }) => { const xp = mark(it.id, ok); ctx.refresh(); host.querySelector('#dr-next').innerHTML = `<div class="row"><button class="go" id="dr-n">Next</button>${xp ? '<span class="src">+6 XP</span>' : ''}</div>`; host.querySelector('#dr-n').onclick = draw; }, { required: it.kind !== 'sketch' });
  };
  draw();
}

function mixTab(host, ctx) {
  const rooms = ctx.catalog.flatMap((c) => c.rooms.map((r) => ({ c, r, p: ctx.roomProgress(r) }))).filter((x) => x.p.done > 0);
  if (!rooms.length) { host.innerHTML = '<p>Interleaved practice mixes questions from rooms you have already worked in. Do a few exercises first and this tab fills with your rooms.</p>'; return; }
  const sel = new Set(rooms.map((x) => `${x.c.id}/${x.r.slug}`)); let size = 15;
  const show = () => {
    host.innerHTML = M(`<p class="src">Mixed topics in random order are harder than one room at a time, and that is why they stick. Choose which of your rooms go into the mix:</p>
      <div class="mixrooms">${rooms.map((x) => `<label class="labrow"><input type="checkbox" data-r="${x.c.id}/${x.r.slug}" ${sel.has(`${x.c.id}/${x.r.slug}`) ? 'checked' : ''}> ${x.r.title} <span class="src">(${x.c.region}, ${x.p.done}/${x.p.total})</span></label>`).join('')}</div>
      <div class="row">length <select id="mx-n">${[10, 15, 25, 40].map((n) => `<option ${n === size ? 'selected' : ''}>${n}</option>`).join('')}</select> questions<button class="go" id="mx-go">Start</button></div><div id="mx-run"></div>`);
    host.querySelectorAll('[data-r]').forEach((c) => (c.onchange = () => { c.checked ? sel.add(c.dataset.r) : sel.delete(c.dataset.r); }));
    host.querySelector('#mx-n').onchange = (e) => { size = +e.target.value; };
    host.querySelector('#mx-go').onclick = () => { const q = buildMix(ctx, sel, size); if (!q.length) { host.querySelector('#mx-run').innerHTML = '<p class="msg bad">No questions in the chosen rooms yet.</p>'; return; } run(q); };
  };
  const run = (qs) => {
    let i = 0, right = 0; const wrong = [];
    const step = () => {
      if (i >= qs.length) { host.innerHTML = M(`<h3>Mix finished</h3><p><b>${right} of ${qs.length}</b> correct (${Math.round((100 * right) / qs.length)} %).</p>${wrong.length ? `<p>Missed (also in your mistakes log where you were sure):</p><ul>${wrong.map((w) => `<li>${w}</li>`).join('')}</ul>` : '<p class="msg good">Clean sheet.</p>'}<div class="row"><button class="go" id="mx-again">Another mix</button></div>`); host.querySelector('#mx-again').onclick = show; ctx.refresh(); return; }
      const it = qs[i]; host.innerHTML = M(`<p class="src">Question ${i + 1} of ${qs.length} · ${roomOf(ctx, it)?.title || ''}</p><div id="mx-card"></div><div id="mx-nx"></div>`);
      mountCard(host.querySelector('#mx-card'), it, ({ ok }) => { if (ok) right++; else wrong.push(plain(it.prompt || it.q || it.title).slice(0, 110)); if (it.id.startsWith('drill-')) mark(it.id, ok); host.querySelector('#mx-nx').innerHTML = `<div class="row"><button class="go" id="mx-n">${i + 1 < qs.length ? 'Next' : 'Finish'}</button></div>`; host.querySelector('#mx-n').onclick = () => { i++; step(); }; }, { required: true, encId: it.encId });
    };
    step();
  };
  show();
}
function buildMix(ctx, sel, size) {
  const pool = [];
  for (const key of sel) {
    const [c, s] = key.split('/'), r = ctx.findRoom(c, s); if (!r) continue;
    for (const e of r.encounters) if (e.type === 'quiz') e.questions.forEach((q, i) => pool.push({ kind: 'mc', id: `${e.id}#${i}`, encId: e.id, course: c, room: s, q: q.q, options: q.options, correct: q.correct, explain: q.explain }));
  }
  for (const it of drillData.items) if ((it.kind === 'limits' || it.kind === 'spot') && sel.has(`${it.course}/${it.room}`)) pool.push({ ...it, encId: null });
  return shuffled(pool.length).slice(0, size).map((i) => pool[i]);
}

function radarTab(host, ctx) {
  const rd = drillData.radar; if (!rd) { host.innerHTML = '<p>No radar data.</p>'; return; }
  let course = null;
  const draw = () => {
    const rows = rd.topics.filter((t) => !course || t.course === course).map((t) => {
      const ps = t.rooms.map((s) => { const r = ctx.findRoom(t.course, s); const p = r ? ctx.roomProgress(r) : { done: 0, total: 1 }; return p.total ? p.done / p.total : 0; }), mastery = ps.reduce((a, b) => a + b, 0) / ps.length, freq = t.count / t.of;
      return { t, mastery, freq, prio: freq * (1 - mastery) };
    }).sort((a, b) => b.prio - a.prio).slice(0, 18);
    host.innerHTML = M(`<p class="src">How often a topic appeared in the old exams (grey) against how much of its rooms you have finished (green). The list is sorted by points you are likely to lose: frequent and not yet done. "Done" counts exercises passed, not how well you know them: take a mock exam for that.</p>
      <div class="row"><button class="chip btn${course ? '' : ' cur'}" data-c="">all courses</button>${ctx.catalog.map((c) => `<button class="chip btn${course === c.id ? ' cur' : ''}" data-c="${c.id}">${c.region}</button>`).join('')}</div>
      <div class="radar">${rows.map((x) => `<button class="radrow" data-go="${x.t.course}/${x.t.rooms[0]}"><span class="rl">${x.t.label}<span class="src"> · ${x.t.count}/${x.t.of} exams</span></span><span class="rb"><i class="rf" style="width:${Math.round(100 * x.freq)}%"></i><i class="rm" style="width:${Math.round(100 * x.mastery * x.freq)}%"></i></span></button>`).join('')}</div>`);
    host.querySelectorAll('[data-c]').forEach((b) => (b.onclick = () => { course = b.dataset.c || null; draw(); }));
    host.querySelectorAll('[data-go]').forEach((b) => (b.onclick = () => ctx.goto(b.dataset.go)));
  };
  draw();
}
