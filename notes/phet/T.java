import edu.colorado.phet.quantumtunneling.model.*;
import edu.colorado.phet.quantumtunneling.enums.Direction;
// Transmission of a plane wave through PhET's single barrier: args E V0 width  (eV, eV, nm)
public class T {
  public static void main(String[] a) {
    double E = Double.parseDouble(a[0]), V = Double.parseDouble(a[1]), w = Double.parseDouble(a[2]);
    SingleBarrierPotential p = new SingleBarrierPotential();
    p.setBarrierWidth(0, w); p.setEnergy(1, V);
    StringBuilder s = new StringBuilder("regions:");
    for (int i = 0; i < p.getNumberOfRegions(); i++) s.append(String.format(" [%.2f,%.2f V=%.3f]", p.getStart(i), p.getEnd(i), p.getEnergy(i)));
    SingleBarrierSolver sol = new SingleBarrierSolver(new TotalEnergy(E), p, Direction.LEFT_TO_RIGHT);
    double R = sol.getReflectionProbability();
    System.out.println(s + String.format("  R=%.5f T=%.5f", R, 1 - R));
  }
}
