#!/usr/bin/env python3
"""Check deployable static references with Python's standard library."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re

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
for marker in ('font-preview', 'font-options', 'schriften.html', 'Archivo_files'):
    if marker in html:
        errors.append(f'Retired export/font picker remains: {marker}')
for expected in ('https://www.hrservice-fm.de/', 'https://villa-schwalbe.vercel.app/', 'https://gasthof-wagner-demo.vercel.app/'):
    if html.count(expected) != 1:
        errors.append(f'Changed or missing project link: {expected}')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'OK: {len(references)} local resources, {len(ids)} unique IDs, project links and internal anchors')
