// Small rewards for every right answer and every XP gain: a floating "+20 XP", a short tone and a tap of vibration.
// Sounds are off by default (Profile > settings). Nothing here changes the game logic.
let cfg = { sound: false, haptics: true };
let ctx = null;
export const configureFeedback = (c) => { cfg = { ...cfg, ...c }; };

function audio() {
  if (!cfg.sound) return null;
  try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === 'suspended') ctx.resume(); return ctx; } catch { return null; }
}
function tone(freq, start, dur, type = 'sine', vol = 0.07) {
  const a = audio(); if (!a) return;
  const t0 = a.currentTime + start, o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(a.destination); o.start(t0); o.stop(t0 + dur + 0.02);
}
const buzz = (p) => { if (cfg.haptics) try { navigator.vibrate?.(p); } catch { /* not supported */ } };

export const sfx = {
  right() { tone(659, 0, 0.12); tone(880, 0.09, 0.18); buzz(18); },
  wrong() { tone(196, 0, 0.22, 'triangle', 0.06); buzz([12, 40, 12]); },
  xp() { tone(1175, 0, 0.07, 'sine', 0.04); },
  goal() { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.22)); buzz([25, 50, 25, 50, 60]); },
};

// floating "+N XP" next to the XP counter (or in the middle of the screen when that is hidden)
export function floatXp(n) {
  if (!n) return;
  const el = document.createElement('div'); el.className = `xpfloat ${n > 0 ? 'up' : 'down'}`; el.textContent = `${n > 0 ? '+' : '−'}${Math.abs(n)} XP`;
  const anchor = document.getElementById('xp'), r = anchor?.getBoundingClientRect();
  if (r && r.width) { el.style.left = `${r.left + r.width / 2}px`; el.style.top = `${r.bottom + 4}px`; } else { el.style.left = '50%'; el.style.top = '40%'; }
  document.body.appendChild(el); setTimeout(() => el.remove(), 1400);
  if (n > 0) sfx.xp();
}

// a soft ring around the screen for a right answer / a mission or goal being completed
export function pulse(kind = 'right') {
  const el = document.createElement('div'); el.className = `pulse ${kind}`; document.body.appendChild(el); setTimeout(() => el.remove(), 700);
}

// Watches the panels for answers being marked right or wrong, so the exercise code needs no change.
export function watchAnswers(roots) {
  let timer = 0, good = 0, bad = 0;
  const flush = () => { timer = 0; if (bad) { sfx.wrong(); pulse('wrong'); } else if (good) { sfx.right(); pulse('right'); } good = bad = 0; };
  const note = (isGood) => { if (isGood) good++; else bad++; if (!timer) timer = setTimeout(flush, 120); };
  const check = (el) => {
    if (!(el instanceof Element)) return;
    const cl = el.classList;
    if (cl.contains('msg') && cl.contains('good') || cl.contains('opt') && cl.contains('right')) note(true);
    else if (cl.contains('msg') && cl.contains('bad') || cl.contains('opt') && cl.contains('wrong')) note(false);
  };
  const mo = new MutationObserver((list) => {
    for (const m of list) {
      if (m.type === 'attributes') { const was = (m.oldValue || '').split(' '); const cl = m.target.classList; if ((cl.contains('right') && !was.includes('right')) || (cl.contains('wrong') && !was.includes('wrong')) || (cl.contains('good') && !was.includes('good')) || (cl.contains('bad') && !was.includes('bad'))) check(m.target); }
      else for (const n of m.addedNodes) { check(n); if (n instanceof Element) n.querySelectorAll?.('.msg.good, .msg.bad').forEach(check); }
    }
  });
  for (const r of roots) if (r) mo.observe(r, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true });
}
