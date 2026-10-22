#!/usr/bin/env python3
"""Offline corona repair; requires ffmpeg (libvpx), numpy, scipy and Pillow.
Uses the original recorded alpha footage from Git, never the newly encoded result.
The website only decodes the finished video; no per-frame browser renderer.
"""
from pathlib import Path
import subprocess as sp
import tempfile
import numpy as np
from scipy.ndimage import gaussian_filter, gaussian_filter1d
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
FPS, SIZE = 60, 512
REST, BUILD, PEAK, RETREAT = 2, 15, 2, 15 / 1.2
DURATION = 2 * REST + BUILD + PEAK + RETREAT

def smooth(x):
    x = np.clip(x, 0, 1)
    return x*x*(3-2*x)

def phase(time):
    """Common gentle motion; withdrawal runs at 120% of its former speed."""
    if time < REST:
        return 0.0
    if time < REST + BUILD:
        return float(smooth((time - REST) / BUILD))
    if time < REST + BUILD + PEAK:
        return 1.0
    return float(1 - smooth((time - REST - BUILD - PEAK) / RETREAT))

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
    # Each reconstructed flare peaks at a different source time. A single global
    # reverse playback made the east/south plumes grow again during withdrawal.
    # Find each direction's peak, then apply one shared phase to all directions.
    angle = np.arctan2(yy-255.5, xx-255.5)
    centers = [-np.pi/2, 0, np.pi/2, np.pi]
    weights = np.stack([np.maximum(np.cos(angle-c), 0)**8 for c in centers])
    weights /= weights.sum(axis=0)
    peak_frames = []
    for name, center in zip(('north', 'east', 'south', 'west'), centers):
        delta = np.angle(np.exp(1j*(angle-center)))
        sector = (radius > 200) & (np.abs(delta) < np.pi/4)
        energy = (frames[:,:,:,3][:,sector].astype(np.float32) *
                  np.max(frames[:,:,:,:3][:,sector], axis=-1) / 255).sum(axis=1)
        k = int(np.argmax(gaussian_filter1d(energy, 3)))
        peak_frames.append(k)
        print(f'{name}: recorded peak {k/FPS:.3f}s', flush=True)
    peak_map = np.sum(weights * np.array(peak_frames)[:,None,None], axis=0)
    # Extend the successful left overlap feather to the right and lower rim.
    # Keep the already approved northern plume and the solar surface untouched.
    left = 1-smooth((xx-92)/40)
    right = smooth((xx-380)/40)
    lower = smooth((yy-268)/40)
    bottom = smooth((yy-380)/40)
    outer = smooth((radius-184)/15)
    overlap = (1 - .96*np.maximum(left,right)*lower*outer) * \
              (1 - .96*bottom*smooth((xx-268)/40)*outer)
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
    for n in range(round(FPS*DURATION)):
        # Direction-aware source sampling avoids replaying any local eruption
        # out of phase. The angular blend has no visible quadrant boundaries.
        envelope = phase(n/FPS)
        source = envelope * peak_map
        k = source.astype(np.int32)
        fraction = (source-k)[:,:,None]
        f = (feathered[k,yy,xx].astype(np.float32)*(1-fraction) +
             feathered[np.minimum(k+1,len(frames)-1),yy,xx].astype(np.float32)*fraction)
        a=f[:,:,3:4]/255
        outa=base_alpha*(1-envelope)+a*envelope
        rgb=(base_rgb*(1-envelope)+f[:,:,:3]*a*envelope)/np.maximum(outa,.001)
        out=np.concatenate([np.clip(rgb,0,255),np.clip(outa*255,0,255)],axis=2).astype(np.uint8)
        if n==0:Image.fromarray(out).save(ROOT/'assets/images/sun-corona.webp',lossless=True)
        for process in outputs:process.stdin.write(out.tobytes())
    for process in outputs:
        process.stdin.close()
        if process.wait():raise SystemExit('Corona encoding failed')
print(f'Encoded {DURATION}s / {FPS}fps alpha loops: all directions share {BUILD}s build and {RETREAT}s retreat; resting endpoints.', flush=True)
