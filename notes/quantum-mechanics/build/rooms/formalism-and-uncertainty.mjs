import { src, T } from '../lib.mjs';
import { room } from '../lib.mjs';
import { lessons12 } from '../parts/fu-l12.mjs';
import { lessons34 } from '../parts/fu-l34.mjs';
import { quizzes } from '../parts/fu-quiz.mjs';
import { derives } from '../parts/fu-derive.mjs';
import { calcs } from '../parts/fu-calc.mjs';
import { bosses } from '../parts/fu-boss.mjs';
const r = String.raw;
const NOTES = src.notes('ch04-formalism');

export default room({
  id: 'qm-formalism-and-uncertainty',
  title: 'The Formalism Vault',
  topics: ['Hilbert space, hermitian operators, Dirac notation', 'spectral decomposition, projectors and the measurement postulate', 'commutators and the (generalised) uncertainty relation', 'Schrodinger and Heisenberg picture, Ehrenfest, conservation laws', 'finite-dimensional quantum mechanics'],
  sources: [
    src.script('Ch. 4.1-4.6 (pp. 41-50): Hilbert space, operators, measurement'), src.script('Ch. 5.1-5.3 (pp. 52-58): commutators and uncertainty relation'),
    src.exam('HS18 (EN)', 'Question 2 [Heisenberg uncertainty relation, 18 pt], Question 3 [Heisenberg picture, 22 pt]'),
    src.exam('HS22', 'Part A, A2, A3, A4, A7 (adapted) and B.1 [QM in finite dimensions, 20 pt]'),
    src.exam('FS22', 'Question 3 [Heisenberg picture, 17 pt]'), src.exam('FS26', 'Question 1 [angular momentum, measurements, uncertainty, 20 pt]'),
    NOTES,
  ],
  intro: r`The vault is where the rules of quantum mechanics are kept: states are vectors in a Hilbert space, observables are hermitian operators, a measurement projects onto an eigenspace, and noncommuting observables obey $\Delta A\Delta B\ge\frac12|\langle[A,B]\rangle|$. Exams ask the same set of proofs again and again (HS18 Q2 and Q3, FS22 Q3, HS22 A and B.1), so the derivation desk matters as much as the fights.`,
  tutorial: [
    { title: 'The phase-space plate', look: { x: 0, z: -3 }, focus: null, html: r`<p>The horizontal axis is the width $\Delta x$ of a state, the vertical axis its momentum width $\Delta p$ (units $\hbar=1$). The glowing hyperbola is $\Delta x\Delta p=\hbar/2$: <b>no state lives below it</b>. The marker slides along it for Gaussian states; squeezing $\Delta x$ blows up $\Delta p$.</p>` },
    { title: 'The rotating dial', look: { x: 0, z: -3 }, focus: null, html: r`<p>The second marker is the Heisenberg-picture oscillator: $x_H(t)=x\cos\omega t+\frac{p}{m\omega}\sin\omega t$ rotates in phase space while the commutator $[x_H,p_H]=i\hbar$ is preserved (the area of the ellipse never shrinks).</p>` },
    { title: 'Consoles', look: { x: 0, z: 0 }, focus: null, html: r`<p>Library: four lessons (Hilbert space, projectors and measurement, uncertainty, time evolution). Quiz includes adapted HS22 part A items. Derivation desk: the proofs asked in HS18 Q2/Q3 and HS22 B.1. Fights: spin-1 measurement, Heisenberg picture of the oscillator, the stronger uncertainty relation. Boss gate: HS18 Q2, HS18 Q3, HS22 B.1.</p>` },
  ],
  encounters: [...lessons12, ...lessons34, ...quizzes, ...derives, ...calcs, ...bosses],
});
