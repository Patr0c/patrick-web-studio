#!/usr/bin/env python3
"""Check deployable static references with Python's standard library."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
import json
import hashlib

ROOT = Path(__file__).resolve().parents[1]
errors = []
references = set()
ids = set()
anchors = []


def check_ref(value, parent):
    if not value or value.startswith(('data:', '#')):
        return
    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc:
        return
    path = unquote(parsed.path)
    target = ROOT / path.lstrip('/') if path.startswith('/') else parent / path
    if not target.is_file():
        errors.append(f'Missing resource: {target.relative_to(ROOT)}')
    references.add(target.resolve())


class SiteParser(HTMLParser):
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            if attrs['id'] in ids:
                errors.append(f'Duplicate id: {attrs["id"]}')
            ids.add(attrs['id'])
        for attr in ('src', 'href', 'poster'):
            value = attrs.get(attr, '')
            if value.startswith('#'):
                anchors.append(value[1:])
            else:
                check_ref(value, ROOT)
        for candidate in attrs.get('srcset', '').split(','):
            if candidate.strip():
                check_ref(candidate.strip().split()[0], ROOT)
        for value in re.findall(r'url\([\'"]?([^\)\'\"]+)', attrs.get('style', '')):
            check_ref(value, ROOT)


html = (ROOT / 'index.html').read_text()
SiteParser().feed(html)
for anchor in anchors:
    if anchor and anchor not in ids:
        errors.append(f'Missing anchor: {anchor}')
for path in (ROOT / 'assets/css').glob('*.css'):
    for value in re.findall(r'url\([\'"]?([^\)\'\"]+)', path.read_text()):
        check_ref(value, path.parent)
for category in ('hotel', 'restaurant', 'driving'):
    check_ref(f'concepts/{category}.webp', ROOT)
# Native ORA source pixels, including negative/off-canvas base offsets, stay archived.
for name in ('geometry.json', 'mousepad-mask.png', 'keyboard-labels.svg', 'keyboard-refined.png'):
    check_ref(f'assets/desk/{name}', ROOT)
geometry_path = ROOT / 'assets/desk/geometry.json'
if geometry_path.is_file():
    geometry = json.loads(geometry_path.read_text())
    if geometry['canvas'] != [1949, 826] or len(geometry['layers']) != 16:
        errors.append('Changed named desk source canvas/layer count')
    for layer in geometry['layers']:
        image_path = geometry_path.parent / layer['file']
        if not image_path.is_file() or hashlib.sha256(image_path.read_bytes()).hexdigest() != layer['sha256']:
            errors.append(f'Original ORA PNG hash mismatch: {layer["name"]}')
    for kind, expected in (('main', 3), ('auxiliary', 4), ('controls', 3)):
        if len(geometry[kind]) != expected:
            errors.append(f'Missing native desk regions: {kind}')
        for region in geometry[kind]:
            x0, y0, x1, y1 = region['box']
            if not (0 <= x0 < x1 <= 1949 and 0 <= y0 < y1 <= 826):
                errors.append(f'Out-of-canvas desk region: {kind}/{region["id"]}')
    if 'data-coordinate-system="2560x1440"' not in html or 'assets/workstation/' in html:
        errors.append('Active scene uses obsolete workstation geometry')
for marker in ('font-preview', 'font-options', 'schriften.html', 'Archivo_files'):
    if marker in html:
        errors.append(f'Retired export/font picker remains: {marker}')
for expected in ('https://www.hrservice-fm.de/', 'https://villa-schwalbe.vercel.app/', 'https://gasthof-wagner-demo.vercel.app/'):
    if html.count(expected) != 2:
        errors.append(f'Changed or missing project link: {expected}')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'OK: {len(references)} local resources, {len(ids)} unique IDs, project links and internal anchors')

# Active source is now the user's 2560x1440 edited GIMP scene; the former ORA remains archived.
scene=json.loads((ROOT/'assets/scene/geometry.json').read_text())
assert scene['canvas']==[2560,1440] and len(scene['screens'])==3
for name,checksum in scene['working_assets'].items():
    asset=ROOT/'assets/scene'/name
    assert asset.is_file() and hashlib.sha256(asset.read_bytes()).hexdigest()==checksum, f'Current asset changed: {name}'
for screen in scene['screens']:
    q=screen['quad']
    assert len(q)==4 and all(0<=x<=2560 and 0<=y<=1440 for x,y in q)
    cross=[(q[(i+1)%4][0]-q[i][0])*(q[(i+2)%4][1]-q[(i+1)%4][1])-(q[(i+1)%4][1]-q[i][1])*(q[(i+2)%4][0]-q[(i+1)%4][0]) for i in range(4)]
    assert all(v>0 for v in cross), f'Invalid screen perspective: {screen["id"]}'
assert html.count('data-project-video=')==3
assert 'assets/js/terminal.js' not in html
assert 'class="table-flow-video"' in html and 'class="table-flow-canvas"' not in html
assert 'assets/video/table-matrix-mobile-green.mp4' in html
assert 'class="scene-screen scene-detective" data-screen="textmode"' in html
assert 'class="scene-screen scene-villa" data-screen="coming-soon"' in html
assert 'data-comparison-hidden="true"' in html
assert 'scene-flow-caption mono' not in html and 'carousel-pause"' not in html
assert '<header class="nav">' not in html
assert 'h1 class="scene-title"' in html
print('OK: current GIMP assets, perspective quads, three recordings, and single active scene controller')

# Current common-camera scene: verify independent real-plane projections,
# untouched archived pixels, and deterministic packaged render hashes.
seated=json.loads((ROOT/'assets/scene/seated/camera.json').read_text())
embedded=json.loads(re.search(r'id="scene-geometry">(.*?)</script>',html,re.S)[1])
assert seated==embedded, 'Published and source camera metadata differ'
assert seated['canvas']==[2560,1440] and seated['overscan_canvas']==[4096,1440]
import math
cam=seated['camera'];C=cam['location'];R=cam['right'];U=cam['up'];D=cam['forward']
def dot(a,b):return sum(x*y for x,y in zip(a,b))
for screen in seated['screens']:
    for world,expected in zip(screen['world_corners'],screen['quad']):
        ray=[x-y for x,y in zip(world,C)];depth=dot(ray,D)
        projected=[seated['principal_point'][0]+seated['focal_pixels']*dot(ray,R)/depth,seated['principal_point'][1]-seated['focal_pixels']*dot(ray,U)/depth]
        assert max(abs(a-b) for a,b in zip(projected,expected))<.02
    assert all(0<x<2560 and 0<y<1440 for x,y in screen['quad'])
for name,checksum in seated['assets'].items():
    assert hashlib.sha256((ROOT/'assets/scene/seated'/name).read_bytes()).hexdigest()==checksum,name
assert 'class="seated-foreground"' in html and 'class="scene-hardware' not in html
assert 'monitor_perspective' not in (ROOT/'assets/js/scene.js').read_text()
assert 'createElement(\'canvas\')' not in (ROOT/'assets/js/scene-lighting.js').read_text()
print('OK: common camera reprojection, calibrated asset hashes, direct live display quads')

assert seated['bezel_join_error_m']<.00001, 'Bezel edges are not flush'
for screen in seated['screens']:
    q=screen['world_corners'];a=[q[1][i]-q[0][i] for i in range(3)];b=[q[3][i]-q[0][i] for i in range(3)]
    assert abs(dot(a,b))<1e-6, 'Screen is not a rigid rectangle'
print('OK: rigid rectangular screens and flush shared bezel hinges')

assert abs(seated['monitor_setup']['eye_above_center_m']-.05)<1e-7
assert [s['pose']['yaw_degrees'] for s in seated['screens']]==[45,0,-45]
