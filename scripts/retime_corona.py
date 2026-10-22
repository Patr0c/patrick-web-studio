#!/usr/bin/env python3
"""Offline corona repair; requires ffmpeg (libvpx), numpy, scipy and Pillow.
Uses the original recorded alpha footage from Git, never the newly encoded result.
The website only decodes the finished video; no per-frame browser renderer.
"""
from pathlib import Path
import subprocess as sp
import tempfile
import numpy as np
from scipy.ndimage import gaussian_filter
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
FPS, DURATION, SIZE = 60, 36, 512

def smooth(x):
    x = np.clip(x, 0, 1)
    return x*x*(3-2*x)

with tempfile.TemporaryDirectory() as directory:
    original = Path(directory)/'original.webm'
    original.write_bytes(sp.check_output(['git','show','c32edc96016d32543f9d9d9dac3d5bd91aa55fcd:assets/video/sun-corona.webm'],cwd=ROOT))
    raw = sp.check_output(['ffmpeg','-v','error','-c:v','libvpx-vp9','-i',str(original),'-f','rawvideo','-pix_fmt','rgba','-'])
    frames = np.frombuffer(raw,np.uint8).reshape(-1,SIZE,SIZE,4)
    yy,xx=np.mgrid[:SIZE,:SIZE];radius=np.hypot(xx-255.5,yy-255.5)
    # Preserve the narrow corona. A quiet ring is shared at both loop endpoints.
    ring = 1-smooth((radius-185)/13)
    base = np.median(frames[::12].astype(np.float32),axis=0)
    base[:,:,3] *= ring
    # The left-hand reconstruction overlap made two stacked lobes and a hard seam.
    # Feather the outer overlap into one plume; do not touch the solar surface.
    left = 1-smooth((xx-92)/40)
    lower = smooth((yy-268)/40)
    outer = smooth((radius-184)/15)
    overlap = 1 - .96*left*lower*outer
    feathered = np.empty_like(frames)
    for i,frame in enumerate(frames):
        f=frame.astype(np.float32)
        alpha=f[:,:,3]/255
        premul=f[:,:,:3]*alpha[:,:,None]
        soft_alpha=gaussian_filter(alpha,.85)
        soft_rgb=np.stack([gaussian_filter(premul[:,:,c],.85) for c in range(3)],axis=2)
        edge=smooth((radius-181)/14)
        alpha=alpha*(1-edge)+soft_alpha*edge
        premul=premul*(1-edge[:,:,None])+soft_rgb*edge[:,:,None]
        alpha*=overlap
        rgb=premul/np.maximum(alpha[:,:,None]/np.maximum(overlap[:,:,None],.001),.001)
        feathered[i,:,:,:3]=np.clip(rgb,0,255)
        feathered[i,:,:,3]=np.clip(alpha*255,0,255)
    base_alpha=base[:,:,3:4]/255
    base_rgb=base[:,:,:3]*base_alpha
    outputs=[]
    for size,name,crf in [(512,'sun-corona.webm','29'),(384,'sun-corona-mobile.webm','30')]:
        command=['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgba','-s','512x512','-r',str(FPS),'-i','-','-vf',f'scale={size}:{size}:flags=lanczos','-c:v','libvpx-vp9','-pix_fmt','yuva420p','-b:v','0','-crf',crf,'-deadline','good','-cpu-used','5','-row-mt','1','-threads','2','-auto-alt-ref','0',str(ROOT/'assets/video'/name)]
        outputs.append(sp.Popen(command,stdin=sp.PIPE))
    for n in range(FPS*DURATION):
        # Exactly mirrored motion: 2s rest, 15s build, 2s peak, 15s retreat, 2s rest.
        # Both source motion and brightness follow the same curve in each direction.
        progress=n/(FPS*DURATION-1)
        half_time=(1-abs(2*progress-1))*(DURATION/2)
        envelope=float(smooth((half_time-2)/15))
        source=envelope*(len(frames)-1)
        k=int(source);fraction=source-k
        f=feathered[k].astype(np.float32)*(1-fraction)+feathered[min(k+1,len(frames)-1)].astype(np.float32)*fraction
        a=f[:,:,3:4]/255
        outa=base_alpha*(1-envelope)+a*envelope
        rgb=(base_rgb*(1-envelope)+f[:,:,:3]*a*envelope)/np.maximum(outa,.001)
        out=np.concatenate([np.clip(rgb,0,255),np.clip(outa*255,0,255)],axis=2).astype(np.uint8)
        if n==0:Image.fromarray(out).save(ROOT/'assets/images/sun-corona.webp',lossless=True)
        for process in outputs:process.stdin.write(out.tobytes())
    for process in outputs:
        process.stdin.close()
        if process.wait():raise SystemExit('Corona encoding failed')
print('Encoded 36s / 60fps alpha loops: equal 15s build and retreat, with mirrored motion and resting endpoints.')
