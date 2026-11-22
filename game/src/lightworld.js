// Light theme for the 3D world (nexus and rooms): its own palette instead of an inverted dark scene.
// The world code builds everything for the dark look; in light mode every material is restyled once when it first appears
// (world.update walks the scene twice a second, a material is touched only once):
//   - lit surfaces (floors, walls, consoles): dark colours become pale, slightly tinted versions of the same hue
//   - glowing / additive things (particles, beams, halos, lines): drawn normally (additive light is invisible on white) and
//     darkened to an ink of the same hue, so they read like a drawing on paper
//   - emissive glow is toned down (a glowing object on a bright floor looks washed out)
// Text sprites (canvas textures with their own dark panel) are left alone: they read like cards on the light floor.
import * as THREE from 'three';

export const LIGHT = {
  sky: 0xeef2f8, // nexus: pale morning sky
  room: 0xf4f1ea, // rooms: warm paper
  hemiSky: 0xffffff, hemiGround: 0xcfc8b8,
};
const done = new WeakSet();
const hsl = { h: 0, s: 0, l: 0 };

function pale(c) { // surfaces: keep the hue, lift the lightness
  c.getHSL(hsl); c.setHSL(hsl.h, Math.min(0.35, hsl.s * 0.7), 0.72 + 0.22 * hsl.l);
}
function ink(c) { // marks on paper: keep the hue, a saturated mid-dark tone; white/grey becomes slate
  c.getHSL(hsl);
  if (hsl.s < 0.12) c.setHSL(0.6, 0.25, 0.32); else c.setHSL(hsl.h, Math.min(0.85, hsl.s * 1.05 + 0.1), Math.min(0.45, 0.22 + 0.25 * hsl.l));
}

function restyle(m) {
  if (!m || done.has(m)) return; done.add(m);
  if (m.isShaderMaterial || m.isRawShaderMaterial) return;
  const glowing = m.blending === THREE.AdditiveBlending;
  if (glowing) { m.blending = THREE.NormalBlending; m.needsUpdate = true; }
  if (m.isSpriteMaterial) { // soft glow blobs: a tinted ink haze; text sprites (no additive blending) stay as they are
    if (glowing && m.color) { ink(m.color); m.opacity = (m.opacity ?? 1) * 0.55; }
    return;
  }
  if (m.isPointsMaterial || m.isLineBasicMaterial || m.isLineDashedMaterial) {
    if (m.vertexColors) m.color?.setRGB(0.42, 0.44, 0.5); // multiplies the per-point colours: darker, same hues
    else if (m.color) ink(m.color);
    return;
  }
  if (m.isMeshBasicMaterial) { // unlit: glow shells, beams, markers
    if (!m.color) return;
    if (glowing || m.transparent) { ink(m.color); if (glowing) m.opacity = Math.min(1, (m.opacity ?? 1) * 0.8); }
    else { m.color.getHSL(hsl); if (hsl.l < 0.3) pale(m.color); else ink(m.color); }
    return;
  }
  if (m.isMeshStandardMaterial || m.isMeshLambertMaterial || m.isMeshPhongMaterial) {
    if (m.color) { m.color.getHSL(hsl); if (hsl.l < 0.45) pale(m.color); }
    if (m.emissive && (m.emissiveIntensity ?? 1) > 0) { m.emissiveIntensity = (m.emissiveIntensity ?? 1) * 0.35; }
  }
}

export function lightify(root) {
  root.traverse((o) => { const m = o.material; if (Array.isArray(m)) m.forEach(restyle); else restyle(m); });
}
