"""Shared projective camera adjustment; original hardware pixels stay untouched.

Only the reflection alpha is resampled offline. The browser projects the original
monitor/stand pixels and all three live screen planes with the same homography.
"""
from pathlib import Path
import hashlib
import json
import re

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'assets/scene'
g = json.loads((ASSETS / 'geometry.json').read_text())
width, height = g['canvas']
anchor, reference, zoom, lift = 1150, 521, 1.05, 60
depth = anchor - reference
b = (1 - 1 / zoom) / depth
a = (depth + lift) / (zoom * depth)
cx = width / 2
matrix = np.array([[1, cx * b, -cx * b * anchor],
                   [0, anchor * b + a, anchor * (1 - b * anchor - a)],
                   [0, b, 1 - b * anchor]])
matrix /= matrix[2, 2]


def point(x, y):
    p = matrix @ [x, y, 1]
    return [round(float(p[0] / p[2]), 6), round(float(p[1] / p[2]), 6)]


# The full plane is described even though hardware is split at its anchored base.
g['monitor_perspective'] = {
    'anchor_y': anchor, 'reference_y': reference,
    'top_scale': zoom, 'top_lift': lift,
    'matrix': matrix.tolist(),
    'canvas_quad': [point(x, y) for x, y in [(0, 0), (width, 0),
                                           (width, height), (0, height)]],
    'rendered_screens': [dict(id=s['id'], quad=[point(*p) for p in s['quad']])
                         for s in g['screens']],
}
for x in [0, cx, width]:
    assert np.allclose(point(x, anchor), [x, anchor])
assert np.allclose(point(cx, reference), [cx, reference - lift])

# Exclude the old screen/stand silhouette from the lighting receiver. Preserve
# the lower desk receiver bit-for-bit; no extra per-frame canvas work is needed.
source = Image.open(ASSETS / 'surface-reflection-mask.webp').getchannel('A')
upper = Image.new('L', source.size)
upper.paste(source.crop((0, 0, width, anchor)), (0, 0))
inverse = np.linalg.inv(matrix)
inverse /= inverse[2, 2]
warped = upper.transform(source.size, Image.Transform.PERSPECTIVE,
                         tuple(inverse.flatten()[:8]), Image.Resampling.BICUBIC)
warped.paste(source.crop((0, anchor, width, height)), (0, anchor))
out = Image.new('RGBA', source.size, 'white')
out.putalpha(warped)
name = 'monitor-reflection-mask.webp'
out.save(ASSETS / name, format='WEBP', lossless=True, method=4)
g['working_assets'][name] = hashlib.sha256((ASSETS / name).read_bytes()).hexdigest()
(ASSETS / 'geometry.json').write_text(json.dumps(g, ensure_ascii=False, indent=2))
html = ROOT / 'index.html'
html.write_text(re.sub(r'(<script type="application/json" id="scene-geometry">).*?(</script>)',
                       lambda m: m[1] + json.dumps(g, ensure_ascii=False) + m[2],
                       html.read_text(), flags=re.S))
print('OK: monitor plane +5% at top, raised60px; feet fixed; lighting receiver registered')
