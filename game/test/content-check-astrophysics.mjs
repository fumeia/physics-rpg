// Astro content check: every answer expression evaluates and matches the values printed in the
// Refregier exam solutions (or independent hand/script values noted next to each check).
import { readFileSync } from 'node:fs';
import { evaluate, withinTolerance } from '../src/expr.js';

const dir = new URL('../content/astrophysics/', import.meta.url);
const index = JSON.parse(readFileSync(new URL('index.json', dir)));
let fails = 0;
const ok = (name, cond, extra = '') => { console.log(`${cond ? 'PASS' : 'FAIL'} ${name} ${extra}`); if (!cond) fails++; };
const near = (a, b, r = 0.01) => Math.abs(a / b - 1) < r;

const got = {}, boss = {}, allIds = new Set();
const inRange = (m) => Number.isInteger(m.correct) && m.correct >= 0 && m.correct < m.options.length && m.options.length >= 2 && m.explain;
for (const id of index.rooms) {
  const room = JSON.parse(readFileSync(new URL(id + '.json', dir)));
  ok(`${id}: has sources`, room.sources?.length >= 2);
  const roomIds = new Set(room.encounters.map((e) => e.id));
  for (const enc of room.encounters) {
    ok(`${enc.id} unique across course`, !allIds.has(enc.id)); allIds.add(enc.id);
    if (enc.requires) ok(`${enc.id} requires an encounter of the same room`, roomIds.has(enc.requires));
    const key = `${id}/${enc.id.replace(/^astro-[a-z]+-/, '')}`;
    if (enc.type === 'lesson') {
      ok(`${key} lesson has blocks`, enc.blocks.length >= 2 && enc.blocks.every((b) => ['text', 'eq', 'intuition', 'pitfall', 'figure', 'exam'].includes(b.kind) && (b.html || b.tex)));
      for (const m of enc.check || []) ok(`${key} check '${m.q.slice(0, 40)}' valid`, inRange(m));
    }
    if (enc.type === 'quiz') {
      ok(`${key} quiz has >= 4 questions`, enc.questions.length >= 4);
      for (const m of enc.questions) ok(`${key} '${m.q.slice(0, 40)}' valid`, inRange(m));
    }
    if (enc.type === 'derive') ok(`${key} derive has steps and key points`, enc.steps.length >= 2 && enc.steps.every((s) => s.prompt && s.reveal) && enc.keyPoints.length >= 1 && enc.source?.file);
    if (enc.type === 'calc') {
      const scope = { ...enc.vars }; got[key] = {};
      for (const s of enc.steps) {
        let v; try { v = evaluate(s.answer, scope); } catch (e) { v = NaN; }
        got[key][s.id] = v; scope[s.id] = v;
        ok(`${key}.${s.id} evaluates`, Number.isFinite(v), String(v));
        ok(`${key}.${s.id} unit listed`, s.units.includes(s.unit));
        ok(`${key}.${s.id} no ^ (XOR) left`, !s.answer.includes('^'));
      }
    }
    if (enc.type === 'boss') {
      boss[key] = {};
      for (const f of enc.finalAnswers) { boss[key][f.id] = evaluate(f.answer, f.vars); ok(`${key}.${f.id} evaluates`, Number.isFinite(boss[key][f.id])); }
      ok(`${key} has keyPoints`, enc.keyPoints.length >= 2);
    }
  }
}
const codex = JSON.parse(readFileSync(new URL('codex.json', dir)));
for (const e of codex.entries) ok(`codex '${e.title}' complete`, e.id && e.group && e.tex && e.meaning);
const has = (k) => !!got[k] || !!boss[k];
const P = 'photometry-radiation', F = 'stellar-forge', D = 'galactic-dynamics', X = 'expanding-universe';
// HS25 winter Q1: 32 AU, 28 pc
ok('Q1a 32 AU', near(got[`${P}/c1`].dres, 32, 0.02), got[`${P}/c1`].dres);
ok('Q1b 28 pc', near(got[`${P}/c1`].dvis, 28, 0.02), got[`${P}/c1`].dvis);
// HS25 winter Q3: 18246 K, 159 nm, 502 nm for the Sun
ok('Q3 Teff 18246 K', near(got[`${P}/c2`].Teff, 18246, 1e-3));
ok('Q3 lambda 159 nm', near(got[`${P}/c2`].lam, 158.8, 2e-3));
// HS24 summer Q1: m = 5.1, ratio 225
ok('SN m = 5.12', near(got[`${P}/c3`].m, 5.1185, 1e-3));
ok('SN flux ratio ~225', near(got[`${P}/c3`].F, 225, 0.01));
// HS24 summer Q2: 57 GHz, 2.5 pW, 210 µK
ok('nu_RJ 57 GHz', near(got[`${P}/c4`].nuRJ, 56.8, 5e-3));
// NOTE: the official solution prints 2.5 pW, but its own prefactor 3.83e-43 J s^-2 times (27^3-18^3)/3 e27 gives 1.77 pW
// (checked by hand: 8.37e-40 * 3 m^2 * 1.523e-4 sr * 4.617e30 = 1.77e-12 W). The solution has an arithmetic slip.
ok('P = 1.77 pW (official key says 2.5: arithmetic error in the key)', near(got[`${P}/c4`].P, 1.766, 5e-3), got[`${P}/c4`].P);
ok('dT = 210 µK', near(got[`${P}/c4`].dT, 210, 0.02), got[`${P}/c4`].dT);
// HS25 winter Q2: 1.8e6 and 4.2e-6
ok('dust ratio 1.8e6', near(boss[`${P}/b1`].ratio, 1.8e6, 0.03), boss[`${P}/b1`].ratio);
ok('tau353 4.2e-6', near(boss[`${P}/b1`].tau, 4.2e-6, 0.03), boss[`${P}/b1`].tau);
// Eddington: 4 pi c G M/chi with chi = sigT/mp -> 3.2e4 Lsun per Msun (independent: 1.26e31 W/Msun... computed by hand below)
const LperM = 4 * Math.PI * 2.99792458e8 * 6.6743e-11 * 1.9884e30 / (6.652458e-29 / 1.67262192369e-27) / 3.828e26;
ok('L_Edd per Msun ~3.2e4 Lsun', near(LperM, 3.2e4, 0.03), LperM);
ok('L_Edd(10 Msun)', near(got[`${F}/c1`].LEdd, 10 * LperM, 1e-9));
ok('Mup = sqrt(LperM) ~ 180', near(got[`${F}/c1`].Mup, Math.sqrt(LperM), 1e-9) && got[`${F}/c1`].Mup > 150 && got[`${F}/c1`].Mup < 200);
ok('MS lifetime of 10 Msun = 100 Myr', near(got[`${F}/c2`].tau, 100, 1e-6));
// virial: sigma^2 = G M /(2 rH): hand: 6.6743e-11*1.9884e35/(10*3.0857e16)=4.301e7 -> 6.56 km/s
ok('globular sigma 6.56 km/s', near(got[`${F}/c3`].sig, 6.558, 2e-3), got[`${F}/c3`].sig);
ok('crossing time 0.75 Myr', near(got[`${F}/c3`].tcross, 0.7455, 5e-3), got[`${F}/c3`].tcross);
// HS24 summer Q6c: 58.5 kpc
ok('tidal d = 58.5 kpc', near(got[`${F}/c4`].d, 58.5, 2e-3), got[`${F}/c4`].d);
ok('boss L_Edd(20 Msun, chi=0.04) 2.5e32 W', near(boss[`${F}/b1`].LEdd, 4 * Math.PI * 2.99792458e8 * 6.6743e-11 * 20 * 1.9884e30 / 0.04, 1e-9));
// flat rotation curve: M = v^2 r/G = 9.0e10 Msun, rho = 0.014 Msun/pc^3 (hand)
ok('M(<8kpc) 9.0e10', near(got[`${D}/c1`].Mr, 9.0e10, 0.01), got[`${D}/c1`].Mr);
ok('rho 0.014 Msun/pc^3', near(got[`${D}/c1`].rho, 0.0140, 0.02), got[`${D}/c1`].rho);
// HS24 summer Q4b: A_V = 1.53, ratio 0.24
ok('A_V(15 deg) = 1.53', near(got[`${D}/c2`].AV, 1.53, 0.01), got[`${D}/c2`].AV);
ok('flux ratio 0.24', near(got[`${D}/c2`].F, 0.24, 0.03), got[`${D}/c2`].F);
ok('cluster T x4, L x16', near(got[`${D}/c3`].Tr, 4, 1e-9) && near(got[`${D}/c3`].Lr, 16, 1e-9));
// Plummer: B(3/2,9/2) = 7 pi/256 (numeric integration check), vc(a) = sqrt(GM) a/(2a^2)^(3/4) = sqrt(GM/a)/2^(3/4)
let integ = 0; const n = 200000;
for (let i = 0; i < n; i++) { const x = (i + 0.5) / n; integ += Math.sqrt(x) * Math.pow(1 - x, 3.5) / n; }
ok('Beta integral = 7 pi/256', near(integ, 7 * Math.PI / 256, 1e-4), integ);
const vcHand = Math.sqrt(6.6743e-11 * 1e11 * 1.9884e30 / 3.085677581e19) / Math.pow(2, 0.75) / 1000;
ok('Plummer vc(a) = sqrt(GM/a)/2^(3/4) = 390 km/s', near(boss[`${D}/b1`].vc, vcHand, 1e-6) && near(vcHand, 389.9, 0.01), vcHand);
ok('Plummer rho0 = 23.87', near(boss[`${D}/b1`].rho0, 23.873, 1e-3));
ok('Plummer rho(a)/rho0 = 0.1768', near(boss[`${D}/b1`].rhoa, 0.17678, 1e-3));
// recombination: z = 1100, 966 nm, 1.06 mm
ok('z_rec 1100', near(got[`${X}/c1`].z, 1100.1, 1e-3));
ok('lambda_rec 966 nm', near(got[`${X}/c1`].lrec, 966, 2e-3));
ok('lambda_0 1.063 mm', near(got[`${X}/c1`].l0, 1.0635, 2e-3));
ok('lambda0 = lambda_rec (1+z)', near(got[`${X}/c1`].l0 * 1e6, got[`${X}/c1`].lrec * (1 + got[`${X}/c1`].z), 1e-3));
// HS25 winter Q6: tS = 5.0e7 yr, doubling 3.5e7 yr
ok('Salpeter 5.0e7 yr', near(got[`${X}/c2`].tS, 5.0, 0.01), got[`${X}/c2`].tS);
ok('doubling 3.5e7 yr', near(got[`${X}/c2`].tdbl, 3.5, 0.02));
ok('growth 1e8 in ~0.9 Gyr', near(got[`${X}/c2`].tgrow, 0.92, 0.02), got[`${X}/c2`].tgrow);
ok('alpha(w=0)=2/3, w=1/3 gives 1/2', near(got[`${X}/c3`].a0, 2 / 3, 1e-9) && near(2 / (3 * (4 / 3)), 0.5, 1e-9));
ok('age matter-only 9.3 Gyr', near(got[`${X}/c3`].age, 9.31, 0.01));
ok('alpha(w=0.5)=0.444', near(got[`${X}/c3`].a2, 0.4444, 1e-3));
// HS25 winter MC13/14: ~100 Mpc, z ~ 1
ok('Hubble d ~100 Mpc', near(got[`${X}/c4`].d, 99.9, 0.01));
ok('21cm z ~ 1.03', near(got[`${X}/c4`].zline, 1.029, 0.005));
// HS25 winter Q7c: 225 s
ok('t_BBN = 225 s', near(boss[`${X}/b1`].tbbn, 225, 1e-9));
ok('t(3e8 K) = 2500 s = 41.7 min', near(boss[`${X}/b1`].tmin, 2500 / 60, 1e-9));
// ---- lessons/quiz era additions: independent values (hand or separate script, see notes/astrophysics) ----
const G_ = (k, s) => got[k]?.[s];
ok('Moon: lambda 2.0 mm', near(G_(`${P}/c5`, 'lam'), 1.9986, 1e-3));
ok('Moon: theta 1.40 arcmin', near(G_(`${P}/c5`, 'th'), 1.397, 2e-3));
ok('eye limit 31.6 pc', near(G_(`${P}/c6`, 'd'), 31.62, 1e-3));
ok('L_sun 3.83e26 W', near(G_(`${P}/c7`, 'L'), 3.828, 2e-3));
ok('solar constant ~1363 W/m2', near(G_(`${P}/c7`, 'F'), 1363, 3e-3));
const RT = 'radiative-transfer';
ok('fog: I = 0.3947 I0', near(G_(`${RT}/c1`, 'I'), 0.39473, 1e-3));
ok('Thomson air: ne 7.71e26', near(G_(`${RT}/c2`, 'ne'), 7.712e26, 1e-3));
ok('Thomson air: L_half 13.5 m', near(G_(`${RT}/c2`, 'Lhalf'), 13.51, 2e-3));
ok('grey: T(0) = 4854 K', near(G_(`${RT}/c3`, 'T0'), 4853.7, 1e-3));
ok('grey: T(1) = 6103 K', near(G_(`${RT}/c3`, 'T1'), 6103.1, 1e-3));
ok('grey: limb(0.5) = 0.70', near(G_(`${RT}/c3`, 'limb'), 0.7, 1e-6));
ok('photon diffusion ~5.1e3 yr', near(G_(`${RT}/c4`, 't'), 5116, 2e-3));
const F2 = 'stellar-forge';
ok('Sun N = 2.378e57', near(G_(`${F2}/c5`, 'N'), 2.3776e57, 1e-3));
ok('Sun U_T = 4.92e41 J', near(G_(`${F2}/c5`, 'UT'), 4.924, 2e-3));
ok('Sun U_V = 1.90e41 J', near(G_(`${F2}/c5`, 'UV'), 1.8965, 2e-3));
ok('t_KH = 15.7 Myr', near(G_(`${F2}/c5`, 'tKH'), 15.70, 2e-3));
ok('nuclear time 10.4 Gyr', near(G_(`${F2}/c6`, 'tau'), 10.355, 2e-3));
ok('mean solar density 1410', near(G_(`${F2}/c7`, 'rho'), 1409.8, 1e-3));
ok('uniform Sun Tc = 5.78e6 K', near(G_(`${F2}/c7`, 'Tc'), 0.57775, 2e-3));
ok('HS24w Q1c r = 0.66 R', near(G_(`${F2}/c7`, 'r01'), 0.66156, 1e-3) && near(boss[`${F2}/b2`].r, 0.66156, 1e-3));
ok('uniform Pc 1.35e14 Pa', near(boss[`${F2}/b2`].Pc, 1.345, 3e-3));
const NU = 'nuclear-furnace';
ok('pp: kT 1.293 keV', near(G_(`${NU}/c1`, 'kT'), 1.2926, 1e-3));
ok('pp: E_G 493 keV', near(G_(`${NU}/c1`, 'EG'), 493.1, 2e-3));
ok('pp: E0 5.91 keV', near(G_(`${NU}/c1`, 'E0'), 5.906, 2e-3));
ok('pp: tunnelling 1.07e-4', near(G_(`${NU}/c1`, 'Pt'), 1.07e-4, 0.01));
ok('pp: eps ~ T^3.9', near(G_(`${NU}/c1`, 'n'), 3.90, 0.01));
ok('Q = 26.73 MeV', near(G_(`${NU}/c2`, 'Q'), 26.73, 1e-3));
ok('He rate 8.94e37 /s', near(G_(`${NU}/c2`, 'rate'), 8.94e37, 3e-3));
ok('neutrino flux 6.4e10 /cm2/s', near(G_(`${NU}/c2`, 'flux'), 6.37e10, 5e-3));
const DG = 'degenerate-matter';
ok('p_F = m_e c: n_e 5.87e35', near(G_(`${DG}/c1`, 'ne'), 5.865e35, 2e-3));
ok('relativistic at 1.96e9 kg/m3', near(G_(`${DG}/c1`, 'rho'), 1.962e9, 2e-3));
ok('WD R ~ 4450 km (scaling)', near(G_(`${DG}/c2`, 'R'), 4450, 3e-3));
ok('M_Ch scaling 0.32 Msun', near(G_(`${DG}/c2`, 'Mch'), 0.3184, 3e-3));
ok('NS density 6.6e17', near(G_(`${DG}/c3`, 'rho'), 6.646, 2e-3));
ok('NS compactness 0.207', near(G_(`${DG}/c3`, 'eta'), 0.2067, 2e-3));
ok('NS v_esc 0.643 c', near(G_(`${DG}/c3`, 'vesc'), 0.643, 2e-3));
ok('NS breakup 0.461 ms', near(G_(`${DG}/c3`, 'Pmin'), 0.461, 2e-3));
ok('Crab E_rot 1.77e42 J', near(G_(`${DG}/c4`, 'Erot'), 1.769, 2e-3));
ok('Crab L 4.45e31 W', near(G_(`${DG}/c4`, 'L'), 4.450, 2e-3));
ok('Crab age 1260 yr', near(G_(`${DG}/c4`, 'tau'), 1260, 2e-3));
const IS = 'interstellar-medium';
ok('Stromgren 14.6 pc', near(G_(`${IS}/c1`, 'Rs'), 14.62, 2e-3));
ok('recombination time 1.2e4 yr', near(G_(`${IS}/c1`, 'trec'), 12188, 2e-3));
ok('Stromgren dense 0.68 pc', near(G_(`${IS}/c1`, 'R2'), 0.6786, 2e-3));
ok('Jeans (Choudhuri) 7.8e35 kg', near(G_(`${IS}/c2`, 'MJ1'), 7.84e35, 3e-3));
ok('Jeans core ~23 Msun', near(G_(`${IS}/c2`, 'MJ2'), 22.98, 3e-3));
ok('3 mag deeper: x63', near(G_(`${IS}/c3`, 'f'), 63.1, 2e-3));
ok('21 cm: 21.11 cm, 5.87 µeV, 0.068 K', near(G_(`${IS}/c4`, 'lam'), 21.106, 1e-3) && near(G_(`${IS}/c4`, 'E'), 5.874, 1e-3) && near(G_(`${IS}/c4`, 'T'), 0.06817, 1e-3));
ok('star counts boss: x31.6, r0 179 pc', near(boss[`${IS}/b1`].x10, 31.62, 1e-3) && near(boss[`${IS}/b1`].r0, 178.87, 1e-3));
ok('Oort v_c 217.6 km/s, P 226 Myr, slope -2.4', near(G_(`${D}/c4`, 'v0'), 217.6, 1e-6) && near(G_(`${D}/c4`, 'P'), 225.87, 2e-3) && near(G_(`${D}/c4`, 'slope'), -2.4, 1e-6));
ok('HS25p Q6c: R > 18.3 kpc', near(G_(`${D}/c5`, 'R'), 18.344, 1e-3));
ok('HS25p Q6c: M8 = 9.84e10', near(G_(`${D}/c5`, 'M8'), 9.840, 2e-3));
ok('HS25p Q6c: M > 2.26e11 (key misprints 9.8e11)', near(G_(`${D}/c5`, 'Mtot'), 22.56, 2e-3));
ok('Trel galaxy 1.68e17 yr', near(G_(`${D}/c6`, 'T1'), 1.6826e17, 2e-3));
ok('Trel globular 16.8 Gyr', near(G_(`${D}/c6`, 'T2'), 16.826, 2e-3));
ok('HS24w Q4c k = 8.13e5 Msun/pc', near(boss[`${D}/b2`].k, 8.134, 2e-3));
const AG = 'active-galaxies';
ok('gyrofrequency 28 Hz at 1 nT', near(G_(`${AG}/c1`, 'nug'), 27.99, 1e-3));
ok('gamma 5977, E 3.05 GeV, s 0.8', near(G_(`${AG}/c1`, 'gam'), 5977, 1e-3) && near(G_(`${AG}/c1`, 'E'), 3.054, 1e-3) && near(G_(`${AG}/c1`, 's'), 0.8, 1e-9));
ok('superluminal max 7.02c at 8.11 deg', near(G_(`${AG}/c2`, 'vmax'), 7.018, 1e-3) && near(G_(`${AG}/c2`, 'thmax'), 8.1096, 1e-3));
ok('superluminal at 20 deg 4.86c', near(G_(`${AG}/c2`, 'v20'), 4.858, 1e-3));
ok('cluster M 1.40e15, T 7.3e7 K, kT 6.3 keV', near(G_(`${AG}/c3`, 'M'), 1.395, 2e-3) && near(G_(`${AG}/c3`, 'T'), 7.269, 2e-3) && near(G_(`${AG}/c3`, 'kT'), 6.264, 2e-3));
ok('HS24w Q6: D 2.5e-3 pc, M 2.6e10 Msun', near(boss[`${AG}/b1`].D, 2.518, 2e-3) && near(boss[`${AG}/b1`].M, 2.631, 2e-3));
ok('H0 = 2.27e-18 /s, 1/H0 = 13.97 Gyr', near(G_(`${X}/c5`, 'H'), 2.2685e-18, 1e-3) && near(G_(`${X}/c5`, 'tH'), 13.968, 1e-3));
ok('rho_c = 9.20e-27, 5.5 protons/m3', near(G_(`${X}/c5`, 'rhoc'), 9.204, 1e-3) && near(G_(`${X}/c5`, 'np'), 5.503, 1e-3));
ok('closed Om=2: t_ta 43.9, life 87.8, age 7.97 Gyr', near(G_(`${X}/c6`, 'tta'), 43.88, 1e-3) && near(G_(`${X}/c6`, 'tlife'), 87.77, 1e-3) && near(G_(`${X}/c6`, 't0'), 7.973, 1e-3));
ok('z_eq = 3540, T_eq 9650 K', near(G_(`${X}/c7`, 'zeq'), 3540, 2e-3) && near(G_(`${X}/c7`, 'Teq'), 9649, 2e-3));
ok('Lambda: H 58.6, doubling 11.6 Gyr', near(G_(`${X}/c8`, 'HL'), 58.566, 1e-3) && near(G_(`${X}/c8`, 'td'), 11.573, 1e-3));
ok('HS24w Q7 numbers: life 186 Gyr, Hmax 1417', near(boss[`${X}/b2`].tu, 186.18, 1e-3) && near(boss[`${X}/b2`].Hmax, 1416.6, 1e-3));
const EU = 'early-universe';
ok('n_gamma 4.105e8, n_B 0.252, eta 6.13e-10', near(G_(`${EU}/c1`, 'ng'), 4.105, 1e-3) && near(G_(`${EU}/c1`, 'nb'), 0.2516, 1e-3) && near(G_(`${EU}/c1`, 'eta'), 6.128e-10, 2e-3));
ok('n/p 0.199, Y0 0.331, Y 0.264', near(G_(`${EU}/c2`, 'r'), 0.19864, 1e-3) && near(G_(`${EU}/c2`, 'Y0'), 0.33145, 1e-3) && near(G_(`${EU}/c2`, 'Y'), 0.26406, 1e-3));
ok('T=1e10 K at 2.31 s, 0.862 MeV; D at 5.8 min', near(G_(`${EU}/c3`, 't1'), 2.3104, 1e-4) && near(G_(`${EU}/c3`, 'kT1'), 0.86173, 1e-4) && near(G_(`${EU}/c3`, 'tD'), 5.836, 1e-3));
ok('T_nu 1.945 K, flatness 1.5e-18, delta 0.011', near(G_(`${EU}/c4`, 'Tnu'), 1.94501, 1e-4) && near(G_(`${EU}/c4`, 'flat'), 1.495e-18, 2e-3) && near(G_(`${EU}/c4`, 'delta'), 0.01101, 1e-6));
// Examination Hall: the four full MC sets must match the official keys (■ marks in the extracted exam text).
{
  const hall = JSON.parse(readFileSync(new URL('exam-hall.json', dir)));
  const files = { 'MC-W25': 'Astro_I_2025_Winter_Session_with_Solutions', 'MC-S24': 'Astro_I_2024_Summer_Session_with_Solutions', 'MC-W24': 'Astro_I_2024_Winter_Session_with_Solutions', 'MC-P25': 'Astro_I_2025_Practice_Exam_with_Solutions' };
  for (const [qid, f] of Object.entries(files)) {
    const quiz = hall.encounters.find((e) => e.id === `astro-exam-${qid}`);
    const txt = readFileSync(new URL(`../../notes/extracted/astrophysics_old-exams_${f}.txt`, import.meta.url), 'utf8');
    const mcPart = txt.slice(0, txt.search(/\n\s*2\s+Open Questions/));
    const keys = [];
    for (const block of mcPart.split(/\n\s*\d{1,2}\.\s+\(3 points\)/).slice(1)) {
      const marks = [...block.matchAll(/[□■]/g)].map((m) => m[0]).slice(0, 4);
      keys.push(marks.indexOf('■'));
    }
    ok(`${qid}: 15 questions in key and quiz`, keys.length === 15 && quiz.questions.length === 15, `key ${keys.length}`);
    const mism = quiz.questions.map((q, i) => (q.correct === keys[i] ? null : i + 1)).filter(Boolean);
    ok(`${qid}: all answers match the official key`, mism.length === 0, mism.length ? `mismatch at ${mism.join(',')}` : '');
  }
  const EH = 'exam-hall';
  ok('HS25w Q5 exponents 2/3, 4/3', near(boss[`${EH}/b1`].aT, 2 / 3, 1e-9) && near(boss[`${EH}/b1`].aL, 4 / 3, 1e-9));
  ok('HS25w Q6 t_S 5.0, doubling 3.47 (1e7 yr)', near(boss[`${EH}/b2`].tS, 5.005, 2e-3) && near(boss[`${EH}/b2`].td, 3.470, 2e-3));
  ok('HS24s Q6 58.5 kpc', near(boss[`${EH}/b3`].d, 58.48, 1e-3));
  ok('HS24s Q4 A_V 1.53, F 0.245', near(boss[`${EH}/b4`].AV, 1.528, 3e-3) && near(boss[`${EH}/b4`].F, 0.2447, 5e-3));
  ok('HS24s Q5 sigma 146.6 km/s', near(boss[`${EH}/b5`].sig, 146.64, 2e-3), boss[`${EH}/b5`].sig);
  ok('HS25p Q6 R 18.3 kpc, M 2.26e11', near(boss[`${EH}/b6`].R, 18.344, 1e-3) && near(boss[`${EH}/b6`].M, 2.2563, 2e-3));
}
//@@MORE@@
console.log(fails ? `${fails} FAILED` : 'ALL PASS');
process.exit(fails ? 1 : 0);
