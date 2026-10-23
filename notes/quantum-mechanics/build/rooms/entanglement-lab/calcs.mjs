import { src, choice, sym, order, num, calc } from '../../lib.mjs';
import { NOTES } from './lessons-a.mjs';
const r = String.raw;
const DL = ['dimensionless', 'energy', 'angular momentum'];

export const calcsEnt = [
  calc({
    id: 'qm-ent-c1', title: 'CHSH on the singlet', source: [src.script('Ch. 10.2, (10.4)-(10.12)'), NOTES],
    problem: r`Two spin-$\frac12$ particles are in the singlet. Alice measures $\vec\sigma^{(1)}\!\cdot\vec n_1$ or $\vec\sigma^{(1)}\!\cdot\vec n_1'$, Bob $\vec\sigma^{(2)}\!\cdot\vec n_2$ or $\vec\sigma^{(2)}\!\cdot\vec n_2'$ (results $\pm1$). Show that $S=|C(\vec n_1,\vec n_2)+C(\vec n_1',\vec n_2)+C(\vec n_1,\vec n_2')-C(\vec n_1',\vec n_2')|$ exceeds the bound for local hidden variables.`,
    symbols: [[r`$C(\vec n_1,\vec n_2)$`, r`spin correlation $\langle\sigma_{\vec n_1}^{(1)}\sigma_{\vec n_2}^{(2)}\rangle$`], [r`$\theta$`, r`angle between the two measurement axes`], [r`$\varphi$`, r`Bob's axes are at $\pm\varphi$, Alice's at $0$ and $\frac\pi2$ (one plane)`], [r`$S$`, r`CHSH combination`]],
    vars: { phi: 0.7853981633974483 },
    derivation: [{ title: 'Method', html: r`<p>Classical bound from $(A+A')B+(A-A')B'=\pm2$; quantum value from $C=-\cos\theta$ for the singlet (script 10.11).</p>` }],
    steps: [
      order('s1', r`Put the proof of $S\le2$ for local hidden variables in order.`, [
        { text: r`for fixed $\omega$, all of $A,A',B,B'$ are numbers $\pm1$`, why: r`Realism: values exist before the measurement.` },
        { text: r`distinguish $A=A'$ and $A=-A'$`, why: r`Only after assigning values can the case split be made.` },
        { text: r`conclude $(A+A')B+(A-A')B'=\pm2$ for each $\omega$`, why: r`Uses the case split: one bracket is $\pm2$, the other 0.` },
        { text: r`average over $d\rho(\omega)$ using $(AB)(\omega)=A(\omega)B(\omega)$`, why: r`Averaging comes last and uses locality; it keeps $|S|\le2$.` },
      ], r`Values first, case distinction, pointwise result, then average.`),
      sym('s2', r`Singlet, axes at angle $\theta$: type $P(\uparrow\uparrow)$ (both $+\frac\hbar2$ along their own axes), symbol <code>theta</code>.`, '(1-cos(theta))/4', { theta: [0.2, 3] }, 'dimensionless', DL, r`P_{++}=\tfrac14(1-\cos\theta)`, r`At $\theta=0$ the particles are anticorrelated, so $P_{++}=0$. By symmetry $P_{--}=P_{++}$ and $P_{+-}=P_{-+}=\frac14(1+\cos\theta)$.`, { wrong: ['(1+cos(theta))/4', 'sin(theta)/2', '(1-cos(theta))/2'] }),
      sym('s3', r`Type the correlation $C=P_{++}+P_{--}-P_{+-}-P_{-+}$ as a function of <code>theta</code>.`, '-cos(theta)', { theta: [0.2, 3] }, 'dimensionless', DL, r`C=-\cos\theta=-\vec n_1\cdot\vec n_2`, r`$C=\frac12(1-\cos\theta)-\frac12(1+\cos\theta)$; compare script (10.11).`, { wrong: ['cos(theta)', '-sin(theta)', '-cos(theta/2)'] }),
      sym('s4', r`Alice at $0$ and $\frac\pi2$, Bob at $\varphi$ and $-\varphi$: type $S(\varphi)$ for $0<\varphi<\frac\pi2$ (symbol <code>phi</code>).`, '2*(cos(phi)+sin(phi))', { phi: [0.1, 1.4] }, 'dimensionless', DL, r`S=2(\cos\varphi+\sin\varphi)`, r`The four angle differences are $\varphi$, $\frac\pi2-\varphi$, $\varphi$, $\frac\pi2+\varphi$; with $C=-\cos(\Delta)$ the sum has magnitude $2\cos\varphi+2\sin\varphi$.`, { wrong: ['2*(cos(phi)-sin(phi))', 'cos(phi)+sin(phi)', '2*cos(phi)'] }),
      choice('s5', r`What value of $\varphi$ maximises $S$, and what is the maximum?`, r`$\varphi=\frac\pi4$, $S=2\sqrt2$ (Tsirelson's bound)`, [[r`$\varphi=\frac\pi2$, $S=2$`, r`That is $2(\cos+\sin)=2$ at $\frac\pi2$, no violation.`], [r`$\varphi=0$, $S=4$`, r`4 is not reachable; $S(0)=2$.`], [r`$\varphi=\frac\pi4$, $S=4\sqrt2$`, r`$2(\frac{\sqrt2}2+\frac{\sqrt2}2)=2\sqrt2$.`]]),
      num('s6', r`Bonus: $S$ at $\varphi=\frac\pi4$.`, '2*(cos(phi)+sin(phi))', 'dimensionless', DL, 0.01, r`Insert $\varphi=\pi/4$: $2(0.7071+0.7071)=2.828$.`, { bonus: true }),
    ],
  }),
  calc({
    id: 'qm-ent-c2', title: 'Reduced density matrix and purity', source: [src.exam('FS16', 'D.4-D.7'), src.exam('HS14', 'E.3, E.5'), NOTES],
    problem: r`Two qubits are in the pure state $|\psi\rangle=\cos\alpha\,|00\rangle+\sin\alpha\,|11\rangle$. Determine the reduced density matrix of $A$, its purity and what it tells about the entanglement.`,
    symbols: [[r`$\alpha$`, r`mixing angle of the state`], [r`$\rho_A$`, r`reduced density matrix of $A$`], [r`$\mathrm{tr}\rho_A^2$`, r`purity of $A$`]],
    vars: { alpha: 0.39269908169872414 },
    derivation: [{ title: 'Method', html: r`<p>$\rho_A=\mathrm{tr}_B|\psi\rangle\langle\psi|=\cos^2\alpha\,|0\rangle\langle0|+\sin^2\alpha\,|1\rangle\langle1|$ (the coherences vanish since $\langle0|1\rangle_B=0$).</p>` }],
    steps: [
      choice('s1', r`How do you obtain the state of $A$ alone from $|\psi\rangle$?`, r`partial trace over $B$: $\rho_A=\mathrm{tr}_B|\psi\rangle\langle\psi|$`, [[r`delete all terms containing $|1\rangle_B$`, r`That is a projective measurement on $B$ with a particular result, not the average over results.`], [r`take $|\psi_A\rangle=\cos\alpha|0\rangle+\sin\alpha|1\rangle$`, r`That would be a pure superposition; the coherence $|0\rangle\langle1|$ is multiplied by $\langle1|0\rangle_B=0$.`], [r`take $\rho_A=\rho_{AB}$ since the state is pure`, r`$\rho_{AB}$ is $4\times4$; purity of the whole does not imply purity of the part.`]]),
      sym('s2', r`Type the entry $(\rho_A)_{00}$ (symbol <code>alpha</code>).`, 'cos(alpha)**2', { alpha: [0.1, 1.4] }, 'dimensionless', DL, r`(\rho_A)_{00}=\cos^2\alpha`, r`Probability that $A$ is found in $|0\rangle$: the $|00\rangle$ component squared.`, { wrong: ['cos(alpha)', 'sin(alpha)**2', 'cos(2*alpha)'] }),
      sym('s3', r`Type the purity $\mathrm{tr}\rho_A^2$.`, 'cos(alpha)**4+sin(alpha)**4', { alpha: [0.1, 1.4] }, 'dimensionless', DL, r`\mathrm{tr}\rho_A^2=\cos^4\alpha+\sin^4\alpha`, r`$\rho_A$ is diagonal with entries $\cos^2\alpha,\sin^2\alpha$, so the trace of its square is the sum of the squares.`, { wrong: ['cos(alpha)**2+sin(alpha)**2', 'cos(alpha)**2*sin(alpha)**2', '1-sin(2*alpha)'] }),
      choice('s4', r`Interpretation of the purity.`, r`$\alpha=0$ gives purity 1 (product state), $\alpha=\frac\pi4$ gives the minimum $\frac12$ (maximally entangled Bell state $\Phi^+$)`, [[r`purity 1 means maximally entangled`, r`Purity 1 of $\rho_A$ means $A$ is in a pure state: no entanglement.`], [r`purity is $\frac12$ for every $\alpha$`, r`$\cos^4\alpha+\sin^4\alpha=1-\frac12\sin^22\alpha$ depends on $\alpha$.`], [r`purity below 1 means the state of $AB$ is mixed`, r`$AB$ is pure by construction; it is the subsystem that is mixed.`]]),
      num('s5', r`Bonus: the purity for $\alpha=\frac\pi8$.`, 'cos(alpha)**4+sin(alpha)**4', 'dimensionless', DL, 0.01, r`$1-\frac12\sin^2(\pi/4)=1-\frac14=0.75$.`, { bonus: true }),
    ],
  }),
  calc({
    id: 'qm-ent-c3', title: 'Teleporting a spin state', source: [src.script('Ch. 10.3, pp. 111-113'), NOTES],
    problem: r`Alice and Bob share the singlet (particles 1, 2). Alice holds particle 0 in the unknown state $|\varphi\rangle=a|{\uparrow}\rangle+b|{\downarrow}\rangle$ and measures particles $0,1$ in the Bell basis $\chi_1..\chi_4$. Work out what Bob must do.`,
    symbols: [[r`$a,b$`, r`amplitudes of $|\varphi\rangle$ with $|a|^2+|b|^2=1$`], [r`$\chi_i$`, r`Bell basis of particles $0,1$ (script 10.3)`], [r`$\sigma_k$`, r`Pauli matrices used for the correction`]],
    vars: { a: 0.6, b: 0.8 },
    derivation: [{ title: 'Method', html: r`<p>$|\varphi\rangle|\psi\rangle=\frac12\sum_i|\chi_i\rangle\otimes|\text{Bob}_i\rangle$ with $|\text{Bob}_i\rangle=U_i^{-1}|\varphi\rangle$ up to phases (script 10.14 and table).</p>` }],
    steps: [
      order('s1', r`Order the teleportation protocol.`, [
        { text: r`create the singlet of particles 1 (Alice) and 2 (Bob) and separate them`, why: r`The shared entanglement is the resource and must exist first.` },
        { text: r`Alice measures particles $0,1$ in the Bell basis $\chi_i$`, why: r`The unknown $|\varphi\rangle$ is on particle 0; the measurement projects Bob's particle.` },
        { text: r`Alice sends the result $i$ (2 classical bits) to Bob`, why: r`Bob cannot know the outcome otherwise, so no signal faster than light.` },
        { text: r`Bob applies $\mathbb 1,\sigma_3,\sigma_1,\sigma_2$ to particle 2`, why: r`The correction needs the bits and ends the protocol.` },
      ], r`Resource, measurement, communication, correction.`),
      choice('s2', r`Without receiving the bits, Bob's particle is in the state`, r`$\rho_B=\frac12\mathbb 1$ (all four outcomes equally likely, corrections differ)`, [[r`$|\varphi\rangle$, so the classical bits are not needed`, r`Only after the correction by $U_i$ does Bob hold $|\varphi\rangle$.`], [r`$\sigma_1|\varphi\rangle$`, r`That is only the state for outcome 3.`], [r`$|{\uparrow}\rangle\langle{\uparrow}|$`, r`The average $\frac14\sum_i U_i^{-1}|\varphi\rangle\langle\varphi|U_i$ is $\frac12\mathbb 1$.`]]),
      sym('s3', r`For outcome $\chi_3$ Bob's particle is $a|{\downarrow}\rangle+b|{\uparrow}\rangle$. Type the coefficient of $|{\uparrow}\rangle$ (symbols <code>a</code>, <code>b</code>).`, 'b', { a: [0.1, 0.9], b: [0.1, 0.9] }, 'dimensionless', DL, r`c_\uparrow=b`, r`Script: $P_3|\varphi\rangle|\psi\rangle=\frac12|\chi_3\rangle\otimes(|{\downarrow}\rangle\langle{\uparrow}|\varphi\rangle+|{\uparrow}\rangle\langle{\downarrow}|\varphi\rangle)$; the spin up component comes from $\langle{\downarrow}|\varphi\rangle=b$.`, { wrong: ['a', '-b', 'a*b'] }),
      choice('s4', r`Which operation restores $|\varphi\rangle$ for outcome $\chi_3$?`, r`$\sigma_1$ (it swaps up and down)`, [[r`$\sigma_3$`, r`$\sigma_3$ only flips the sign of the down component (outcome 2).`], [r`$\sigma_2$`, r`$\sigma_2$ belongs to outcome 4.`], [r`$\mathbb 1$`, r`That is outcome 1.`]]),
      num('s5', r`Bonus: probability of outcome $\chi_3$ for $a=0.6$, $b=0.8$.`, '(a**2+b**2)/4', 'dimensionless', DL, 0.02, r`Each term is $\frac12|\chi_i\rangle\otimes|\text{Bob}_i\rangle$ with $\||\text{Bob}_i\rangle\|^2=|a|^2+|b|^2=1$, so $p_i=\frac14$.`, { bonus: true }),
    ],
  }),
];
