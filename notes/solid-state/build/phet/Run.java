import edu.colorado.phet.boundstates.model.*;
// Energies of the PhET "Many Wells" square potential, computed with the sim's own solver.
// args: N offset width height separation [massMultiplier] [field]
public class Run {
  public static void main(String[] a) {
    int n = Integer.parseInt(a[0]); double off = Double.parseDouble(a[1]), w = Double.parseDouble(a[2]), h = Double.parseDouble(a[3]), s = Double.parseDouble(a[4]);
    BSParticle p = new BSParticle();
    if (a.length > 5) p.setMass(p.getMass() * Double.parseDouble(a[5]));
    BSSquarePotential v = new BSSquarePotential(p, n, off, h, w, s);
    if (a.length > 6) v.setFieldConstant(Double.parseDouble(a[6]));
    StringBuilder sb = new StringBuilder("mass=" + p.getMass());
    for (BSEigenstate e : v.getEigenstates()) sb.append(String.format(" %.4f", e.getEnergy()));
    System.out.println(sb);
  }
}
