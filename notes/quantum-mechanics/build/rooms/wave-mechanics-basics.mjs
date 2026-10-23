import { src, room } from '../lib.mjs';
import { lessons } from '../parts/wmb-lessons.mjs';
import { lessons2 } from '../parts/wmb-lessons2.mjs';
import { quizzes } from '../parts/wmb-quiz.mjs';
import { derives } from '../parts/wmb-derive.mjs';
import { calcs } from '../parts/wmb-calc.mjs';
import { bosses } from '../parts/wmb-boss.mjs';
const r = String.raw;

export default room({
  id: 'qm-wave-mechanics-basics',
  title: 'The Wave Mechanics Basement',
  topics: ['Compton effect, de Broglie and Bohr orbits', 'Schroedinger equation, probability current, continuity', 'Galilean invariance and Ehrenfest theorem', 'Gaussian wave packet, uncertainty and free spreading', 'particle in a 1d/2d box, expansion in eigenstates, parity', 'sudden change of the box (sudden approximation)'],
  sources: [
    src.script('Ch. 1.4-1.5 and 2.1-2.4 (pp. 12-18): Compton, de Broglie, Schroedinger equation, current, Ehrenfest'), src.script('Ch. 3.1: particle in a box'),
    src.ex(1, 'Q1 Compton, Q2 Bohr atom, Q3 Galilean invariance'), src.ex(3, 'Q1 Gaussian, Q2-Q4 box, sudden wall'),
    src.exam('FS26', 'Question 2 [Particle in the box, 20 points]'), src.exam('FS 19', 'Question 1 [Particle in a 2d box, 21 pt]'), src.exam('FS22', 'Question 1 [Wave mechanics, 17 pt]'), src.exam('HS21', 'Question 1 [Ehrenfest theorem, 10 pt]'),
    src.notes('ch02-wave-mechanics'),
  ],
  intro: r`The basement holds the foundations the rest of the course stands on. Every exam starts here: probability current and continuity (FS22 Q1), Ehrenfest (HS21 Q1, FS19 Q2), the box with a symmetry operator or an expansion (FS26 Q2, FS19 Q1). The pattern is always the same: write down eigenstates, expand, square the coefficients, check that the probabilities add up to one.`,
  tutorial: [
    { title: 'The well and the packet', look: { x: 0, z: -3 }, focus: null, html: r`<p>On the back wall the infinite well of width $a$ with the two lowest levels. The glowing curve is $|\Psi|^2$ for $\frac1{\sqrt2}(\psi_1+\psi_2)$: the density sloshes back and forth with the angular frequency $(E_2-E_1)/\hbar$, while the density of a single eigenstate would stand still.</p>` },
    { title: 'The spreading packet', look: { x: 0, z: -3 }, focus: null, html: r`<p>In front of the well a free Gaussian packet widens as $\Delta x(t)=\Delta x_0\sqrt{1+(\hbar\lambda t/m)^2}$ while the area under $|\Psi|^2$ stays one. The narrower it starts, the faster it spreads: this is $\Delta x\,\Delta p\ge\hbar/2$ in motion.</p>` },
    { title: 'Consoles', look: { x: 0, z: 0 }, focus: null, html: r`<p>Library: Compton to Ehrenfest and the box. Quiz: eight multiple-choice questions. Derivation desk: Compton, continuity, Ehrenfest, Gaussian spreading, the sudden wall. Fights: Compton, spreading, sudden wall. Boss gate: FS26 Q2, FS19 Q1, FS22 Q1.</p>` },
  ],
  encounters: [...lessons, ...lessons2, ...quizzes, ...derives, ...calcs, ...bosses],
});
