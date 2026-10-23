// Confidence bets: before answering you say "guessing / probably / sure". The game tracks how often each level is right
// (calibration) and files confident wrong answers in the mistakes log as overconfidence.
import { store } from './store.js';
import { logMistake } from './mistakes.js';
export const LEVELS = [['guess', 'guessing'], ['probably', 'probably'], ['sure', 'sure']];
export const calibStats = () => store.val('calib', {}) || {};
export function confBar(host, { required = false } = {}) {
  const bar = document.createElement('div'); bar.className = 'confbar';
  bar.innerHTML = `<span class="src">How sure are you${required ? ' (choose first)' : ' (optional bet)'}?</span> ${LEVELS.map(([k, l]) => `<button type="button" class="chip btn confchip" data-conf="${k}">${l}</button>`).join('')}`;
  let level = null;
  bar.querySelectorAll('.confchip').forEach((b) => (b.onclick = () => { level = b.dataset.conf; bar.querySelectorAll('.confchip').forEach((x) => x.classList.toggle('cur', x === b)); bar.classList.remove('need'); }));
  host.prepend(bar);
  return { get: () => level, need: () => { if (required && !level) { bar.classList.add('need'); return false; } return true; }, bar };
}
export function recordConf(level, ok, meta) {
  if (!level) return;
  const s = { ...calibStats() }; const e = s[level] || { n: 0, ok: 0 }; s[level] = { n: e.n + 1, ok: e.ok + (ok ? 1 : 0) }; store.setVal('calib', s);
  if (level === 'sure' && !ok && meta?.encId) logMistake({ encId: meta.encId, step: meta.step || 'conf', prompt: meta.prompt, given: meta.given, expected: meta.expected, diag: 'You were <b>sure</b> but it was wrong: overconfidence. What did you assume without checking?' });
}
export function calibHtml() {
  const s = calibStats(), tot = LEVELS.reduce((a, [k]) => a + (s[k]?.n || 0), 0);
  if (!tot) return '<p>No bets yet. In drills, interleaved mode and quizzes you can say how sure you are before answering. After a few dozen answers this page shows whether your confidence matches your results. In the exam that tells you what to skip and what to double-check.</p>';
  const pct = (k) => (s[k]?.n ? Math.round((100 * s[k].ok) / s[k].n) : null), exp = { guess: 35, probably: 65, sure: 90 };
  const rows = LEVELS.map(([k, l]) => `<tr><td>${l}</td><td>${s[k]?.n || 0}</td><td>${pct(k) === null ? '-' : pct(k) + ' %'}</td><td>${s[k]?.n ? `<div class="calbar"><i style="width:${pct(k)}%"></i></div>` : ''}</td></tr>`).join('');
  const notes = [];
  if ((s.sure?.n || 0) >= 8 && pct('sure') < 80) notes.push(`When you say <b>sure</b> you are right only ${pct('sure')} % of the time: you are overconfident. Before committing, check units, signs and limits once more (the "Spot the error" drills train exactly this).`);
  if ((s.guess?.n || 0) >= 8 && pct('guess') > 60) notes.push(`Your <b>guesses</b> are right ${pct('guess')} % of the time: you know more than you think. Trust the first idea a bit more and use the saved time on harder parts.`);
  if (!notes.length) notes.push('Your confidence matches your results so far (or there is not enough data yet). Keep going.');
  return `<table class="lk-map"><tr><th>You said</th><th>Answers</th><th>Right</th><th></th></tr>${rows}</table><p class="src">A well-calibrated student is right about ${exp.guess} % when guessing, ${exp.probably} % when "probably", and ${exp.sure} % or more when "sure".</p>${notes.map((n) => `<p>${n}</p>`).join('')}`;
}
