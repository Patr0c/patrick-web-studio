#!/usr/bin/env python3
"""Build the live pad mask from archived ORA alpha; keep hardware unpainted."""
from pathlib import Path
import argparse, json
from PIL import Image, ImageChops, ImageFilter

root = Path(__file__).resolve().parents[1] / 'assets/desk'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--keyboard-lift', type=int, default=24)
args = parser.parse_args()
g = json.loads((root / 'geometry.json').read_text())
layers = {layer['name']: layer for layer in g['layers']}
mask = Image.new('L', (1949, 826))
pad = layers['mousepad']
alpha = Image.open(root / pad['file']).getchannel('A').filter(ImageFilter.MinFilter(3))
mask.paste(alpha, (pad['x'], pad['y']))
for name in ('keyboard', 'mouse', 'mouse-wheel', 'button-red', 'button-orange', 'button-green'):
    layer = layers[name]
    alpha = Image.open(root / layer['file']).getchannel('A')
    alpha = alpha.point(lambda value: 255 if value > 16 else 0).filter(ImageFilter.MaxFilter(3))
    hardware = Image.new('L', mask.size)
    y = layer['y'] - (args.keyboard_lift if name == 'keyboard' else 0)
    hardware.paste(alpha, (layer['x'], y))
    mask = ImageChops.subtract(mask, hardware)
image = Image.new('RGBA', mask.size, 'white')
image.putalpha(mask)
image.save(root / 'mousepad-mask.png', optimize=True)
print(f'Mousepad mask: keyboard lifted {args.keyboard_lift} native pixels; original artwork unchanged.')
