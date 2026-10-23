import * as THREE from 'three';
import { mathTexture } from './mathtex.js';

// 3D hall of the Tunneling Bridge: a viewing gallery in front of a bridge over a chasm, with
// terminals (encounters), a door and a review portal. Everything is low-poly and procedural.
export const SIM_VIEW = 45;          // simulation units shown on the bridge: [-50, 50]
export const BRIDGE_HALF = 9;       // metres
export const SCALE = BRIDGE_HALF / SIM_VIEW;
export const BARRIER_H = 4;
export const GALLERY = { xmin: -15, xmax: 15, zmin: 5.5, zmax: 9.5 };
export const TERMINAL_Z = 6.3;

const flat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, metalness: 0.1, ...extra });
const glow = (color, intensity = 1.2) => new THREE.MeshStandardMaterial({ color: 0x000000, emissive: color, emissiveIntensity: intensity });

// All text in the 3D world goes through KaTeX: write math between $...$ (see mathtex.js).
function labelTexture(lines, opts = {}) { return mathTexture(lines, opts); }

function textSprite(lines, { w = 440, h = 130, ppm = 100 } = {}) {
  const tex = mathTexture(lines, { w, h, size: 30, small: 24, bg: 'rgba(8,16,30,0.88)', border: '#58b6ff', fg: '#cfe6ff', accent: '#ffffff' });
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
  s.scale.set(w / ppm, h / ppm, 1); s.renderOrder = 10;
  return s;
}

export class World {
  constructor(canvas) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, matchMedia('(pointer: coarse)').matches ? 1.5 : 2)); // phones: fewer pixels, steadier frame rate
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070a12);
    this.scene.fog = new THREE.Fog(0x070a12, 14, 48);
    this.camera = new THREE.PerspectiveCamera(72, 1, 0.05, 400);
    this.interactables = [];
    this.fx = { shake: 0, flash: 0, flashColor: new THREE.Color(0xff3030) };
    this.sim = null;
    this.t = 0;
    this._buildLights();
    this._buildHall();
    this._buildBridge();
    this._buildWave();
    this._buildDoor();
    this._buildPortal();
    this._buildLabels();
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
  }

  _buildLights() {
    this.hallLights = [];
    this.hemi = new THREE.HemisphereLight(0x8fb4ff, 0x141020, 0.9); this.scene.add(this.hemi);
    const sun = new THREE.DirectionalLight(0xffffff, 0.5); sun.position.set(-4, 10, 8); this.scene.add(sun);
    for (let x = -12; x <= 12; x += 6) {
      const p = new THREE.PointLight(0x7fc4ff, 14, 14, 1.6); p.position.set(x, 4.6, 7); this.scene.add(p); this.hallLights.push(p);
    }
    this.barrierLight = new THREE.PointLight(0xffc24b, 10, 10, 1.8); this.barrierLight.position.set(0, 3, 0); this.scene.add(this.barrierLight);
  }

  _buildHall() {
    const g = new THREE.Group();
    const floor = new THREE.Mesh(new THREE.BoxGeometry(34, 0.3, GALLERY.zmax - GALLERY.zmin + 1.4), flat(0x1c2433));
    floor.position.set(0, -0.15, (GALLERY.zmax + GALLERY.zmin) / 2 - 0.3); g.add(floor);
    // glowing floor strips
    for (let x = -14; x <= 14; x += 2) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.02, 0.06), glow(0x3aa0ff, 0.8)); s.position.set(x, 0.01, 6.9); g.add(s);
    }
    // walls and ceiling
    const wallMat = flat(0x161c2a);
    const back = new THREE.Mesh(new THREE.BoxGeometry(34, 8, 0.4), wallMat); back.position.set(0, 3.7, GALLERY.zmax + 0.6); g.add(back);
    for (const sx of [-1, 1]) { const w = new THREE.Mesh(new THREE.BoxGeometry(0.4, 8, 20), wallMat); w.position.set(sx * 17, 3.7, 1); g.add(w); }
    const ceil = new THREE.Mesh(new THREE.BoxGeometry(34, 0.3, 21), wallMat); ceil.position.set(0, 7.6, 1); g.add(ceil);
    for (let x = -14; x <= 14; x += 4) { const l = new THREE.Mesh(new THREE.BoxGeometry(2, 0.06, 0.5), glow(0xbfe3ff, 1.5)); l.position.set(x, 7.4, 6.5); g.add(l); }
    // chasm: dark floor with a faint grid, far wall
    const chasm = new THREE.Mesh(new THREE.PlaneGeometry(34, 16, 34, 16), new THREE.MeshBasicMaterial({ color: 0x0a2a44, wireframe: true, transparent: true, opacity: 0.35 }));
    chasm.rotation.x = -Math.PI / 2; chasm.position.set(0, -7, 0); g.add(chasm);
    const far = new THREE.Mesh(new THREE.BoxGeometry(34, 14, 0.4), flat(0x101726)); far.position.set(0, 0, -8); g.add(far);
    // railing between gallery and chasm
    const rail = new THREE.Mesh(new THREE.BoxGeometry(34, 0.08, 0.08), glow(0x58b6ff, 0.9)); rail.position.set(0, 1.0, GALLERY.zmin - 0.25); g.add(rail);
    for (let x = -16; x <= 16; x += 2) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.0, 0.06), flat(0x3b4a66)); p.position.set(x, 0.5, GALLERY.zmin - 0.25); g.add(p); }
    this.scene.add(g); this.hall = g;
  }

  _buildBridge() {
    const g = new THREE.Group();
    this.deckMat = flat(0x3a4560);
    const deck = new THREE.Mesh(new THREE.BoxGeometry(2 * BRIDGE_HALF + 2, 0.25, 2.2), this.deckMat); deck.position.set(0, -0.125, 0); g.add(deck);
    for (let x = -BRIDGE_HALF; x <= BRIDGE_HALF; x += 1) {
      const plank = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.05, 2.0), flat(0x4a5878)); plank.position.set(x, 0.01, 0); g.add(plank);
    }
    for (const sz of [-1.15, 1.15]) {
      const r = new THREE.Mesh(new THREE.BoxGeometry(2 * BRIDGE_HALF + 2, 0.06, 0.06), glow(0x58b6ff, 0.8)); r.position.set(0, 0.9, sz); g.add(r);
    }
    // emitter ring (left) and detector (right)
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.12, 8, 24), glow(0x7dffb0, 1.4)); ring.rotation.y = Math.PI / 2; ring.position.set(-BRIDGE_HALF - 0.6, 1.4, 0); g.add(ring);
    const det = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.4, 2.2), glow(0xff8a5b, 0.9)); det.position.set(BRIDGE_HALF + 0.9, 1.2, 0); g.add(det);
    // barrier
    this.barrierMat = new THREE.MeshStandardMaterial({ color: 0xffc24b, emissive: 0xaa6a00, emissiveIntensity: 0.6, transparent: true, opacity: 0.45, flatShading: true });
    this.barrier = new THREE.Mesh(new THREE.BoxGeometry(1, BARRIER_H, 2.1), this.barrierMat); g.add(this.barrier);
    this.barrierEdges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1, BARRIER_H, 2.1)), new THREE.LineBasicMaterial({ color: 0xffe08a }));
    g.add(this.barrierEdges);
    // energy marker
    this.energyLine = new THREE.Mesh(new THREE.BoxGeometry(2 * BRIDGE_HALF, 0.03, 0.03), glow(0x6cb6ff, 1.6)); g.add(this.energyLine);
    this.bridge = g; this.scene.add(g);
    this.setBarrier({ L: 2, V: 1, E: 0.5 });
  }

  // Barrier of width L (sim units) and height V, energy marker at E (same units as V).
  setBarrier({ L, V, E, widthMetres }) {
    this._barrierKey = null;
    const w = widthMetres ?? Math.max(0.15, L * SCALE);
    this.barrier.scale.set(w, 1, 1); this.barrierEdges.scale.set(w, 1, 1);
    this.barrier.position.set(0, BARRIER_H / 2, 0); this.barrierEdges.position.copy(this.barrier.position);
    this.energyLine.position.set(0, Math.min((E / V) * BARRIER_H, BARRIER_H * 1.5), 0);
    this._placeEnergyLabel();
  }

  _buildWave() {
    const N = 200;
    this.waveN = N;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array((N + 1) * 2 * 3), col = new Float32Array((N + 1) * 2 * 3), idx = [];
    for (let i = 0; i <= N; i++) {
      const x = -BRIDGE_HALF + (2 * BRIDGE_HALF * i) / N;
      pos.set([x, 0.02, 0, x, 0.02, 0], i * 6);
      col.set([0.1, 0.35, 0.9, 0.5, 0.95, 1.0], i * 6);
      if (i < N) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setIndex(idx);
    this.curtain = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false }));
    this.scene.add(this.curtain);
    // real part of the wavefunction as a thin line (shows the phase and the exponential decay)
    const lg = new THREE.BufferGeometry();
    lg.setAttribute('position', new THREE.BufferAttribute(new Float32Array((N + 1) * 3), 3));
    this.reLine = new THREE.Line(lg, new THREE.LineBasicMaterial({ color: 0xffffff }));
    this.reLine.frustumCulled = false; this.curtain.frustumCulled = false;
    this.scene.add(this.reLine);
  }


  // Floating legend labels that explain every object in the room (toggle with L, always on in the tutorial).
  _buildLabels() {
    this.labels = [];
    const add = (key, lines, x, y, z, size) => {
      const s = textSprite(lines, size); s.position.set(x, y, z); s.visible = false; this.scene.add(s); this.labels.push(s); this[`label_${key}`] = s; return s;
    };
    add('emitter', ['Emitter', 'launches the electron wave packet'], -BRIDGE_HALF - 0.6, 3.1, 0, { w: 520, h: 130 });
    add('detector', ['Detector', 'collects what gets through'], BRIDGE_HALF + 0.9, 3.2, 0, { w: 460, h: 130 });
    add('barrier', ['Barrier: height $V_0$, width $L$', 'classically forbidden if $E<V_0$'], 0, BARRIER_H + 0.7, 0, { w: 600, h: 130 });
    add('energy', ['$E$ = particle energy'], -BRIDGE_HALF * 0.3, 1.0, 0, { w: 420, h: 84 });
    add('density', ['$|\\Psi|^2$ = probability density', 'area under it = probability'], -BRIDGE_HALF * 0.55, 5.6, 0, { w: 580, h: 130 });
    add('wave', ['$\\mathrm{Re}\\,\\Psi$ = the oscillating wave', 'wavelength $\\lambda=h/p$'], BRIDGE_HALF * 0.55, 4.9, 0, { w: 600, h: 130 });
    this.labelsOn = false;
  }
  focusLabel(key) { for (const s of this.labels) s.material.opacity = !key || s === this[`label_${key}`] ? 1 : 0.28; }
  setLabelsVisible(on) { this.labelsOn = on; for (const s of this.labels) s.visible = on && this.bridgeVisible !== false; this._placeEnergyLabel(); }
  _placeEnergyLabel() { if (this.label_energy) this.label_energy.position.y = this.energyLine.position.y + 0.45; if (this.label_barrier) this.label_barrier.position.y = BARRIER_H + 0.7; }

  setSim(sim) { // a replay with the same barrier must not rebuild meshes and label textures (that caused a visible hitch)
    this.sim = sim; const key = `${sim.L}|${sim.V0}|${sim.E}`;
    if (key !== this._barrierKey) { this.setBarrier({ L: sim.L, V: sim.V0, E: sim.E }); this._barrierKey = key; }
    this.updateWave();
  }

  // flat curtain (no packet), used while a calculation terminal is open
  clearSim() { this.sim = null; this.updateWave(); }

  updateWave() {
    const N = this.waveN, pos = this.curtain.geometry.attributes.position, rl = this.reLine.geometry.attributes.position;
    const s = this.sim;
    for (let i = 0; i <= N; i++) {
      let h = 0, re = 0;
      if (s) {
        const simX = -SIM_VIEW + (2 * SIM_VIEW * i) / N;
        const j = Math.min(s.N - 1, Math.max(0, Math.round((simX + s.xmax) / s.dx - 0.5)));
        h = Math.min(1.15, s.density(j) / 0.08) * 3.4;
        re = Math.max(-1, Math.min(1, s.re[j] / 0.27));
      }
      pos.setY(i * 2 + 1, 0.05 + h);
      rl.setXYZ(i, -BRIDGE_HALF + (2 * BRIDGE_HALF * i) / N, 1.8 + re * 1.1, 0.0);
    }
    pos.needsUpdate = true; rl.needsUpdate = true;
  }

  _buildDoor() {
    const g = new THREE.Group(); g.position.set(16.7, 0, 7.6);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4.6, 4.2), flat(0x2a3652)); g.add(frame);
    this.doorL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.8, 1.9), flat(0x5a2430)); this.doorL.position.set(-0.3, 1.9, -1.0); g.add(this.doorL);
    this.doorR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.8, 1.9), flat(0x5a2430)); this.doorR.position.set(-0.3, 1.9, 1.0); g.add(this.doorR);
    this.doorLight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 3.9), glow(0xff4040, 1.6)); this.doorLight.position.set(-0.5, 4.0, 0); g.add(this.doorLight);
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.1), new THREE.MeshBasicMaterial({ map: labelTexture(['NEXT LAB', 'Hydrogen Lamp (coming soon)'], { w: 512, h: 190 }) }));
    sign.rotation.y = -Math.PI / 2; sign.position.set(-0.5, 3.2, 0); g.add(sign); this.doorSign = sign;
    this.door = g; this.doorOpen = 0; this.doorTarget = 0; this.scene.add(g);
    this.interactables.push({ id: 'door', type: 'door', pos: new THREE.Vector3(15.6, 0, 7.6), radius: 1.2 });
  }

  setDoorOpen(open) { this.doorTarget = open ? 1 : 0; this.doorLight.material.emissive.set(open ? 0x40ff90 : 0xff4040); }

  _buildPortal() {
    const g = new THREE.Group(); g.position.set(-14.5, 1.4, 7.6);
    this.portalRing = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.1, 8, 24), glow(0xffc24b, 1.4)); this.portalRing.rotation.y = Math.PI / 2; g.add(this.portalRing);
    this.portalDisc = new THREE.Mesh(new THREE.CircleGeometry(0.95, 24), new THREE.MeshBasicMaterial({ color: 0x402a00, transparent: true, opacity: 0.55, side: THREE.DoubleSide })); this.portalDisc.rotation.y = Math.PI / 2; g.add(this.portalDisc);
    this.portalSign = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.8), new THREE.MeshBasicMaterial({ map: labelTexture(['REVIEW PORTAL', 'respawns due: 0'], { w: 512, h: 170 }), transparent: true }));
    this.portalSign.position.set(0.05, 1.9, 0); this.portalSign.rotation.y = Math.PI / 2; g.add(this.portalSign);
    this.portal = g; this.scene.add(g);
    this.interactables.push({ id: 'portal', type: 'portal', pos: new THREE.Vector3(-14.5, 0, 7.6), radius: 1.0 });
  }

  setPortalDue(n) {
    this.portalSign.material.map = labelTexture(['REVIEW PORTAL', n ? `${n} respawn${n > 1 ? 's' : ''} due: enter` : 'no respawns due'], { w: 512, h: 170, accent: n ? '#ffb347' : '#ffd86b' });
    this.portalSign.material.needsUpdate = true;
    this.portalDisc.material.opacity = n ? 0.85 : 0.35;
  }

  // One terminal per encounter. spec: { id, label, x, locked, status }
  addTerminal(spec, x, title) {
    const g = new THREE.Group(); g.position.set(x, 0, TERMINAL_Z);
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.7, 0.6), flat(0x252f45)); base.position.y = 0.35; g.add(base);
    const screenMat = new THREE.MeshBasicMaterial({ map: labelTexture([title, 'new']) });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.06), screenMat);
    screen.position.set(0, 1.05, 0.12); screen.rotation.x = -0.75; g.add(screen); // tilted towards the player (+z), seen from above
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.1), flat(0x3b4a66)); post.position.y = 0.7; g.add(post);
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.04, 6, 20), glow(0x58b6ff, 1.0)); halo.rotation.x = Math.PI / 2; halo.position.set(0, 0.03, 0.55); g.add(halo);
    this.scene.add(g);
    const it = { id: spec.id, type: 'terminal', spec, group: g, screenMat, halo, title, pos: new THREE.Vector3(x, 0, TERMINAL_Z), radius: 0.9 };
    this.interactables.push(it);
    return it;
  }

  setTerminalStatus(it, status, locked, caption) {
    const color = locked ? '#ff8a8a' : status === 'review' ? '#ffb347' : status === 'done' ? '#7dffb0' : '#9fd8ff';
    const text = caption || (locked ? 'LOCKED' : status === 'review' ? 'RESPAWN: retry' : status === 'done' ? 'DONE' : 'NEW');
    it.screenMat.map?.dispose?.();
    it.screenMat.map = labelTexture([it.title, { text, color }], { fg: color }); it.screenMat.needsUpdate = true;
    it.halo.material.emissive.set(locked ? 0xff4040 : status === 'review' ? 0xffa000 : status === 'done' ? 0x40ff90 : 0x58b6ff);
    it.locked = locked;
  }

  // 'hub' = the Nexus (open space, hall hidden); 'room' = the gallery hall with consoles, door and portal
  setMode(mode) {
    const hub = mode === 'hub';
    this.hall.visible = !hub; this.door.visible = !hub; this.portal.visible = !hub;
    for (const l of this.hallLights) l.visible = !hub;
    for (const it of this.interactables) if (it.group) it.group.visible = !hub;
    this.hemi.intensity = hub ? 0.5 : 0.9;
    this.scene.fog.near = hub ? 40 : 14; this.scene.fog.far = hub ? 190 : 48;
    this.scene.background.set(hub ? 0x02030a : 0x070a12);
    this.hubMode = hub;
  }
  // The QM exhibit (bridge, wave, barrier, labels) is only shown in QM rooms; other courses bring their own set piece.
  setBridgeVisible(vis) {
    this.bridgeVisible = vis;
    for (const o of [this.bridge, this.curtain, this.reLine, this.barrierLight]) if (o) o.visible = vis;
    for (const s of this.labels) s.visible = vis && this.labelsOn;
  }
  resetEnvironment() { this.scene.fog.near = this.hubMode ? 40 : 14; this.scene.fog.far = this.hubMode ? 190 : 48; }
  clearTerminals() {
    for (const it of this.interactables.filter((i) => i.type === 'terminal')) {
      this.scene.remove(it.group); it.group.traverse((o) => { o.geometry?.dispose?.(); o.material?.map?.dispose?.(); o.material?.dispose?.(); });
    }
    this.interactables = this.interactables.filter((i) => i.type !== 'terminal');
  }
  setDoorSign(lines) {
    this.doorSign.material.map?.dispose?.();
    this.doorSign.material.map = labelTexture(lines, { w: 512, h: 190 }); this.doorSign.material.needsUpdate = true;
  }

  failEffect() { this.fx.shake = 1.1; this.fx.flash = 1; this.fx.flashColor.set(0xff3030); }
  successEffect() { this.fx.flash = 1; this.fx.flashColor.set(0x30ff90); }

  update(dt) {
    this.t += dt;
    this.portalRing.rotation.x += dt * 1.5;
    this.portalDisc.rotation.x -= dt * 0.8;
    if (this.bridgeVisible !== false) this.barrierLight.intensity = 8 + Math.sin(this.t * 2) * 1.5;
    // door animation
    this.doorOpen += (this.doorTarget - this.doorOpen) * Math.min(1, dt * 2.5);
    this.doorL.position.z = -1.0 - this.doorOpen * 1.8; this.doorR.position.z = 1.0 + this.doorOpen * 1.8;
    // fail / success feedback: deck + barrier flash, camera shake
    const f = this.fx;
    f.flash = Math.max(0, f.flash - dt * 1.2); f.shake = Math.max(0, f.shake - dt);
    this.deckMat.emissive.copy(f.flashColor).multiplyScalar(f.flash * 0.9);
    this.deckMat.emissiveIntensity = 1;
    for (const it of this.interactables) if (it.halo) { it.halo.rotation.z += dt; it.halo.scale.setScalar(it.guide ? 1.25 + 0.4 * Math.sin(this.t * 4) : 1); }
  }

  render(playerCam) {
    const f = this.fx, c = this.camera;
    c.position.copy(playerCam.position); c.rotation.copy(playerCam.rotation);
    if (f.shake > 0) { const a = f.shake * 0.04; c.position.x += (Math.random() - 0.5) * a; c.position.y += (Math.random() - 0.5) * a; c.rotation.z += (Math.random() - 0.5) * a * 0.5; }
    this.renderer.render(this.scene, c);
  }
}
