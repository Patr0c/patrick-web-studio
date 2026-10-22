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
# Dynamic terminal resources are not HTML/CSS references. Guard the native
# coordinate contract and original PNG bytes in CI without image libraries.
for name in ('geometry.json', 'aux-mask.png', 'matrix-mask.png'):
    check_ref(f'assets/workstation/{name}', ROOT)
geometry_path = ROOT / 'assets/workstation/geometry.json'
if geometry_path.is_file():
    geometry = json.loads(geometry_path.read_text())
    if geometry['canvas'] != [1774, 887]:
        errors.append('Changed original workstation canvas')
    expected_layers = {'base': [0, 0, 1774, 887], 'monitors': [128, 95, 1519, 432],
                       'panels': [38, 423, 1701, 209], 'controls': [49, 423, 1677, 201]}
    for layer in geometry['layers']:
        actual = [layer[k] for k in ('x', 'y', 'width', 'height')]
        if actual != expected_layers.get(layer['name']):
            errors.append(f'Changed original layer offset/size: {layer["name"]}')
        image_path = geometry_path.parent / layer['file']
        if not image_path.is_file() or hashlib.sha256(image_path.read_bytes()).hexdigest() != layer['sha256']:
            errors.append(f'Original ORA PNG hash mismatch: {layer["name"]}')
    for kind, expected in (('main', 2), ('auxiliary', 11), ('controls', 61)):
        if len(geometry[kind]) != expected:
            errors.append(f'Missing native workstation regions: {kind}')
        for region in geometry[kind]:
            x0, y0, x1, y1 = region['box']
            if not (0 <= x0 < x1 <= 1774 and 0 <= y0 < y1 <= 887):
                errors.append(f'Out-of-canvas workstation region: {kind}/{region["id"]}')
for marker in ('font-preview', 'font-options', 'schriften.html', 'Archivo_files'):
    if marker in html:
        errors.append(f'Retired export/font picker remains: {marker}')
for expected in ('https://www.hrservice-fm.de/', 'https://villa-schwalbe.vercel.app/', 'https://gasthof-wagner-demo.vercel.app/'):
    if html.count(expected) != 1:
        errors.append(f'Changed or missing project link: {expected}')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'OK: {len(references)} local resources, {len(ids)} unique IDs, project links and internal anchors')
