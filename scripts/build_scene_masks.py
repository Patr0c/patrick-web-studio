"""Rebuild current 2560x1440 glass/equipment masks from native source alpha."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageChops
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'assets/scene'
geometry = json.loads((ASSETS / 'geometry.json').read_text())
size = tuple(geometry['canvas'])
glass = Image.new('L', size)
glass_quad = [(x, y + (26 if i < 2 else -8)) for i, (x, y) in enumerate(geometry['table_quad'])]
ImageDraw.Draw(glass).polygon(glass_quad, fill=255)
# Inset the actual glass polygon, keeping all bright metal edges protected.
glass = glass.filter(ImageFilter.MinFilter(17))
material = Image.open(ASSETS / 'hardware.webp').getchannel('A')
for screen in geometry['screens']:
    ImageDraw.Draw(material).polygon([tuple(p) for p in screen['quad']], fill=0)
for layer in geometry['layers']:
    if layer['id'] not in ('mouse-wheel', 'mouse', 'keyboard', 'mousepad'):
        continue
    alpha = Image.new('L', size)
    alpha.paste(Image.open(ASSETS / layer['file']).getchannel('A'), (layer['x'], layer['y']))
    # Any visible source pixel plus a safety margin excludes the entire mousepad
    # and equipment. No guessed rectangle or visible hard mask boundary.
    protected = alpha.point(lambda value: 255 if value > 0 else 0).filter(ImageFilter.MaxFilter(11))
    glass = ImageChops.subtract(glass, protected)
    material = ImageChops.lighter(material, alpha)
    assert ImageChops.multiply(glass, alpha).getbbox() is None, layer['id']
for name, alpha in [('table-matrix-mask.webp', glass), ('material-light-mask.webp', material)]:
    image = Image.new('RGBA', size, 'white')
    image.putalpha(alpha)
    image.save(ASSETS / name, format='WEBP', lossless=True, method=4)
    geometry['working_assets'][name] = hashlib.sha256((ASSETS / name).read_bytes()).hexdigest()
(ASSETS / 'geometry.json').write_text(json.dumps(geometry, ensure_ascii=False, indent=2))
html = ROOT / 'index.html'
html.write_text(re.sub(r'(<script type="application/json" id="scene-geometry">).*?(</script>)',
                      lambda m: m[1] + json.dumps(geometry, ensure_ascii=False) + m[2], html.read_text(), flags=re.S))
print('OK: glass-only matrix; zero overlap with mousepad, keyboard, mouse and wheel')
