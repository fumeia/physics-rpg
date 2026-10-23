# Running several Claude sessions in parallel

Yes, this works. Open one terminal per session in `/projects/physics-rpg` and start `claude` in each
(auto mode on so they do not stop to ask). They share the same files, so each session owns its own folders
(see "Ownership" in `docs/CONTENT.md`). The main session owns the engine and QM; the other two own one course each.

Before starting the others: the game engine and the content format are stable enough (QM Tunneling Bridge is the
reference room and has passing tests: `node game/test/sim-check.mjs && node game/test/content-check.mjs && node game/test/e2e.mjs`).

## Prompt for the Solid State session
> Read /projects/physics-rpg/CLAUDE.md, notes/syllabus.md and docs/CONTENT.md. You own solid state physics (the
> "Crystal Caverns" region): notes/solid-state/, game/content/solid-state/, game/src/rooms/solid-state.js and
> game/test/content-check-solid-state.mjs. Do not edit game/src/engine files; write requests to docs/ENGINE_REQUESTS.md.
> Work in this order: (1) transcribe script chapters 1.2-1.5 (lattices, reciprocal lattice, diffraction) and the
> Zheludev HS23 exams (both sessions) and Ensslin HS20 into notes/solid-state/ reading the PDFs visually;
> (2) build the first room "Bragg Gate" (2D lattice, reciprocal lattice, Brillouin zone, neutron diffraction angles
> and intensities as in HS23 problem 1) with predict/observe/calc/boss encounters, citing sources; (3) then free-electron
> metals (HS23 problem 2), phonons/Debye, 1D semiconductors, magnetism. Verify every number with a node check.
> Work autonomously, do not ask for confirmation, use verbose output, and commit nothing.

## Prompt for the Astro session
> Read /projects/physics-rpg/CLAUDE.md, notes/syllabus.md and docs/CONTENT.md. You own astrophysics (the "Observatory
> Ship" region): notes/astrophysics/, game/content/astrophysics/, game/src/rooms/astrophysics.js and
> game/test/content-check-astrophysics.mjs. Do not edit engine files; write requests to docs/ENGINE_REQUESTS.md.
> The exam is Refregier's written exam (15 multiple-choice + 7 open questions); only the HS24 and HS25 exams matter
> for weighting, and the course follows Choudhuri (about half of it). Work in this order: (1) transcribe the four
> Refregier exams with solutions (Astro_I_2024_Summer/Winter, 2025 Practice/Winter) and tabulate the recurring
> derivations; (2) build the first room around the A-priority topics: hydrostatic equilibrium + Eddington luminosity,
> virial theorem, magnitudes/parallax, blackbody/Wien; (3) Friedmann/cosmology and galactic dynamics rooms; multiple-choice
> items become quick fights, open questions become calc fights and bosses. Add SI constants you need (kB, G, c, Msun,
> pc) to game/src/expr.js only by appending to CONSTANTS and tell the main session in docs/ENGINE_REQUESTS.md.
> Verify every number with a node check. Work autonomously, do not ask for confirmation, use verbose output.

## Alternative: I launch them from this session
The main session can also start them as background sub-agents with the same prompts (they inherit nothing but the prompt,
so the files above are what they read). That avoids opening terminals but their output is summarised rather than live.
