// Graphics quality with an automatic low mode for slow machines (the target is a ten-year-old laptop with 4 GB RAM).
// Levels trade resolution and frame rate, the two things that cost the most; nothing in the scene is removed.
// "auto" starts from what the machine reports and then follows the measured frame rate: down quickly, up slowly.
export const LEVELS = [
  { name: 'high', scale: 1, maxRatio: 2, fps: 60 },
  { name: 'medium', scale: 1, maxRatio: 1, fps: 60 },
  { name: 'low', scale: 0.75, maxRatio: 1, fps: 30 },
  { name: 'minimal', scale: 0.5, maxRatio: 1, fps: 30 },
];
const READING_FPS = 12; // while an exercise panel is open and nothing in the scene is being run, the 3D view only idles

export function createQuality({ setPixelRatio, deviceRatio = () => window.devicePixelRatio || 1, memoryGb = () => navigator.deviceMemory || 8, cores = () => navigator.hardwareConcurrency || 4 }) {
  let mode = 'auto', level = 0, lastRender = 0, win = [], lowSince = 0, highSince = 0, ups = 0;
  const apply = () => { const L = LEVELS[level]; setPixelRatio(Math.min(deviceRatio(), L.maxRatio) * L.scale); };
  const startLevel = () => (memoryGb() <= 4 || cores() <= 2 ? 2 : memoryGb() <= 6 || cores() <= 4 ? 1 : 0);
  function setMode(m) { mode = ['auto', 'high', 'medium', 'low', 'minimal'].includes(m) ? m : 'auto'; level = mode === 'auto' ? startLevel() : LEVELS.findIndex((x) => x.name === mode); win = []; lowSince = highSince = 0; ups = 0; apply(); }
  // Should this animation frame be drawn? Caps the frame rate of the level (or the reading rate) without touching the game logic.
  function shouldRender(now, { reading = false } = {}) {
    const cap = reading ? READING_FPS : LEVELS[level].fps; if (cap >= 60) { lastRender = now; return true; }
    if (now - lastRender < 1000 / cap - 3) return false; lastRender = now; return true;
  }
  // Feed the time one drawn frame took to come round (ms between two drawn frames at full rate). Only used in auto mode.
  function sample(now, frameMs, { reading = false, hidden = false } = {}) {
    if (mode !== 'auto' || reading || hidden || frameMs <= 0 || frameMs > 1000) { win = []; lowSince = highSince = 0; return; }
    win.push(frameMs); if (win.length > 90) win.shift(); if (win.length < 45) return;
    const avg = win.reduce((a, b) => a + b, 0) / win.length, fps = 1000 / avg, target = LEVELS[level].fps;
    if (fps < Math.min(24, target * 0.75)) { lowSince ||= now; if (now - lowSince > 2500 && level < LEVELS.length - 1) { level++; win = []; lowSince = 0; apply(); } } else lowSince = 0;
    if (fps > target * 0.93 && level > startLevel() - 1 && level > 0 && ups < 2) { highSince ||= now; if (now - highSince > 25000) { level--; ups++; win = []; highSince = 0; apply(); } } else highSince = 0;
  }
  return { setMode, shouldRender, sample, get level() { return LEVELS[level].name; }, get mode() { return mode; }, info: () => ({ mode, level: LEVELS[level].name, scale: LEVELS[level].scale, fpsCap: LEVELS[level].fps }) };
}
