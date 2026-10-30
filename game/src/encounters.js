import { TunnelSim } from './sim.js';
import { evaluate, parseNumber, withinTolerance, checkSymbolic } from './expr.js';
import { store } from './store.js';
import { M } from './math.js';
import { whereHtml } from './glossary.js';
import { mountLab } from './labs.js';
import { buildTargets, mountExplorer } from './explorer.js';
import { diagnose } from './diagnose.js';
import { logMistake } from './mistakes.js';
import { confBar, recordConf } from './confidence.js';

export const HINT_COST = 5, FIRST_TRY_BONUS = 3, PREDICT_XP = 10, BONUS_STEP_XP = 5;
export const fmt = (v) => (v !== 0 && (Math.abs(v) < 1e-2 || Math.abs(v) >= 1e4) ? v.toExponential(3) : Number(v.toPrecision(4)).toString());
const eligibleForXp = (enc) => !store.isSolved(enc.id) || store.hasReview(enc.id);

// Record the outcome of an encounter: XP, solved flag and spaced-repetition bookkeeping.
export function finish(enc, ok, xp) {
  const note = (gained, review) => store.logActivity({ id: enc.id, title: String(enc.title || enc.id).slice(0, 120), type: enc.type, ok: !!ok, xp: gained, review: !!review, mission: !!enc.synthetic });
  if (enc.synthetic) { // daily-mission quizzes: XP once, no respawn bookkeeping for ids that are not part of any room
    const gained = ok && xp && !store.isSolved(enc.id) ? xp : 0;
    if (gained) { store.addXp(xp); store.markSolved(enc.id); }
    note(gained, false);
    window.dispatchEvent(new CustomEvent('encounter-done', { detail: { id: enc.id, ok } })); return;
  }
  const wasReview = store.hasReview(enc.id), gained = eligibleForXp(enc) && xp ? xp : 0;
  if (gained) store.addXp(xp);
  if (ok) { if (wasReview) store.reviewPassed(enc.id); store.markSolved(enc.id); }
  else if (wasReview) store.reviewFailed(enc.id);
  else { store.fail(enc.id); store.markSolved(enc.id, { failed: true }); }
  note(gained, wasReview);
  window.dispatchEvent(new CustomEvent('encounter-done', { detail: { id: enc.id, ok } }));
}

/**
 * Mount the UI of one encounter into `el`.
 * env: { onChange(), flash(ok), preview(variant) -> sim, run(variant, onDone(sim)), previewSketch(enc),
 *        previewBanner(enc), next(), hasNext }.  The 3D world and the DOM panel only talk through this.
 */
export function mount(enc, el, env) {
  if (enc.type === 'predict-observe') return mountPredict(enc, el, env);
  if (enc.type === 'calc') return mountCalc(enc, el, env);
  if (enc.type === 'sandbox') return mountSandbox(enc, el, env);
  if (enc.type === 'lab') return mountLab(enc, el, env, { finish, sourceHtml, nextBtn, wireNext });
  if (enc.type === 'lesson') return mountLesson(enc, el, env);
  if (enc.type === 'quiz') return mountQuiz(enc, el, env);
  if (enc.type === 'derive') return mountDerive(enc, el, env);
  return mountBoss(enc, el, env);
}

const nextBtn = (env) => (env.hasNext ? '<button class="go" id="next">Next encounter</button>' : '');
const wireNext = (env) => { const n = document.getElementById('next'); if (n) n.onclick = () => env.next(); };

// Structured derivation: [{title, html}] shown as open <details> blocks.
export function derivationHtml(sections) {
  if (!sections?.length) return '';
  return '<div class="deriv"><h3>Where the equation comes from</h3>' +
    sections.map((s, i) => `<details ${i < 2 ? 'open' : ''}><summary>${s.title}</summary><div class="dbody">${s.html}</div></details>`).join('') + '</div>';
}
export function symbolsHtml(symbols) {
  if (!symbols?.length) return '';
  return '<details class="symbols"><summary>Symbols used here</summary><table>' +
    symbols.map(([s, d]) => `<tr><td class="sym">${s}</td><td>${d}</td></tr>`).join('') + '</table></details>';
}

// ---------------------------------------------------------------- predict -> observe
function mountPredict(enc, el, env) {
  env.preview(enc.variant);
  el.innerHTML = M(`
    <h2>${enc.title}</h2>
    <p>${enc.setup}</p>
    ${symbolsHtml(enc.symbols)}
    <p><b>${enc.question}</b></p>
    <div id="opts">${enc.options.map((o, k) => `<button class="opt" data-k="${k}">${o}</button>`).join('')}</div>
    <button class="go" id="lock" disabled>Lock in prediction</button>
    <button class="go" id="run" style="display:none">Run experiment (watch the bridge)</button>
    <div id="result"></div>`);
  let sel = null, locked = false;
  el.querySelectorAll('.opt').forEach((b) => (b.onclick = () => {
    if (locked) return;
    sel = +b.dataset.k;
    el.querySelectorAll('.opt').forEach((x) => x.classList.toggle('sel', x === b));
    el.querySelector('#lock').disabled = false;
  }));
  el.querySelector('#lock').onclick = () => { locked = true; el.querySelector('#lock').style.display = 'none'; el.querySelector('#run').style.display = ''; };
  el.querySelector('#run').onclick = () => {
    el.querySelector('#run').disabled = true;
    env.run(enc.variant, (sim) => conclude(enc, el, env, sim, sel));
  };
}

function conclude(enc, el, env, sim, sel) {
  const p = sim.probabilities();
  const plane = TunnelSim.transmission(sim.E, sim.V0, sim.L);
  const ok = sel === enc.correct;
  el.querySelectorAll('.opt').forEach((b) => {
    const k = +b.dataset.k;
    if (k === enc.correct) b.classList.add('right'); else if (k === sel) b.classList.add('wrong');
  });
  env.flash(ok);
  const why = enc.whyWrong?.[sel];
  el.querySelector('#result').innerHTML = M(`
    <p class="msg ${ok ? 'good' : 'bad'}">${ok ? `Correct prediction (+${PREDICT_XP} XP).` : 'Wrong prediction: the bridge cracks. This room respawns for review.'}</p>
    ${!ok && why ? `<p class="why"><b>Why that choice fails:</b> ${why}</p>` : ''}
    <p><b>Measured in the simulation:</b> transmitted <b>${(100 * p.T).toFixed(2)} %</b>, reflected ${(100 * p.R).toFixed(2)} %.
    The exact plane-wave formula at the packet's central energy gives ${(100 * plane).toFixed(2)} %; the packet contains a spread of energies, which is why the two differ slightly.</p>
    <p>${enc.explain}</p>
    ${derivationHtml(enc.derivation)}
    <p class="src">Use the bar at the bottom of the screen to watch the run again (pause, speed, loop).</p>
    ${nextBtn(env)}`);
  wireNext(env);
  finish(enc, ok, ok ? PREDICT_XP : 0);
  env.onChange();
}

// ---------------------------------------------------------------- calculation fights
const SYMBOL_HELP = 'Type with * for multiplication, ^ for powers; functions sqrt, exp, sinh, cosh, sin, cos, log.';

function mountCalc(enc, el, env) {
  env.previewSketch(enc);
  const required = enc.steps.filter((s) => !s.bonus);
  const per = Math.round(enc.xp / required.length);
  const scope = { ...(enc.vars || {}) }, answers = {};
  enc.steps.forEach((s) => { if (!s.kind || s.kind === 'numeric') { answers[s.id] = evaluate(s.answer, scope); scope[s.id] = answers[s.id]; } });
  const state = Object.fromEntries(enc.steps.map((s) => [s.id, { solved: false, tries: 0, hints: 0 }]));
  let earned = 0, gaveUp = false, completed = false;
  el.innerHTML = M(`<h2>${enc.title} <span class="src">${enc.fight === 'fermi' ? '(quick fight)' : '(normal fight)'}</span></h2>
    <p>${enc.problem}</p>${symbolsHtml(enc.symbols)}<div id="steps-box"></div><div id="calc-result"></div>
    <button class="link" id="giveup">give up and show solution (no XP, problem respawns)</button>`);
  const q = (s) => el.querySelector(s);
  const box = q('#steps-box');

  enc.steps.forEach((s, n) => {
    const d = document.createElement('div'); d.className = 'step'; d.dataset.step = s.id;
    const head = `<div><b>${n + 1}.</b> ${s.prompt}${s.bonus ? ' <span class="src">(bonus)</span>' : ''}</div>`;
    const foot = `<div class="msg" data-ms="${s.id}"></div><div data-hh="${s.id}"></div><div data-after="${s.id}"></div>`;
    const hintBtn = s.hint ? `<button class="link" data-hn="${s.id}">hint (−${HINT_COST} XP)</button>` : '';
    const unitSel = s.units ? `<select data-un="${s.id}"><option value="">${s.kind === 'symbolic' ? 'dimension of the result?' : 'unit?'}</option>${s.units.map((u) => `<option>${u}</option>`).join('')}</select>` : '';
    const kind = s.kind || 'numeric';
    let body = '';
    if (kind === 'choice') body = `<div class="opts">${s.options.map((o, k) => `<button class="opt" data-ch="${s.id}" data-k="${k}">${o}</button>`).join('')}</div><div class="row">${hintBtn}</div>`;
    else if (kind === 'symbolic') body = `<div class="row"><input type="text" class="wide" placeholder="expression, e.g. sqrt(2*m*(V0-E))/hbar" data-in="${s.id}" autocomplete="off" spellcheck="false">${unitSel}<button class="go" data-ck="${s.id}">Check</button>${hintBtn}</div>
      <div class="src">Symbols: ${Object.keys(s.symbols).join(', ')}. ${SYMBOL_HELP}</div>`;
    else if (kind === 'order') body = `<div class="order"><div class="src">Click the steps in the order you would do them.</div><div data-pool="${s.id}"></div><div class="chain" data-chain="${s.id}"></div></div><div class="row">${hintBtn}</div>`;
    else body = `<div class="row"><input type="text" placeholder="number" data-in="${s.id}" autocomplete="off">${unitSel}<button class="go" data-ck="${s.id}">Check</button>${hintBtn}</div>`;
    d.innerHTML = M(head + body + foot);
    box.appendChild(d);
    const get = (k) => d.querySelector(`[data-${k}="${s.id}"]`);
    const ms = get('ms');
    const bad = (t, tex) => { ms.className = 'msg bad'; if (tex) ms.innerHTML = M(`${t} <span class="diag">Likely slip: ${tex}</span>`); else ms.textContent = t; };
    const solved = (extra = '') => {
      const st = state[s.id]; if (st.solved) return;
      st.solved = true;
      const first = st.tries === 0;
      const gain = Math.max(1, (s.bonus ? BONUS_STEP_XP : per) + (first ? FIRST_TRY_BONUS : 0) - st.hints * HINT_COST);
      earned += gain;
      ms.className = 'msg good'; ms.innerHTML = M(`${extra}${first ? ` Clean answer bonus +${FIRST_TRY_BONUS}.` : ''} +${gain} XP`);
      if (s.after) get('after').innerHTML = M(`<div class="after">${s.after}</div>`);
      d.querySelectorAll('button.go, button.opt, input, select').forEach((x) => { x.disabled = true; });
      if (!completed && required.every((r) => state[r.id].solved)) complete();
    };
    const hn = get('hn');
    if (hn && s.hint) hn.onclick = () => {
      if (!state[s.id].hints) { store.addXp(-HINT_COST); env.onChange(); }
      state[s.id].hints++;
      get('hh').innerHTML = M(`<div class="hint">${s.hint}</div>`);
    };
    if (kind === 'choice') {
      d.querySelectorAll('.opt').forEach((b) => (b.onclick = () => {
        const st = state[s.id]; if (st.solved || gaveUp) return;
        const k = +b.dataset.k;
        if (k === s.correct) { b.classList.add('right'); solved('Correct.'); }
        else { st.tries++; b.classList.add('wrong'); b.disabled = true; bad(s.why?.[k] ? `Not this one: ${s.why[k]}` : 'Not this one. Think about what each term means.'); ms.innerHTML = M(ms.textContent); }
      }));
    } else if (kind === 'symbolic') {
      const spec = { symbols: s.symbols, constraint: s.constraint ? new Function('v', `return (${s.constraint});`) : null };
      const input = get('in'); input.onkeydown = (e) => { e.stopPropagation(); if (e.key === 'Enter') get('ck').click(); };
      get('ck').onclick = () => {
        const st = state[s.id]; if (st.solved || gaveUp) return;
        const r = checkSymbolic(input.value, s.answer, spec);
        const unit = get('un')?.value;
        if (!r.ok) { st.tries++; bad(r.error); return; }
        if (s.units && !unit) { bad('Your expression is right. Now pick its dimension (that is the unit check).'); return; }
        if (s.units && unit !== s.unit) { st.tries++; bad('The expression matches, but the dimension you chose is wrong. What are the units of what you wrote?'); return; }
        solved(`Correct: $${s.latex}$.`);
      };
    } else if (kind === 'order') {
      const pool = get('pool'), chain = get('chain');
      const idx = s.items.map((_, i) => i);
      for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
      let nextIdx = 0;
      idx.forEach((orig) => {
        const b = document.createElement('button'); b.className = 'opt'; b.dataset.orig = orig; b.innerHTML = M(s.items[orig].text);
        b.onclick = () => {
          const st = state[s.id]; if (st.solved || gaveUp) return;
          if (orig === nextIdx) {
            b.disabled = true; b.classList.add('right');
            const li = document.createElement('div'); li.className = 'link-item'; li.innerHTML = M(`<b>${nextIdx + 1}.</b> ${s.items[orig].text}${s.items[orig].note ? `<div class="src">${s.items[orig].note}</div>` : ''}`);
            chain.appendChild(li); b.remove(); nextIdx++;
            ms.className = 'msg dim'; ms.textContent = '';
            if (nextIdx === s.items.length) solved('Derivation assembled.');
          } else { st.tries++; bad(s.items[orig].why ? `Not yet: ${s.items[orig].why}` : 'Not yet: another step has to come first.'); ms.innerHTML = M(ms.textContent); }
        };
        pool.appendChild(b);
      });
    } else {
      const input = get('in'); input.onkeydown = (e) => { e.stopPropagation(); if (e.key === 'Enter') get('ck').click(); };
      get('ck').onclick = () => {
        const st = state[s.id]; if (st.solved || gaveUp) return;
        const x = parseNumber(input.value), unit = get('un')?.value;
        if (Number.isNaN(x)) { bad('Enter a number (e.g. 5.4e-4).'); return; }
        if (!unit) { bad('Pick the unit or dimension first: that is the dimension check.'); return; }
        const numOk = withinTolerance(x, answers[s.id], s), unitOk = unit === s.unit;
        if (numOk && !unitOk) { st.tries++; bad('The number matches, but the unit/dimension is wrong. Think again about what this quantity is.'); return; }
        if (!numOk) { st.tries++; const d = diagnose(x, answers[s.id]); logMistake({ encId: enc.id, step: s.id, prompt: s.prompt, given: input.value, expected: fmt(answers[s.id]), diag: d }); bad(`Not within tolerance: your value is ${x > answers[s.id] ? 'too large' : 'too small'}.`, d); return; }
        solved(`Correct: ${fmt(answers[s.id])} ${s.unit === 'dimensionless' ? '' : s.unit}.`);
      };
    }
  });

  function complete() {
    completed = true;
    env.flash(true);
    q('#calc-result').innerHTML = M(`<p class="msg good"><b>Fight won.</b> ${enc.unlocks ? 'The door opens.' : ''} (+${earned} XP this fight.)</p>
      ${derivationHtml(enc.derivation)}<div class="ex-host"></div>${nextBtn(env)}`);
    mountExplorer(q('#calc-result .ex-host'), buildTargets(enc));
    wireNext(env);
    finish(enc, true, earned);
    env.onChange();
  }
  q('#giveup').onclick = () => {
    if (completed || gaveUp) return;
    gaveUp = true;
    enc.steps.forEach((s) => {
      const ms = el.querySelector(`[data-ms="${s.id}"]`); ms.className = 'msg dim';
      const kind = s.kind || 'numeric';
      if (kind === 'numeric') ms.textContent = `Solution: ${fmt(answers[s.id])} ${s.unit === 'dimensionless' ? '' : s.unit}`;
      else if (kind === 'symbolic') ms.innerHTML = M(`Solution: $${s.latex}$`);
      else if (kind === 'choice') ms.innerHTML = M(`Solution: ${s.options[s.correct]}`);
      else ms.innerHTML = M('Solution order: ' + s.items.map((it, i) => `${i + 1}. ${it.text}`).join('<br>'));
    });
    env.flash(false);
    q('#calc-result').innerHTML = M(`<p class="msg bad">You gave up; this problem respawns for review.</p>${derivationHtml(enc.derivation)}<div class="ex-host"></div>${nextBtn(env)}`);
    mountExplorer(q('#calc-result .ex-host'), buildTargets(enc));
    wireNext(env);
    finish(enc, false, 0);
    env.onChange();
  };
}

// ---------------------------------------------------------------- sandbox (free exploration)
function mountSandbox(enc, el, env) {
  env.previewBanner(enc);
  const d = enc.defaults || { EoverV0: 0.5, L: 2 };
  let last = null; // previous run {T, EoverV0, L}
  el.innerHTML = M(`<h2>${enc.title}</h2>
    <p>${enc.intro}</p>${symbolsHtml(enc.symbols)}
    <div class="row"><label>$E/V_0$ <b id="ev">${d.EoverV0}</b></label><input type="range" id="sl-e" min="0.1" max="2" step="0.05" value="${d.EoverV0}"></div>
    <div class="row"><label>width $L$ <b id="lv">${d.L}</b></label><input type="range" id="sl-l" min="0.4" max="8" step="0.2" value="${d.L}"></div>
    <div id="regime"></div>
    <div id="guess" style="display:none"><p><b>Before you run: compared with the previous run, will the transmitted fraction be...</b></p>
      <button class="opt" data-g="up">higher</button><button class="opt" data-g="same">about the same</button><button class="opt" data-g="down">lower</button></div>
    <button class="go" id="run">Run this experiment</button>
    <div id="result"></div>`);
  const q = (s) => el.querySelector(s);
  const params = () => ({ EoverV0: +q('#sl-e').value, L: Math.round(+q('#sl-l').value * 5) / 5 });
  let guess = null;
  function regime() {
    const { EoverV0: e, L } = params(); q('#ev').textContent = e.toFixed(2); q('#lv').textContent = L.toFixed(1);
    env.preview(params());
    const E = e, V0 = 1, T = TunnelSim.transmission(E, V0, L);
    let html;
    if (E < V0) {
      const kappa = Math.sqrt(2 * (V0 - E)), kL = kappa * L, approx = (16 * E * (V0 - E)) / V0 ** 2 * Math.exp(-2 * kL);
      html = `<p><b>Regime: tunnelling</b> ($E<V_0$). Inside the barrier $\\kappa=\\sqrt{2m(V_0-E)}/\\hbar=${kappa.toFixed(2)}$, so $\\kappa L=${kL.toFixed(2)}$.
        Exact $T=${(100 * T).toFixed(2)}\\,\\%$; thick-barrier estimate $\\frac{16E(V_0-E)}{V_0^2}e^{-2\\kappa L}=${(100 * approx).toFixed(2)}\\,\\%$ ${kL < 1.5 ? '(poor: the barrier is not thick enough, $\\kappa L\\not\\gg1$)' : ''}.</p>`;
    } else if (Math.abs(E - V0) < 1e-9) {
      html = '<p><b>Regime: $E=V_0$</b>, the borderline case: the wave inside is linear in $x$.</p>';
    } else {
      const l = Math.sqrt(2 * (E - V0)), lL = l * L, nres = lL / Math.PI;
      html = `<p><b>Regime: over the barrier</b> ($E>V_0$). Inside $l=\\sqrt{2m(E-V_0)}/\\hbar=${l.toFixed(2)}$, so $lL=${lL.toFixed(2)}=${nres.toFixed(2)}\\pi$.
        Exact $T=${(100 * T).toFixed(2)}\\,\\%$. $T=1$ exactly when $lL=n\\pi$ (resonances); here the nearest resonance is $n=${Math.round(nres)}$.</p>`;
    }
    q('#regime').innerHTML = M(html);
  }
  ['#sl-e', '#sl-l'].forEach((id) => (q(id).oninput = regime));
  regime();
  q('#guess').querySelectorAll('.opt').forEach((b) => (b.onclick = () => { guess = b.dataset.g; q('#guess').querySelectorAll('.opt').forEach((x) => x.classList.toggle('sel', x === b)); }));
  q('#run').onclick = () => {
    if (last && !guess) { q('#guess').style.display = ''; q('#result').innerHTML = '<p class="msg bad">Make a guess first (this is the point of the bench).</p>'; return; }
    const v = params();
    env.run(v, (sim) => {
      const p = sim.probabilities(), plane = TunnelSim.transmission(sim.E, sim.V0, sim.L);
      let verdict = '';
      if (last && guess) {
        const ratio = p.T / last.T, actual = ratio > 1.15 ? 'up' : ratio < 0.87 ? 'down' : 'same';
        verdict = `<p class="msg ${actual === guess ? 'good' : 'bad'}">You guessed <b>${guess === 'up' ? 'higher' : guess === 'down' ? 'lower' : 'about the same'}</b>; it went <b>${actual === 'up' ? 'higher' : actual === 'down' ? 'lower' : 'about the same'}</b> (${(100 * last.T).toFixed(2)} % → ${(100 * p.T).toFixed(2)} %). Ask yourself which factor in $T$ changed: $\\kappa L$ (or $lL$), or the prefactor $E(V_0-E)$.</p>`;
      }
      last = { T: p.T, ...v }; guess = null;
      q('#guess').style.display = ''; q('#guess').querySelectorAll('.opt').forEach((x) => x.classList.remove('sel'));
      q('#result').innerHTML = M(`${verdict}<p><b>Measured:</b> transmitted ${(100 * p.T).toFixed(2)} %, reflected ${(100 * p.R).toFixed(2)} % (exact plane-wave $T=${(100 * plane).toFixed(2)}\\,\\%$ at the central energy).</p>`);
      env.flash(true); env.onChange();
    });
  };
}

// ---------------------------------------------------------------- boss
function mountBoss(enc, el, env) {
  env.previewBanner(enc);
  let timer = null;
  el.innerHTML = M(`<h2>${enc.title}</h2>
    <p class="src">Source: ${enc.source.file.split('/').pop()}, ${enc.source.where}</p>
    <p>${enc.instructions}</p>
    <div class="timer" id="timer">${String(enc.minutes).padStart(2, '0')}:00</div>
    <button class="go" id="boss-start">Start the timer and reveal the problem</button>
    <div id="boss-body" style="display:none"></div>`);
  const q = (s) => el.querySelector(s);
  q('#boss-start').onclick = () => {
    q('#boss-start').style.display = 'none';
    const body = q('#boss-body'); body.style.display = '';
    body.innerHTML = M(enc.statement.map((l) => `<p>${l}</p>`).join('') + '<h3>Final answers</h3>' +
      enc.finalAnswers.map((f) => `<div class="step"><div>${f.prompt}</div><div class="row"><input type="text" data-fa="${f.id}" autocomplete="off"><span data-fm="${f.id}" class="msg"></span></div></div>`).join('') +
      '<button class="go" id="submit">Submit final answers</button><div id="boss-result"></div>');
    body.querySelectorAll('input').forEach((i) => (i.onkeydown = (e) => e.stopPropagation()));
    const end = Date.now() + enc.minutes * 60000;
    timer = setInterval(() => {
      const left = Math.max(0, end - Date.now()), m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
      const t = q('#timer'); if (!t || !t.isConnected) { clearInterval(timer); return; }
      t.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      t.classList.toggle('low', left < 5 * 60000);
      if (!left) { clearInterval(timer); t.textContent = '00:00 (time up)'; }
    }, 500);
    q('#submit').onclick = () => submit();
  };
  function submit() {
    clearInterval(timer);
    q('#submit').disabled = true;
    let right = 0;
    enc.finalAnswers.forEach((f) => {
      const exp = evaluate(f.answer, f.vars || {}), x = parseNumber(q(`[data-fa="${f.id}"]`).value), ok = withinTolerance(x, exp, f);
      if (ok) right++;
      const m = q(`[data-fm="${f.id}"]`); m.className = 'msg ' + (ok ? 'good' : 'bad'); const dg = ok ? null : diagnose(x, exp);
      if (!ok && !Number.isNaN(x)) logMistake({ encId: enc.id, step: f.id, prompt: f.prompt, given: q(`[data-fa="${f.id}"]`).value, expected: fmt(exp), diag: dg });
      if (dg) m.innerHTML = M(`Expected ${fmt(exp)}. <span class="diag">Likely slip: ${dg}</span>`); else m.textContent = ok ? `Correct (${fmt(exp)})` : `Expected ${fmt(exp)}`;
    });
    q('#boss-result').innerHTML = M(`<h3>Self-grade the written parts</h3><p class="src">Tick each key point you actually had on paper.</p>
      <ul class="key" style="list-style:none;padding:0">${enc.keyPoints.map((k) => `<li><label><input type="checkbox" class="kp"> ${k}</label></li>`).join('')}</ul>
      <button class="go" id="grade">Finish boss</button><div id="boss-final"></div>`);
    q('#grade').onclick = () => {
      const kp = [...el.querySelectorAll('.kp')].filter((c) => c.checked).length;
      const score = 0.5 * (right / enc.finalAnswers.length) + 0.5 * (kp / enc.keyPoints.length);
      const ok = score >= 0.6, xp = Math.round(score * enc.xp);
      q('#grade').disabled = true;
      env.flash(ok);
      q('#boss-final').innerHTML = `<p class="msg ${ok ? 'good' : 'bad'}">Score ${(100 * score).toFixed(0)} % (${right}/${enc.finalAnswers.length} numeric answers, ${kp}/${enc.keyPoints.length} key points). ${ok ? `Boss defeated, +${xp} XP.` : 'The boss survives; it respawns for review.'}</p><div class="ex-host"></div>`;
      mountExplorer(q('#boss-final .ex-host'), buildTargets(enc));
      finish(enc, ok, xp);
      env.onChange();
    };
  }
  return () => clearInterval(timer);
}

// ---------------------------------------------------------------- shared helpers for the text-based encounter types
const shuffled = (n) => { const a = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export function sourceHtml(src) {
  if (!src) return '';
  const arr = (Array.isArray(src) ? src : [src]).filter(Boolean); if (!arr.length) return '';
  return `<p class="src">Source: ${arr.map((s) => `${s.file.split('/').pop()} (${s.where})`).join('; ')}</p>`;
}
// One multiple-choice question with shuffled options. onAnswer(correct) is called on every click.
function mcQuestion(q, host, onAnswer, { reveal = true } = {}) {
  const order = shuffled(q.options.length);
  host.innerHTML = M(`<p><b>${q.q}</b></p><div class="opts">${order.map((orig) => `<button class="opt" data-orig="${orig}">${q.options[orig]}</button>`).join('')}</div><div class="msg"></div>`);
  host.dataset.correct = q.correct; // read by the browser tests
  const msg = host.querySelector('.msg'); let done = false, betDone = false; const bet = confBar(host); // optional confidence bet, recorded for the first click only
  host.querySelectorAll('.opt').forEach((b) => (b.onclick = () => {
    if (done) return;
    const orig = +b.dataset.orig, ok = orig === q.correct;
    if (!betDone) { betDone = true; recordConf(bet.get(), ok, null); bet.bar.querySelectorAll('button').forEach((x) => (x.disabled = true)); }
    if (ok) { done = true; b.classList.add('right'); host.querySelectorAll('.opt').forEach((x) => (x.disabled = true)); }
    else { b.classList.add('wrong'); b.disabled = true; }
    if (reveal || ok) { msg.className = 'msg ' + (ok ? 'good' : 'bad'); msg.innerHTML = M(ok ? `Correct. ${q.explain || ''}` : 'Not this one, try again.'); }
    onAnswer(ok, orig);
  }));
}
const BLOCK_LABEL = { intuition: 'Intuition', pitfall: 'Pitfall', figure: 'Figure (described in words)', exam: 'In the exam' };
function blockHtml(b, ctx = '') {
  if (b.kind === 'eq') return `<div class="eqbox">$$${b.tex}$$${b.label ? `<div class="eqlabel">${b.label}</div>` : ''}${whereHtml(b.tex, ctx + ' ' + (b.label || ''))}</div>`;
  if (b.kind === 'text') return `<p>${b.html}</p>`;
  return `<div class="callout ${b.kind}"><div class="ctitle">${BLOCK_LABEL[b.kind] || b.kind}</div>${b.html}</div>`;
}

// ---------------------------------------------------------------- lesson (theory card with check questions)
function mountLesson(enc, el, env) {
  env.previewBanner(enc);
  const qs = enc.check || [];
  el.innerHTML = M(`<h2>${enc.title} <span class="src">(${enc.tier === 'intuition' ? 'intuition' : 'theory'}, about ${enc.minutes || 10} min)</span></h2>
    ${sourceHtml(enc.source)}
    <div class="lesson">${enc.blocks.map((b) => blockHtml(b, enc.title)).join('')}</div>
    <h3>Check yourself</h3><div id="checks"></div><div id="result"></div>`);
  const host = el.querySelector('#checks');
  let right = 0, mistakes = 0, finished = false;
  const finishLesson = () => {
    if (finished) return; finished = true;
    el.querySelector('#result').innerHTML = M(`<p class="msg good"><b>Lesson passed.</b> +${enc.xp} XP${mistakes ? `. You missed ${mistakes} check${mistakes > 1 ? 's' : ''} on the way, so this lesson comes back for review.` : '.'}</p>${nextBtn(env)}`);
    wireNext(env);
    env.flash(true);
    finish(enc, true, enc.xp);
    if (mistakes) store.fail(enc.id);
    env.onChange();
  };
  if (!qs.length) { host.innerHTML = '<button class="go" id="done">Mark as read</button>'; host.querySelector('#done').onclick = finishLesson; return; }
  qs.forEach((q) => {
    const d = document.createElement('div'); d.className = 'step'; host.appendChild(d);
    let first = true;
    mcQuestion(q, d, (ok) => { if (!ok && first) mistakes++; first = false; if (ok && ++right === qs.length) finishLesson(); });
    if (q.source) d.insertAdjacentHTML('beforeend', sourceHtml(q.source));
  });
}

// ---------------------------------------------------------------- quiz (exam-style multiple choice, one question at a time)
function mountQuiz(enc, el, env) {
  env.previewBanner(enc);
  const qs = enc.questions, order = shuffled(qs.length);
  let i = 0, correct = 0; const missed = [];
  el.innerHTML = M(`<h2>${enc.title} <span class="src">(quick fight)</span></h2>${sourceHtml(enc.source)}
    <p class="src">${qs.length} questions, pass mark ${Math.round(100 * enc.passMark)} %. One attempt per question, like the exam.</p>
    <div id="qprog" class="src"></div><div id="qbox"></div><div id="qnav"></div><div id="result"></div>`);
  const q$ = (s) => el.querySelector(s);
  function show() {
    const q = qs[order[i]];
    q$('#qprog').textContent = `Question ${i + 1} of ${qs.length}`;
    q$('#qnav').innerHTML = '';
    let answered = false;
    mcQuestion({ ...q }, q$('#qbox'), (ok) => {
      // exam rule: the first click counts; reveal the key either way
      if (answered) return; answered = true;
      if (ok) correct++; else { missed.push(q); q$('#qbox').querySelectorAll('.opt').forEach((x) => { x.disabled = true; if (+x.dataset.orig === q.correct) x.classList.add('right'); }); q$('#qbox .msg').className = 'msg bad'; q$('#qbox .msg').innerHTML = M(`Wrong. ${q.explain || ''}`); }
      q$('#qnav').innerHTML = `<button class="go" id="qnext">${i === qs.length - 1 ? 'See result' : 'Next question'}</button>`;
      q$('#qnext').onclick = () => { if (i === qs.length - 1) end(); else { i++; show(); } };
    }, { reveal: false });
    if (q.source) q$('#qbox').insertAdjacentHTML('beforeend', sourceHtml(q.source));
  }
  function end() {
    const frac = correct / qs.length, ok = frac >= enc.passMark, xp = Math.round(enc.xp * frac);
    q$('#qbox').innerHTML = ''; q$('#qnav').innerHTML = ''; q$('#qprog').textContent = '';
    env.flash(ok);
    q$('#result').innerHTML = M(`<p class="msg ${ok ? 'good' : 'bad'}"><b>${correct} / ${qs.length} correct (${(100 * frac).toFixed(0)} %).</b> ${ok ? `Passed, +${xp} XP.` : 'Below the pass mark: the quiz respawns for review.'}</p>
      ${missed.length ? `<h3>What you missed</h3>${missed.map((m) => `<div class="step"><p><b>${m.q}</b></p><p class="after">Answer: ${m.options[m.correct]}<br>${m.explain || ''}</p></div>`).join('')}` : ''}${nextBtn(env)}`);
    wireNext(env);
    finish(enc, ok, xp); env.onChange();
  }
  show();
}

// ---------------------------------------------------------------- derive ("show that", written on paper, self-graded)
function mountDerive(enc, el, env) {
  env.previewBanner(enc);
  el.innerHTML = M(`<h2>${enc.title} <span class="src">(${enc.book ? 'textbook exercise' : 'derivation practice'})</span></h2>${sourceHtml(enc.source)}
    <div class="callout exam"><div class="ctitle">Goal</div>${enc.goal}</div>
    <h3>Given</h3><ul>${enc.given.map((g) => `<li>${g}</li>`).join('')}</ul>
    <p class="src">Do each step on paper first, then reveal the reference step and compare.</p>
    <div id="dsteps"></div><div id="dkeys"></div><div id="result"></div>`);
  const host = el.querySelector('#dsteps'); let revealed = 0;
  enc.steps.forEach((s, n) => {
    const d = document.createElement('div'); d.className = 'step';
    d.innerHTML = M(`<div><b>${n + 1}.</b> ${s.prompt}</div><button class="go" data-rv>Reveal reference step</button><div class="after" style="display:none">${s.reveal}</div>`);
    host.appendChild(d);
    d.querySelector('[data-rv]').onclick = () => {
      d.querySelector('.after').style.display = ''; d.querySelector('[data-rv]').style.display = 'none';
      if (++revealed === enc.steps.length) keys();
    };
  });
  function keys() {
    el.querySelector('#dkeys').innerHTML = M(`<h3>Key points of a full-marks solution</h3><p class="src">Tick each one you really had on paper.</p>
      <ul class="key" style="list-style:none;padding:0">${enc.keyPoints.map((k) => `<li><label><input type="checkbox" class="kp"> ${k}</label></li>`).join('')}</ul>
      <button class="go" id="dgrade">Finish</button>`);
    el.querySelector('#dgrade').onclick = () => {
      const got = [...el.querySelectorAll('.kp')].filter((c) => c.checked).length, score = got / enc.keyPoints.length, ok = score >= 0.6, xp = Math.round(score * enc.xp);
      el.querySelector('#dgrade').disabled = true; env.flash(ok);
      el.querySelector('#result').innerHTML = M(`<p class="msg ${ok ? 'good' : 'bad'}">${got} / ${enc.keyPoints.length} key points. ${ok ? `Derivation done, +${xp} XP.` : 'Not yet solid: it respawns for review. Redo it on paper from the given equations.'}</p>${nextBtn(env)}`);
      wireNext(env); finish(enc, ok, xp); env.onChange();
    };
  }
}
