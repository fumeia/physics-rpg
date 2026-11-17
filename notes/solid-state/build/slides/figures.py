"""Crop the figures of the lecture concept questions (lecture slides of weeks 1-4 and "Week08 (Quizzes).pdf", not in the
repository: release asset ISSP.zip of fumeia/physics-rpg). Usage: python3 figures.py <folder "lecture slides"> ../../../../game/content/solid-state/fig
Boxes are fractions of the slide (x0, y0, x1, y1). The slides mark the correct answer with a red frame: where a frame
falls inside a figure it is painted out (unred), and the countdown clock is blanked (blank)."""
import subprocess, sys, os
from PIL import Image
I, OUT = sys.argv[1], sys.argv[2]
W8, W1, W2 = 'Week08 (Quizzes).pdf', 'Week01 (Chapters 1-1 and 1-2).pdf', 'Week02 (Chapters 1-3 to 1-5).pdf'
C = [  # slide, box, name, unred, blank boxes[, pdf]
 (2, (.42, .27, .68, .70), 'q02-hex-lattice', False, []),
 (6, (.33, .23, .95, .82), 'q06-sodium-two-temperatures', False, []),
 (9, (.0, .54, 1, 1), 'q09-orbital-configurations', False, []),
 (23, (.0, .32, .76, .96), 'q23-diatomic-mode', True, []),
 (24, (.0, .21, 1, .54), 'q24-diatomic-modes', False, []),
 (27, (.37, .18, .76, .71), 'q27-chain-dos-segments', False, []),
 (29, (.0, .27, .55, .96), 'q29-motions', True, []),
 (29, (.56, .16, .97, .66), 'q29-dispersion-point-p', False, []),
 (38, (.0, .08, 1, 1), 'q38-bands-and-dos', True, [(.76, .56, 1, 1)]),
 (39, (.0, .27, .73, .98), 'q39-dos-candidates', True, []),
 (40, (.0, .17, .61, .91), 'q40-dispersions', False, []),
 (33, (.43, .20, .75, .82), 'w1-33-structure', False, [], W1),
 (34, (.39, .35, .72, .95), 'w1-34-structure', False, [], W1),
 (35, (.37, .31, .75, .92), 'w1-35-structure', False, [], W1),
 (36, (.36, .26, .71, .62), 'w1-36-layering', False, [], W1),
 (51, (.0, .09, .82, 1), 'w2-51-reciprocal-candidates', True, [(.78, .12, 1, .58)], W2),
 (52, (.0, .09, .82, 1), 'w2-52-reciprocal-candidates', True, [(.78, .12, 1, .58)], W2),
 (53, (.03, .20, .42, .88), 'w2-53-miller-plane', False, [], W2),
 (54, (.66, .505, 1, 1), 'w2-54-neutron-bcc', False, [], W2),
]
for sl, (x0, y0, x1, y1), name, unred, blank, *pdf in C:
    subprocess.run(['pdftoppm', '-r', '100', '-f', str(sl), '-l', str(sl), '-png', '-singlefile', os.path.join(I, pdf[0] if pdf else W8), '/tmp/_sl'], check=True)
    im = Image.open('/tmp/_sl.png').convert('RGB'); W, H = im.size; px = im.load()
    for bx in blank:
        for x in range(int(bx[0] * W), int(bx[2] * W)):
            for y in range(int(bx[1] * H), int(bx[3] * H)): px[x, y] = (255, 255, 255)
    if unred:
        for x in range(W):
            for y in range(H):
                r, g, b = px[x, y]
                if r > 200 and g < 90 and b < 90: px[x, y] = (255, 255, 255)
    im = im.crop((int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H))).quantize(48)
    im.save(os.path.join(OUT, name + '.png'), optimize=True); print(name, im.size, os.path.getsize(os.path.join(OUT, name + '.png')))
