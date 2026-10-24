"""Flatten the calibrated scene offline for iOS. No runtime masks/perspective.

Only the small Matrix strip and a single solar video need decoding after a tap.
Source glyph paths, common-camera projection and model pixels are unchanged.
"""
from pathlib import Path
import hashlib
from PIL import Image,ImageDraw,ImageEnhance
import numpy as np,cv2,cairosvg,json,subprocess,io,math,sys

ROOT=Path(__file__).resolve().parents[1];S=ROOT/'assets/scene/seated';O=ROOT/'assets/iphone';O.mkdir(exist_ok=True)
g=json.loads((S/'camera.json').read_text());W,H=1056,576;CROP=448;MH=128
def save(im,name):im.save(O/name,quality=93,method=4)
def small(im):return im.crop((728,0,3368,1440)).resize((W,H),Image.Resampling.LANCZOS)
def warp(im,q,bezel):
 a=np.array(im.convert('RGBA'));h,w=a.shape[:2]
 matrix=cv2.getPerspectiveTransform(np.float32([[0,0],[w,0],[w,h],[0,h]]),np.float32([[x+768,y] for x,y in q]))
 result=cv2.warpPerspective(a,matrix,(4096,1440),flags=cv2.INTER_LANCZOS4)
 # A recessed plane must never paint outside its physical front case silhouette.
 cam=g['camera'];C=np.array(cam['location']);R=np.array(cam['right']);U=np.array(cam['up']);F=np.array(cam['forward'])
 v=np.array(bezel)-C;z=v@F
 polygon=np.stack([2048+1750*(v@R)/z,785-1750*(v@U)/z],axis=1)
 aperture=np.zeros((1440,4096),np.uint8);cv2.fillConvexPoly(aperture,np.rint(polygon).astype(np.int32),255)
 result[:,:,3]=np.minimum(result[:,:,3],aperture)
 return Image.fromarray(result)

floor=Image.new('RGBA',(4096,1440));floor.alpha_composite(Image.open(S/'platform.webp').convert('RGBA'),(0,g['floor_crop_y']))
hardware=Image.open(S/'workstation.webp').convert('RGBA')
legends=Image.new('RGBA',(4096,1440));legends.alpha_composite(Image.open(S/'keyboard-legends.webp').convert('RGBA'),(768,0))
for project in ['hrservice','wagner','night']:
 im=floor.copy()
 for screen,name in zip(g['screens'],[project,'detective','villa']):
  photo=Image.new('RGBA',(8,8),(1,2,3,255)) if project=='night' else Image.open(ROOT/('previews/'+name+('.webp' if name=='detective' else '.jpg')))
  im.alpha_composite(warp(photo,screen['quad'],screen['bezel_world_corners']))
 im.alpha_composite(hardware)
 if project!='night':im.alpha_composite(legends)
 else:im=ImageEnhance.Brightness(im).enhance(.045)
 save(small(im),'scene-'+project+'.webp')
save(Image.open(S/'moon-mobile.webp').resize((192,192),Image.Resampling.LANCZOS),'moon.webp')
particles=Image.new('RGBA',(960,960))
for p in sorted(S.glob('particle-*.webp')):particles.alpha_composite(Image.open(p).convert('RGBA'))
save(particles.resize((320,320),Image.Resampling.LANCZOS),'particles.webp')
# A camera-registered scan mask, excluding screen apertures and tabletop.
save(small(Image.open(S/'boot-matrix.webp').convert('RGBA')),'circuit.webp')

# Broad floor wave: eight cheap bitmap frames, interpolated in the 2D renderer.
fm=np.array(small(floor).getchannel('A'),dtype=np.float32)/255
xx,yy=np.meshgrid(np.arange(W),np.arange(H));native_x=xx/.4-40;native_y=yy/.4
cam=g['camera'];P=np.array(cam['location']);R=np.array(cam['right']);U=np.array(cam['up']);F=np.array(cam['forward'])
ray=F+((native_x-1280)/1750)[...,None]*R+((785-native_y)/1750)[...,None]*U
depth=np.divide(-P[2],ray[...,2],out=np.zeros_like(native_x,dtype=float),where=np.abs(ray[...,2])>1e-5)
worldx=P[0]+ray[...,0]*depth
sheet=Image.new('RGBA',(W,176*8))
for i in range(8):
 crest=np.exp(-((worldx-(-9+i*18/7))/1.3)**2)*fm*.45
 a=np.zeros((176,W,4),np.uint8);a[:,:,:3]=(255,174,86);a[:,:,3]=np.clip(crest[400:]*255,0,255).astype(np.uint8)
 sheet.alpha_composite(Image.fromarray(a),(0,i*176))
sheet.save(O/'floor-wave.png')

# Rasterize genuine outlines once offline, then inverse-map a moving period.
SS=2;FPS=60
atlas=np.array(Image.open(io.BytesIO(cairosvg.svg2png(url=str(S/'matrix-glyphs.svg'),scale=SS))).convert('RGBA'))
cells=json.loads((S/'matrix-cells.json').read_text())
mask=Image.new('L',(2640,1440));mask.paste(Image.open(S/'glass-mask.webp').getchannel('A'),(40,0))
mask=np.array(mask.resize((W*SS,H*SS),Image.Resampling.LANCZOS))[CROP*SS:]/255
mx=np.full((MH*SS,W*SS),-1,np.float32);my=np.full((MH*SS,W*SS),-1,np.float32)
px,py=np.meshgrid((np.arange(W*SS,dtype=np.float32)+.5)/SS,(np.arange(MH*SS,dtype=np.float32)+.5)/SS)
for face in g['matrix_surfaces']:
 o,h=face['offset'],face['height'];q=np.float32([[(x+40)*.4,y*.4-CROP] for x,y in face['quad']])
 src=np.float32([[0,o],[1920,o],[1920,o+h],[0,o+h]])
 inv=cv2.getPerspectiveTransform(q,src);den=inv[2,0]*px+inv[2,1]*py+inv[2,2]
 valid=np.zeros((MH*SS,W*SS),np.uint8);cv2.fillConvexPoly(valid,np.rint(q*SS).astype(np.int32),1);v=valid.astype(bool)
 mx[v]=((inv[0,0]*px+inv[0,1]*py+inv[0,2])/den)[v]
 my[v]=((inv[1,0]*px+inv[1,1]*py+inv[1,2])/den)[v]
sprites=np.uint8(atlas[:,:,:3].astype(np.float32)*(atlas[:,:,3:]/255))
ink=np.zeros((2304*SS,1920*SS,3),np.uint8)
def hash32(n):
 n=((n^(n>>16))*0x45d9f3b)&0xffffffff
 n=((n^(n>>16))*0x45d9f3b)&0xffffffff
 return (n^(n>>16))&0xffffffff
period=2304/31.2;frames=round(period*FPS);previous={}
def mutate(t):
 for c in cells['cells']:
  col,row=c['col'],c['row'];seed=hash32(row*131+col*977+17);steps=23+seed%59
  cycle=math.floor(((t%period)/period+(seed%997)/997)*steps)%steps
  glyph=(c['glyph']+cycle*(1+seed%(cells['glyphs']-1)))%cells['glyphs'];key=(col,row)
  if previous.get(key)==glyph:continue
  previous[key]=glyph;x=(glyph%16)*32*SS;y=(glyph//16*32+c['bank']*288)*SS
  ink[row*32*SS:(row+1)*32*SS,col*32*SS:(col+1)*32*SS]=np.uint8(sprites[y:y+32*SS,x:x+32*SS]*c['opacity'])
cmd=['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W*SS}x{MH*SS}','-r',str(FPS),'-i','pipe:0','-an','-vf','scale=792:96:flags=area','-c:v','libx264','-threads','4','-preset','fast','-crf','19','-maxrate','420k','-bufsize','840k','-pix_fmt','yuv420p','-profile:v','main','-level','3.1','-g','120','-movflags','+faststart',str(O/'matrix.mp4')]
proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
for n in range(frames):
 if n%6==0:mutate(n/FPS)
 mapy=(np.mod(my-n*31.2/FPS,2304)*SS).astype(np.float32)
 frame=cv2.remap(ink,mx*SS,mapy,cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT)
 frame=np.uint8(frame.astype(np.float32)*mask[:,:,None])
 if n==0:save(Image.fromarray(frame).resize((W,MH),Image.Resampling.LANCZOS),'matrix-poster.webp')
 if n%600==0:print('Matrix:',n,'/',frames,flush=True)
 proc.stdin.write(frame.tobytes())
proc.stdin.close();assert proc.wait()==0

# Keep existing solar media when only rebuilding the tabletop.
if '--keep-sun' not in sys.argv:
 from build_iphone_sun import build_sun
 build_sun(ROOT,O)

data={'width':W,'height':H,'nativeWidth':2640,'nativeHeight':1440,'padding':40,'matrixCrop':CROP,'matrixHeight':MH,'leds':[[s['quad'][2][0]+26,s['quad'][2][1]+9] for s in g['screens']], 'screenQuads':[[[x+40,y] for x,y in s['quad']] for s in g['screens']], 'screenBounds':[[min(p[0] for p in s['quad'])+40,min(p[1] for p in s['quad']),max(p[0] for p in s['quad'])+40,max(p[1] for p in s['quad'])] for s in g['screens']], 'noRuntimePerspective':True,'noRuntimeMasks':True}
(O/'geometry.json').write_text(json.dumps(data,indent=2)+'\n')
manifest={}
for path in sorted(O.iterdir()):
 if not path.is_file() or path.name=='manifest.json':continue
 entry={'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
 if path.suffix in ('.webp','.png'):
  im=Image.open(path);im.verify();entry['size']=list(im.size)
 if path.suffix=='.mp4':
  probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','stream=width,height,codec_name,avg_frame_rate','-of','json',str(path)]));entry.update(probe['streams'][0])
 manifest[path.name]=entry
(O/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Prepared iPhone assets:',[(p.name,p.stat().st_size) for p in O.iterdir()],flush=True)
