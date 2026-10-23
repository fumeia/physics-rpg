import { src, choice, sym, order, num, T, calc } from '../lib.mjs';
const r = String.raw;

export const calcs = [
  calc({
    id: 'qm-fu-c1', title: r`Measurement and spread of $L_z$ in a spin-1 superposition`, xp: 55,
    problem: r`An $l=1$ system is prepared in $|\psi\rangle=\cos\theta\,|1,1\rangle+\sin\theta\,|1,0\rangle$ (basis of $L_z$ eigenstates $m=1,0,-1$). Find the outcome probabilities of an $L_z$ measurement, $\langle L_z\rangle$ and $\Delta L_z$. Style: FS26 Q1 (measurement probabilities and uncertainties); the state is chosen here.`,
    symbols: [[r`$\theta$`, r`mixing angle of the superposition`], [r`$\hbar$`, r`Planck constant over $2\pi$`], [r`$W(m)$`, r`probability to measure $L_z=m\hbar$`], [r`$P_m$`, r`projector $|1,m\rangle\langle1,m|$`]],
    vars: { th: 0.5235987756 },
    derivation: [{ title: 'Method', html: r`<p>$L_z$ is diagonal in the given basis, so $W(m)=\langle\psi|P_m|\psi\rangle=|c_m|^2$. Then $\langle L_z\rangle=\sum_mm\hbar W(m)$ and $(\Delta L_z)^2=\langle L_z^2\rangle-\langle L_z\rangle^2$.</p>` }],
    steps: [
      choice('s1', r`Which statement gives the probability of measuring $L_z=0$?`, r`$W(0)=\langle\psi|P_0|\psi\rangle=|\langle1,0|\psi\rangle|^2=\sin^2\theta$`, [[r`$W(0)=\sin\theta$`, r`Probabilities are squared moduli of amplitudes.`], [r`$W(0)=\cos^2\theta$`, r`That is the probability of $m=1$: the coefficient of $|1,1\rangle$ is $\cos\theta$.`], [r`$W(0)=\tfrac13$`, r`Equal weights hold only for a uniformly random state, not for this prepared state.`]]),
      order('s2', r`Order the steps that give $\Delta L_z$.`, [
        { text: r`Read off the amplitudes $c_1=\cos\theta$, $c_0=\sin\theta$, $c_{-1}=0$`, note: r`normalised: $\cos^2+\sin^2=1$`, why: r`Everything follows from the amplitudes in the eigenbasis of the measured observable.` },
        { text: r`Probabilities $W(m)=|c_m|^2$`, note: r`projection postulate`, why: r`Needs the amplitudes.` },
        { text: r`$\langle L_z\rangle=\sum m\hbar W(m)$ and $\langle L_z^2\rangle=\sum m^2\hbar^2W(m)$`, note: r`weighted averages`, why: r`Needs the probabilities.` },
        { text: r`$\Delta L_z=\sqrt{\langle L_z^2\rangle-\langle L_z\rangle^2}$`, note: r`variance last`, why: r`Needs both moments; a variance cannot be computed from the mean alone.` },
      ], r`amplitudes, probabilities, first and second moment, variance.`),
      sym('s3', r`Type $\langle L_z\rangle$ (symbols <code>hbar</code>, <code>th</code>).`, 'hbar*cos(th)**2', { hbar: [0.5, 2], th: [0.2, 1.3] }, 'action', ['action', 'dimensionless', 'energy', 'action^2'], r`\langle L_z\rangle=\hbar\cos^2\theta`, r`Only $m=1$ contributes: $1\cdot\hbar\cdot\cos^2\theta+0\cdot\sin^2\theta$.`, { wrong: ['hbar*cos(th)', 'hbar*sin(th)**2', 'hbar**2*cos(th)**2'] }),
      sym('s4', r`Type $\Delta L_z$ (symbols <code>hbar</code>, <code>th</code>).`, 'hbar*cos(th)*sin(th)', { hbar: [0.5, 2], th: [0.2, 1.3] }, 'action', ['action', 'dimensionless', 'action^2', 'energy'], r`\Delta L_z=\hbar\,|\cos\theta\sin\theta|`, r`$\langle L_z^2\rangle=\hbar^2\cos^2\theta$, so $(\Delta L_z)^2=\hbar^2\cos^2\theta(1-\cos^2\theta)$. The spread vanishes for $\theta=0$ (eigenstate) and for $\theta=\pi/2$ (the state is an $m=0$ eigenstate).`, { wrong: ['hbar*cos(th)**2', 'hbar*sin(th)**2*cos(th)', 'hbar**2*cos(th)*sin(th)'] }),
      num('s5', r`Bonus: $\Delta L_z/\hbar$ for $\theta=\pi/6$ (<code>th</code> in vars).`, 'cos(th)*sin(th)', 'ħ', ['ħ', 'ħ²', 'dimensionless'], 0.02, r`$\cos\frac\pi6\sin\frac\pi6=\frac{\sqrt3}{2}\cdot\frac12=0.433$.`, { bonus: true }),
    ],
  }),
  calc({
    id: 'qm-fu-c2', title: r`Heisenberg picture of the oscillator: $x_H(t)$ and Ehrenfest`, xp: 60,
    problem: r`For $H=\frac{p^2}{2m}+\frac12m\omega^2x^2$ derive the Heisenberg equations of motion, solve them and give $\langle x\rangle(t)$ for a state with $\langle x\rangle_0=x_0$, $\langle p\rangle_0=p_0$. Source: HS18 Q3 (ii)-(iii), FS22 Q3 (Heisenberg picture), HS21 Q1 (Ehrenfest).`,
    symbols: [[r`$x_0,p_0$`, r`initial expectation values $\langle x\rangle,\langle p\rangle$`], [r`$m,\omega$`, r`mass and angular frequency`], [r`$t$`, r`time`], [r`$x_H(t)$`, r`Heisenberg operator $U^\dagger xU$`]],
    vars: { x0: 1, p0: 0.5, m: 1, w: 2, t: 0.3926990817 },
    derivation: [{ title: 'Method', html: r`<p>$\dot A_H=\frac i\hbar[H,A_H]$. With $[H,x]=-i\hbar p/m$ and $[H,p]=i\hbar m\omega^2x$ the equations are linear and closed, so they are solved exactly (as in the classical oscillator).</p>` }],
    steps: [
      choice('s1', r`Which pair of Heisenberg equations is correct?`, r`$\dot x_H=p_H/m$, $\dot p_H=-m\omega^2x_H$`, [[r`$\dot x_H=-p_H/m$, $\dot p_H=-m\omega^2x_H$`, r`Sign: $\frac i\hbar[H,x]=\frac i\hbar(-i\hbar p/m)=+p/m$.`], [r`$\dot x_H=p_H/m$, $\dot p_H=+m\omega^2x_H$`, r`$\frac i\hbar[H,p]=\frac i\hbar(i\hbar m\omega^2x)=-m\omega^2x$: the restoring force.`], [r`$\dot x_H=\frac{i}{\hbar}[x_H,H]$`, r`The commutator order is reversed; this flips the sign.`]]),
      order('s2', r`Order the solution steps.`, [
        { text: r`Compute $[H,x]$ and $[H,p]$ from $[x,p]=i\hbar$`, note: r`$-i\hbar p/m$, $i\hbar m\omega^2x$`, why: r`The commutators are the input of the Heisenberg equation.` },
        { text: r`Write $\dot x_H=p_H/m$, $\dot p_H=-m\omega^2x_H$`, note: r`operator equations`, why: r`Uses the commutators.` },
        { text: r`Decouple: $\ddot x_H=-\omega^2x_H$ and solve with the initial values $x_H(0)=x$, $p_H(0)=p$`, note: r`$x_H=x\cos\omega t+\frac p{m\omega}\sin\omega t$`, why: r`Needs the first-order system.` },
        { text: r`Take the expectation value in the (time-independent) Heisenberg state`, note: r`$\langle x\rangle_0=x_0$, $\langle p\rangle_0=p_0$`, why: r`Expectation values come last: the operator solution holds for every state.` },
      ], r`commutators, equations of motion, solve, expectation value.`),
      sym('s3', r`Type $\langle x\rangle(t)$ (symbols <code>x0</code>, <code>p0</code>, <code>m</code>, <code>w</code>, <code>t</code>).`, 'x0*cos(w*t)+p0*sin(w*t)/(m*w)', { x0: [0.5, 2], p0: [0.5, 2], m: [0.5, 2], w: [0.5, 2], t: [0.1, 2] }, 'length', ['length', 'momentum', 'dimensionless', 'energy'], r`\langle x\rangle(t)=x_0\cos\omega t+\frac{p_0}{m\omega}\sin\omega t`, r`Initial conditions: $x(0)=x_0$, $\dot x(0)=p_0/m$, and the solution of $\ddot x=-\omega^2x$.`, { wrong: ['x0*cos(w*t)+p0*sin(w*t)/m', 'x0*cos(w*t)+p0*m*w*sin(w*t)', 'x0*sin(w*t)+p0*cos(w*t)/(m*w)'] }),
      choice('s4', r`What is $[x_H(t),p_H(t)]$ at time $t$?`, r`$i\hbar$ for all $t$: $[U^\dagger xU,U^\dagger pU]=U^\dagger[x,p]U=i\hbar$`, [[r`$i\hbar\cos^2\omega t$`, r`Compute with the solution: the $\sin\cos$ cross terms cancel and $\cos^2+\sin^2=1$.`], [r`$0$ for $t>0$`, r`Unitary conjugation preserves commutators.`], [r`depends on the state`, r`A c-number commutator is the same in every state.`]]),
      num('s5', r`Bonus: $\langle x\rangle$ for $x_0=1$, $p_0=0.5$, $m=1$, $\omega=2$ at $t=\pi/8$ (vars).`, 'x0*cos(w*t)+p0*sin(w*t)/(m*w)', 'dimensionless', ['dimensionless', 'm', 'ħ'], 0.02, r`$\omega t=\pi/4$: $\cos=\sin=0.7071$; $0.7071+0.5\cdot0.7071/2=0.884$.`, { bonus: true }),
    ],
  }),
  calc({
    id: 'qm-fu-c3', title: r`The stronger uncertainty relation for spin-1/2 (HS18 Q2 (iv))`, xp: 65,
    problem: r`Spin-1/2 in the state $|\psi\rangle=\cos\frac\theta2|\uparrow\rangle+e^{i\varphi}\sin\frac\theta2|\downarrow\rangle$. For $A=\sigma_x$, $B=\sigma_y$ evaluate both sides of $(\Delta A)^2(\Delta B)^2\ge\frac14\langle i[A,B]\rangle^2+\frac14\langle\{\hat A,\hat B\}\rangle^2$. Use $\langle\sigma_x\rangle=\sin\theta\cos\varphi$, $\langle\sigma_y\rangle=\sin\theta\sin\varphi$, $\langle\sigma_z\rangle=\cos\theta$. Source: inequality (15) of HS18 Q2 applied to spin (the state is chosen here).`,
    symbols: [[r`$\theta,\varphi$`, r`polar and azimuthal angle of the Bloch vector`], [r`$\hat A,\hat B$`, r`$A-\langle A\rangle$, $B-\langle B\rangle$`], [r`$\sigma_i$`, r`Pauli matrices, $\sigma_x^2=\mathbb 1$`], [r`$\{\cdot,\cdot\}$`, r`anticommutator`]],
    vars: { th: 1.5707963268, ph: 0.7853981634 },
    derivation: [{ title: 'Method', html: r`<p>$\sigma_i^2=\mathbb 1$ gives $(\Delta\sigma_i)^2=1-\langle\sigma_i\rangle^2$. $[\sigma_x,\sigma_y]=2i\sigma_z$ and $\{\sigma_x,\sigma_y\}=0$, so $\langle\{\hat A,\hat B\}\rangle=-2\langle\sigma_x\rangle\langle\sigma_y\rangle$.</p>` }],
    steps: [
      choice('s1', r`What is $\frac12|\langle[\sigma_x,\sigma_y]\rangle|$, the textbook bound?`, r`$|\langle\sigma_z\rangle|=|\cos\theta|$, from $[\sigma_x,\sigma_y]=2i\sigma_z$`, [[r`$2|\langle\sigma_z\rangle|$`, r`The factor $\frac12$ of the relation cancels the 2 of the commutator.`], [r`$1$, always`, r`The commutator is an operator ($\sigma_z$), so the bound is state dependent.`], [r`$|\langle\sigma_x\sigma_y\rangle|$`, r`That is not the commutator expectation value; $\langle\sigma_x\sigma_y\rangle=i\langle\sigma_z\rangle$ and the anticommutator vanishes, but one must use $[\sigma_x,\sigma_y]$.`]]),
      sym('s2', r`Type the left side $(\Delta\sigma_x)^2(\Delta\sigma_y)^2$ (symbols <code>th</code>, <code>ph</code>).`, '(1-sin(th)**2*cos(ph)**2)*(1-sin(th)**2*sin(ph)**2)', { th: [0.2, 1.4], ph: [0.2, 1.4] }, 'dimensionless', ['dimensionless', 'action', 'action^2', 'angle'], r`(\Delta\sigma_x)^2(\Delta\sigma_y)^2=(1-\sin^2\theta\cos^2\varphi)(1-\sin^2\theta\sin^2\varphi)`, r`$(\Delta\sigma_i)^2=\langle\sigma_i^2\rangle-\langle\sigma_i\rangle^2=1-\langle\sigma_i\rangle^2$.`, { wrong: ['(1-sin(th)*cos(ph))*(1-sin(th)*sin(ph))', '(1-sin(th)**2)', 'cos(th)**2'] }),
      sym('s3', r`Type the anticommutator term $\frac14\langle\{\hat A,\hat B\}\rangle^2$ (symbols <code>th</code>, <code>ph</code>).`, 'sin(th)**4*cos(ph)**2*sin(ph)**2', { th: [0.2, 1.4], ph: [0.2, 1.4] }, 'dimensionless', ['dimensionless', 'action', 'action^2', 'angle'], r`\tfrac14\langle\{\hat A,\hat B\}\rangle^2=\sin^4\theta\cos^2\varphi\sin^2\varphi`, r`$\{\hat\sigma_x,\hat\sigma_y\}=\{\sigma_x,\sigma_y\}-2\langle\sigma_x\rangle\sigma_y-2\langle\sigma_y\rangle\sigma_x+2\langle\sigma_x\rangle\langle\sigma_y\rangle=-2\langle\sigma_x\rangle\sigma_y-\dots$; its expectation value is $-2\langle\sigma_x\rangle\langle\sigma_y\rangle$.`, { wrong: ['sin(th)**2*cos(ph)*sin(ph)', 'sin(th)**4*cos(ph)*sin(ph)', 'cos(th)**2'] }),
      order('s4', r`Order the verification of (15).`, [
        { text: r`Evaluate the variances $1-\langle\sigma_i\rangle^2$ and multiply`, note: r`left side`, why: r`Defines the left-hand side.` },
        { text: r`Evaluate $\langle i[\sigma_x,\sigma_y]\rangle=-2\langle\sigma_z\rangle$, square and divide by 4`, note: r`$\cos^2\theta$`, why: r`Independent of the previous steps; gives the commutator term.` },
        { text: r`Evaluate $\langle\{\hat\sigma_x,\hat\sigma_y\}\rangle=-2\langle\sigma_x\rangle\langle\sigma_y\rangle$, square and divide by 4`, note: r`$\sin^4\theta\cos^2\varphi\sin^2\varphi$`, why: r`The covariance term; needs the means.` },
        { text: r`Compare: $\cos^2\theta+\sin^4\theta\cos^2\varphi\sin^2\varphi$ equals the left side exactly`, note: r`equality for spin-1/2`, why: r`Last: needs all three.` },
      ], r`left side, commutator term, anticommutator term, compare.`),
      num('s5', r`Bonus: left side at $\theta=\pi/2$, $\varphi=\pi/4$ (vars <code>th</code>, <code>ph</code>).`, '(1-sin(th)**2*cos(ph)**2)*(1-sin(th)**2*sin(ph)**2)', 'dimensionless', ['dimensionless', 'ħ²'], 0.02, r`$\sin^2\theta\cos^2\varphi=\frac12$ for both, so the product is $\frac14$; here the textbook bound $\cos^2\theta=0$ is far from sharp, the stronger bound (0.25) is exact.`, { bonus: true }),
    ],
  }),
];
