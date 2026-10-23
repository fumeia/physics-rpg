import { src, room } from '../lib.mjs';
import { NOTES, lessonsA } from './entanglement-lab/lessons-a.mjs';
import { lessonsB } from './entanglement-lab/lessons-b.mjs';
import { quizEnt } from './entanglement-lab/quiz.mjs';
import { derivesEnt } from './entanglement-lab/derives.mjs';
import { calcsEnt } from './entanglement-lab/calcs.mjs';
import { bossesEnt } from './entanglement-lab/bosses.mjs';
const r = String.raw;

const withReq = (bosses, reqs) => bosses.map((b, i) => ({ ...b, requires: reqs[i] }));

export default room({
  id: 'qm-entanglement-lab',
  title: 'Entanglement Lab: EPR, Bell and CHSH',
  topics: ['tensor products and product vs entangled states', 'Bell basis and the singlet', 'density matrix, purity, partial trace', 'EPR pair and spin correlations', 'Bell-CHSH inequality and the bound 2 sqrt 2', 'Hardy paradox', 'quantum teleportation', 'no-cloning (supplement)'],
  sources: [
    src.script('Ch. 10.1-10.3 (pp. 108-113): EPR paradox, Bell inequality, teleportation'), src.script('Ch. 9.1-9.3 (pp. 93-98): tensor products, two spin-1/2'),
    src.ex(13, 'Question 3 [Hardy\'s paradox]'),
    src.exam('HS21', 'Question 3 [EPR pair, 12 pt]'), src.exam('FS 19', 'Question 3 [Spin 1 EPR pair, 18 pt]'), src.exam('FS16', 'Aufgabe D [Dichtematrizen, 18 Punkte]'), src.exam('HS14', 'E.3-E.5'), NOTES,
  ],
  intro: r`Two particles, one state: $|\psi\rangle=\frac1{\sqrt2}(|{\uparrow\downarrow}\rangle-|{\downarrow\uparrow}\rangle)$ cannot be written as a product, each particle alone is maximally random ($\rho_A=\frac12\mathbb 1$), yet the outcomes along any common axis are perfectly anticorrelated. Bell and CHSH turn this into a number: local hidden variables obey $|S|\le2$, the singlet reaches $2\sqrt2$. The room covers product vs entangled states, the Bell basis, density matrices and partial traces, the EPR pair (HS21 Q3, FS19 Q3, FS16 D), CHSH, Hardy and teleportation.`,
  tutorial: [
    { title: 'The source', look: { x: 0, z: -3 }, focus: null, html: r`<p>The glowing orb in the middle emits the singlet pair; the two pillars are Alice's and Bob's detectors. Each particle alone is random, the pair is perfectly anticorrelated: $C=-\vec n_1\cdot\vec n_2$.</p>` },
    { title: 'The CHSH dial', look: { x: 4, z: -3 }, focus: null, html: r`<p>The bars show the CHSH value $S(\varphi)=2(\cos\varphi+\sin\varphi)$ as Bob's detector turns. The classical limit $2$ is the white line, the quantum maximum $2\sqrt2\approx2.83$ the gold line, reached at $\varphi=\frac\pi4$.</p>` },
    { title: 'Consoles', look: { x: 0, z: 0 }, focus: null, html: r`<p>Four lessons (product states, density matrices, EPR, Bell/CHSH), a quiz, six derivations (singlet, correlation, CHSH, partial trace, teleportation, no-cloning), three calculation fights and three bosses (HS21 Q3, FS19 Q3, FS16 D).</p>` },
  ],
  encounters: [
    ...lessonsA, ...lessonsB, quizEnt, ...derivesEnt, ...calcsEnt,
    ...withReq(bossesEnt, ['qm-ent-c1', 'qm-ent-c3', 'qm-ent-c2']),
  ],
});
