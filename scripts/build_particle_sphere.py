"""Seeded volumetric violet sphere, disjoint particle layers for subtle renewal."""
from PIL import Image,ImageDraw,ImageFilter
import random,math
from pathlib import Path
OUT=Path(__file__).resolve().parents[1]/'assets/scene/seated';rng=random.Random(242610)
N=960;layers=[Image.new('RGBA',(N,N)) for _ in range(6)]
for i in range(17500):
 z=rng.uniform(-1,1);theta=rng.random()*math.tau
 radius=.86+.10*rng.random() if rng.random()<.58 else rng.random()**.4*.97
 x=radius*math.sqrt(1-z*z)*math.cos(theta);y=radius*z;depth=radius*math.sqrt(1-z*z)*math.sin(theta)
 # Individual subpixel stars, gentle limb density and wisps, never broad fog.
 noise=.65+.35*math.sin(theta*7+z*12)
 if rng.random()>noise:continue
 u=N/2+x*N*.43;v=N/2+y*N*.43
 a=int((.18+.82*rng.random())*(.45+.55*(depth+1)/2)*185)
 r=rng.uniform(.28,.72)*(1.3 if i%137==0 else 1)
 col=(int(145+85*rng.random()),int(95+70*rng.random()),255,a)
 d=ImageDraw.Draw(layers[i%6]);d.ellipse((u-r,v-r,u+r,v+r),fill=col)
 if i%239==0:
  d.line((u-2,v,u+2,v),fill=(210,185,255,140),width=1);d.line((u,v-2,u,v+2),fill=(210,185,255,140),width=1)
for i,im in enumerate(layers):im.save(OUT/f'particle-{i}.webp',lossless=True)
