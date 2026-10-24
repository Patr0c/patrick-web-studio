"""Bake core and corona masks before the small iPhone video is decoded."""
from pathlib import Path
import subprocess,json,hashlib
import numpy as np
from PIL import Image

def build_sun(root,out):
 yy,xx=np.mgrid[:320,:320];r=np.hypot(xx-159.5,yy-159.5)/160
 ring=np.minimum(np.clip((r-.62)/.06,0,1),np.clip((1-r)/.08,0,1))
 # The desktop core's radial mask also needs baking; padding alone left a box.
 core=np.clip((1.004-r*160/132)/(1.004-.778),0,1)
 for name,mask in [('solar-ring',ring),('solar-core',core)]:Image.fromarray(np.uint8(mask*255)).convert('RGB').save(out/(name+'.png'))
 filters='[0:v]fps=20,scale=264:264,pad=320:320:28:28:black,format=gbrp[core];[1:v]fps=20,scale=320:320,format=gbrp[flare];[2:v]format=gbrp[mask];[3:v]format=gbrp[coremask];[flare][mask]blend=all_mode=multiply[ring];[core][coremask]blend=all_mode=multiply[disk];[disk][ring]blend=all_mode=screen,format=yuv420p[out]'
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(root/'assets/video/sun-smooth-mobile.mp4'),'-stream_loop','-1','-i',str(root/'assets/video/sun-corona-smooth-mobile.mp4'),'-loop','1','-i',str(out/'solar-ring.png'),'-loop','1','-i',str(out/'solar-core.png'),'-filter_complex_threads','2','-filter_complex',filters,'-map','[out]','-t','108.733333','-an','-c:v','libx264','-threads','4','-preset','fast','-b:v','120k','-maxrate','160k','-bufsize','320k','-pix_fmt','yuv420p','-profile:v','main','-level','3.0','-movflags','+faststart',str(out/'sun.mp4')],check=True)
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss','4','-i',str(out/'sun.mp4'),'-frames:v','1',str(out/'sun-poster.webp')],check=True)
 for name in ['solar-ring.png','solar-core.png']:(out/name).unlink()

if __name__=='__main__':
 root=Path(__file__).resolve().parents[1];out=root/'assets/iphone';build_sun(root,out)
 path=out/'manifest.json';manifest=json.loads(path.read_text())
 for name in ['sun.mp4','sun-poster.webp']:
  p=out/name;entry=manifest[name];entry.update(bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
 path.write_text(json.dumps(manifest,indent=2)+'\n')
