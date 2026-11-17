"""Crop the figures of the solid-state problem sets from the PDFs (not in the repository: release asset ISSP.zip of fumeia/physics-rpg).
Usage: python3 figures.py <folder with Exercises/ and Solutions/> ../../../../game/content/solid-state/fig
Crop boxes are in points of a 60 dpi rendering (x0, y0, x1, y1); output is 130 dpi, 64 colours."""
import subprocess, sys, os
from PIL import Image
I, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)
R = 130; k = R / 60
C = [
 ('Solutions/Weekly Solution Set 1.pdf', 1, 150, 190, 345, 345, 's1q1-trapezoid'),
 ('Solutions/Weekly Solution Set 1.pdf', 2, 160, 100, 360, 272, 's1q2-diatomic'),
 ('Solutions/Weekly Solution Set 2.pdf', 1, 185, 300, 345, 448, 's2q1-bcc-cell'),
 ('Solutions/Weekly Solution Set 2.pdf', 2, 185, 42, 335, 215, 's2q1-reciprocal-cell'),
 ('Solutions/Weekly Solution Set 2.pdf', 2, 185, 352, 340, 478, 's2q1-first-bz'),
 ('Solutions/Weekly Solution Set 2.pdf', 3, 60, 383, 440, 582, 's2q3-lattices'),
 ('Solutions/Weekly Solution Set 2.pdf', 4, 160, 96, 362, 290, 's2q3-210-plane'),
 ('Solutions/Weekly Solution Set 2.pdf', 4, 155, 336, 362, 524, 's2q3-triangle'),
 ('Exercises/Weekly Problem Set 3.pdf', 1, 125, 440, 400, 580, 's3q1-cr-spectrum'),
 ('Solutions/Weekly Solution Set 4.pdf', 2, 210, 92, 340, 200, 's4q1-discrete-dispersion'),
 ('Solutions/Weekly Solution Set 6.pdf', 2, 125, 232, 375, 432, 's6q1-dos'),
 ('Exercises/Weekly Problem Set 7.pdf', 1, 125, 268, 375, 448, 's7q2-na-bands'),
 ('Solutions/Weekly Solution Set 7.pdf', 1, 135, 378, 362, 572, 's7q1-fermi-surface'),
 ('Solutions/Weekly Solution Set 7.pdf', 2, 165, 125, 340, 275, 's7q2-bz-h-point'),
 ('Solutions/Weekly Solution Set 8.pdf', 2, 185, 45, 335, 195, 's8q1-bcc-110'),
 ('Solutions/Weekly Solution Set 8.pdf', 2, 205, 412, 315, 530, 's8q2-fcc-neighbours'),
]
for pdf, pg, x0, y0, x1, y1, name in C:
    subprocess.run(['pdftoppm', '-r', str(R), '-f', str(pg), '-l', str(pg), '-png', '-singlefile', os.path.join(I, pdf), '/tmp/_pg'], check=True)
    im = Image.open('/tmp/_pg.png').convert('RGB').crop((int(x0*k), int(y0*k), int(x1*k), int(y1*k)))
    im = im.quantize(64) if 'na-bands' not in name else im.convert('L')
    im.save(os.path.join(OUT, name + '.png'), optimize=True)
    print(name, im.size, os.path.getsize(os.path.join(OUT, name + '.png')))
