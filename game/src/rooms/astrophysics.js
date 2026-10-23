import * as THREE from 'three';
import { mathTexture } from '../mathtex.js';

// Astro "Observatory Ship" set pieces. buildRoom(world, room) replaces the QM bridge with a physics-driven
// exhibit for the room (in the area in front of the gallery, x in [-14, 14], z in [-7, 4]) and returns
// { update(dt) } for animation. Every visual is computed from the formulas taught in that room.

const flat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, metalness: 0.1, ...extra });
const glow = (color, intensity = 1.2, extra = {}) => new THREE.MeshStandardMaterial({ color: 0x000000, emissive: color, emissiveIntensity: intensity, ...extra });

// ---------- physics helpers (exported for tests) ----------
const h = 6.62607015e-34, c = 2.99792458e8, kB = 1.380649e-23;
export const planck = (lambda, T) => (2 * h * c * c / lambda ** 5) / Math.expm1(h * c / (lambda * kB * T));
// Colour of a blackbody: sample B_λ at red, green and blue wavelengths, normalise to the brightest channel.
export function blackbodyColor(T) {
  const rgb = [610e-9, 550e-9, 465e-9].map((l) => planck(l, T));
  const m = Math.max(...rgb);
  return new THREE.Color(...rgb.map((v) => Math.pow(v / m, 0.8)));
}
// Binding energy per nucleon (MeV): measured values for the light nuclei (the liquid-drop model fails there),
// the Weizsäcker semi-empirical mass formula (without the pairing term, i.e. a smooth average) for A > 12.
const LIGHT = { 2: 1.112, 3: 2.573, 4: 7.074, 6: 5.333, 7: 5.606, 9: 6.463, 10: 6.475, 11: 6.928, 12: 7.680 };
export function bindingPerNucleon(A) {
  if (A <= 12) return LIGHT[A] ?? (LIGHT[A - 1] + LIGHT[A + 1]) / 2;
  const Z = Math.round(A / (2 + 0.0153 * A ** (2 / 3)));
  const N = A - Z;
  const B = 15.75 * A - 17.8 * A ** (2 / 3) - 0.711 * Z * (Z - 1) / A ** (1 / 3) - 23.7 * (N - Z) ** 2 / A;
  return B / A;
}
// White-dwarf mass–radius relation (Nauenberg 1972 fit to Chandrasekhar's models), R in units of 0.0112 R_sun (μe = 2).
export const wdRadius = (m, mch = 1.44) => (m >= mch ? 0 : Math.pow(m / mch, -1 / 3) * Math.sqrt(1 - Math.pow(m / mch, 4 / 3)));

function label(lines, size, { color = '#9fd8ff', accent = '#ffd86b' } = {}) {
  if (typeof document === 'undefined') return new THREE.MeshBasicMaterial({ color: 0x0b1a2b });
  const w = Math.round(size[0] * 170), hh = Math.round(size[1] * 170), n = lines.length;
  const visible = (t) => String(typeof t === 'string' ? t : t.text).replace(/\\[A-Za-z]+/g, 'x').replace(/[${}^_]/g, '');
  const maxChars = Math.max(...lines.map((l) => visible(l).length));
  const small = Math.max(14, Math.min(34, Math.floor((hh - 44) / (n * 1.45)), Math.floor((w - 52) / (0.5 * maxChars))));
  const tex = mathTexture(lines, { w, h: hh, bg: 'rgba(11,26,43,0.9)', fg: color, accent, border: color, size: Math.round(small * 1.25), small });
  return new THREE.MeshBasicMaterial({ map: tex, transparent: true });
}
function sign(group, lines, pos, size0 = [4, 1.25]) {
  const size = size0.map((v) => v * 1.3); // bigger panels: the typeset formulas must be readable from the gallery
  const m = new THREE.Mesh(new THREE.PlaneGeometry(...size), label(lines, size));
  m.position.copy(pos); group.add(m); return m;
}
function points(positions, colors, size = 0.08) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
  if (colors) g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
  return new THREE.Points(g, new THREE.PointsMaterial({ size, vertexColors: !!colors, color: colors ? 0xffffff : 0x9fd8ff, transparent: true, opacity: 0.9, depthWrite: false }));
}
const rng = (seed) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

// ---------- set pieces ----------
const PIECES = {
  // Spectral sequence O B A F G K M: colour from Planck, size from main-sequence scaling R ∝ M^{1/2}, M ∝ T^2.
  'astro-photometry-radiation'(g) {
    const classes = [['O', 40000], ['B', 20000], ['A', 9000], ['F', 7000], ['G', 5800], ['K', 4500], ['M', 3200]];
    const stars = classes.map(([cl, T], i) => {
      const R = Math.min(1.6, Math.max(0.35, 0.7 * (T / 5800))); // R ∝ T on the MS (R ∝ M^{1/2}, M ∝ T^2)
      const s = new THREE.Mesh(new THREE.IcosahedronGeometry(R, 2), new THREE.MeshBasicMaterial({ color: blackbodyColor(T) }));
      s.position.set(-12 + i * 4, 2.6, -3); g.add(s);
      sign(g, [`${cl}  ${T} K`, `$\\lambda_{\\max}$ ${(2.898e-3 / T * 1e9).toFixed(0)} nm`], new THREE.Vector3(-12 + i * 4, 0.6, -2.2), [3.2, 1.0]);
      return s;
    });
    sign(g, ['SPECTRAL SEQUENCE', 'colour = Planck $B_\\lambda(T)$ sampled at 610/550/465 nm', 'size $\\propto R\\propto T$ on the main sequence'], new THREE.Vector3(0, 5.6, -5), [9, 2.2]);
    return (t) => stars.forEach((s, i) => s.scale.setScalar(1 + 0.03 * Math.sin(t * 2 + i)));
  },

  // A beam crossing slabs of optical depth 0.5 each: segment brightness e^{-τ}.
  'astro-radiative-transfer'(g, world) {
    if (world.scene.fog) world.scene.fog.near = 6;
    const src = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 12), glow(0xfff2c0, 2.2)); src.position.set(-13, 2.5, -2); g.add(src);
    const segs = [];
    for (let k = 0; k <= 6; k++) {
      const tau = 0.5 * k, I = Math.exp(-tau);
      const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 3.4, 10), glow(0xffe08a, 2.2 * I, { transparent: true, opacity: 0.25 + 0.75 * I }));
      seg.rotation.z = Math.PI / 2; seg.position.set(-11 + k * 3.8, 2.5, -2); g.add(seg); segs.push(seg);
      if (k < 6) {
        const slab = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.5, 3.5), new THREE.MeshStandardMaterial({ color: 0x8090a8, transparent: true, opacity: 0.22, roughness: 1 }));
        slab.position.set(-9.1 + k * 3.8, 2.5, -2); g.add(slab);
        sign(g, [`$\\tau = ${(tau + 0.5).toFixed(1)}$`, `$I/I_0 = ${Math.exp(-(tau + 0.5)).toFixed(2)}$`], new THREE.Vector3(-9.1 + k * 3.8, 5.0, -2), [2.4, 0.8]);
      }
    }
    sign(g, ['THE FOG CHAMBER', '$dI/d\\tau=-I+S$, here $S=0$: $I=I_0e^{-\\tau}$'], new THREE.Vector3(0, 0.75, 1.5), [11, 1.3]);
    return (t) => segs.forEach((s, k) => { s.material.emissiveIntensity = 2.2 * Math.exp(-0.5 * k) * (0.92 + 0.08 * Math.sin(t * 3 - k)); });
  },

  // Cutaway of a constant-density star: shells coloured by T(r) = T_c (1 − r²/R²) (HS24 winter Q1), core burning ∝ T⁴.
  'astro-stellar-forge'(g) {
    const Tc = 1.5e7, shells = [];
    for (let i = 6; i >= 1; i--) {
      const r = i / 6, T = Math.max(5800, Tc * (1 - r * r + 1 / 36));
      const m = new THREE.Mesh(new THREE.SphereGeometry(3.6 * r, 24, 16, 0, Math.PI * 1.5), new THREE.MeshStandardMaterial({ color: 0x000000, emissive: blackbodyColor(3000 + 9000 * T / Tc), emissiveIntensity: 0.4 + 1.6 * (1 - r * r) ** 4, side: THREE.DoubleSide, flatShading: true }));
      m.position.set(0, 3.2, -3); m.rotation.y = Math.PI * 0.75; g.add(m); shells.push(m);
    }
    sign(g, ['STELLAR FORGE', '$dP/dr=-GM_r\\rho/r^2$', '$T(r)=\\frac{\\pi}{3}\\frac{m_HG\\rho}{k_B}(R^2-r^2)$, $\\varepsilon\\propto T^4$', 'colour scale: $T(r)/T_c$ (red edge to white core)'], new THREE.Vector3(9, 3.6, -3), [7, 2.6]);
    return (t) => shells.forEach((s, i) => { s.rotation.y += 0.002 * (i + 1); s.scale.setScalar(1 + 0.01 * Math.sin(t * 1.5 + i)); });
  },

  // Binding energy per nucleon from the semi-empirical mass formula, plus the He-4 spike (7.07 MeV, not in the SEMF).
  'astro-nuclear-furnace'(g) {
    const pts = [], col = [];
    for (let A = 2; A <= 240; A++) {
      const f = bindingPerNucleon(A);
      pts.push(-13 + (A / 240) * 26, 0.3 + f * 0.5, -3);
      const fus = A < 56; col.push(fus ? 1 : 0.4, fus ? 0.7 : 0.6, fus ? 0.3 : 1);
    }
    const curve = new THREE.Line(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3)).setAttribute('color', new THREE.BufferAttribute(new Float32Array(col), 3)), new THREE.LineBasicMaterial({ vertexColors: true }));
    g.add(curve);
    const he = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8), glow(0xffe08a, 2)); he.position.set(-13 + (4 / 240) * 26, 0.3 + 7.07 * 0.5, -3); g.add(he);
    const fe = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 8), glow(0xff5050, 2)); fe.position.set(-13 + (56 / 240) * 26, 0.3 + 8.79 * 0.5, -3); g.add(fe);
    const axis = new THREE.Mesh(new THREE.BoxGeometry(26.5, 0.05, 0.05), flat(0x58b6ff)); axis.position.set(0, 0, -3); g.add(axis);
    sign(g, ['BINDING ENERGY PER NUCLEON', 'fusion releases energy (left) | fission releases energy (right)', 'peak $\\approx8.8$ MeV at ${}^{56}$Fe, ${}^{4}$He spike 7.1 MeV'], new THREE.Vector3(3, 6.6, -5), [11, 2.2]);
    sign(g, ['${}^{56}$Fe  8.8 MeV'], new THREE.Vector3(-13 + (56 / 240) * 26, 5.5, -2.8), [2.6, 0.6]);
    sign(g, ['${}^{4}$He  7.1 MeV'], new THREE.Vector3(-11.4, 4.6, -2.8), [2.6, 0.6]);
    return (t) => { fe.scale.setScalar(1 + 0.15 * Math.sin(t * 3)); he.scale.setScalar(1 + 0.15 * Math.sin(t * 3 + 1)); };
  },

  // Pulsar (rotating beams around a tilted magnetic axis) and the white-dwarf mass–radius curve ending at M_Ch.
  'astro-degenerate-matter'(g) {
    const ns = new THREE.Group(); ns.position.set(-6, 3, -3); g.add(ns);
    ns.add(new THREE.Mesh(new THREE.SphereGeometry(0.6, 20, 14), glow(0xbfe3ff, 1.8)));
    const beamGeo = new THREE.ConeGeometry(0.9, 7, 16, 1, true); beamGeo.translate(0, -3.5, 0);
    const mag = new THREE.Group(); mag.rotation.z = 0.5; ns.add(mag);
    for (const s of [1, -1]) { const b = new THREE.Mesh(beamGeo, glow(0x7dffb0, 1.2, { transparent: true, opacity: 0.25, side: THREE.DoubleSide, depthWrite: false })); b.rotation.x = s > 0 ? Math.PI : 0; mag.add(b); }
    const pts = [];
    for (let m = 0.2; m < 1.44; m += 0.01) pts.push(new THREE.Vector3(2 + m * 6, 0.6 + wdRadius(m) * 2.6, -3));
    pts.push(new THREE.Vector3(2 + 1.44 * 6, 0.6, -3));
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xffd86b })));
    const ax = new THREE.LineBasicMaterial({ color: 0x58b6ff });
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(2, 4.4, -3), new THREE.Vector3(2, 0.6, -3), new THREE.Vector3(11.3, 0.6, -3)]), ax));
    sign(g, ['$M/M_\\odot\\to$  (0 … 1.44)'], new THREE.Vector3(7.5, 0.15, -3), [3.6, 0.5]);
    sign(g, ['$R\\uparrow$'], new THREE.Vector3(1.4, 4.2, -3), [0.9, 0.5]);
    sign(g, ['WHITE DWARFS: $R\\propto M^{-1/3}$ …', '… until $R\\to0$ at $M_{Ch}\\approx1.44\\,M_\\odot$'], new THREE.Vector3(7, 6.2, -3), [7, 1.4]);
    sign(g, ['PULSAR', '$P_{\\min}=2\\pi\\sqrt{R^3/GM}\\approx0.5$ ms'], new THREE.Vector3(-6, 6.4, -3), [5, 1.2]);
    return (t, dt) => { ns.rotation.y += dt * 3.2; };
  },

  // Strömgren sphere: ionised bubble (radius ∝ (N_γ/n²)^{1/3}) inside a neutral cloud.
  'astro-interstellar-medium'(g) {
    const r = rng(7), pos = [], col = [];
    for (let i = 0; i < 3500; i++) {
      const v = new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).multiplyScalar(13); if (v.length() > 6.5) continue;
      const ion = v.length() < 3; pos.push(v.x, v.y + 3, v.z - 3); col.push(ion ? 1 : 0.3, ion ? 0.3 : 0.45, ion ? 0.4 : 0.85);
    }
    g.add(points(pos, col, 0.09));
    const star = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 12), glow(blackbodyColor(40000), 2.4)); star.position.set(0, 3, -3); g.add(star);
    const front = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 20), new THREE.MeshBasicMaterial({ color: 0xff4060, transparent: true, opacity: 0.18, depthWrite: false })); front.position.copy(star.position); g.add(front);
    sign(g, ['STRÖMGREN SPHERE', '$R_s=\\left(\\frac{3N_\\gamma}{4\\pi\\alpha n^2}\\right)^{1/3}$', 'red: HII (H$\\alpha$), blue: neutral HI'], new THREE.Vector3(10, 3.5, -3), [6.5, 2.0]);
    return (t) => { front.material.opacity = 0.16 + 0.04 * Math.sin(t * 2); };
  },

  // Disk galaxy with a flat rotation curve: v = v0 r/√(r² + rc²), so ω = v/r falls with r and arms wind up.
  'astro-galactic-dynamics'(g) {
    const r = rng(3), N = 4000, R = [], phi0 = [], pos = new Float32Array(N * 3), col = [];
    for (let i = 0; i < N; i++) {
      const rad = 0.3 + 6 * Math.sqrt(r()); const arm = (i % 2) * Math.PI;
      R.push(rad); phi0.push(arm + rad * 0.9 + (r() - 0.5) * 0.6);
      const b = 1 - rad / 7; col.push(0.6 + 0.4 * b, 0.7 + 0.2 * b, 1);
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(col), 3));
    const gal = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.08, vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false }));
    gal.position.set(0, 3, -3); gal.rotation.x = -1.0; g.add(gal);
    const bulge = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 12), glow(0xffe8b0, 1.5)); bulge.position.copy(gal.position); g.add(bulge);
    sign(g, ['FLAT ROTATION CURVE', '$v_c\\approx\\mathrm{const}\\Rightarrow M_r\\propto r,\\ \\rho\\propto r^{-2}$', '$\\omega=v/r$: inner stars lap the outer ones'], new THREE.Vector3(10, 4.5, -3), [6.5, 2.0]);
    let time = 0;
    return (t, dt) => {
      time += dt;
      for (let i = 0; i < N; i++) { const v = 1.0 * R[i] / Math.sqrt(R[i] ** 2 + 0.8); const ph = phi0[i] + (v / R[i]) * time * 0.4; pos[i * 3] = R[i] * Math.cos(ph); pos[i * 3 + 1] = R[i] * Math.sin(ph); pos[i * 3 + 2] = 0; }
      geo.attributes.position.needsUpdate = true;
    };
  },

  // AGN: accretion disk coloured by T ∝ r^{-3/4}, two jets, a blob moving out along the jet (superluminal demo).
  'astro-active-galaxies'(g) {
    const agn = new THREE.Group(); agn.position.set(-2, 3, -3); agn.rotation.z = 0.35; g.add(agn);
    agn.add(new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 12), new THREE.MeshBasicMaterial({ color: 0x000000 })));
    for (let k = 0; k < 12; k++) {
      const r1 = 0.5 + k * 0.28, T = 3e4 * Math.pow(r1 / 0.5, -0.75); // shape T ∝ r^{-3/4}, scaled into the visible range
      const ring = new THREE.Mesh(new THREE.RingGeometry(r1, r1 + 0.27, 48), glow(blackbodyColor(T), 1.4, { side: THREE.DoubleSide }));
      ring.rotation.x = Math.PI / 2; agn.add(ring);
    }
    const jetGeo = new THREE.CylinderGeometry(0.08, 0.35, 7, 12, 1, true);
    for (const s of [1, -1]) { const j = new THREE.Mesh(jetGeo, glow(0x9fb8ff, 1.1, { transparent: true, opacity: 0.35, side: THREE.DoubleSide })); j.position.y = s * 3.6; if (s < 0) j.rotation.x = Math.PI; agn.add(j); }
    const blob = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 8), glow(0xffffff, 2.5)); agn.add(blob);
    sign(g, ['QUASAR ENGINE', '$L=\\eta\\dot Mc^2,\\ \\eta\\approx0.1$', 'disk $T\\propto r^{-3/4}$ (colours scaled), $v_\\perp=\\frac{v\\sin\\theta}{1-\\beta\\cos\\theta}$'], new THREE.Vector3(8, 3.5, -3), [7, 2.0]);
    return (t, dt) => { agn.rotation.y += dt * 0.3; blob.position.y = 0.6 + ((t * 1.5) % 6.5); };
  },

  // Hubble flow: a lattice of galaxies whose separations scale with a(t) ∝ t^{2/3} (matter era), looping.
  'astro-expanding-universe'(g) {
    const base = [], r = rng(11);
    for (let i = -3; i <= 3; i++) for (let j = -1; j <= 1; j++) for (let k = -2; k <= 2; k++) base.push(new THREE.Vector3(i * 1.6 + (r() - 0.5) * 0.4, j * 1.4 + (r() - 0.5) * 0.4, k * 1.3 + (r() - 0.5) * 0.4));
    const gal = base.map((b) => { const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.12), glow(0xffe0b0, 1.6)); g.add(m); return m; });
    const center = new THREE.Vector3(0, 3, -3);
    sign(g, ['HUBBLE FLOW', '$r=a(t)x,\\ v=\\frac{\\dot a}{a}r=Hr$', 'matter era: $a\\propto t^{2/3}$'], new THREE.Vector3(0, 6.0, -4.5), [8, 1.9]);
    return (t) => {
      const tau = 0.15 + ((t * 0.12) % 1); const a = Math.pow(tau, 2 / 3) * 1.3;
      gal.forEach((m, i) => m.position.copy(base[i]).multiplyScalar(a).add(center));
    };
  },

  // CMB sky: inside a sphere with δT/T ~ 1e-5 anisotropies, shown with a strongly stretched colour scale.
  'astro-early-universe'(g) {
    const W = 256, H = 128;
    let mat;
    if (typeof document !== 'undefined') {
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const ctx = cv.getContext('2d'); const img = ctx.createImageData(W, H);
      const r = rng(5), waves = Array.from({ length: 60 }, () => [r() * 8 + 1, r() * 6 + 1, r() * 6.28, r() * 6.28, (r() - 0.5)]);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        let d = 0; const u = (x / W) * 6.283, v = (y / H) * 3.1416;
        for (const [kx, ky, p1, p2, amp] of waves) d += amp * Math.sin(kx * u + p1) * Math.sin(ky * v + p2);
        const s = Math.max(-1, Math.min(1, d / 3)), o = (y * W + x) * 4;
        img.data[o] = 128 + 127 * Math.max(0, s); img.data[o + 1] = 90 + 60 * (1 - Math.abs(s)); img.data[o + 2] = 128 + 127 * Math.max(0, -s); img.data[o + 3] = 255;
      }
      ctx.putImageData(img, 0, 0); const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
      mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.FrontSide });
    } else mat = new THREE.MeshBasicMaterial({ color: 0x402030, side: THREE.BackSide });
    const sky = new THREE.Mesh(new THREE.SphereGeometry(3.4, 48, 24), mat); sky.position.set(-2, 3.6, -3); g.add(sky);
    sign(g, ['LAST SCATTERING SURFACE', '$T_0=2.725$ K, $\\delta T/T\\sim10^{-5}$ (colour scale stretched $\\times10^5$)', '$z\\approx1100$, $t\\approx380\\,000$ yr'], new THREE.Vector3(8.5, 3.6, -3), [7, 2.0]);
    return (t, dt) => { sky.rotation.y += dt * 0.05; };
  },

  // Exam hall: rows of desks facing a big clock whose hand sweeps the 45-minute multiple-choice part.
  'astro-exam-hall'(g) {
    for (let i = -3; i <= 3; i++) for (let j = 0; j < 3; j++) {
      const desk = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.9), flat(0x3a4560)); desk.position.set(i * 3.4, 0.8, -1 - j * 2.2); g.add(desk);
      for (const sx of [-0.7, 0.7]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.8, 0.06), flat(0x252f45)); leg.position.set(i * 3.4 + sx, 0.4, -1 - j * 2.2); g.add(leg); }
    }
    const clock = new THREE.Group(); clock.position.set(0, 4.6, -6.5); g.add(clock);
    clock.add(new THREE.Mesh(new THREE.CircleGeometry(1.4, 48), flat(0xe8eef8)));
    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.2, 0.05), flat(0xc03040)); hand.geometry.translate(0, 0.55, 0.03); clock.add(hand);
    sign(g, ['EXAMINATION HALL', '15 MC × 3 pt (45 min) + 7 open questions ≈ 110 pt', '4 A4 pages of notes, calculator, constants table'], new THREE.Vector3(7.5, 4.6, -6.4), [7, 2.0]);
    return (t) => { hand.rotation.z = -((t / 45) % 1) * Math.PI * 2; };
  },
};

export function buildRoom(world, room) {
  // hide the QM bridge exhibit if this world was built with it
  for (const k of ['bridge', 'curtain', 'reLine']) if (world[k]) world[k].visible = false;
  if (world.barrierLight) world.barrierLight.intensity = 0;
  const g = new THREE.Group(); g.name = `astro-set:${room.id}`;
  const build = PIECES[room.id];
  const update = build ? build(g, world) : null;
  // a starfield behind every astro room
  const r = rng(1), sp = [];
  for (let i = 0; i < 1500; i++) { const v = new THREE.Vector3(r() - 0.5, r() * 0.8, r() - 0.5).normalize().multiplyScalar(40); sp.push(v.x, v.y, v.z - 10); }
  g.add(points(sp, null, 0.12));
  world.scene.add(g);
  let t = 0;
  return { group: g, update(dt) { t += dt; if (update) update(t, dt); } };
}

export const ROOM_IDS = Object.keys(PIECES);
