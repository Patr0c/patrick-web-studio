"""Pixel-registered tabletop separation and receiver masks, 2560x1440.
Original hardware pixels remain the master. Bezier points trace the INNER glass
edge in that bitmap; 4x coverage sampling preserves its rounded front corners.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageChops
import hashlib, json, re
import numpy as np

ROOT=Path(__file__).resolve().parents[1];ASSETS=ROOT/'assets/scene'
g=json.loads((ASSETS/'geometry.json').read_text());size=tuple(g['canvas'])
path='M278 1155H2284C2295 1155 2303 1161 2316 1173L2490 1346C2500 1360 2483 1379 2456 1380H102C72 1380 55 1369 68 1350L247 1173C260 1157 266 1155 278 1155Z'
segments=[('M',(278,1155)),('L',(2284,1155)),('C',(2295,1155,2303,1161,2316,1173)),('L',(2490,1346)),('C',(2500,1360,2483,1379,2456,1380)),('L',(102,1380)),('C',(72,1380,55,1369,68,1350)),('L',(247,1173)),('C',(260,1157,266,1155,278,1155))]
points=[];current=None
for command,values in segments:
 if command in ('M','L'):current=np.array(values,dtype=float);points.append(tuple(current))
 else:
  start=current.copy();a=np.array(values[:2]);b=np.array(values[2:4]);end=np.array(values[4:]);
  for t in np.linspace(0,1,65)[1:]:points.append(tuple((1-t)**3*start+3*(1-t)**2*t*a+3*(1-t)*t*t*b+t**3*end))
  current=end
coverage=Image.new('L',(size[0]*4,size[1]*4));ImageDraw.Draw(coverage).polygon([(round(x*4),round(y*4)) for x,y in points],fill=255)
coverage=coverage.resize(size,Image.Resampling.LANCZOS)
# The plate and metal structure render exactly once, retaining original RGB.
hardware=Image.open(ASSETS/'hardware.webp').convert('RGBA');alpha=hardware.getchannel('A')
def save(name,im):
 im.save(ASSETS/name,format='WEBP',lossless=True,method=4)
 g['working_assets'][name]=hashlib.sha256((ASSETS/name).read_bytes()).hexdigest()
def mask(name,a):
 im=Image.new('RGBA',size,'white');im.putalpha(a);save(name,im)
plate=hardware.copy();plate.putalpha(ImageChops.multiply(alpha,coverage));save('tabletop.webp',plate)
structure=hardware.copy();structure.putalpha(ImageChops.subtract(alpha,plate.getchannel('A')));save('hardware-structure.webp',structure)
mask('tabletop-mask.webp',coverage)
(ASSETS/'tabletop-outline.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440"><path d="{path}" fill="white"/></svg>\n')
g['tabletop_outline']=path
g['working_assets']['tabletop-outline.svg']=hashlib.sha256((ASSETS/'tabletop-outline.svg').read_bytes()).hexdigest()
glass=coverage.copy();material=alpha.copy()
for screen in g['screens']:ImageDraw.Draw(material).polygon([tuple(p) for p in screen['quad']],fill=0)
for layer in g['layers']:
 if layer['id'] not in ('mouse-wheel','mouse','keyboard','mousepad'):continue
 a=Image.new('L',size);a.paste(Image.open(ASSETS/layer['file']).getchannel('A'),(layer['x'],layer['y']))
 protected=a.point(lambda v:255 if v else 0).filter(ImageFilter.MaxFilter(3))
 glass=ImageChops.subtract(glass,protected);material=ImageChops.lighter(material,a)
 assert ImageChops.multiply(glass,a).getbbox() is None,layer['id']
mask('table-matrix-mask.webp',glass);mask('material-light-mask.webp',material)
floor=Image.open(ASSETS/'floor-mask.webp').getchannel('A')
visible_floor=ImageChops.subtract(floor,alpha)
receiver=ImageChops.lighter(visible_floor,material)
# Full screen polygons stay excluded even if platform pixels lie behind them.
for screen in g['screens']:ImageDraw.Draw(receiver).polygon([tuple(p) for p in screen['quad']],fill=0)
mask('surface-reflection-mask.webp',receiver)
assert ImageChops.add(structure.getchannel('A'),plate.getchannel('A')).tobytes()==alpha.tobytes()
(ASSETS/'geometry.json').write_text(json.dumps(g,ensure_ascii=False,indent=2))
html=ROOT/'index.html';html.write_text(re.sub(r'(<script type="application/json" id="scene-geometry">).*?(</script>)',lambda m:m[1]+json.dumps(g,ensure_ascii=False)+m[2],html.read_text(),flags=re.S))
print('OK: exact source-alpha sum; separate glass/metal; matrix/equipment overlap zero; screen-safe receivers')
