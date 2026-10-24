// On-screen controls for phones and tablets: a move stick (bottom left), drag anywhere on the 3D view to look,
// an action button for "E" (bottom right) and fly buttons in the Nexus. Panels, menus and the toolbar are in main.js / style.css.
const STICK_RADIUS = 52, DEADZONE = 0.12;

export function initTouch({ player, canvas, act, fullscreen, zoom }) {
  player.touch = true;
  const root = document.createElement('div'); root.id = 'touch';
  root.innerHTML = `<div id="joy"><div id="joy-knob"></div></div>
    <div id="t-zoom"><button id="t-zin" class="tb sm" aria-label="Zoom in">+</button><button id="t-zout" class="tb sm" aria-label="Zoom out">&minus;</button></div>
    <div id="t-right"><button id="t-act" class="tb act" hidden></button>
      <div class="fly" hidden><button id="t-up" class="tb">&#9650;</button><button id="t-down" class="tb">&#9660;</button><button id="t-fast" class="tb">&raquo;</button></div></div>`;
  document.body.appendChild(root);
  const $ = (id) => root.querySelector(id), joy = $('#joy'), knob = $('#joy-knob'), actBtn = $('#t-act'), fly = $('.fly');

  // move stick: relative to the centre of the base, with a dead zone
  let stickId = null, cx = 0, cy = 0;
  const setStick = (x, y) => {
    let dx = x - cx, dy = y - cy; const d = Math.hypot(dx, dy);
    if (d > STICK_RADIUS) { dx *= STICK_RADIUS / d; dy *= STICK_RADIUS / d; }
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    const ax = dx / STICK_RADIUS, ay = -dy / STICK_RADIUS, m = Math.hypot(ax, ay);
    if (m < DEADZONE) { player.axis.x = 0; player.axis.y = 0; return; }
    const g = (m - DEADZONE) / (1 - DEADZONE) / m; // rescale so the speed starts at 0 right after the dead zone
    player.axis.x = ax * g; player.axis.y = ay * g;
  };
  const endStick = () => { stickId = null; knob.style.transform = ''; player.axis.x = 0; player.axis.y = 0; };
  joy.addEventListener('pointerdown', (e) => {
    if (stickId !== null) { try { joy.releasePointerCapture(stickId); } catch { /* gone already */ } endStick(); } // a stale stick (its finger vanished) is replaced by the new touch
    stickId = e.pointerId; joy.setPointerCapture(e.pointerId);
    const r = joy.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2; setStick(e.clientX, e.clientY); e.preventDefault();
  });
  joy.addEventListener('pointermove', (e) => { if (e.pointerId === stickId) { setStick(e.clientX, e.clientY); e.preventDefault(); } });
  for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) joy.addEventListener(t, (e) => { if (e.pointerId === stickId) endStick(); });

  // look: drag on the 3D view with a finger (the mouse keeps its own handling in player.js)
  const looks = new Map(); let pinch = null; // two fingers on the view: pinch to zoom
  canvas.style.touchAction = 'none';
  canvas.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return; looks.set(e.pointerId, { x: e.clientX, y: e.clientY }); canvas.setPointerCapture(e.pointerId);
    if (looks.size === 2 && zoom) { const [a, b] = [...looks.values()]; pinch = { d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, z0: zoom.get() }; }
  });
  canvas.addEventListener('pointermove', (e) => {
    const l = looks.get(e.pointerId); if (!l) return;
    const dx = e.clientX - l.x, dy = e.clientY - l.y; l.x = e.clientX; l.y = e.clientY;
    if (pinch && looks.size === 2) { const [a, b] = [...looks.values()]; zoom.set(pinch.z0 * (Math.hypot(a.x - b.x, a.y - b.y) / pinch.d0)); return; }
    if (player.enabled) player.look(dx, dy);
  });
  const lift = (e) => { looks.delete(e.pointerId); if (looks.size < 2) pinch = null; };
  for (const tp of ['pointerup', 'pointercancel']) canvas.addEventListener(tp, lift);
  if (zoom) { document.getElementById('t-zin').onclick = () => zoom.set(zoom.get() * 1.25); document.getElementById('t-zout').onclick = () => zoom.set(zoom.get() / 1.25); }

  // buttons held down: up / down (Nexus flight); fast is a toggle
  const hold = (id, v) => {
    const b = $(id); let pid = null;
    b.addEventListener('pointerdown', (e) => { pid = e.pointerId; b.setPointerCapture(pid); player.vert = v; b.classList.add('on'); e.preventDefault(); });
    for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) b.addEventListener(t, (e) => { if (e.pointerId === pid) { pid = null; if (player.vert === v) player.vert = 0; b.classList.remove('on'); } });
  };
  hold('#t-up', 1); hold('#t-down', -1);
  $('#t-fast').addEventListener('click', () => { player.fast = !player.fast; $('#t-fast').classList.toggle('on', player.fast); });
  actBtn.addEventListener('click', () => act());

  root.addEventListener('contextmenu', (e) => e.preventDefault());
  const fsBtn = document.getElementById('btn-fs');
  if (fsBtn) {
    const can = document.documentElement.requestFullscreen && !matchMedia('(display-mode: standalone)').matches;
    if (!can) fsBtn.style.display = 'none'; else fsBtn.onclick = () => fullscreen();
  }

  const promptEl = document.getElementById('prompt');
  let shownText = null, shownFly = null;
  return {
    // called every frame: promptText is the "[E] ..." line of the thing in front of the player (or null)
    update({ promptText, flying }) {
      const text = promptText && promptText.startsWith('[E]') ? promptText.slice(3).trim() : null;
      if (text !== shownText) { shownText = text; actBtn.hidden = !text; actBtn.textContent = text || ''; promptEl?.classList.toggle('t-hide', !!text); }
      if (flying !== shownFly) { shownFly = flying; fly.hidden = !flying; if (!flying) { player.vert = 0; player.fast = false; $('#t-fast').classList.remove('on'); } }
    },
    reset() { endStick(); looks.clear(); player.vert = 0; },
  };
}
