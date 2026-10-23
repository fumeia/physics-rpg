// Labs as holographic exhibits standing in the hall: the real lab widget, drawn live onto a floating panel.
// Walk up, press E, and the full experiment (sliders, tasks, explanation) opens.
import * as THREE from 'three';
import { LABS } from './labs.js';

const W = 640, H = 340, SLOTS = [[-9.8, 6.7, 0.28], [9.8, 6.7, -0.28]]; // x, z, yaw towards the middle; at the ends of the walkable gallery strip (z 5.5 to 9.5)
const plain = (s) => String(s).replace(/\$/g, '').replace(/\\[a-zA-Z]+/g, '').replace(/[{}]/g, '').trim();

export function buildLabHolos(world, room) {
  const labs = room.encounters.filter((e) => e.type === 'lab' && LABS[e.widget]).slice(0, SLOTS.length);
  const group = new THREE.Group(), holos = [], its = [];
  labs.forEach((enc, i) => {
    const spec = LABS[enc.widget], p = {};
    spec.controls.forEach((c) => { p[c.id] = c.type === 'toggle' ? c.value : c.log ? Math.pow(10, c.value) : c.value; });
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const ctx = cv.getContext('2d'), tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
    const [x, z, yaw] = SLOTS[i], g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = yaw;
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.8), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.92, side: THREE.DoubleSide, depthWrite: false })); panel.position.y = 2.15; g.add(panel);
    const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(3.46, 1.86)), new THREE.LineBasicMaterial({ color: 0x6cd8ff })); frame.position.y = 2.15; g.add(frame);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.03, 6, 32), new THREE.MeshBasicMaterial({ color: 0x6cd8ff })); ring.rotation.x = Math.PI / 2; ring.position.y = 0.05; g.add(ring);
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 1.2, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0x6cd8ff, transparent: true, opacity: 0.07, side: THREE.DoubleSide, depthWrite: false })); beam.position.y = 0.65; g.add(beam);
    group.add(g);
    const it = { id: `labholo:${enc.id}`, type: 'labholo', enc, group: g, pos: new THREE.Vector3(x, 0, z), radius: 1.6 };
    world.interactables.push(it); its.push(it);
    const h = { spec, p, ctx, tex, panel, ring, enc, t: Math.random() * 3, acc: 1 };
    holos.push(h);
  });
  world.scene.add(group);
  const draw = (h, t) => {
    try { h.spec.draw.call(h.spec, h.ctx, h.p, t); } catch { /* a lab that cannot draw with defaults stays blank */ }
    const c = h.ctx; c.fillStyle = 'rgba(8,16,30,.78)'; c.fillRect(0, 0, W, 26); c.fillStyle = '#9fe6ff'; c.font = '600 14px system-ui'; c.textAlign = 'left'; c.fillText(`EXPERIMENT · ${plain(h.enc.title)}`, 10, 18);
    h.tex.needsUpdate = true;
  };
  holos.forEach((h) => draw(h, 0));
  let clock = 0;
  return {
    group, count: holos.length,
    update(dt, playerPos) {
      clock += dt;
      for (const h of holos) {
        h.ring.rotation.z += dt * 0.6; h.panel.position.y = 2.15 + 0.05 * Math.sin(clock * 1.3 + h.t);
        h.acc += dt; const near = !playerPos || Math.hypot(h.panel.parent.position.x - playerPos.x, h.panel.parent.position.z - playerPos.z) < 14;
        if (near && h.acc > (h.spec.animated ? 0.1 : 1.5)) { h.acc = 0; draw(h, clock); }
      }
    },
    dispose() { world.scene.remove(group); for (const it of its) world.interactables.splice(world.interactables.indexOf(it), 1); group.traverse((o) => { o.geometry?.dispose?.(); o.material?.map?.dispose?.(); o.material?.dispose?.(); }); },
  };
}
