"""Package Blender output; no geometry, color retouching or generated pixels.

Full-width floor overscan and inset workstation retain the SAME pixel scale.
The visible glass object-ID pass is the exclusive live Matrix receiver.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageChops
import json
import hashlib
import io
import os
import uuid
import math

ROOT=Path(__file__).resolve().parents[1]
RAW=Path('/tmp/patrick-seated-render')
OUT=ROOT/'assets/scene/seated'
data=json.loads((OUT/'camera.json').read_text())
data['object_categories']['10']='live display aperture'
for screen in data['screens']:
    # Bezel dimensions/front plane are the same manufactured mesh parameters
    # used by Blender. Export the joins for an explicit rigid-frame audit.
    p=screen['pose'];theta=math.radians(p['yaw_degrees'])
    width=math.dist(screen['world_corners'][0],screen['world_corners'][1])+.025
    height=.455
    screen['bezel_world_corners']=[
        [p['center'][0]+x*math.cos(theta)+.033*math.sin(theta),
         p['center'][1]+x*math.sin(theta)-.033*math.cos(theta),p['center'][2]+z]
        for x,z in [(-width/2,height/2),(width/2,height/2),(width/2,-height/2),(-width/2,-height/2)]]
left,middle,right=data['screens']
data['bezel_join_error_m']=max(
    math.dist(left['bezel_world_corners'][1],middle['bezel_world_corners'][0]),
    math.dist(left['bezel_world_corners'][2],middle['bezel_world_corners'][3]),
    math.dist(middle['bezel_world_corners'][1],right['bezel_world_corners'][0]),
    math.dist(middle['bezel_world_corners'][2],right['bezel_world_corners'][3]))
assert data['bezel_join_error_m']<.00001, 'Monitor bezel joints are not flush'
assert Image.open(RAW/'combined0001.png').size==(4096,1440), 'Run full-resolution render first'
crop=(768,0,3328,1440)

def atomic(path,content):
    temporary=path.with_name('.'+path.name+'.'+uuid.uuid4().hex+'.tmp')
    with temporary.open('wb') as file:
        file.write(content)
        file.flush()
        os.fsync(file.fileno())
    os.replace(temporary,path)

def encode(im,path,quality):
    data=io.BytesIO()
    im.save(data,format='WEBP',quality=quality,method=4,exact=True)
    atomic(path,data.getvalue())

def save(im,name,mobile=False):
    encode(im,OUT/(name+'.webp'),94)
    if mobile:
        encode(im.resize((im.width//2,im.height//2),Image.Resampling.LANCZOS),OUT/(name+'-mobile.webp'),91)

floor=Image.open(RAW/'floor0001.png').convert('RGBA')
fore=Image.open(RAW/'combined0001.png').convert('RGBA')
aperture=Image.open(RAW/'display-mask0001.png').convert('RGBA')
fore.putalpha(ImageChops.subtract(ImageChops.subtract(fore.getchannel('A'),floor.getchannel('A')),aperture.getchannel('A')))
# Keep overscan:45° outer cases extend a few pixels beyond the native grid,
# while still fitting safely inside the viewport's desk side clearance.
save(fore,'workstation',True)
data['foreground_native_left']=-768
data['foreground_size']=[4096,1440]
data['foreground_visible_bbox']=list(fore.getchannel('A').getbbox())
floor_y=floor.getchannel('A').getbbox()[1]
save(floor.crop((0,floor_y,4096,1440)),'platform',True)
data['floor_crop_y']=floor_y
glass=Image.open(RAW/'glass-mask0001.png').convert('RGBA').crop(crop)
save(glass,'glass-mask',True)
legends=Image.open(RAW/'legends-mask0001.png').convert('RGBA').crop(crop)
ink=Image.new('RGBA',legends.size,(168,85,247,0))
ink.putalpha(legends.getchannel('A'))
save(ink,'keyboard-legends',True)
for name in ['pad','keyboard','mouse']:
    mask=Image.open(RAW/(name+'-mask0001.png')).convert('RGBA').crop(crop)
    # Interior pixels must never receive Matrix. Antialiased boundary fragments
    # can share a pixel, so compare only fully covered object pixels.
    interior=mask.getchannel('A').point(lambda v:255 if v>250 else 0)
    overlap=ImageChops.multiply(interior,glass.getchannel('A'))
    assert overlap.getextrema()[1]<32, 'Matrix spills onto '+name
    save(mask,name+'-mask')

# Light-group passes contain real occlusion/reflection from the shared camera.
# Keep live screen pixels entirely untouched by the reflection overlays.
alpha=Image.open(RAW/'combined0001.png').convert('RGBA').getchannel('A')
draw=ImageDraw.Draw(alpha)
for screen in data['screens']:
    draw.polygon([(x+768,y) for x,y in screen['quad']],fill=0)
light_y=440
for name in ['sun','galaxy','flare']:
    im=Image.open(RAW/('flare-resolved.png' if name=='flare' else name+'0001.png')).convert('RGBA')
    if im.size!=(4096,1440):
        im=im.resize((4096,1440),Image.Resampling.LANCZOS)
    im.putalpha(alpha)
    # Smooth illumination needs fewer pixels than the detailed object beauty.
    # Preserve registration while cutting decoded light-map memory by75%.
    im=im.crop((0,light_y,4096,1440)).resize((2048,500),Image.Resampling.LANCZOS)
    save(im,'light-'+name,True)
data['light_crop_y']=light_y
data['render_engine']='Blender 4.2 / Cycles CPU, 48 samples, denoising, AgX'
data['assets']={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(OUT.glob('*.webp'))}
atomic(OUT/'camera.json',(json.dumps(data,indent=2)+'\n').encode())

# Embed only the actual active calibration, keeping the original GIMP metadata
# and untouched archival images in assets/scene/geometry.json.
path=ROOT/'index.html'
html=path.read_text()
import re
html=re.sub(r'(<script type="application/json" id="scene-geometry">).*?(</script>)',lambda m:m[1]+json.dumps(data,separators=(',',':'))+m[2],html,count=1,flags=re.S)
html=re.sub(r'(class="scene-platform"[^>]*width="4096" height=")\d+',lambda m:m[1]+str(1440-floor_y),html,count=1)
atomic(path,html.encode())
print('Packaged calibrated scene:',len(data['assets']),'assets; floor begins at',floor_y)
