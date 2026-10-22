#!/usr/bin/env python3
"""Import Patrick's original OpenRaster layers; derive masks, never redraw pixels.

Usage: python scripts/import_workstation_ora.py /path/to/Workstation-Ebenen.ora
Requires Pillow, numpy and scipy. Runtime website needs no dependencies/build.
"""
from pathlib import Path
from hashlib import sha256
import json
import sys
import zipfile
import xml.etree.ElementTree as ET
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/workstation'
W, H = 1774, 887
SPECS = [('base', '003', 0, 0, 1774, 887),
         ('monitors', '002', 128, 95, 1519, 432),
         ('panels', '001', 38, 423, 1701, 209),
         ('controls', '000', 49, 423, 1677, 201)]


def components(alpha, paths=False):
    """Connected source alpha support; discard only isolated <12px noise."""
    labels, count = ndimage.label(alpha > 20)
    result = []
    for label, slices in enumerate(ndimage.find_objects(labels), 1):
        if slices is None:
            continue
        ys, xs = slices
        local = labels[slices] == label
        pixels = int(local.sum())
        if pixels < 12:
            continue
        item = dict(id=label, pixels=pixels,
                    box=[xs.start, ys.start, xs.stop, ys.stop])
        if paths:
            # Exact thresholded alpha, as 1px horizontal spans. No estimated hull.
            spans = []
            for y, row in enumerate(local):
                edges = np.diff(np.pad(row.astype('int8'), (1, 1)))
                for a, b in zip(np.where(edges == 1)[0], np.where(edges == -1)[0]):
                    spans.append(f'M{xs.start+a} {ys.start+y}h{b-a}v1h{a-b}z')
            item['path'] = ''.join(spans)
        result.append(item)
    return result


def save_mask(name, alpha):
    image = np.full((H, W, 4), 255, dtype='uint8')
    image[:, :, 3] = np.clip(alpha, 0, 255).astype('uint8')
    Image.fromarray(image).save(OUT / name, optimize=True)


def main(source):
    OUT.mkdir(parents=True, exist_ok=True)
    layers, canvases = [], {}
    with zipfile.ZipFile(source) as ora:
        stack = ora.read('stack.xml')
        image = ET.fromstring(stack)
        assert (int(image.get('w')), int(image.get('h'))) == (W, H)
        records = {n.get('src'): n for n in image.findall('.//layer')}
        for name, number, x, y, width, height in SPECS:
            src = f'data/{number}.png'
            record = records[src]
            assert (int(record.get('x')), int(record.get('y'))) == (x, y)
            data = ora.read(src)
            path = OUT / f'{name}.png'
            path.write_bytes(data)  # Exact archive bytes, including hidden RGB.
            original = Image.open(path).convert('RGBA')
            assert original.size == (width, height)
            canvas = np.zeros((H, W, 4), dtype='uint8')
            canvas[y:y+height, x:x+width] = np.array(original)
            canvases[name] = canvas
            layers.append(dict(name=name, source=src, file=path.name, x=x, y=y,
                               width=width, height=height,
                               originalVisibility=record.get('visibility'),
                               sha256=sha256(data).hexdigest()))
        (OUT / 'stack.xml').write_bytes(stack)
    a = {name: image[:, :, 3] for name, image in canvases.items()}
    monitor_regions = components(a['monitors'])
    main_regions = [r for r in monitor_regions if r['pixels'] > 100000]
    auxiliary = [r for r in monitor_regions if r not in main_regions]
    # Keep source alpha/AA in the glass mask, exclude the two large monitors.
    aux = a['monitors'].copy()
    for region in main_regions:
        x0, y0, x1, y1 = region['box']
        aux[y0:y1, x0:x1] = 0
    save_mask('aux-mask.png', aux)
    # Only base cutouts filled by the original PANEL layer, never the exterior.
    # Protective 2px expansion excludes glass and every marked physical control.
    protected = ndimage.binary_dilation((a['monitors'] > 5) | (a['controls'] > 5), iterations=2)
    rgb = canvases['panels'][:, :, :3].astype('float32')
    brightness = rgb.max(axis=2)
    # Dark substrate can receive light; bright metal/reflections stay protected.
    dark = np.clip((90 - brightness) / 50, 0, 1)
    matrix = (a['panels'].astype('float32') * (1-a['base']/255) * dark)
    matrix[protected] = 0
    save_mask('matrix-mask.png', matrix)
    regions = dict(canvas=[W,H], alphaThreshold=20, minimumComponentPixels=12,
                   oraSha256=sha256(Path(source).read_bytes()).hexdigest(),
                   layers=layers, main=main_regions, auxiliary=auxiliary,
                   panels=components(a['panels']),
                   controls=components(a['controls'], paths=True))
    (OUT / 'geometry.json').write_text(json.dumps(regions, separators=(',', ':'))+'\n')
    css = ['/* Generated from original ORA offsets and measured alpha components. */']
    for layer in layers:
        css.append(f".workstation-layer--{layer['name']}{{left:{layer['x']/W*100:.8f}%;top:{layer['y']/H*100:.8f}%;width:{layer['width']/W*100:.8f}%;height:{layer['height']/H*100:.8f}%;}}")
    for side, region in zip(('left','right'), sorted(main_regions, key=lambda r:r['box'][0])):
        x0,y0,x1,y1 = region['box']
        # Inset 12 source pixels inside measured glass; no display skew.
        css.append(f'.workstation-stage .screen-{side}{{left:{(x0+12)/W*100:.8f}%;top:{(y0+12)/H*100:.8f}%;width:{(x1-x0-24)/W*100:.8f}%;height:{(y1-y0-24)/H*100:.8f}%;}}')
    (OUT / 'geometry.css').write_text('\n'.join(css)+'\n')
    assert not matrix[protected].any()
    assert len(main_regions) == 2 and len(auxiliary) == 11 and len(regions['controls']) == 61
    print(f"Imported unchanged layers; {len(auxiliary)} auxiliary displays, {len(regions['controls'])} control regions; matrix support {int((matrix>0).sum())} px")


if __name__ == '__main__':
    main(sys.argv[1])
