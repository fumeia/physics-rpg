import * as THREE from 'three';
import { GALLERY } from './world.js';

// First-person controller: WASD + mouse look (pointer lock), arrow keys also turn (fallback when
// pointer lock is unavailable, e.g. headless tests). Movement is clamped to the gallery and
// pushed out of circular obstacles (terminals).
export class Player {
  constructor(canvas, world) {
    this.canvas = canvas; this.world = world;
    this.camera = new THREE.PerspectiveCamera();
    this.camera.rotation.order = 'YXZ';
    this.pos = new THREE.Vector3(-12, 1.7, 8.0);
    this.yaw = 0; this.pitch = 0; // yaw 0 looks along -z (towards the bridge)
    this.keys = new Set();
    this.enabled = false;
    this.flying = false; // free flight in the Nexus
    this.speed = 4.2;
    // Movement keys are ignored while the player types in a field (answers, search), so the player can
    // walk around with a problem open without the answer box stealing or sending WASD.
    const typing = (t) => !!t && ['INPUT', 'SELECT', 'TEXTAREA'].includes(t.tagName);
    window.addEventListener('keydown', (e) => { if (this.enabled && !typing(e.target) && !e.ctrlKey && !e.metaKey && !e.altKey) this.keys.add(e.code); });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('blur', () => this.keys.clear());
    document.addEventListener('focusin', (e) => { if (typing(e.target)) this.keys.clear(); });
    document.addEventListener('mousemove', (e) => {
      if (!this.enabled) return;
      if (document.pointerLockElement === canvas || this.dragging) {
        const k = (this.dragging ? 0.004 : 0.0022) * (this.sens || 1);
        this.turn = null; this.yaw -= e.movementX * k;
        this.pitch = Math.max(-1.3, Math.min(1.3, this.pitch - e.movementY * k));
      }
    });
    // with a panel open the mouse is free: drag on the 3D view to look around
    canvas.addEventListener('mousedown', (e) => { if (this.enabled && !this.locked && e.button === 0) { this.dragging = true; canvas.style.cursor = 'grabbing'; } });
    window.addEventListener('mouseup', () => { this.dragging = false; canvas.style.cursor = ''; });
    this.apply();
  }
  get locked() { return document.pointerLockElement === this.canvas; }
  lock() { try { const p = this.canvas.requestPointerLock(); if (p && p.catch) p.catch(() => {}); } catch { /* ignore */ } }
  unlock() { if (document.pointerLockElement) document.exitPointerLock(); }
  // Smoothly turn towards a point on the floor plane (used to watch the experiment).
  faceTarget(x, z, pitch = 0.02) {
    const target = Math.atan2(-(x - this.pos.x), -(z - this.pos.z));
    let d = target - this.yaw; d = Math.atan2(Math.sin(d), Math.cos(d));
    this.turn = { yaw: this.yaw + d, pitch };
  }
  teleport(x, z, yaw = 0, pitch = 0, y = 1.7) { this.turn = null; this.pos.set(x, y, z); this.yaw = yaw; this.pitch = pitch; this.apply(); }
  forward() { return new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw)); }

  update(dt) {
    if (this.turn) {
      const k = Math.min(1, dt * 4);
      this.yaw += (this.turn.yaw - this.yaw) * k; this.pitch += (this.turn.pitch - this.pitch) * k;
      if (Math.abs(this.turn.yaw - this.yaw) < 0.002) this.turn = null;
    }
    if (this.enabled) {
      const k = this.keys;
      if (k.has('ArrowLeft')) this.yaw += 1.8 * dt;
      if (k.has('ArrowRight')) this.yaw -= 1.8 * dt;
      if (k.has('ArrowUp')) this.pitch = Math.min(1.3, this.pitch + 1.2 * dt);
      if (k.has('ArrowDown')) this.pitch = Math.max(-1.3, this.pitch - 1.2 * dt);
      const f = (k.has('KeyW') ? 1 : 0) - (k.has('KeyS') ? 1 : 0), s = (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0);
      if (this.flying) {
        // free flight (the Nexus): W/S along the view direction incl. pitch, A/D sideways, Space up, C down
        const up = (k.has('Space') ? 1 : 0) - (k.has('KeyC') ? 1 : 0);
        if (f || s || up) {
          const fw3 = new THREE.Vector3(-Math.sin(this.yaw) * Math.cos(this.pitch), Math.sin(this.pitch), -Math.cos(this.yaw) * Math.cos(this.pitch));
          const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
          const v = fw3.multiplyScalar(f).add(right.multiplyScalar(s)).add(new THREE.Vector3(0, up, 0)).normalize();
          this.pos.addScaledVector(v, 11 * (k.has('ShiftLeft') ? 3 : 1) * dt);
        }
      } else if (f || s) {
        const fw = this.forward(), right = new THREE.Vector3(-fw.z, 0, fw.x); // yaw 0 faces -z, so right is +x
        const v = fw.multiplyScalar(f).add(right.multiplyScalar(s)).normalize().multiplyScalar(this.speed * (k.has('ShiftLeft') ? 1.7 : 1) * dt);
        this.pos.add(v);
      }
    }
    if (this.flying) { const r = this.pos.length(); if (r > 90) this.pos.multiplyScalar(90 / r); } else this.collide();
    this.apply();
  }
  collide() {
    const p = this.pos;
    p.x = Math.max(GALLERY.xmin, Math.min(GALLERY.xmax, p.x));
    p.z = Math.max(GALLERY.zmin + 0.5, Math.min(GALLERY.zmax, p.z));
    for (const it of this.world.interactables) {
      if (it.type !== 'terminal') continue;
      const dx = p.x - it.pos.x, dz = p.z - it.pos.z, d = Math.hypot(dx, dz), r = 0.75;
      if (d < r) { const n = d > 1e-4 ? 1 / d : 0; p.x = it.pos.x + (n ? dx * n : 0) * r; p.z = it.pos.z + (n ? dz * n : 1) * r; }
    }
  }
  apply() {
    this.camera.position.copy(this.pos);
    this.camera.rotation.set(this.pitch, this.yaw, 0);
  }
  // Closest interactable that is near and roughly in front of the player.
  target() {
    const fw = this.forward(); let best = null, bestScore = 0;
    for (const it of this.world.interactables) {
      const dx = it.pos.x - this.pos.x, dz = it.pos.z - this.pos.z, d = Math.hypot(dx, dz);
      if (d > 3.2 + it.radius) continue;
      const dot = d > 1e-3 ? (fw.x * dx + fw.z * dz) / d : 1;
      if (dot < 0.55) continue;
      const score = dot / (1 + d);
      if (score > bestScore) { bestScore = score; best = it; }
    }
    return best;
  }
}
