import * as THREE from 'three';
import { mathTexture } from '../mathtex.js';

// THE NEXUS: the main hub. One galaxy per course, one star per room (ring = progress, beacon = recommended next,
// red pulse = respawn due), curved beams for the connections between topics (pulses travel along them), and a small
// physical exhibit in the core of each galaxy. Fly with WASD / Space / C. Everything is generated from the catalog.
export const STYLE = {
  qm: { color: 0x58b6ff, name: 'QUANTUM MECHANICS', center: [-36, 6, -8], exhibit: ['Ripple tank', 'two coherent sources: $I\\propto|\\psi_1+\\psi_2|^2$'] },
  'solid-state': { color: 0xffa94d, name: 'SOLID STATE PHYSICS', center: [36, 6, -8], exhibit: ['Crystal and Fermi sphere', '$k_F=(3\\pi^2n)^{1/3}$'] },
  astrophysics: { color: 0xb38cff, name: 'ASTROPHYSICS', center: [0, 14, -56], exhibit: ['Flat rotation curve', '$v_c\\approx\\mathrm{const}\\ \\Rightarrow\\ \\omega=v/r$'] },
};
const FALLBACK = { color: 0x9aa6c0, name: '', center: [0, 0, 0], exhibit: ['', ''] };

const glowCache = new Map();
function glowTexture(color) {
  if (glowCache.has(color)) return glowCache.get(color);
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'), col = new THREE.Color(color), rgb = `${Math.round(col.r * 255)},${Math.round(col.g * 255)},${Math.round(col.b * 255)}`;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, `rgba(${rgb},0.95)`); grad.addColorStop(0.25, `rgba(${rgb},0.45)`); grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; glowCache.set(color, t); return t;
}
function textSprite(lines, w, h, ppm, opts = {}) {
  const tex = mathTexture(lines, { w, h, size: opts.size ?? 30, small: opts.small ?? 22, bg: 'rgba(5,10,22,0.82)', border: opts.border ?? '#58b6ff', fg: '#cfe6ff', accent: opts.accent ?? '#ffffff' });
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
  s.scale.set(w / ppm, h / ppm, 1); s.renderOrder = 12; return s;
}
const rng = (seed) => () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;

export function buildNexus(world, { catalog, links, progress, dueRooms = new Set(), recommended = new Set() }) {
  const group = new THREE.Group(); group.name = 'nexus';
  const anim = [], disposables = [];
  const nodes = [], nodeByKey = new Map(), edges = [], crossLinks = [], galaxyDust = [], titles = [];
  const R = rng(7);

  // ---- starfield
  const sp = [], sc = [];
  for (let i = 0; i < 5000; i++) {
    const v = new THREE.Vector3(R() - 0.5, R() - 0.5, R() - 0.5).normalize().multiplyScalar(150 + R() * 100);
    sp.push(v.x, v.y, v.z); const b = 0.35 + R() * 0.65; sc.push(b * 0.8, b * 0.85, b);
  }
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3)); sg.setAttribute('color', new THREE.Float32BufferAttribute(sc, 3));
  group.add(new THREE.Points(sg, new THREE.PointsMaterial({ size: 0.9, vertexColors: true, sizeAttenuation: false, transparent: true, opacity: 0.9, depthWrite: false })));

  // ---- galaxies: core, dust arms, stars (rooms)
  for (const course of catalog) {
    const st = STYLE[course.id] || FALLBACK, C = new THREE.Vector3(...st.center);
    const col = new THREE.Color(st.color);
    // glow core + title
    const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(st.color), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.8 }));
    core.position.copy(C); core.scale.set(26, 26, 1); group.add(core);
    const title = textSprite([st.name || course.region], 520, 84, 70, { size: 34, accent: '#' + col.getHexString(), border: '#' + col.getHexString() });
    title.position.copy(C).add(new THREE.Vector3(0, 11.5, 0)); group.add(title); titles.push({ s: title, base: title.scale.clone() });
    // dust arms
    const dp = [], dc = [];
    for (let i = 0; i < 2600; i++) {
      const arm = i % 3, r = 2 + Math.pow(R(), 0.7) * 30, a = arm * 2.094 + r * 0.22 + (R() - 0.5) * 0.5;
      dp.push(Math.cos(a) * r, (R() - 0.5) * (1.4 + r * 0.06), Math.sin(a) * r);
      const k = 0.5 + R() * 0.5; dc.push(col.r * k + 0.15, col.g * k + 0.15, col.b * k + 0.15);
    }
    const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.Float32BufferAttribute(dp, 3)); dg.setAttribute('color', new THREE.Float32BufferAttribute(dc, 3));
    const dust = new THREE.Points(dg, new THREE.PointsMaterial({ size: 0.16, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }));
    dust.position.copy(C); group.add(dust); galaxyDust.push(dust);
    // rooms as stars along a spiral
    course.rooms.forEach((room, i) => {
      const a = 0.5 + i * 0.95, r = 7 + i * 1.65, pos = C.clone().add(new THREE.Vector3(Math.cos(a) * r, 2.6 * Math.sin(i * 0.8) + i * 0.1, Math.sin(a) * r));
      const frac = progress(room), key = `${course.id}/${room.slug}`;
      const node = { key, course: course.id, room, pos, frac, color: st.color, due: dueRooms.has(key), rec: recommended.has(key), i };
      const size = 0.75 + Math.min(0.5, room.encounters.length / 40);
      node.core = new THREE.Mesh(new THREE.IcosahedronGeometry(size, 1), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.3 + 0.9 * frac, flatShading: true, roughness: 0.5 }));
      node.core.position.copy(pos);
      node.halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(st.color), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.55 + 0.4 * frac }));
      node.halo.position.copy(pos); node.halo.scale.setScalar(4.2 + 3 * frac);
      node.ring = new THREE.Mesh(new THREE.RingGeometry(size * 1.55, size * 1.75, 48, 1, 0, Math.max(0.001, frac * Math.PI * 2)), new THREE.MeshBasicMaterial({ color: frac >= 1 ? 0xffd86b : col, side: THREE.DoubleSide, transparent: true, opacity: 0.95 }));
      node.ring.position.copy(pos);
      const done = Math.round(frac * room.encounters.filter((e) => e.type !== 'sandbox' && !e.book).length), total = room.encounters.filter((e) => e.type !== 'sandbox' && !e.book).length;
      node.label = textSprite([room.title, `${done} / ${total} done${node.due ? ' · respawn due' : ''}`], 470, 112, 105, { border: node.due ? '#ffb347' : '#' + col.getHexString() });
      node.label.position.copy(pos).add(new THREE.Vector3(0, 2.1 + size, 0)); node.labelBase = node.label.scale.clone();
      if (node.due) {
        node.alert = new THREE.Mesh(new THREE.TorusGeometry(size * 2.1, 0.07, 6, 40), new THREE.MeshBasicMaterial({ color: 0xff5a4a, transparent: true, opacity: 0.9 }));
        node.alert.position.copy(pos); group.add(node.alert);
      }
      if (node.rec || node.due) {
        node.beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 18, 8, 1, true), new THREE.MeshBasicMaterial({ color: node.due ? 0xff7a66 : 0xfff2b0, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
        node.beacon.position.copy(pos).add(new THREE.Vector3(0, 9, 0)); group.add(node.beacon);
      }
      group.add(node.core, node.halo, node.ring, node.label);
      nodes.push(node); nodeByKey.set(key, node);
    });
    // path edges inside the course (study order)
    for (let i = 1; i < course.rooms.length; i++) {
      const a = nodeByKey.get(`${course.id}/${course.rooms[i - 1].slug}`), b = nodeByKey.get(`${course.id}/${course.rooms[i].slug}`);
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([a.pos, b.pos]), new THREE.LineBasicMaterial({ color: st.color, transparent: true, opacity: 0.45 }));
      group.add(line); edges.push({ a, b, line });
    }
    // exhibit in the core
    buildExhibit(course.id, group, C, anim, st);
  }

  // ---- cross links (curated links.json + the `links` of room files), only if both rooms exist
  const seen = new Set();
  const addLink = (a, b, title, tex, why, data = null) => {
    if (!a || !b || a === b) return;
    const id = [a.key, b.key].sort().join('|'); if (seen.has(id)) return; seen.add(id);
    const mid = a.pos.clone().add(b.pos).multiplyScalar(0.5); mid.y += a.pos.distanceTo(b.pos) * 0.16 + 3;
    const curve = new THREE.CatmullRomCurve3([a.pos, mid, b.pos]);
    const seg = 64, rad = 6, tube = new THREE.TubeGeometry(curve, seg, 0.07, rad, false);
    const ca = new THREE.Color(a.color), cb = new THREE.Color(b.color), cols = [];
    for (let i = 0; i < tube.attributes.position.count; i++) { const u = Math.floor(i / (rad + 1)) / seg, c = ca.clone().lerp(cb, u); cols.push(c.r, c.g, c.b); }
    tube.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    const mat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false });
    const mesh = new THREE.Mesh(tube, mat); group.add(mesh);
    const marker = new THREE.Mesh(new THREE.OctahedronGeometry(0.4), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.9, flatShading: true }));
    marker.position.copy(curve.getPoint(0.5)); group.add(marker);
    const pulses = [0, 1, 2].map((k) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff })); group.add(m); return { m, t: k / 3 }; });
    crossLinks.push({ a, b, title, tex, why, data, curve, mesh, mat, marker, pulses });
  };
  const resolveKey = (c, r) => nodeByKey.get(`${c}/${r}`);
  for (const l of links) { const [ac, ar] = l.a.split('/'), [bc, br] = l.b.split('/'); addLink(resolveKey(ac, ar), resolveKey(bc, br), l.title, l.tex, l.why, l); }
  for (const course of catalog) for (const room of course.rooms) for (const l of room.links || []) addLink(nodeByKey.get(`${course.id}/${room.slug}`), resolveKey(l.course, l.room), 'Connection', '', l.why, { title: 'Connection', why: l.why });

  // ---- focus / animation
  const state = { focus: null, t: 0 };
  const linked = (node) => crossLinks.filter((l) => l.a === node || l.b === node);
  const neighbours = (node) => linked(node).map((l) => ({ other: l.a === node ? l.b : l.a, link: l }));
  function update(dt, playerPos, camera) {
    state.t += dt; const t = state.t;
    for (const d of galaxyDust) d.rotation.y += dt * 0.015;
    for (const f of anim) f(t, dt);
    // nearest node / link marker
    // labels grow with distance so they stay readable from far away
    for (const t2 of titles) t2.s.scale.copy(t2.base).multiplyScalar(THREE.MathUtils.clamp(t2.s.position.distanceTo(playerPos) / 55, 1, 2.6));
    let fn = null, fd = 9;
    for (const n of nodes) { const d = n.pos.distanceTo(playerPos); if (d < fd) { fd = d; fn = n; } }
    let fl = null, ld = 3.6;
    for (const l of crossLinks) { const d = l.marker.position.distanceTo(playerPos); if (d < ld) { ld = d; fl = l; } }
    state.focus = fl && (!fn || ld < fd * 0.6) ? { link: fl } : fn ? { node: fn } : null;
    const fnode = state.focus?.node, flink = state.focus?.link;
    const nearSet = new Set(); if (fnode) { nearSet.add(fnode); for (const { other } of neighbours(fnode)) nearSet.add(other); } if (flink) { nearSet.add(flink.a); nearSet.add(flink.b); }
    const dim = !!state.focus;
    for (const n of nodes) {
      const on = !dim || nearSet.has(n), s = on && dim ? 1.25 : 1;
      n.core.rotation.y += dt * 0.6; n.core.rotation.x += dt * 0.25;
      n.core.scale.lerp(new THREE.Vector3(s, s, s), Math.min(1, dt * 6));
      n.halo.material.opacity = (on ? 0.55 : 0.18) + 0.4 * n.frac + Math.sin(t * 2 + n.i) * 0.05;
      n.ring.quaternion.copy(camera.quaternion);
      n.label.material.opacity = on ? 1 : 0.3;
      n.label.scale.copy(n.labelBase).multiplyScalar(THREE.MathUtils.clamp(n.pos.distanceTo(playerPos) / 22, 1, 3.6));
      if (n.alert) { n.alert.rotation.x = t * 1.3; n.alert.rotation.y = t * 0.9; n.alert.scale.setScalar(1 + 0.12 * Math.sin(t * 5)); }
      if (n.beacon) n.beacon.material.opacity = 0.35 + 0.25 * Math.sin(t * 2.5);
    }
    for (const e of edges) e.line.material.opacity = !dim ? 0.45 : (nearSet.has(e.a) && nearSet.has(e.b) ? 0.9 : 0.12);
    for (const l of crossLinks) {
      const touch = (fnode && (l.a === fnode || l.b === fnode)) || flink === l;
      l.mat.opacity = !dim ? 0.6 : touch ? 1 : 0.12;
      l.marker.rotation.y += dt * 1.5; l.marker.rotation.x += dt * 0.7;
      l.marker.scale.setScalar(touch ? 1.6 + 0.2 * Math.sin(t * 5) : 1);
      for (const p of l.pulses) { p.t = (p.t + Math.max(0, dt) * 0.11) % 1; p.m.position.copy(l.curve.getPoint(p.t)); p.m.visible = !dim || touch; }
    }
  }
  function dispose() {
    world.scene.remove(group);
    group.traverse((o) => { o.geometry?.dispose?.(); const m = o.material; if (m && !Array.isArray(m)) m.dispose?.(); });
  }
  world.scene.add(group);
  return { group, update, dispose, nodes, links: crossLinks, neighbours, get focus() { return state.focus; }, nodeByKey };
}

// ---------------------------------------------------------------- exhibits in the galaxy cores
function buildExhibit(id, group, C, anim, st) {
  const col = new THREE.Color(st.color);
  const label = textSprite(st.exhibit, 520, 112, 90, { border: '#' + col.getHexString() });
  label.position.copy(C).add(new THREE.Vector3(0, -5.4, 0)); group.add(label);
  if (id === 'qm') {
    // ripple tank: heights from two coherent point sources (interference pattern)
    const N = 64, sp = 0.3, pos = new Float32Array(N * N * 3), colr = new Float32Array(N * N * 3);
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { const k = (i * N + j) * 3; pos[k] = (i - N / 2) * sp; pos[k + 2] = (j - N / 2) * sp; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(colr, 3));
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.16, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
    pts.position.copy(C).add(new THREE.Vector3(0, -2.2, 0)); group.add(pts);
    const kw = 2.4, w = 2.6;
    anim.push((t) => {
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
        const x = (i - N / 2) * sp, z = (j - N / 2) * sp, d1 = Math.hypot(x + 2.2, z), d2 = Math.hypot(x - 2.2, z);
        const h = (Math.cos(kw * d1 - w * t) / Math.sqrt(1 + d1) + Math.cos(kw * d2 - w * t) / Math.sqrt(1 + d2)) * 0.9, k = (i * N + j) * 3;
        pos[k + 1] = h; const b = 0.5 + 0.5 * Math.max(-1, Math.min(1, h / 1.2));
        colr[k] = 0.1 + 0.3 * b; colr[k + 1] = 0.4 + 0.5 * b; colr[k + 2] = 0.8 + 0.2 * b;
      }
      g.attributes.position.needsUpdate = true; g.attributes.color.needsUpdate = true;
    });
  } else if (id === 'solid-state') {
    const lat = new THREE.InstancedMesh(new THREE.SphereGeometry(0.22, 10, 8), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.5 }), 125);
    const holder = new THREE.Group(); holder.position.copy(C); group.add(holder);
    const m4 = new THREE.Matrix4(); let n = 0;
    for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) for (let k = -2; k <= 2; k++) { m4.setPosition(i * 1.3, j * 1.3, k * 1.3); lat.setMatrixAt(n++, m4); }
    holder.add(lat);
    const fermi = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), new THREE.MeshBasicMaterial({ color: 0xffe3a0, wireframe: true, transparent: true, opacity: 0.45 }));
    holder.add(fermi);
    anim.push((t) => { holder.rotation.y = t * 0.25; holder.rotation.x = 0.35; fermi.scale.setScalar(2.4 + 0.25 * Math.sin(t * 1.2)); });
  } else if (id === 'astrophysics') {
    const N = 3200, pos = new Float32Array(N * 3), colr = new Float32Array(N * 3), rr = new Float32Array(N), th = new Float32Array(N), yy = new Float32Array(N);
    for (let i = 0; i < N; i++) { rr[i] = 0.8 + Math.pow(R2(), 0.8) * 7.5; th[i] = R2() * 6.283; yy[i] = (R2() - 0.5) * 0.5 * Math.exp(-rr[i] / 6); const b = 0.5 + 0.5 * R2(); colr.set([0.6 * b + 0.3, 0.45 * b + 0.3, 1 * b], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(colr, 3));
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.13, vertexColors: true, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }));
    pts.position.copy(C); pts.rotation.x = 0.4; group.add(pts);
    anim.push((t) => { for (let i = 0; i < N; i++) { const a = th[i] + 1.7 * t / rr[i]; /* flat rotation curve: v = const, omega = v/r */ pos[i * 3] = Math.cos(a) * rr[i]; pos[i * 3 + 1] = yy[i]; pos[i * 3 + 2] = Math.sin(a) * rr[i]; } g.attributes.position.needsUpdate = true; });
  }
}
const R2 = rng(99);
