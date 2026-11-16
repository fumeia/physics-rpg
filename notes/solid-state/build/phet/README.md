# PhET "Band Structure" exercises: how the answers were computed

The exercises in `game/content/solid-state/phet-band-structure.json` use the PhET simulation
"Band Structure" (Many Wells tab of "Bound States", PhET 1.08, CheerpJ build:
https://phet.colorado.edu/sims/cheerpj/bound-states/latest/bound-states.html?simulation=band-structure&locale=en).

Every energy in the answers was computed with the simulation's **own** eigenstate solver (`SchmidtLeeSolver` inside
`band-structure_en.jar`, downloadable from https://phet.colorado.edu/sims/bound-states/band-structure_en.jar), so they are
exactly what the sim draws. `Run.java` here calls it:

    javac -cp jar Run.java && java -cp jar:. Run N offset width height separation [massMultiplier]

Sim facts read from the jar (`BSManyWellsSpec`, `BSSquarePotential`):
- square wells, defaults: 5 wells (1 to 10), width 0.5 nm (0.1-0.5), height 10 eV (0-20) = barrier height above the well bottom,
  separation 0.1 nm (0.05-0.2) = barrier width between wells, offset 0 eV, particle mass 1.0 m_e (0.5-1.1);
- the potential is offset+height everywhere except inside the wells; positions -3.5..3.5 nm with hard walls at the ends,
  so a chain of N wells is a finite (open) chain: each single-well level becomes N levels.
- hbar^2/2m_e = 0.0381 eV nm^2.

Default spectrum (N = 5): band 1 0.8125-1.0842 eV, band 2 3.2242-4.3143 eV, band 3 7.1779-9.5561 eV; single well: 0.9668, 3.7769, 7.9898 eV.
