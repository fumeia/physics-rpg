import { TunnelSim } from '../src/sim.js';
const cases = [
  { EoverV0: 0.5, L: 2 }, { EoverV0: 0.5, L: 4 }, { EoverV0: 0.8, L: 2 }, { EoverV0: 1.5, L: 2 },
];
let ok = true;
for (const c of cases) {
  const s = new TunnelSim(c);
  while (!s.done) s.step();
  const p = s.probabilities();
  const plane = TunnelSim.transmission(s.E, s.V0, s.L), avg = s.packetTransmission();
  const rel = Math.abs(p.T - avg) / avg;
  console.log(JSON.stringify(c), 'norm', (p.T + p.R + p.inside).toFixed(5),
    'T_sim', p.T.toFixed(4), 'T_packet', avg.toFixed(4), 'T_plane', plane.toFixed(4), 'rel.err', rel.toFixed(3));
  if (rel > 0.03 || Math.abs(p.T + p.R + p.inside - 1) > 1e-3) ok = false;
}
console.log(ok ? 'PASS' : 'FAIL');
process.exit(ok ? 0 : 1);
