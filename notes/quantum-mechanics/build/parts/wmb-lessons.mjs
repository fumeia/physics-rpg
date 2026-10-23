import { src, qz, T, EQ, I, P, X, lesson } from '../lib.mjs';
const r = String.raw;
const NOTES = src.notes('ch02-wave-mechanics');

export const lessons = [
  lesson({
    id: 'qm-wm-L1', title: 'From photons to matter waves: Compton, de Broglie, the Bohr orbit', minutes: 12,
    source: [src.script('Ch. 1.4-1.5, pp. 12-13 (Compton, de Broglie)'), src.ex(1, 'Q1 Compton, Q2 Bohr atom and de Broglie'), NOTES],
    blocks: [
      T(r`<b>Photon as particle.</b> A photon of wavelength $\lambda$ carries the four-momentum $p^\mu=(\hbar k,\hbar\vec k)$, $k=\omega/c=2\pi/\lambda$ (script 1.23). In Compton scattering off an electron at rest, energy and momentum conservation (square the electron momentum to eliminate its angle) give a wavelength shift that depends only on the scattering angle:`),
      EQ(r`\lambda_2-\lambda_1=\frac{h}{mc}\,(1-\cos\theta),\qquad \lambda_C=\frac h{mc}=2.426\times10^{-12}\ \text{m}`, 'script Ch. 1.4; sheet I Q1(ii)'),
      T(r`Classical (Thomson) scattering predicts <b>no</b> shift: the driven electron radiates at the driving frequency. The shift is visible only if $\lambda_C$ is a noticeable fraction of $\lambda$: hard X-rays ($\lambda\sim10^{-11}$ m) yes, visible light ($10^{-7}$ m, relative shift $\lesssim10^{-4}$) no.`),
      T(r`<b>Matter as wave.</b> De Broglie postulates the same relation for particles (script 1.24, 2.1):`),
      EQ(r`\lambda=\frac{2\pi\hbar}{p}=\frac hp,\qquad \omega=\frac E\hbar\qquad\Longrightarrow\qquad \Psi(x,t)=\Psi(0,0)\,e^{ipx/\hbar-iEt/\hbar}`, 'Davisson-Germer confirmed it with electron diffraction on a crystal'),
      T(r`<b>Bohr orbits as standing waves (sheet I Q2).</b> Bohr's quantisation $mv_nr_n=n\hbar$ is the same as $2\pi r_n=n\lambda$: the de Broglie wave closes on itself, $\lambda/r_n=2\pi\hbar/(mv_nr_n)=2\pi/n$. With $r_n=n^2a_0$ and $v_n=\alpha c/n$ the electron is non-relativistic ($v_1=2.19\times10^6$ m/s, $v_1/c=1/137$), so $p=mv$ is justified.`),
      I(r`Quantisation is a <b>resonance condition</b>: only waves that fit survive. This is the seed of the box spectrum (lesson 4): $n\lambda/2=a$.`),
      P(r`(1) Compton shifts the <b>wavelength</b>, not the frequency of the scattered light by a classical factor; the shift is independent of $\lambda_1$. (2) $\lambda_C=h/mc$ uses the electron mass; the photon has no rest mass. (3) $hc=1239.84$ eV nm is the quickest route from photon energy to wavelength.`),
      X(r`Sheet I (Gaberdiel HS25), Q1-Q2: derive the Compton formula from four-momentum conservation, explain why Thomson scattering is the limit $\lambda\gg h/mc$, and check $2\pi r_n=n\lambda$ for the Bohr orbits.`),
    ],
    check: [
      qz(r`A photon of wavelength $\lambda_1=0.0710$ nm is Compton scattered by $\theta=90^\circ$. The wavelength afterwards is`, r`$\lambda_1+\lambda_C\approx0.0734$ nm`, [[r`$\lambda_1$ (no shift at $90^\circ$)`, r`$1-\cos90^\circ=1$, so the shift is the full $\lambda_C$; the shift vanishes only for $\theta=0$.`], [r`$\lambda_1+2\lambda_C\approx0.0758$ nm`, r`$2\lambda_C$ is the maximum shift at $\theta=180^\circ$.`], [r`$\lambda_1-\lambda_C$`, r`The photon loses energy to the electron, so its wavelength grows.`]], r`$\Delta\lambda=\lambda_C(1-\cos\theta)=\lambda_C$ at $90^\circ$, $\lambda_C=2.43$ pm.`),
      qz(r`Why is the Compton effect not seen with visible light?`, r`$\lambda_C/\lambda\sim10^{-5}$: the relative shift is far below what a spectrometer resolves`, [[r`visible photons carry no momentum`, r`$p=h/\lambda$ holds for all photons; the effect is only tiny.`], [r`the electron is too heavy`, r`The electron mass sets $\lambda_C$ itself; the point is the ratio $\lambda_C/\lambda$.`], [r`energy conservation fails for visible light`, r`Energy and momentum conservation hold at all wavelengths.`]], r`$\Delta\lambda/\lambda\le2\lambda_C/\lambda\approx5\times10^{-5}$ for $\lambda=500$ nm.`),
      qz(r`In the Bohr model, de Broglie's relation turns $mv_nr_n=n\hbar$ into`, r`$2\pi r_n=n\lambda$: $n$ wavelengths fit around the orbit`, [[r`$r_n=n\lambda$`, r`The circumference, not the radius, must contain an integer number of wavelengths.`], [r`$\lambda=2r_n/n$`, r`That would be diameter instead of circumference.`], [r`$\lambda=r_n/n$`, r`$\lambda/r_n=2\pi/n$, not $1/n$.`]], r`$\lambda=h/p=2\pi\hbar/(mv_n)$ and $mv_nr_n=n\hbar$ give $\lambda=2\pi r_n/n$.`),
    ],
  }),
  lesson({
    id: 'qm-wm-L2', title: 'Schroedinger equation, probability current, Galilean invariance, Ehrenfest', minutes: 15,
    source: [src.script('Ch. 2.1-2.3, pp. 14-18'), src.ex(2, 'Q1 Ehrenfest, Q3 current'), src.ex(1, 'Q3 Galilean invariance'), src.exam('FS22', 'Question 1 (i)-(iv)'), src.exam('HS21', 'Question 1'), NOTES],
    blocks: [
      T(r`From $\lambda=2\pi\hbar/p$ and $\omega=E/\hbar$ one gets $\partial_x\Psi=\frac{ip}\hbar\Psi$ and $\partial_t\Psi=-\frac{iE}\hbar\Psi$; with $E=p^2/2m+V$ the postulate (script 2.7) is $i\hbar\partial_t\Psi=\big(-\frac{\hbar^2}{2m}\partial_x^2+V\big)\Psi$, $p=-i\hbar\partial_x$. Born: $\rho=|\Psi|^2$ with $\int\rho\,dx=1$ at all times.`),
      T(r`<b>Continuity equation (FS22 Q1(i), 4 pt).</b> Use the equation and its complex conjugate in $\partial_t\rho=\Psi^*\dot\Psi+\Psi\dot\Psi^*$; the $V$ terms cancel because $V$ is real, the rest is a total derivative:`),
      EQ(r`\partial_t\rho+\partial_xj=0,\qquad j=\frac{i\hbar}{2m}\big(\Psi\,\partial_x\Psi^*-\Psi^*\partial_x\Psi\big)=\frac\hbar m\,\mathrm{Im}\big(\Psi^*\partial_x\Psi\big)`, 'script 2.15-2.16'),
      T(r`<b>Examples.</b> $\Psi=Ae^{ikx/\hbar}e^{-iEt/\hbar}$ gives $j=|A|^2k/m$ (density times velocity). The superposition $Ae^{ikx/\hbar}+Be^{-ikx/\hbar}$ gives $j=(|A|^2-|B|^2)k/m$: the interference term drops out of $j$ (sheet II Q3). A real stationary wavefunction has $j=0$. For $E<V_0$ behind a step $\psi\propto e^{-\kappa x}$ is real up to a constant phase, so $j=0$ (FS22 Q1(iv)).`),
      T(r`<b>Galilean invariance (sheet I Q3).</b> If $\Psi(x,t)$ solves the free equation then so does the boosted wave. The phase factor is needed because $p\to p+mu$:`),
      EQ(r`\Psi_u(x,t)=\Psi(x-ut,t)\,\exp\!\Big[\frac{im}{\hbar}\big(ux-\tfrac12u^2t\big)\Big]`, 'check: the cross term -i hbar u dPsi/dx cancels the time derivative of the shifted argument'),
      T(r`<b>Ehrenfest theorem.</b> $\frac d{dt}\langle x\rangle=\frac1m\langle p\rangle$ and $m\frac{d^2}{dt^2}\langle x\rangle=-\langle\partial_xV\rangle$ (script 2.25-2.26). In Dirac notation (HS21 Q1) it is a commutator statement: $\frac d{dt}\langle A\rangle=\frac i\hbar\langle[H,A]\rangle$ with $[H,x]=-\frac{i\hbar}mp$ and $[H,p]=i\hbar V'(x)$.`),
      I(r`The centre of the packet obeys Newton's law <b>only with the average force</b> $\langle V'(x)\rangle$, not the force at the average position $V'(\langle x\rangle)$. They agree exactly for $V$ at most quadratic (harmonic oscillator: $\langle x\rangle$ follows the classical orbit for any state).`),
      P(r`(1) $j$ has the sign convention $\Psi\partial\Psi^*-\Psi^*\partial\Psi$ with prefactor $+\frac{i\hbar}{2m}$ in the script; swapping the order flips the sign. (2) The boost phase carries $-\frac12u^2t$: forgetting it breaks the time derivative. (3) Ehrenfest does not say $\langle x\rangle$ obeys the classical equation for anharmonic $V$.`),
      X(r`FS22 Q1 (17 pt): continuity equation, current of a plane wave, current for a step with $E>V_0$ and the check $\partial_xj=0$, and $j=0$ for $E<V_0$. HS21 Q1 (10 pt) and FS19 Q2(i) (5 pt): Ehrenfest.`),
    ],
    check: [
      qz(r`For $\Psi=Ae^{ikx/\hbar}+Be^{-ikx/\hbar}$ the probability current is`, r`$(|A|^2-|B|^2)\,k/m$`, [[r`$(|A|^2+|B|^2)\,k/m$`, r`The left-mover carries current in the $-x$ direction, so it subtracts.`], [r`$(|A|^2-|B|^2)\,k/m+2\,\mathrm{Re}(AB^*)\,k/m$`, r`The cross terms $\propto AB^*e^{2ikx/\hbar}$ cancel between $\Psi\partial\Psi^*$ and $\Psi^*\partial\Psi$.`], [r`$0$ for every $A,B$`, r`Only $|A|=|B|$ (a standing wave) gives $j=0$.`]], r`Each plane wave gives $\pm|\cdot|^2k/m$ and the cross terms cancel.`),
      qz(r`The boosted free solution $\Psi_u$ needs the phase $\exp[\frac{im}\hbar(ux-\frac12u^2t)]$ because`, r`momentum and energy shift as $p\to p+mu$, $E\to E+up+\frac12mu^2$`, [[r`the norm of $\Psi$ must stay 1`, r`$|\Psi_u|^2$ is just the shifted density; the phase does not affect the norm.`], [r`$\Psi(x-ut,t)$ alone is already a solution`, r`It is not: the shifted wave has the old momentum distribution, but a moving packet needs $p\to p+mu$, which the phase supplies.`], [r`the potential changes under the boost`, r`The equation is free, $V=0$.`]], r`Check: $i\hbar\partial_t\Psi_u$ and $-\frac{\hbar^2}{2m}\partial_x^2\Psi_u$ differ by $-i\hbar u\Psi'$ and $\frac m2u^2\Psi$ terms which the phase supplies.`),
      qz(r`Ehrenfest: $m\frac{d^2}{dt^2}\langle x\rangle=-\langle V'(x)\rangle$. For $V=\frac12m\omega^2x^2$ this equals $-m\omega^2\langle x\rangle$, because`, r`$V'$ is linear in $x$, so $\langle V'(x)\rangle=V'(\langle x\rangle)$`, [[r`all states are classical`, r`Spreading and quantum fluctuations exist; only $\langle x\rangle$ is exactly classical.`], [r`$\langle x^2\rangle=\langle x\rangle^2$`, r`The variance does not vanish; it is irrelevant here because $V'$ is linear.`], [r`$\hbar\to0$`, r`The statement is exact at finite $\hbar$ for the oscillator.`]], r`Average of a linear function = function of the average.`),
    ],
  }),
];
