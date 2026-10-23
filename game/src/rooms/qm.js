import * as THREE from 'three';
import { mathTexture } from '../mathtex.js';

// QM set pieces (one builder per room id). Contract like the other courses: buildRoom(world, room) -> { group, update(dt), dispose() }.
const mat = (c, e = 0) => new THREE.MeshStandardMaterial({ color: c, flatShading: true, emissive: e ? c : 0x000000, emissiveIntensity: e, roughness: 0.6 });
const line = (pts, color, opacity = 1) => new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts.map((p) => new THREE.Vector3(...p))), new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity }));
function sign(group, lines, pos, w = 1000, h = 230) {
  if (typeof document === 'undefined') return;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w / 120, h / 120), new THREE.MeshBasicMaterial({ map: mathTexture(lines, { w, h, bg: 'rgba(11,26,43,0.9)', size: 38, small: 28 }), transparent: true }));
  m.position.copy(pos); group.add(m);
}

const BUILDERS = {
  // parabolic potential, equally spaced levels, and a coherent state whose centre oscillates classically
  'qm-harmonic-oscillator-elevator'(g, anim) {
    const pts = []; for (let i = -40; i <= 40; i++) { const x = i * 0.18; pts.push([x, 0.4 + 0.12 * x * x, -3]); }
    g.add(line(pts, 0x58b6ff));
    for (let n = 0; n < 6; n++) { const E = 0.4 + 0.9 * (n + 0.5) * 0.5, half = Math.sqrt((E - 0.4) / 0.12); g.add(line([[-half, E, -3], [half, E, -3]], n === 0 ? 0xffd86b : 0x7dffb0, 0.7)); }
    const packet = new THREE.Mesh(new THREE.SphereGeometry(0.35, 14, 10), mat(0xffa94d, 0.9)); g.add(packet);
    const halo = new THREE.Mesh(new THREE.SphereGeometry(0.7, 14, 10), new THREE.MeshBasicMaterial({ color: 0xffa94d, transparent: true, opacity: 0.25 })); g.add(halo);
    const A = 3.2;
    anim.push((t) => { const x = A * Math.cos(1.4 * t); packet.position.set(x, 0.4 + 0.12 * x * x + 0.35, -3); halo.position.copy(packet.position); halo.scale.setScalar(1 + 0.15 * Math.sin(3 * t)); });
    sign(g, ['HARMONIC OSCILLATOR ELEVATOR', '$E_n=\\hbar\\omega\\left(n+\\tfrac12\\right)$, $\\ [a,a^\\dagger]=1$', 'coherent state: $\\langle x\\rangle=x_0\\cos\\omega t$, $\\Delta x\\Delta p=\\hbar/2$'], new THREE.Vector3(0, 6.2, -4.5));
  },
  // angular momentum l=2: arrows precessing on cones of fixed quantised L_z
  'qm-angular-momentum-spin'(g, anim) {
    const L = Math.sqrt(6), sc = 1.0, cy = 3.2, cz = -3;
    for (let m = -2; m <= 2; m++) {
      const y = cy + m * sc, rad = Math.sqrt(6 - m * m) * sc;
      const ring = []; for (let i = 0; i <= 48; i++) { const a = (i / 48) * 2 * Math.PI; ring.push([rad * Math.cos(a), y, cz + rad * Math.sin(a)]); }
      g.add(line(ring, m === 0 ? 0xffd86b : 0x58b6ff, 0.55));
      g.add(line([[-6.5, y, cz - 2.2], [-5.2, y, cz - 2.2]], 0x7dffb0, 0.8));
      g.add(line([[0, cy, cz], [rad, y, cz]], 0x58b6ff, 0.25));
      const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.5, 8), mat(m === 0 ? 0xffd86b : 0xffa94d, 0.9)); g.add(arrow);
      const w = 0.9 + 0.25 * m, ph = m * 1.1;
      anim.push((t) => { const a = w * t + ph; const x = rad * Math.cos(a), z = cz + rad * Math.sin(a); arrow.position.set(x, y, z); arrow.lookAt(0, cy, cz); arrow.rotateX(-Math.PI / 2); });
    }
    g.add(line([[0, cy - 2.6, cz], [0, cy + 2.6, cz]], 0xffffff, 0.5));
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 8), mat(0xffffff, 0.8)); core.position.set(0, cy, cz); g.add(core);
    sign(g, ['ANGULAR MOMENTUM SPIRAL', '$[L_i,L_j]=i\\hbar\\varepsilon_{ijk}L_k$, $\\ |\\vec L|=\\hbar\\sqrt{\\ell(\\ell+1)}=\\hbar\\sqrt6$', '$L_z=m\\hbar,\\ m=-2,\\dots,2$; $L_x,L_y$ undetermined'], new THREE.Vector3(0, 6.9, -5.4));
  },
  // avoided crossing: dashed unperturbed levels, exact curves, and a marker sweeping Delta with the second-order PT marker
  'qm-perturbation-forge'(g, anim) {
    const V = 0.6, X = 1.2, Y = 3.3, S = 1.5, ex = (D, s) => s * 0.5 * Math.sqrt(D * D + 4 * V * V), cz = -3;
    const un1 = [], un2 = [], up = [], lo = [];
    for (let i = -40; i <= 40; i++) { const D = i * 0.1; un1.push([D * X, Y - D * 0.5 * S, cz]); un2.push([D * X, Y + D * 0.5 * S, cz]); up.push([D * X, Y + ex(D, 1) * S, cz]); lo.push([D * X, Y + ex(D, -1) * S, cz]); }
    g.add(line(un1, 0x4a5d85, 0.7)); g.add(line(un2, 0x4a5d85, 0.7)); g.add(line(up, 0x58b6ff)); g.add(line(lo, 0x58b6ff));
    g.add(line([[0, Y - 2.2 * S, cz], [0, Y + 2.2 * S, cz]], 0xffffff, 0.15));
    const exact = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8), mat(0xffa94d, 0.9)), pt = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 8), mat(0x7dffb0, 0.9)), halo = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 8), new THREE.MeshBasicMaterial({ color: 0xff5b5b, transparent: true, opacity: 0 }));
    g.add(exact); g.add(pt); g.add(halo);
    anim.push((t) => {
      const D = 3.6 * Math.sin(0.45 * t), E = ex(D, -1), pt2 = -D / 2 - V * V / D; // lower level; PT: eps1 - V^2/Delta with eps1 = -Delta/2
      exact.position.set(D * X, Y + E * S, cz);
      const valid = Math.abs(D) > 2 * V * 1.4; pt.visible = valid; pt.position.set(D * X, Y + (D > 0 ? pt2 : -D / 2 - V * V / D) * S, cz + 0.2);
      halo.position.copy(exact.position); halo.material.opacity = valid ? 0 : 0.35 + 0.15 * Math.sin(6 * t);
    });
    sign(g, ['PERTURBATION FORGE', '$E^{(2)}_n=\\sum_{m\\ne n}\\frac{|\\langle m|H\'|n\\rangle|^2}{E_n-E_m}$,  $\\ E_\\pm=\\pm\\tfrac12\\sqrt{\\Delta^2+4V^2}$', 'green: $\\varepsilon_1-V^2/\\Delta$ fails for $|\\Delta|\\lesssim2V$ (red): use degenerate PT'], new THREE.Vector3(0, 6.9, -4.5));
    sign(g, ['Stark $n=2$: $E=E_2\\pm3|e|Ea_0$', 'fine structure: $E^{(1)}_{2,0}=-\\tfrac{13}{128}mc^2\\alpha^4$'], new THREE.Vector3(-5.2, 1.6, -4.6), 700, 150);
  },
  // hydrogen lamp: E_n = -1/n^2 levels, electron jumping and photons of energy 1/n^2 - 1/m^2; left: 2p Zeeman ladder (weak field)
  'qm-hydrogen-lamp'(g, anim) {
    const Y = (n) => 0.7 + 4.6 * (1 - 1 / (n * n)), x0 = -2.2, x1 = 4.6, cz = -3;
    for (let n = 1; n <= 7; n++) g.add(line([[x0, Y(n), cz], [x1, Y(n), cz]], n === 1 ? 0xffd86b : 0x7dffb0, 0.75));
    g.add(line([[x0, Y(1) + 4.6, cz], [x1, Y(1) + 4.6, cz]], 0xff5b5b, 0.35));
    const trans = [[2, 1], [3, 1], [3, 2], [4, 2], [5, 2], [4, 3], [2, 1]], el = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 8), mat(0xffa94d, 0.9)), ph = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    g.add(el); g.add(ph);
    const T = 2.4;
    anim.push((t) => {
      const k = Math.floor(t / T) % trans.length, u = (t % T) / T, [hi, lo] = trans[k], E = 1 / (lo * lo) - 1 / (hi * hi); // photon energy in Rydberg
      const xe = x0 + 0.6 + 0.9 * hi * 0.3, tj = Math.min(1, Math.max(0, (u - 0.25) / 0.15)); // electron sits at hi, jumps to lo, then photon flies
      el.position.set(xe, tj < 1 ? Y(hi) + (Y(lo) - Y(hi)) * tj : Y(lo), cz);
      ph.visible = u > 0.4; const f = (u - 0.4) / 0.6; ph.position.set(xe + 0.3 + f * 4.5, (Y(lo) + Y(hi)) / 2 + 0.4 * Math.sin(10 * f), cz);
      ph.material.color.setHSL(Math.max(0, 0.78 - E * 0.9), 1, 0.6); ph.scale.setScalar(0.6 + E);
    });
    // Zeeman ladder of 2p: j=3/2 (g=4/3) and j=1/2 (g=2/3), SO splitting 1/32 (in units mc^2 alpha^4), field ramps with time
    const xz = -6.2, yc = 3.0, sc = 38.4, E32 = 1 / 96, E12 = -1 / 48, mk = [];
    g.add(line([[xz - 0.6, yc + E32 * sc, cz], [xz + 0.6, yc + E32 * sc, cz]], 0x58b6ff, 0.3)); g.add(line([[xz - 0.6, yc + E12 * sc, cz], [xz + 0.6, yc + E12 * sc, cz]], 0x58b6ff, 0.3));
    for (const [j, gj, E0] of [[1.5, 4 / 3, E32], [0.5, 2 / 3, E12]]) for (let m = -j; m <= j; m++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), mat(m > 0 ? 0xffa94d : 0x7dffb0, 0.9)); g.add(s); mk.push([s, E0, gj * m, m]); }
    anim.push((t) => { const b = 0.012 * (0.5 - 0.5 * Math.cos(0.5 * t)); for (const [s, E0, gm, m] of mk) s.position.set(xz + 0.18 * m * 2.0, yc + (E0 + gm * b) * sc, cz); });
    sign(g, ['HYDROGEN LAMP', '$E_n=-\\frac{13.6\\,\\mathrm{eV}}{n^2}$,  $\\deg=n^2$ ($\\mathrm{so}(4)$)', 'photons: $\\hbar\\omega=13.6\\,\\mathrm{eV}\\,(n^{-2}-n\'^{-2})$'], new THREE.Vector3(1.2, 6.9, -4.5));
    sign(g, ['2p Zeeman (weak field)', '$\\Delta E=g_{lj}\\mu_BBm_j$, $g=\\frac43,\\frac23$'], new THREE.Vector3(-6.2, 5.6, -4.6), 700, 150);
  },
  // Stern-Gerlach with molecules of three spin-1/2 atoms (4 beams, 1:3:3:1) and the HS25 spin-1 pair (levels 5/3/1, P(t))
  'qm-spin-addition-stern-gerlach'(g, anim) {
    const cz = -3, xm = 0.5, xs = 6.2, y0 = 3.0, ms = [1.5, 0.5, -0.5, -1.5], w = [1, 3, 3, 1];
    const magnet = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.4, 1.0), mat(0x4a5d85, 0.2)); magnet.position.set(xm, y0, cz); g.add(magnet);
    g.add(line([[xs, y0 - 2.4, cz], [xs, y0 + 2.4, cz]], 0xffffff, 0.35));
    ms.forEach((m, i) => { const h = w[i] * 0.45; const bar = new THREE.Mesh(new THREE.BoxGeometry(0.25, h, 0.25), mat(0x7dffb0, 0.5)); bar.position.set(xs + 0.35, y0 + m * 1.3 + h / 2 - 0.2, cz); g.add(bar); });
    const N = 28, parts = []; for (let i = 0; i < N; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), mat(0xffa94d, 0.9)); g.add(s); parts.push(s); }
    const pick = (k) => { const u = (k * 0.6180339887 % 1) * 8; return u < 1 ? 0 : u < 4 ? 1 : u < 7 ? 2 : 3; }; // 1:3:3:1
    anim.push((t) => { parts.forEach((s, i) => { const T = 3.0, ph = ((t / T + i / N) % 1), k = Math.floor(t / T + i / N) * N + i, m = ms[pick(k)], x = -7 + ph * (xs + 7); const f = Math.max(0, (x - xm) / (xs - xm)); s.position.set(x, y0 + (x > xm ? m * 1.3 * f : 0), cz + 0.05 * Math.sin(i)); }); });
    // spin-1 pair: levels sigma = 2, 1, 0 with E = 1, -1, -2 (hbar omega) and the oscillating probability bar
    const xl = -7.0, yc = 3.4, lv = [[2, 1, 5], [1, -1, 3], [0, -2, 1]];
    for (const [, E, deg] of lv) for (let k = 0; k < deg; k++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 6), mat(0x58b6ff, 0.8)); s.position.set(xl + k * 0.38, yc + E * 0.75, cz); g.add(s); }
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 0.3), mat(0xffd86b, 0.8)); g.add(bar);
    anim.push((t) => { const P = (5 + 4 * Math.cos(3 * 0.6 * t)) / 9; bar.scale.y = Math.max(0.02, P * 3); bar.position.set(-3.6, y0 - 2.2 + P * 1.5, cz); });
    sign(g, ['SPIN ADDITION', '$D_{j_1}\\otimes D_{j_2}=\\bigoplus_{j=|j_1-j_2|}^{j_1+j_2}D_j$', '3 atoms: $D_{3/2}\\oplus2D_{1/2}$, 4 beams $1:3:3:1$'], new THREE.Vector3(0.5, 6.9, -4.5));
    sign(g, ['$\\vec S_1\\!\\cdot\\!\\vec S_2$, $s=1$: $\\hbar\\omega,-\\hbar\\omega,-2\\hbar\\omega$ (5,3,1)', '$P(0;0)=\\frac{5+4\\cos3\\omega t}{9}$'], new THREE.Vector3(-5.3, 1.3, -4.6), 900, 150);
  },
  // infinite well with psi1+psi2 sloshing, and a free Gaussian packet that spreads
  'qm-wave-mechanics-basics'(g, anim) {
    const a = 6, x0 = -3, y0 = 0.4, z = -3.2;
    g.add(line([[x0, y0 + 4.6, z], [x0, y0, z], [x0 + a, y0, z], [x0 + a, y0 + 4.6, z]], 0x58b6ff));
    const N = 60, dens = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({ length: N + 1 }, () => new THREE.Vector3())), new THREE.LineBasicMaterial({ color: 0xffd86b })); g.add(dens);
    anim.push((t) => { const p = dens.geometry.attributes.position; for (let i = 0; i <= N; i++) { const u = i / N, s = Math.PI * u, psi = (Math.sin(s) * Math.cos(1.0 * t) + Math.sin(2 * s) * Math.cos(4.0 * t)) / Math.SQRT2; p.setXYZ(i, x0 + a * u, y0 + 0.05 + 1.5 * psi * psi * 2, z); } p.needsUpdate = true; });
    const M = 80, xp = 1.6, pk = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({ length: M + 1 }, () => new THREE.Vector3())), new THREE.LineBasicMaterial({ color: 0x7dffb0 })); g.add(pk);
    anim.push((t) => { const T = (t % 8) / 8, w = Math.sqrt(1 + (2.2 * T) ** 2), p = pk.geometry.attributes.position; for (let i = 0; i <= M; i++) { const x = (i / M - 0.5) * 8; p.setXYZ(i, x + xp, 0.5 + (2.4 / w) * Math.exp(-(x * x) / (2 * 0.6 * 0.6 * w * w)), -1.0); } p.needsUpdate = true; });
    sign(g, ['WAVE MECHANICS BASEMENT', '$\\Delta x(t)^2=\\frac1{2\\lambda}\\left[1+\\left(\\frac{\\hbar\\lambda t}m\\right)^2\\right]$', '$E_n=\\frac{n^2\\pi^2\\hbar^2}{2ma^2}$, $\\ j=\\frac\\hbar m\\mathrm{Im}(\\Psi^*\\Psi\')$'], new THREE.Vector3(0, 6.4, -4.5));
  },
  // uncertainty plate: Delta x * Delta p = hbar/2 hyperbola with a squeezed Gaussian sliding along it, and a Heisenberg-picture phase-space rotation
  'qm-formalism-and-uncertainty'(g, anim) {
    const x0 = -3.5, y0 = 0.6, z = -3.2, s = 5.5;
    g.add(line([[x0, y0 + 5, z], [x0, y0, z], [x0 + 7, y0, z]], 0xffffff, 0.6));
    const hyp = []; for (let i = 0; i <= 60; i++) { const dx = 0.12 + i * 0.1; hyp.push([x0 + dx * 1.0, y0 + Math.min(5, 0.5 * s / (dx * 2.2) ), z]); }
    g.add(line(hyp, 0xffd86b));
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 8), mat(0xffa94d, 0.9)); g.add(dot);
    const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.05), new THREE.MeshBasicMaterial({ color: 0x58b6ff, transparent: true, opacity: 0.25 })); g.add(box);
    anim.push((t) => { const dx = 0.45 + 0.95 * (1 + Math.sin(0.7 * t)), dy = 0.5 * s / (dx * 2.2); dot.position.set(x0 + dx, y0 + Math.min(5, dy), z); box.scale.set(dx, Math.min(5, dy), 1); box.position.set(x0 + dx / 2, y0 + Math.min(5, dy) / 2, z); });
    const cx = 4.2, cy = 3.2, ring = []; for (let i = 0; i <= 48; i++) { const a = (i / 48) * 2 * Math.PI; ring.push([cx + 1.6 * Math.cos(a), cy + 1.6 * Math.sin(a), z]); }
    g.add(line(ring, 0x7dffb0, 0.6)); g.add(line([[cx - 2, cy, z], [cx + 2, cy, z]], 0xffffff, 0.35)); g.add(line([[cx, cy - 2, z], [cx, cy + 2, z]], 0xffffff, 0.35));
    const ph = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 8), mat(0x7dffb0, 0.9)); g.add(ph);
    anim.push((t) => ph.position.set(cx + 1.6 * Math.cos(1.2 * t), cy + 1.6 * Math.sin(1.2 * t), z));
    sign(g, ['FORMALISM VAULT', '$\\Delta A\\,\\Delta B\\ge\\tfrac12|\\langle[A,B]\\rangle|$, $\\ \\Delta x\\Delta p\\ge\\hbar/2$', '$\\dot A_H=\\tfrac i\\hbar[H,A_H]$, $\\ A_H=U^\\dagger AU$'], new THREE.Vector3(0, 6.6, -4.5));
  },
  // singlet source between two detectors, CHSH bars S(phi) = 2(cos phi + sin phi) with the classical line 2 and Tsirelson line 2 sqrt 2
  'qm-entanglement-lab'(g, anim) {
    const cz = -3, y0 = 3.0, src = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 12), mat(0xffd86b, 1)); src.position.set(0, y0, cz); g.add(src);
    const halo = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffd86b, transparent: true, opacity: 0.2 })); halo.position.copy(src.position); g.add(halo);
    for (const s of [-1, 1]) { const pil = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.0, 0.6), mat(0x4a5d85, 0.2)); pil.position.set(s * 5.2, y0, cz); g.add(pil); g.add(line([[0, y0, cz], [s * 4.8, y0, cz]], 0x58b6ff, 0.3)); }
    const A = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), mat(0xffa94d, 0.9)), B = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), mat(0x7dffb0, 0.9)); g.add(A); g.add(B);
    const arrA = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.5, 8), mat(0xffa94d, 0.9)), arrB = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.5, 8), mat(0x7dffb0, 0.9)); g.add(arrA); g.add(arrB);
    anim.push((t) => { const ph = (t * 0.5) % 1, up = Math.floor(t * 0.5) % 2 === 0 ? 1 : -1; A.position.set(-ph * 4.8, y0, cz); B.position.set(ph * 4.8, y0, cz); arrA.position.set(-5.2, y0 + 1.9, cz); arrB.position.set(5.2, y0 + 1.9, cz); arrA.rotation.z = up > 0 ? 0 : Math.PI; arrB.rotation.z = up > 0 ? Math.PI : 0; halo.scale.setScalar(1 + 0.2 * Math.sin(4 * t)); });
    const x0 = -2.6, ys = 0.6; // bars at phi = 0 .. pi/2 in 8 steps
    for (let k = 0; k <= 8; k++) { const ph = (k / 8) * Math.PI / 2, Sv = 2 * (Math.cos(ph) + Math.sin(ph)), h = Sv * ys; const bar = new THREE.Mesh(new THREE.BoxGeometry(0.4, h, 0.3), mat(Sv > 2.001 ? 0xffd86b : 0x58b6ff, 0.5)); bar.position.set(x0 + k * 0.65, 0.2 + h / 2, cz - 1.2); g.add(bar); }
    g.add(line([[x0 - 0.4, 0.2 + 2 * ys, cz - 1.2], [x0 + 5.6, 0.2 + 2 * ys, cz - 1.2]], 0xffffff, 0.8));
    g.add(line([[x0 - 0.4, 0.2 + 2 * Math.SQRT2 * ys, cz - 1.2], [x0 + 5.6, 0.2 + 2 * Math.SQRT2 * ys, cz - 1.2]], 0xffd86b, 0.9));
    sign(g, ['ENTANGLEMENT LAB', '$|\\psi\\rangle=\\tfrac1{\\sqrt2}(|{\\uparrow\\downarrow}\\rangle-|{\\downarrow\\uparrow}\\rangle)$, $\\ C=-\\vec n_1\\!\\cdot\\!\\vec n_2$', 'CHSH: local $\\le2$, quantum $2\\sqrt2$'], new THREE.Vector3(0, 6.6, -4.5));
  },
};
function generic(g, anim, room) {
  // fallback: a ladder of levels with a light climbing it
  for (let n = 0; n < 6; n++) g.add(line([[-4, 0.8 + n * 0.8, -3], [4, 0.8 + n * 0.8, -3]], 0x58b6ff, 0.6));
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 8), mat(0xffd86b, 1)); g.add(m);
  anim.push((t) => m.position.set(3.2 * Math.sin(t), 0.8 + ((t * 0.8) % 4.0), -3));
  sign(g, [String(room?.title || 'QM').toUpperCase()], new THREE.Vector3(0, 6.2, -4.5), 900, 110);
}

export function buildRoom(world, room) {
  const group = new THREE.Group(); group.name = room?.id || 'qm-room';
  const anim = []; (BUILDERS[room?.id] || ((g, a) => generic(g, a, room)))(group, anim);
  const light = new THREE.PointLight(0x9fd8ff, 12, 16, 1.6); light.position.set(0, 4, -1); group.add(light);
  world.scene.add(group);
  let t = 0;
  return { group, update(dt) { t += dt; for (const f of anim) f(t); }, dispose() { world.scene.remove(group); group.traverse((o) => { o.geometry?.dispose?.(); o.material?.dispose?.(); }); } };
}
export const ROOM_IDS = Object.keys(BUILDERS);
