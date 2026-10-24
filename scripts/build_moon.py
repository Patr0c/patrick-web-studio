"""Orthographic lunar sphere from NASA LROC albedo; illuminated from upper left."""
import numpy as np
from PIL import Image
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];out=ROOT/'assets/scene/seated';N=1024
tex=np.array(Image.open(Path(__file__).resolve().parents[1]/'assets/scene/seated/materials/moon-lroc-2k.jpg').convert('RGB'))/255
Y,X=np.mgrid[:N,:N];x=(X+.5-N/2)/(N/2-2);y=-(Y+.5-N/2)/(N/2-2);r=x*x+y*y;z=np.sqrt(np.maximum(0,1-r))
# View at longitude 0, the familiar lunar near side. Supersampled round limb.
u=(np.arctan2(x,z)/(2*np.pi)+.5)*(tex.shape[1]-1);v=(.5-np.arcsin(np.clip(y,-1,1))/np.pi)*(tex.shape[0]-1)
from scipy.ndimage import map_coordinates
albedo=np.stack([map_coordinates(tex[:,:,i],[v,u],order=1) for i in range(3)],2)
light=np.array([-.86,.24,.45]);light/=np.linalg.norm(light)
shade=np.maximum(0,x*light[0]+y*light[1]+z*light[2]);rgb=np.clip(albedo*(.07+shade[:,:,None]*1.8),0,1)
a=np.clip((1-r)*N/3,0,1);result=np.dstack([rgb,a]);im=Image.fromarray((result*255).astype('uint8'))
im.save(out/'moon.webp',quality=96);im.resize((512,512),Image.Resampling.LANCZOS).save(out/'moon-mobile.webp',quality=94)
