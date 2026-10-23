"""Build the solid-state room files: python3 notes/solid-state/build/build.py (from the repo root or anywhere).
r1..r7: calc fights and bosses; x12/x34/x567: lessons, quizzes, derivations. Do not hand-edit game/content/solid-state/*.json."""
import json, os, sys, random, hashlib
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from common import check_room, write
import r1, r2, r3, r4, r5, r6, r7, r8, x12, x34, x567

OUT = os.path.join(HERE, '..', '..', '..', 'game', 'content', 'solid-state')
ROOMS = [(r1, 'lat', x12.lattice), (r8, 'bon', r8.extras), (r2, 'pho', x12.phonon), (r3, 'fer', x34.fermi), (r4, 'dri', x34.drift),
         (r5, 'sem', x567.semi), (r6, 'mag', x567.magnet), (r7, 'deg', x567.degenerate)]
ORDER = {'lesson': 0, 'quiz': 1, 'derive': 2, 'calc': 3, 'boss': 4}
EXTRA_LINKS = {'deg': [dict(course='astrophysics', room='degenerate-matter', why="The astro Degenerate Vault: lessons and fights on white dwarfs, neutron stars and accretion (Choudhuri Ch. 5).")],
               'pho': [dict(course='astrophysics', room='photometry-radiation', why="Blackbody radiation: the photon version of the phonon gas.")]}

def shuffle(q):
    # deterministic shuffle so the right answer is not always in the same slot; HS20 questions keep the exam's order
    if 'HS20' in json.dumps(q.get('source', {})): return
    rng = random.Random(int(hashlib.md5(q['q'].encode()).hexdigest(), 16))
    order = list(range(len(q['options']))); rng.shuffle(order)
    q['options'] = [q['options'][i] for i in order]; q['correct'] = order.index(q['correct'])

ids = []
for mod, short, extra in ROOMS:
    room = mod.room(); room.pop('_extras', None)
    check_room(room, report=False)              # evaluates every answer before ids are changed
    encs = sorted(extra() + room['encounters'], key=lambda e: ORDER[e['type']])
    for e in encs:
        e['id'] = f"ss-{short}-{e['id']}"
        if e.get('requires'): e['requires'] = f"ss-{short}-{e['requires']}"
    for e in encs:
        for q in e.get('questions', []) + e.get('check', []): shuffle(q)
    room['encounters'] = encs
    room.setdefault('links', []).extend(EXTRA_LINKS.get(short, []))
    for l in room['links']:                     # course = folder name; mark rooms the other sessions have not built yet
        l['course'] = {'astro': 'astrophysics'}.get(l['course'], l['course'])
        l['planned'] = not os.path.exists(os.path.join(OUT, '..', l['course'], l['room'] + '.json'))
    write(room, OUT); ids.append(room['file'])
with open(os.path.join(OUT, 'index.json'), 'w') as f:
    json.dump(dict(region="Solid State Crystal Caverns", rooms=ids), f, indent=2); f.write('\n')
print('built', len(ids), 'rooms ->', os.path.normpath(OUT))
