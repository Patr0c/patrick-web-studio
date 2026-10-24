"""Static, camera-registered satin finish over the existing physical desk render.

Immutable source beauty/light passes preserve all modeled contact shadows.
The exposed-glass object ID excludes every accessory. Nothing repaints at runtime.
Run after package_seated_workstation.py, before build_iphone_assets.py.
"""
from pathlib import Path
import hashlib, io, json, re, sys, shutil
import cv2, cairosvg
import numpy as np
from PIL import Image, ImageDraw

ROOT=Path(__file__).resolve().parents[1]; S=ROOT/'assets/scene/seated'
g=json.loads((S/'camera.json').read_text())
if '--capture-source' in sys.argv:
 for name in ['workstation','light-sun','light-flare']:
  shutil.copyfile(S/(name+'.webp'),S/('materials/'+name+'-source.webp'))
W,H=4096,1440
mask=np.zeros((H,W),np.float32)
mask[:,768:3328]=np.asarray(Image.open(S/'glass-mask.webp').getchannel('A'))/255
receiver=mask.copy()
receiver[:,768:3328]=np.maximum(receiver[:,768:3328],np.asarray(Image.open(S/'pad-mask.webp').getchannel('A'))/255)
y,x=np.mgrid[:H,:W].astype(np.float32);nx=x-768

# Inverse project a deterministic fine stochastic texture in physical table space.
# A .45mm sand-etched finish, with a softer long-scale variation in roughness.
cam=g['camera'];C=np.array(cam['location']);R=np.array(cam['right']);U=np.array(cam['up']);F=np.array(cam['forward'])
ray=F+((nx-1280)/1750)[...,None]*R+((785-y)/1750)[...,None]*U
t=np.divide(.75-C[2],ray[...,2],out=np.zeros_like(x),where=np.abs(ray[...,2])>.0001)
wx=C[0]+ray[...,0]*t;wy=C[1]+ray[...,1]*t
rng=np.random.default_rng(20261024)
texture=rng.normal(0,1,(2048,2048)).astype(np.float32)
texture=cv2.GaussianBlur(texture,(0,0),.55)
grain=cv2.remap(texture,np.mod(wx/.00045,2048).astype(np.float32),np.mod(wy/.00045,2048).astype(np.float32),cv2.INTER_LINEAR,borderMode=cv2.BORDER_WRAP)
grain=np.clip(grain,-1,1)
cloud=cv2.GaussianBlur(rng.normal(0,1,(H,W)).astype(np.float32),(0,0),16)*40

beauty=np.array(Image.open(S/'materials/workstation-source.webp').convert('RGBA'))
rgb=beauty[:,:,:3].astype(np.float32)
# The old hot spot under monitor1 flattened the surface into a gold mirror.
# Preserve the existing occlusion, but compress its reflection into smoked satin.
hot=np.exp(-.5*(((nx-490)/300)**2+((y-1240)/145)**2))
rgb*=1-(hot*receiver*.74)[:,:,None]
base=np.stack([11.0+grain*2.4+cloud*.25,13.0+grain*2.5+cloud*.26,13.5+grain*2.5+cloud*.27],axis=2)
base*=np.clip((rgb.mean(axis=2)+4)/16,.25,1.0)[:,:,None]
rgb=rgb*(1-mask[:,:,None]*.28)+base*mask[:,:,None]*.60
# A restrained rounded-edge catchlight and darker vertical body, never a rim.
edge=np.exp(-((y-1381)/2.0)**2)*mask
rgb+=edge[:,:,None]*np.array([5,6,6])
front=np.clip((y-1386)/30,0,1)*mask
rgb*=1-front[:,:,None]*.22
beauty[:,:,:3]=np.uint8(np.clip(rgb,0,255))

def save_pair(array,name):
 im=Image.fromarray(array)
 for output,frame,quality in [(name,im,96),(name+'-mobile',im.resize((im.width//2,im.height//2),Image.Resampling.LANCZOS),94)]:
  buffer=io.BytesIO();frame.save(buffer,format='WEBP',quality=quality,method=4,exact=True)
  content=buffer.getvalue();assert len(content)>1000, 'Empty render: '+output
  Image.open(io.BytesIO(content)).verify()
  target=S/(output+'.webp');temporary=target.with_suffix('.pending');temporary.write_bytes(content);temporary.replace(target)
save_pair(beauty,'workstation')
for name in ['sun','flare']:
 im=np.array(Image.open(S/('materials/light-'+name+'-source.webp')).convert('RGBA'))
 attenuation=Image.fromarray(np.uint8(np.clip(1-hot*receiver*.80,0,1)*255)).crop((0,440,4096,1440)).resize((2048,500),Image.Resampling.LANCZOS)
 im[:,:,:3]=np.uint8(im[:,:,:3].astype(float)*(np.array(attenuation)/255)[:,:,None])
 save_pair(im,'light-'+name)

# Actual glyphs on the hardware silhouette, with opaque display apertures removed.
atlas=Image.open(io.BytesIO(cairosvg.svg2png(url=str(S/'matrix-vector.svg')))).convert('RGBA')
ink=Image.new('RGBA',(W,H));atlas=atlas.resize((1536,1843),Image.Resampling.LANCZOS)
ink.alpha_composite(atlas,(-300,-180));ink.alpha_composite(atlas,(1236,-180));ink.alpha_composite(atlas,(2772,-180))
hardware=beauty[:,:,3].astype(np.float32)/255
hardware[y>1167]=0
for screen in g['screens']:
 aperture=Image.new('L',(W,H));ImageDraw.Draw(aperture).polygon([(px+768,py) for px,py in screen['quad']],fill=255)
 hardware*=1-np.array(aperture)/255
rgba=np.array(ink);rgba[:,:,3]=np.uint8(rgba[:,:,3]*hardware)
rgba[:,:,:3][rgba[:,:,3]==0]=0
save_pair(rgba,'boot-matrix')
g['table_finish']={'kind':'fine sand-etched smoked satin','grain_pitch_m':.00045,'left_hotspot_reduction':.74,'method':'static inverse-camera material finish; original physical contact shadows retained'}
g['assets']={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(S.glob('*.webp'))}
(S/'camera.json').write_text(json.dumps(g,indent=2)+'\n')
p=ROOT/'index.html';html=p.read_text();html=re.sub(r'(<script type="application/json" id="scene-geometry">).*?(</script>)',lambda m:m[1]+json.dumps(g,separators=(',',':'))+m[2],html,count=1,flags=re.S);p.write_text(html)
print('Satin table, reduced left reflection and masked hardware Matrix prepared.')
