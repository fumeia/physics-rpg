# Solid State 01: crystals, reciprocal lattice, diffraction

Sources: script 2026 (`materials/solid-state/scripts/Script-2026_2026-09-01.pdf`) Ch. 1.2–1.5 (pp. 5–23); Zheludev exams HS23 Jan 2024
(`HS23.pdf`, solution `… (Solution) (1).pdf`) and Aug 2024 (`HS23 (1).pdf`, solution `… (Solution).pdf`) Problem 1; Ensslin HS20 Task 2 (BaTiO3)
and MC (e),(f),(g),(h),(k). Game rooms: `game/content/solid-state/lattice-gate.json`. Numbers verified in `game/test/content-check-solid-state.mjs`.
(Figures were read from the rendered exam pages; descriptions below.)

## Definitions (script 1.2–1.3)
- Bravais lattice: $\vec R=n_1\vec a+n_2\vec b+n_3\vec c$. **Primitive cell**: smallest cell, one lattice point, volume $V=\vec a\cdot(\vec b\times\vec c)$.
  **Basis**: the atoms inside a primitive cell, given in fractional coordinates $\vec r_j=x_1\vec a+x_2\vec b+x_3\vec c$.
  Crystal = lattice $\ast$ basis. A cell that contains extra lattice points (centred cell) is **not primitive**: count lattice points, not atoms.
- **Wigner–Seitz cell**: all points closer to a given lattice point than to any other (bisector planes). Same area/volume as any primitive cell.
- Allowed rotation axes of a lattice: 1, 2, 3, 4, 6 (HS20 MC (f): the regular 5-, 7-, 8-gon cannot be unit cells; a regular hexagon can).
- **Reciprocal lattice** (script 1.4–1.5): $\vec a^*=\frac{2\pi}{V}\vec b\times\vec c$ and cyclic, so $\vec a\cdot\vec a^*=2\pi$, $\vec a\cdot\vec b^*=0$.
  $\vec G=h\vec a^*+k\vec b^*+l\vec c^*$ with integers $h,k,l$; $e^{i\vec G\cdot\vec R}=1$; $V^*=(2\pi)^3/V$. Reciprocal of bcc is fcc and vice versa.
  **Always build it from the primitive translations**; the reciprocal of a non-primitive cell lacks points (this is the point of the exam's two-step 2D problem).
- 2D exam version: $\vec a^*=\frac{2\pi}{A}(\vec b\times\hat z)$, $\vec b^*=\frac{2\pi}{A}(\hat z\times\vec a)$, $A$ the primitive-cell area. For a rectangle $|\vec a^*|=2\pi/a$ along $\vec a$.
- **First Brillouin zone** = Wigner–Seitz cell of the reciprocal lattice; area $A^*=(2\pi)^2/A$ (2D), volume $(2\pi)^3/V$ (3D). Every BZ has the same volume.
- Miller indices $(hkl)$: plane through $(1/h,1/k,1/l)$; spacing $d_{hkl}=2\pi/|\vec G_{hkl}|$ ($=a/\sqrt{h^2+k^2+l^2}$ cubic).

## Diffraction (script 1.5, pp. 15–23)
- Scattering density $\rho(\vec r)$ periodic. Scattered amplitude $\propto\sum_{\vec R}e^{i\vec K\cdot\vec R}F(\vec K)$, $\vec K=\vec k_f-\vec k_i$.
  Intensity (1.33): $I\propto N|F(\vec K)|^2$ if $\vec K=\vec G$, zero otherwise.
- **Structure factor** $F(\vec G)=\sum_jf_je^{i\vec G\cdot\vec r_j}$, with $\vec G\cdot\vec r_j=2\pi(hx_1+kx_2+lx_3)$ (1.9). Intensity $I=|F|^2$.
- Elastic: $|\vec k_f|=|\vec k_i|=2\pi/\lambda$. Laue: $\vec G=\vec k_f-\vec k_i$, so $|\vec G|=2k\sin\theta$, i.e. $4\pi\sin\theta/\lambda=|\vec G|$ and Bragg $2d_{hkl}\sin\theta=n\lambda$.
  **$2\theta$ is the scattering angle** (angle between $\vec k_i$ and $\vec k_f$); $\theta$ is the Bragg angle. The Zheludev key gives $\theta$ and calls it "the scattering angle": give both.
- Ewald sphere: radius $k$ through the origin of reciprocal space; reflections occur where it hits a reciprocal lattice point; all reflections lie within $|\vec G|\le2k$.
  Debye–Scherrer (powder): all orientations are present, so every reciprocal lattice point inside the ball of radius $2|\vec k_0|$ around the *origin* produces a ring (HS20 MC (h): key = "all reflections inside a sphere of radius $2|\vec k_0|$ around the origin", not only those on one sphere).
- Extinctions: bcc has $F=f(1+e^{i\pi(h+k+l)})$ so $h+k+l$ must be even; fcc: $h,k,l$ all even or all odd. Same atom at $(\frac12,\frac12)$ in a 2D rectangle
  ($F=f(1+e^{i\pi(h+k)})$) kills $h+k$ odd: that is a centred rectangular lattice.
- Why neutrons: $E[\mathrm{meV}]=81.8/\lambda[\text{Å}]^2$, so $\lambda=2.36$ Å gives 14.7 meV (phonon energies); X-rays at that $\lambda$: 5.25 keV. See note 02.

## Exam problems transcribed
**HS23 Jan 2024, P1** (figure: rectangle $a=6.0$ Å $\times$ $b=4.0$ Å; filled circles at the corners (a lattice), hollow circles at the centre $(\frac12,\frac12)$; $f_1$ filled, $f_2$ hollow; neutrons $\lambda=2.36$ Å):
$A=24$ Å², basis $(0,0),(\frac12,\frac12)$; BZ area $(2\pi)^2/24=1.64$ Å$^{-2}$; $|\vec k|=2.66$ Å$^{-1}$; $\theta(2,1)=29.5^\circ$, $\theta(1,1)=20.7^\circ$ (key: $\arcsin\frac\lambda2\sqrt{(h/a)^2+(k/b)^2}$);
$F(2,1)=f_1-f_2$, $F(1,1)=f_1+f_2$, ratio $(1/3)^2$ for $f_1=2f_2$; for $f_1=f_2$ the $(2,1)$ peak vanishes.
Then all atoms identical: the $a\times b$ cell is no longer primitive, primitive area $ab/2=12$ Å², WS area 12, one atom, BZ area $(2\pi)^2/12=3.29$ Å$^{-2}$.
**HS23 Aug 2024, P1** ($\vec a=(0,4)$, $\vec b=(5,0)$ Å, $\vec d=\frac12(\vec a+\vec b)$): primitive cell $(\vec a\pm\vec b)/2$, area 10 Å², BZ 3.95 Å$^{-2}$; shift atoms to $\vec d=\frac13(\vec a+\vec b)$: $\vec a,\vec b$ primitive, two-atom basis $(0,0),(\frac13,\frac13)$, area 20 Å², BZ 1.97 Å$^{-2}$;
$\theta(2,1)=39.5^\circ$, $\theta(1,1)=22.2^\circ$; $F=f(1+e^{2\pi i(h+k)/3})$: $I(2,1)/I(1,1)=4$.
**HS20 Task 2** (BaTiO3: Ba at cube corners, Ti at the centre, O at face centres, cube edge $a$): simple cubic, 5-atom basis Ba $(0,0,0)$, Ti $(\frac12,\frac12,\frac12)$, O $(\frac12,\frac12,0),(\frac12,0,\frac12),(0,\frac12,\frac12)$; reciprocal lattice simple cubic with edge $2\pi/a$; first BZ a cube, all BZ volumes $(2\pi/a)^3$;
$S(hkl)=f_{Ba}+f_{Ti}e^{i\pi(h+k+l)}+f_O(e^{i\pi(h+k)}+e^{i\pi(h+l)}+e^{i\pi(k+l)})$; with $f_{Ba}=5f_O$, $f_{Ti}=4f_O$: $S(110)=8f_O$, $S(200)=12f_O$, $I(200)/I(110)=9/4$.

## Checklist for lattice problems
1. Draw the lattice points, choose $\vec a,\vec b$ **primitive** (count lattice points per cell). 2. Basis in fractional coordinates of *that* cell. 3. $A$, then $A^*=(2\pi)^2/A$.
4. Reciprocal lattice from the primitive vectors; BZ by bisectors of the nearest points. 5. $F(hkl)$ with the basis you chose (a different primitive cell relabels $h,k$ but not the physics).
6. $\sin\theta=\lambda|\vec G|/4\pi$, report $\theta$ and $2\theta$.

## Connections
- QM: $\lambda=h/p$ for neutrons; plane waves and Fourier analysis; the transfer-matrix reflection of sheet 5 is the 1D version of Bragg reflection.
- Astro: spectral gratings (grating equation = Laue in 1D); X-ray astronomy.
