// Fights with stakes: every exercise is an encounter with an enemy. A right answer hits it, a first-try answer is a
// critical hit, a wrong answer costs you focus, a hint costs a little focus, and a streak of right answers builds a combo.
// It is a layer on top of the exercise panel: it watches the panel for answers being marked (like feedback.js), so no
// exercise code or content changes, and nothing here decides whether an exercise is passed.
import { store } from './store.js';
import { todayStr } from './missions.js';
import { mistakes, updateMistake } from './mistakes.js';

const MAX_FOCUS = 100, WRONG_COST = 10, HINT_COST_FOCUS = 4, READ_GAIN = 8, WIN_GAIN = 3;
const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const rnd = (seed) => () => { seed = Math.imul(seed ^ (seed >>> 15), 2246822507) >>> 0; seed = Math.imul(seed ^ (seed >>> 13), 3266489909) >>> 0; return ((seed ^= seed >>> 16) >>> 0) / 4294967296; };

// ---- who you are fighting: a name and a creature drawn from the exercise id (always the same for the same exercise)
const KIN = {
  qm: { hue: 205, names: ['Wraith', 'Phantom', 'Superposition', 'Eigen-Shade', 'Tunneller', 'Collapse'], adj: ['Decoherent', 'Entangled', 'Uncertain', 'Degenerate', 'Non-commuting', 'Virtual'] },
  'solid-state': { hue: 150, names: ['Golem', 'Crawler', 'Phonon Swarm', 'Lattice Warden', 'Band Serpent', 'Dislocation'], adj: ['Crystalline', 'Reciprocal', 'Brillouin', 'Anharmonic', 'Umklapp', 'Fermi'] },
  astrophysics: { hue: 28, names: ['Leviathan', 'Dwarf', 'Nebula Beast', 'Pulsar', 'Accretor', 'Void Drifter'], adj: ['Red-shifted', 'Degenerate', 'Opaque', 'Eddington', 'Virial', 'Relativistic'] },
};
const ROLE = { lesson: 'Fog', quiz: 'Quiz', derive: 'Derivation', calc: 'Fight', boss: 'Examiner', 'predict-observe': 'Illusion', lab: 'Experiment', sandbox: 'Sandbox' };
export function enemyOf(enc, course) {
  const k = KIN[course] || KIN.qm, r = rnd(hash(enc.id));
  const elite = !!enc.sheet || enc.type === 'boss', name = enc.type === 'boss' ? 'The Examiner' : enc.sheet ? 'Sheet Warden' : enc.type === 'lesson' ? `${k.adj[Math.floor(r() * k.adj.length)]} Fog` : enc.type === 'quiz' ? 'Misconception Swarm' : `${k.adj[Math.floor(r() * k.adj.length)]} ${k.names[Math.floor(r() * k.names.length)]}`;
  return { name, elite, hue: (k.hue + Math.floor(r() * 40) - 20 + 360) % 360, seed: hash(enc.id), kind: enc.type, role: ROLE[enc.type] || 'Encounter' };
}
export function spriteSvg(e, size = 54) {
  const r = rnd(e.seed), n = 5 + Math.floor(r() * 4), pts = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 - Math.PI / 2, rad = 15 + r() * 9; pts.push(`${(32 + Math.cos(a) * rad).toFixed(1)},${(34 + Math.sin(a) * rad * 0.9).toFixed(1)}`); }
  const eyes = 1 + Math.floor(r() * 3), ex = [[32], [25, 39], [22, 32, 42]][eyes - 1], spikes = e.elite ? `<path d="M18 16 L24 4 L28 16 M36 16 L40 4 L46 16" fill="none" stroke="hsl(${e.hue} 80% 70%)" stroke-width="2.4" stroke-linejoin="round"/>` : '';
  const body = e.kind === 'lesson' ? `<g opacity=".85">${[0, 1, 2].map((i) => `<ellipse cx="${22 + i * 10}" cy="${32 + (i % 2) * 6}" rx="${13 - i}" ry="${9 + i}" fill="hsl(${e.hue} 45% ${42 + i * 8}%)" opacity=".6"/>`).join('')}</g>` : e.kind === 'quiz' ? [0, 1, 2, 3, 4].map((i) => `<circle cx="${14 + r() * 36}" cy="${18 + r() * 30}" r="${4 + r() * 4}" fill="hsl(${e.hue + i * 12} 60% 55%)"/>`).join('') : `<polygon points="${pts.join(' ')}" fill="hsl(${e.hue} 55% 42%)" stroke="hsl(${e.hue} 80% 72%)" stroke-width="2" stroke-linejoin="round"/>`;
  return `<svg class="bt-sprite" viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true">${spikes}${body}${ex.map((x) => `<circle cx="${x}" cy="32" r="3.6" fill="#fff"/><circle cx="${x + 0.8}" cy="32.6" r="1.7" fill="#101522"/>`).join('')}</svg>`;
}

// ---- your focus (resets every day) and today's fight log (grades shown in the run summary)
export function focus() { const f = store.val('focus', null); return f && f.date === todayStr() ? f.v : MAX_FOCUS; }
function setFocus(v) { store.setVal('focus', { date: todayStr(), v: Math.max(0, Math.min(MAX_FOCUS, Math.round(v))) }); }
export function fightsToday() { const f = store.val('fights', null); return f && f.date === todayStr() ? f.list : []; }
export const gradeBook = () => store.val('grades', {}) || {};
function logFight(row) { store.setVal('grades', { ...gradeBook(), [row.id]: { g: row.grade, t: row.t } }); const list = fightsToday().filter((x) => x.id !== row.id); list.push(row); store.setVal('fights', { date: todayStr(), list: list.slice(-60) }); }
// cards played count like hints for the grade (an S needs neither)
export const gradeOf = (wrong, hints, ok) => (!ok ? 'D' : wrong === 0 && hints === 0 ? 'S' : wrong + hints <= 1 ? 'A' : wrong + hints <= 3 ? 'B' : 'C');
export function expectedHits(enc) {
  if (enc.type === 'quiz') return enc.questions?.length || 4;
  if (enc.type === 'calc') return (enc.steps || []).filter((s) => !s.bonus).length || 3;
  if (enc.type === 'derive') return (enc.steps?.length || 2) + 1;
  if (enc.type === 'boss') return (enc.finalAnswers?.length || 3) + 1;
  if (enc.type === 'lesson') return Math.max(1, (enc.checks || enc.questions || enc.check || []).length || 2);
  return 2;
}

let cur = null; // the fight of the open panel
export function begin(enc, panel, { course, onChange, cards = null, M = (x) => x } = {}) {
  end();
  if (!enc || enc.synthetic || enc.type === 'sandbox') return;
  const enemy = enemyOf(enc, course), n = expectedHits(enc);
  const bar = document.createElement('div'); bar.className = `battle${enemy.elite ? ' elite' : ''}`;
  bar.innerHTML = `<div class="bt-foe">${spriteSvg(enemy)}<div class="bt-info"><div class="bt-name"><b>${enemy.name}</b><span>${enemy.elite ? 'elite · ' : ''}${enemy.role}</span></div><div class="bt-hp"><i></i></div></div></div>
    <div class="bt-mid"><span class="bt-combo"></span><span class="bt-pop"></span></div>
    <div class="bt-you"><div class="bt-name"><b>Focus</b>${cards ? '<button class="bt-cards chip btn" type="button" title="Play a formula card you earned (it wears the card, not your focus)"></button>' : ''}<span class="bt-fv"></span></div><div class="bt-fo"><i></i></div></div>`;
  panel.prepend(bar);
  // nemesis: an open mistake you made on this exercise comes back with the enemy and carries what you wrote; three wins retire it
  const nem = mistakes().filter((m) => m.open && m.encId === enc.id).slice(-1)[0];
  if (nem) { bar.classList.add('nemesis'); const d = document.createElement('div'); d.className = 'bt-nem'; d.textContent = `Nemesis (${nem.beaten || 0}/3 beaten): last time you answered \u201c${String(nem.given).slice(0, 60)}\u201d${nem.diag ? ` \u2014 ${String(nem.diag).replace(/<[^>]+>/g, '').slice(0, 110)}` : ''}`; bar.appendChild(d); }
  const st = cur = { enc, bar, enemy, hp: 100, n, hits: 0, wrong: 0, hints: 0, combo: 0, done: false, lastWrongAt: 0, tried: new WeakSet(), onChange };
  const paint = () => { const f = focus(); bar.querySelector('.bt-hp i').style.width = `${st.hp}%`; bar.querySelector('.bt-fo i').style.width = `${f}%`; bar.querySelector('.bt-fv').textContent = `${f} / ${MAX_FOCUS}`; bar.classList.toggle('lowfocus', f <= 25); bar.querySelector('.bt-combo').textContent = st.combo >= 2 ? `combo ×${st.combo}` : ''; };
  const pop = (text, cls) => { const p = bar.querySelector('.bt-pop'); p.textContent = text; p.className = `bt-pop ${cls}`; void p.offsetWidth; p.classList.add('go'); };
  const anim = (cls) => { bar.classList.remove('hit', 'crit', 'hurt'); void bar.offsetWidth; bar.classList.add(cls); };
  st.right = (firstTry) => { if (st.done) return; st.hits++; st.combo++; const dmg = 92 / st.n; st.hp = Math.max(8, st.hp - dmg); pop(firstTry ? `critical hit${st.combo >= 3 ? ` · combo ×${st.combo}` : ''}` : 'hit', firstTry ? 'crit' : 'hit'); anim(firstTry ? 'crit' : 'hit'); paint(); };
  st.bad = () => { if (st.done) return; const now = Date.now(); if (now - st.lastWrongAt < 150) return; st.lastWrongAt = now; st.wrong++; st.combo = 0; setFocus(focus() - WRONG_COST); pop(`−${WRONG_COST} focus`, 'hurt'); anim('hurt'); paint(); st.onChange?.(); };
  st.hint = () => { if (st.done) return; st.hints++; setFocus(focus() - HINT_COST_FOCUS); pop(`hint · −${HINT_COST_FOCUS} focus`, 'hurt'); paint(); };
  st.finish = (ok) => {
    if (st.done) return; st.done = true; const g = gradeOf(st.wrong, st.hints + (st.cardsPlayed || 0), ok);
    if (ok && nem) { const n = (nem.beaten || 0) + 1; updateMistake(nem.id, { beaten: n, open: n < 3 }); }
    if (ok) { st.hp = 0; setFocus(focus() + (enc.type === 'lesson' ? READ_GAIN : WIN_GAIN)); pop(`${enemy.name} defeated \u00b7 grade ${g}${nem ? ` \u00b7 nemesis ${(nem.beaten || 0) + 1}/3` : ''}`, 'win'); bar.classList.add('won'); }
    else { pop('it got away · it comes back as a respawn', 'hurt'); bar.classList.add('lost'); }
    logFight({ id: enc.id, grade: g, wrong: st.wrong, hints: st.hints, ok: !!ok, enemy: enemy.name, t: Date.now() }); paint();
  };
  // watch the panel: answers marked right or wrong, hints taken, reference steps revealed
  const firstTryOf = (el) => { const step = el.closest?.('.step, #qbox, .check, .q') || el.parentElement; if (!step) return true; const first = !st.tried.has(step); st.tried.add(step); return first; };
  const check = (el) => {
    if (!(el instanceof Element) || bar.contains(el) || el.closest?.('#result')) return; const cl = el.classList;
    if ((cl.contains('msg') && cl.contains('good')) || (cl.contains('opt') && cl.contains('right') && !el.disabled)) st.right(firstTryOf(el));
    else if ((cl.contains('msg') && cl.contains('bad')) || (cl.contains('opt') && cl.contains('wrong'))) { firstTryOf(el); st.bad(); }
  };
  st.mo = new MutationObserver((list) => { for (const m of list) { if (m.type === 'attributes') { const was = (m.oldValue || '').split(' '), cl = m.target.classList; if (['right', 'wrong', 'good', 'bad'].some((k) => cl.contains(k) && !was.includes(k))) check(m.target); } else for (const nd of m.addedNodes) check(nd); } });
  st.mo.observe(panel, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true });
  st.click = (ev) => { const b = ev.target.closest?.('button'); if (!b || bar.contains(b)) return; if (b.matches('[data-hint], .hintbtn') || /^(hint|show hint|need a hint)/i.test(b.textContent.trim())) st.hint(); else if (b.matches('[data-rv]')) st.right(false); };
  panel.addEventListener('click', st.click, true);
  st.doneEv = (ev) => { if (ev.detail?.id === enc.id) st.finish(!!ev.detail.ok); };
  window.addEventListener('encounter-done', st.doneEv);
  // formula cards: play one you earned to see its formula during this fight
  if (cards) {
    const btn = bar.querySelector('.bt-cards'), drawer = document.createElement('div'); drawer.className = 'bt-drawer'; drawer.style.display = 'none'; bar.appendChild(drawer);
    const draw = () => { const list = cards.list(); btn.textContent = `Cards ${list.filter((c) => c.charge > 0).length}`; btn.disabled = !list.length;
      drawer.innerHTML = list.length ? list.map((c) => `<div class="bt-card${c.charge ? '' : ' worn'}" data-k="${c.key}"><div class="bt-cl"><b>${c.label}</b><span>${c.roomTitle} \u00b7 ${'\u25cf'.repeat(c.charge)}${'\u25cb'.repeat(3 - c.charge)}</span></div>${c.shown ? `<div class="bt-ctex">${M(`$$${c.tex}$$`)}</div>` : c.charge ? '<button class="chip btn" data-play>Play</button>' : '<button class="chip btn" data-recall>Recall it cold to recharge</button>'}</div>`).join('') : '<p class="src">No cards yet: passing a lesson drops its formulas as cards.</p>';
      drawer.querySelectorAll('[data-play]').forEach((b) => (b.onclick = () => { const k = b.closest('.bt-card').dataset.k; if (cards.play(k)) { st.cardsPlayed = (st.cardsPlayed || 0) + 1; pop('card played', 'hit'); draw(); } }));
      drawer.querySelectorAll('[data-recall]').forEach((b) => (b.onclick = () => { const row = b.closest('.bt-card'), k = row.dataset.k, c = cards.list().find((x) => x.key === k); row.querySelector('[data-recall]').outerHTML = `<div class="bt-ctex"><p class="src">Write it on paper first. Then compare:</p><details><summary>show the formula</summary>${M(`$$${c.tex}$$`)}<div class="row"><button class="chip btn" data-had="1">I had it</button><button class="chip btn" data-had="0">Not quite</button></div></details></div>`; row.querySelectorAll('[data-had]').forEach((x) => (x.onclick = () => { if (x.dataset.had === '1') { cards.recharge(k); pop('card recharged', 'win'); } draw(); })); })); };
    btn.onclick = () => { drawer.style.display = drawer.style.display === 'none' ? '' : 'none'; draw(); }; draw();
  }
  st.panel = panel; paint();
  if (store.isPassed(enc.id) && !store.hasReview(enc.id)) { bar.classList.add('rematch'); bar.querySelector('.bt-name span').textContent += ' · rematch'; }
}
export function end() { if (!cur) return; cur.mo?.disconnect(); cur.panel?.removeEventListener('click', cur.click, true); window.removeEventListener('encounter-done', cur.doneEv); cur = null; }
export const current = () => cur && { hp: cur.hp, hits: cur.hits, wrong: cur.wrong, hints: cur.hints, combo: cur.combo, done: cur.done, enemy: cur.enemy.name };
