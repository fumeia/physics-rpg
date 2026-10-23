// "Why is my answer wrong?": compares a wrong number with the expected one and names the typical slip
// (factor 2π from h vs ħ, factor 2 or 1/2, reciprocal, sign, wrong power of ten / unit prefix, eV vs J ...).
const PI = Math.PI, near = (a, b, t = 0.03) => Number.isFinite(a) && Number.isFinite(b) && b !== 0 && Math.abs(a / b - 1) < t;
const FACTORS = [
  [2 * PI, 'a factor $2\\pi$ too large: did you use $h$ where the formula needs $\\hbar$ (or $f$ instead of $\\omega$)?'],
  [1 / (2 * PI), 'a factor $2\\pi$ too small: did you use $\\hbar$ where the formula needs $h$ (or $\\omega$ instead of $f$)?'],
  [4 * PI, 'a factor $4\\pi$ too large: check the solid-angle or sphere-area factor ($4\\pi r^2$, $4\\pi\\epsilon_0$).'],
  [1 / (4 * PI), 'a factor $4\\pi$ too small: did you forget (or invert) a $4\\pi$ from a sphere or from $4\\pi\\epsilon_0$?'],
  [PI, 'a factor $\\pi$ too large: check a circle/sphere factor ($\\pi r^2$ vs $r^2$).'],
  [1 / PI, 'a factor $\\pi$ too small: did you drop a $\\pi$ (area of a circle, $\\pi^2$ in a sum)?'],
  [2, 'a factor 2 too large: did you count something twice (two spin states, both signs, $2\\kappa$ vs $\\kappa$, diameter vs radius)?'],
  [0.5, 'a factor 2 too small: did you forget a 2 (spin degeneracy, $2\\kappa a$ in the exponent, $\\tfrac12$ in $\\tfrac12mv^2$ used twice)?'],
  [4, 'a factor 4 too large: a factor 2 squared? Check whether a radius/diameter or an amplitude/intensity ($|\\cdot|^2$) got mixed up.'],
  [0.25, 'a factor 4 too small: a factor 2 squared? Check radius vs diameter or amplitude vs intensity.'],
  [Math.SQRT2, 'a factor $\\sqrt2$ too large: check $\\sqrt{2}$ from $\\sqrt{2mE}$, rms vs peak, or a missing $1/\\sqrt2$.'],
  [1 / Math.SQRT2, 'a factor $\\sqrt2$ too small: check $\\sqrt{2}$ from $\\sqrt{2mE}$ or rms vs peak.'],
  [3, 'a factor 3 too large: check $3/2\\,k_BT$ vs $k_BT$, or $\\tfrac43\\pi r^3$ vs $r^3$.'],
  [1 / 3, 'a factor 3 too small: check the $1/3$ in a volume ($\\tfrac43\\pi r^3$) or in $\\langle v_x^2\\rangle$.'],
  [1.602176634e-19, 'a factor $1.6\\times10^{-19}$: you converted eV to J once too often (or the other way round).'],
  [1 / 1.602176634e-19, 'a factor $6.2\\times10^{18}$: eV and J are mixed up (1 eV $=1.6\\times10^{-19}$ J).'],
];
export function diagnose(x, exp) {
  if (!Number.isFinite(x) || !Number.isFinite(exp) || exp === 0 || x === 0) return null;
  if (near(x, -exp)) return 'the magnitude is right but the sign is opposite: check the direction or a sign in the formula.';
  const r = x / exp;
  for (const [f, msg] of FACTORS) if (near(r, f)) return `your value is ${msg}`;
  if (Math.abs(exp) > 1e-12 && near(x, 1 / exp, 0.03) && Math.abs(Math.log(exp)) > 0.2) return 'your value is the reciprocal of the expected one: did you divide where you should multiply?';
  if (Math.abs(Math.log(exp)) > 0.3 && near(x, exp * exp, 0.03)) return 'your value looks like the square of the expected one: a square too many (or an intensity instead of an amplitude)?';
  if (exp > 0 && near(x, Math.sqrt(exp), 0.03) && Math.abs(Math.log(exp)) > 0.3) return 'your value looks like the square root of the expected one: did you forget to square?';
  const k = Math.round(Math.log10(Math.abs(r)));
  if (k !== 0 && Math.abs(Math.abs(r) / 10 ** k - 1) < 0.04) {
    const pref = { 3: 'milli/kilo', 6: 'micro/mega', 9: 'nano/giga', 12: 'pico/tera', 2: 'cm vs m', 10: 'ångström vs metre' }[Math.abs(k)];
    return `your value is $10^{${k}}$ times the expected one: a unit prefix or an exponent slip${pref ? ` (${pref})` : ''}? Re-check every conversion.`;
  }
  return null;
}
