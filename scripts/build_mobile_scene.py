"""Bake existing pixels, perspective and colors into bounded mobile textures.

No new artwork. Originals remain unchanged. Avoid giant filtered/3D intermediary
surfaces on iOS: one 1280x720 hardware texture and small responsive backdrops.
"""
from pathlib import Path
import json
import numpy as np
from PIL import Image, ImageOps, ImageEnhance, ImageFilter, ImageChops

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'assets/scene'
OUT = ASSETS / 'mobile'
OUT.mkdir(exist_ok=True)
g = json.loads((ASSETS / 'geometry.json').read_text())
size = tuple(g['canvas'])


def neutral(image):
    out = ImageOps.grayscale(image).convert('RGBA')
    out.putalpha(image.getchannel('A'))
    return out


def save(name, image, width):
    image = image.resize((width, round(image.height * width / image.width)),
                         Image.Resampling.LANCZOS)
    pending = OUT / (name + '.pending')
    image.save(pending, 'WEBP', quality=94, method=4)
    with Image.open(pending) as check:
        check.verify()
    pending.replace(OUT / name)


hardware = neutral(Image.open(ASSETS / 'hardware-structure.webp').convert('RGBA'))
anchor = g['monitor_perspective']['anchor_y']
upper = Image.new('RGBA', size)
upper.paste(hardware.crop((0, 0, size[0], anchor)), (0, 0))
inverse = np.linalg.inv(g['monitor_perspective']['matrix'])
inverse /= inverse[2, 2]
hardware = upper.transform(size, Image.Transform.PERSPECTIVE,
                           tuple(inverse.flatten()[:8]), Image.Resampling.BICUBIC)
base = Image.open(ASSETS / 'hardware-structure.webp').convert('RGBA')
hardware.alpha_composite(neutral(base.crop((0, anchor, size[0], size[1]))), (0, anchor))
hardware.alpha_composite(neutral(Image.open(ASSETS / 'tabletop.webp').convert('RGBA')))
layers = {layer['id']: layer for layer in g['layers']}


def place(image, name):
    layer = layers[name]
    hardware.alpha_composite(image, (layer['x'], layer['y']))


pad = Image.open(ASSETS / 'mousepad.webp').convert('RGBA')
place(pad, 'mousepad')
receiver = Image.new('L', size)
receiver.paste(pad.getchannel('A'), (layers['mousepad']['x'], layers['mousepad']['y']))
# Small contact shadows use the same source alpha and sun-side cast direction.
for name, elevation in [('keyboard', 9), ('mouse', 22)]:
    layer = layers[name]
    original = Image.open(ASSETS / layer['file']).convert('RGBA')
    dx, dy = layer['x'] + layer['width'] / 2 - 499, layer['y'] + layer['height'] / 2 - 312
    distance = np.hypot(dx, dy)
    for blur, opacity, shift in [(1.1, .46, (1.2, 1.5)),
                                  (3, .24, (dx / distance * elevation, dy / distance * elevation * .45))]:
        alpha = Image.new('L', size)
        alpha.paste(original.getchannel('A'), (round(layer['x'] + shift[0]), round(layer['y'] + shift[1])))
        alpha = ImageChops.multiply(alpha.filter(ImageFilter.GaussianBlur(blur)), receiver)
        alpha = alpha.point(lambda value: round(value * opacity))
        shadow = Image.new('RGBA', size, (1, 2, 3, 0))
        shadow.putalpha(alpha)
        hardware.alpha_composite(shadow)
    if name == 'keyboard':
        rgba = np.asarray(original).copy()
        rgb = rgba[..., :3].astype(float)
        matrix = np.array([[.1705, .659, .1705], [.3335, .333, .3335], [.0155, .969, .0155]])
        rgba[..., :3] = np.clip(rgb @ matrix.T, 0, 255).round().astype('uint8')
        original = Image.fromarray(rgba)
    place(original, name)
labels = Image.open(ASSETS / 'keyboard-labels.webp').getchannel('A').point(lambda value: round(value * .588235))
ink = Image.new('RGBA', labels.size, '#a855f7')
ink.putalpha(labels)
place(ink, 'keyboard-labels')
place(Image.open(ASSETS / 'mouse-wheel.webp').convert('RGBA'), 'mouse-wheel')
save('hardware.webp', hardware, 1280)
save('galaxy.webp', Image.open(ASSETS / 'galaxy.webp').convert('RGBA'), 1024)
floor = neutral(Image.open(ASSETS / 'platform.webp').convert('RGBA'))
alpha = floor.getchannel('A')
floor = ImageEnhance.Contrast(ImageEnhance.Brightness(floor).enhance(.79)).enhance(.94)
floor.putalpha(alpha)
save('platform.webp', floor, 1280)
save('reflection-mask.webp', Image.open(ASSETS / 'monitor-reflection-mask.webp'), 1280)
save('matrix-mask.webp', Image.open(ASSETS / 'table-matrix-mask.webp'), 1280)
for name, source in [('hrservice', 'hrservice.jpg'), ('villa', 'villa.jpg'),
                     ('wagner', 'wagner.jpg'), ('detective', 'detective.webp')]:
    save(name + '.webp', Image.open(ROOT / 'previews' / source), 640)
poster = np.asarray(Image.open(ASSETS / 'table-matrix-reference-poster.webp').convert('RGB')).copy()
green = poster[..., 1].astype(float)
poster[..., 0] = (green * 25 / 229).round().astype('uint8')
poster[..., 2] = (green * 15 / 229).round().astype('uint8')
save('matrix-poster.webp', Image.fromarray(poster), 704)
print('OK: mobile original-pixel composite 1280x720; bounded backdrops/masks/posters')
