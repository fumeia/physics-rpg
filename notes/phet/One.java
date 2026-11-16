import edu.colorado.phet.boundstates.model.*;
// Energies of the PhET "Quantum Bound States" one-well potentials, with the sim's own solver.
// args: type params... [mass multiplier via -m x]
//  square offset height width | ho offset omega | c3 offset | c1 offset | asym offset height width
public class One {
  public static void main(String[] a) {
    BSParticle p = new BSParticle(); int i = 0;
    if (a[0].equals("-m")) { p.setMass(p.getMass() * Double.parseDouble(a[1])); i = 2; }
    String t = a[i]; double[] v = new double[a.length - i - 1]; for (int k = 0; k < v.length; k++) v[k] = Double.parseDouble(a[i + 1 + k]);
    BSAbstractPotential pot;
    if (t.equals("square")) pot = new BSSquarePotential(p, 1, v[0], v[1], v[2], 0);
    else if (t.equals("ho")) pot = new BSHarmonicOscillatorPotential(p, v[0], v[1]);
    else if (t.equals("c3")) pot = new BSCoulomb3DPotential(p, v[0]);
    else if (t.equals("c1")) pot = new BSCoulomb1DPotential(p, 1, v[0], 0);
    else pot = new BSAsymmetricPotential(p, v[0], v[1], v[2]);
    StringBuilder sb = new StringBuilder(t);
    for (BSEigenstate e : pot.getEigenstates()) sb.append(String.format(" %.4f", e.getEnergy()));
    System.out.println(sb);
  }
}
