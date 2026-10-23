import * as THREE from 'three';
import { mathTexture } from '../mathtex.js';

// Crystal Caverns: one procedural showpiece per solid-state room, shown in the chasm behind the gallery (x in [-9, 9], z in [-6, 0]).
// Contract: buildRoom(world, room) adds a group to world.scene and returns { group, update(dt), dispose() }.
// It only needs world.scene, so it can be smoke-tested in Node (test/scene-check-solid-state.mjs). Engine hook needed: see docs/ENGINE_REQUESTS.md.
const mat = (color, glowing = 0) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.6, metalness: 0.15, emissive: glowing ? color : 0x000000, emissiveIntensity: glowing });
const line = (pts, color, opacity = 1) => new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts.map((p) => new THREE.Vector3(...p))), new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity }));
const ball = (r, color, glowing = 0) => new THREE.Mesh(new THREE.SphereGeometry(r, 12, 8), mat(color, glowing));
const arrow = (color) => { const g = new THREE.Group(); const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 6), mat(color, 0.6)); const tip = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.3, 8), mat(color, 0.6)); tip.position.y = 0.45; g.add(shaft, tip); return g; };

const BUILDERS = {
  // rectangular lattice with a two-atom basis (filled corner, hollow centre), its primitive cell and Wigner-Seitz outline
  'ss-lattice-gate'(g, anim) {
    const a = 1.5, b = 1.0;
    for (let i = -3; i <= 3; i++) for (let j = 0; j <= 3; j++) {
      const A = ball(0.2, 0x58b6ff, 0.4); A.position.set(i * a, 0.8 + j * b, -3); g.add(A);
      const B = ball(0.15, 0xffc24b, 0.4); B.position.set(i * a + a / 2, 0.8 + j * b + b / 2, -3); g.add(B);
    }
    g.add(line([[0, 0.8, -3], [a, 0.8, -3], [a, 0.8 + b, -3], [0, 0.8 + b, -3], [0, 0.8, -3]], 0x7dffb0));
    // reciprocal lattice floating in front (points of spacing 2 pi/a, 2 pi/b scaled down)
    const rec = new THREE.Group(); rec.position.set(0, 2.2, -1.5);
    for (let h = -3; h <= 3; h++) for (let k = -2; k <= 2; k++) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), mat((h + k) % 2 ? 0x555e75 : 0xff8a5b, (h + k) % 2 ? 0 : 0.8)); p.position.set(h * 0.9, k * 0.65, 0); rec.add(p); }
    g.add(rec); anim.push((t) => { rec.rotation.y = Math.sin(t * 0.4) * 0.35; });
  },
  // rock-salt block (Na+ small, Cl- large) next to a Lennard-Jones curve whose marker rolls in the potential well
  'ss-bonding-grotto'(g, anim) {
    const blk = new THREE.Group(); blk.position.set(-3.5, 2, -3);
    for (let x = 0; x < 4; x++) for (let y = 0; y < 4; y++) for (let z = 0; z < 4; z++) { const na = (x + y + z) % 2 === 0; const b = ball(na ? 0.16 : 0.27, na ? 0xb38cff : 0x7dffb0, 0.3); b.position.set((x - 1.5) * 0.6, (y - 1.5) * 0.6, (z - 1.5) * 0.6); blk.add(b); }
    g.add(blk);
    const lj = (r) => 4 * (r ** -12 - r ** -6), pts = [];
    for (let i = 0; i <= 60; i++) { const r = 0.95 + i * 0.03; pts.push([2 + (r - 0.95) * 3, 2.2 + Math.max(-1.2, Math.min(1.2, lj(r))), -3]); }
    g.add(line(pts, 0xffc24b), line([[2, 2.2, -3], [7.5, 2.2, -3]], 0xffffff, 0.3));
    const m = ball(0.12, 0xffffff, 1); g.add(m);
    anim.push((t) => { blk.rotation.y = t * 0.3; blk.rotation.x = 0.4; const r = 2 ** (1 / 6) + 0.12 * Math.sin(t * 1.5); m.position.set(2 + (r - 0.95) * 3, 2.2 + lj(r) + 0.12, -3); });
  },
  // diatomic chain with springs; the vibration alternates between acoustic (in phase) and optical (anti-phase)
  'ss-phonon-halls'(g, anim) {
    const atoms = [], N = 14;
    for (let i = 0; i < N; i++) { const heavy = i % 2; const m = ball(heavy ? 0.3 : 0.2, heavy ? 0xff8a5b : 0x58b6ff, 0.4); g.add(m); atoms.push(m); }
    const springs = atoms.slice(1).map(() => { const l = line([[0, 0, 0], [1, 0, 0]], 0xbfe3ff); g.add(l); return l; });
    anim.push((t) => {
      const optical = Math.floor(t / 4) % 2 === 1, q = 0.5;
      atoms.forEach((m, i) => { const s = i % 2 && optical ? -1 : 1; m.position.set(-8 + i * 1.25 + 0.25 * s * Math.sin(2 * t - q * i), 2, -3); });
      springs.forEach((l, i) => { const p = l.geometry.attributes.position; p.setXYZ(0, ...atoms[i].position.toArray()); p.setXYZ(1, ...atoms[i + 1].position.toArray()); p.needsUpdate = true; });
    });
  },
  // Fermi sphere in k-space: translucent filled ball, shifted by a drift field when 'E on'
  'ss-fermi-sea'(g, anim) {
    const sea = new THREE.Mesh(new THREE.SphereGeometry(1.6, 24, 16), new THREE.MeshStandardMaterial({ color: 0x3a8bff, transparent: true, opacity: 0.45, emissive: 0x1a4a99, emissiveIntensity: 0.7 }));
    sea.position.set(0, 2, -3); g.add(sea);
    const shell = new THREE.Mesh(new THREE.SphereGeometry(1.64, 24, 16), new THREE.MeshBasicMaterial({ color: 0x9fd8ff, wireframe: true, transparent: true, opacity: 0.5 })); shell.position.copy(sea.position); g.add(shell);
    for (let i = 0; i < 40; i++) { const e = ball(0.05, 0xffffff, 1); const th = Math.random() * 6.283, ph = Math.acos(2 * Math.random() - 1), r = 1.64 + (Math.random() - 0.5) * 0.15; e.position.set(sea.position.x + r * Math.sin(ph) * Math.cos(th), sea.position.y + r * Math.cos(ph), sea.position.z + r * Math.sin(ph) * Math.sin(th)); g.add(e); }
    anim.push((t) => { const dx = 0.5 * (0.5 + 0.5 * Math.sin(t * 0.7)); sea.position.x = dx; shell.position.x = dx; });
  },
  // fixed ion rows with drifting electrons: more scatterers (defects) shorten the free flight
  'ss-drift-corridor'(g, anim) {
    for (let i = 0; i < 12; i++) for (let j = 0; j < 3; j++) { const ion = ball(0.2, 0xff8a5b, 0.3); ion.position.set(-8 + i * 1.5, 1 + j * 1.4, -3); g.add(ion); }
    const es = [], rng = (s) => { let x = s; return () => (x = (x * 16807) % 2147483647) / 2147483647; }, r = rng(7);
    for (let k = 0; k < 18; k++) { const e = ball(0.08, 0x7dffb0, 1); e.userData = { y: 1.7 + (r() - 0.5) * 2.2, x0: r() * 16, v: 0.6 + r() }; g.add(e); es.push(e); }
    anim.push((t) => es.forEach((e) => { e.position.set(-8 + ((e.userData.x0 + t * e.userData.v) % 16), e.userData.y + Math.sin(t * 6 + e.userData.x0) * 0.12, -2.4); }));
  },
  // parabolic band edges: conduction band above, valence band below, thermally excited carriers hop across the gap
  'ss-semiconductor-forge'(g, anim) {
    const gap = 1.6, cb = [], vb = [];
    for (let i = -20; i <= 20; i++) { const k = i / 10; cb.push([k * 2.2, 2.5 + gap / 2 + 0.55 * k * k, -3]); vb.push([k * 2.2, 2.5 - gap / 2 - 0.55 * k * k, -3]); }
    g.add(line(cb, 0x58b6ff), line(vb, 0xff8a5b), line([[-5, 2.5, -3], [5, 2.5, -3]], 0xffffff, 0.35));
    const es = [];
    for (let n = 0; n < 6; n++) { const e = ball(0.09, 0x58b6ff, 1), h = ball(0.09, 0xff8a5b, 1); g.add(e, h); es.push([e, h, n * 1.3]); }
    anim.push((t) => es.forEach(([e, h, ph]) => { const k = Math.sin(t * 0.6 + ph) * 1.0, up = 0.5 + 0.5 * Math.sin(t * 1.3 + ph); e.position.set(k * 2.2, 2.5 + gap / 2 + 0.55 * k * k + 0.25 * up, -3); h.position.set(k * 2.2, 2.5 - gap / 2 - 0.55 * k * k - 0.25 * up, -3); }));
  },
  // brick-wall lattice of spins with the Neel arrangement of ferromagnetic dimers
  'ss-magnet-vault'(g, anim) {
    const arrows = [];
    for (let i = 0; i < 8; i++) for (let j = 0; j < 4; j++) {
      const dimer = Math.floor(i / 2), up = (dimer + j) % 2 === 0;
      const a = arrow(up ? 0x58b6ff : 0xff8a5b); a.position.set(-5.2 + i * 1.5 + (j % 2) * 0.4, 0.7 + j * 1.1, -3); a.rotation.z = up ? 0 : Math.PI; g.add(a); arrows.push([a, up]);
    }
    // a field along +x cants both sublattices towards it; at the saturation field the angle reaches 90 degrees
    anim.push((t) => { const cant = (0.5 + 0.5 * Math.sin(t * 0.5)) * Math.PI / 2; arrows.forEach(([a, up]) => { a.rotation.z = up ? -cant : Math.PI + cant; }); });
  },
  // white dwarf: a dense crystal ball with a Fermi sphere shell, pulsing slowly
  'ss-degenerate-core'(g, anim) {
    const star = new THREE.Mesh(new THREE.SphereGeometry(1.7, 24, 16), new THREE.MeshStandardMaterial({ color: 0xcfe8ff, emissive: 0x8fb4ff, emissiveIntensity: 0.9, flatShading: true }));
    star.position.set(0, 2.2, -3); g.add(star);
    // ion lattice inside the star (carbon/oxygen nuclei in a degenerate electron sea)
    for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) { if (i * i + j * j > 5) continue; const ion = ball(0.09, 0xff8a5b, 0.8); ion.position.set(i * 0.45, 2.2 + j * 0.45, -1.2); g.add(ion); }
    const k = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffc24b, wireframe: true })); k.position.set(4.2, 2.2, -3); g.add(k);
    g.add(line([[1.8, 2.2, -3], [3.5, 2.2, -3]], 0xffc24b, 0.6));
    anim.push((t) => { const s = 1 + 0.03 * Math.sin(t); star.scale.setScalar(s); k.scale.setScalar(1 + 0.08 * Math.sin(t * 1.3)); });
  },
};


// One title sign with the key formulas of the room, typeset with KaTeX (text between $...$).
const SIGNS = {
  'ss-lattice-gate': ['LATTICE GATE', '$\\vec R=n_1\\vec a+n_2\\vec b$ plus a basis', '$\\vec G\\cdot\\vec R=2\\pi m$: the reciprocal lattice'],
  'ss-bonding-grotto': ['BONDING GROTTO', '$U(r)=4\\epsilon\\left[(\\sigma/r)^{12}-(\\sigma/r)^6\\right]$', 'ionic crystal: $U\\approx-\\alpha_M\\,e^2/(4\\pi\\epsilon_0R)$ + repulsion'],
  'ss-phonon-halls': ['PHONON HALLS', 'diatomic chain: acoustic $\\omega\\propto k$, optical $\\omega(0)\\neq0$', 'Debye: $C_V\\propto T^3$ for $T\\ll\\Theta_D$'],
  'ss-fermi-sea': ['FERMI SEA', '$k_F=(3\\pi^2n)^{1/3}$, $\\ E_F=\\hbar^2k_F^2/2m$', '$C_V=\\gamma T$ with $g(E_F)=\\frac{3n}{2E_F}$'],
  'ss-drift-corridor': ['DRIFT CORRIDOR', 'Drude: $\\sigma=ne^2\\tau/m$, $\\ v_d=-e\\tau E/m$', 'Matthiessen: $\\rho=\\rho_0+\\rho_{\\rm ph}(T)$'],
  'ss-semiconductor-forge': ['SEMICONDUCTOR FORGE', 'mass action: $np=n_i^2\\propto e^{-E_g/k_BT}$', 'effective mass $m^*=\\hbar^2/(d^2E/dk^2)$'],
  'ss-magnet-vault': ['MAGNET VAULT', 'Heisenberg: $H=-\\sum J_{ij}\\,\\vec S_i\\cdot\\vec S_j$', 'Curie-Weiss: $\\chi\\propto1/(T-T_W)$'],
  'ss-degenerate-core': ['DEGENERATE CORE', '$P=\\frac25\\,nE_F$ (non-relativistic degenerate gas)', 'white dwarf: $R\\propto M^{-1/3}$'],
};
function addSign(group, id) {
  const lines = SIGNS[id]; if (!lines || typeof document === 'undefined') return;
  const w = 1100, h = 250, tex = mathTexture(lines, { w, h, bg: 'rgba(11,26,43,0.9)', size: 40, small: 30 });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w / 120, h / 120), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
  m.position.set(0, 6.8, -5.4); group.add(m);
}

export function buildRoom(world, room) {
  const group = new THREE.Group(); group.name = room?.id || 'ss-room';
  const anim = [];
  (BUILDERS[room?.id] || BUILDERS['ss-lattice-gate'])(group, anim);
  const light = new THREE.PointLight(0x9fd8ff, 12, 16, 1.6); light.position.set(0, 4, -1); group.add(light);
  addSign(group, room?.id);
  world.scene.add(group);
  let t = 0;
  return {
    group,
    update(dt) { t += dt; for (const f of anim) f(t); },
    dispose() { world.scene.remove(group); group.traverse((o) => { o.geometry?.dispose?.(); o.material?.dispose?.(); }); },
  };
}
