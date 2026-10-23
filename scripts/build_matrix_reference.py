#!/usr/bin/env python3
"""Build native matrix media from Patrick's supplied fullscreen recording.
Usage: python3 scripts/build_matrix_reference.py /path/to/reference.mp4
The original upload is external; UI-free source interval: seconds6–32.
"""
import subprocess, sys
from pathlib import Path
root=Path(__file__).resolve().parents[1]
source=Path(sys.argv[1]).resolve()
video=root/'assets/video/table-matrix-reference.mp4'
filters='[0:v]fps=60,scale=1280:720:flags=lanczos,split=2[base][extra];[extra]crop=128:720:0:0[strip];[base][strip]hstack=inputs=2,split=3[main][tail][start];[main]trim=start=0.6:end=25.4,setpts=PTS-STARTPTS[body];[tail]trim=start=25.4:end=26,setpts=PTS-STARTPTS[end];[start]trim=start=0:end=0.6,setpts=PTS-STARTPTS[opening];[end][opening]xfade=transition=fade:duration=0.6:offset=0[seam];[body][seam]concat=n=2:v=1:a=0,format=yuv420p[out]'
def run(args):subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y',*args],check=True)
run(['-ss','6','-t','26','-i',str(source),'-filter_complex',filters,'-map','[out]','-an','-c:v','libx264','-preset','fast','-crf','23','-movflags','+faststart',str(video)])
run(['-i',str(video),'-vf','scale=704:360:flags=lanczos','-an','-c:v','libx264','-preset','fast','-crf','23','-movflags','+faststart',str(root/'assets/video/table-matrix-reference-mobile.mp4')])
run(['-ss','3','-i',str(video),'-frames:v','1','-c:v','libwebp','-quality','94',str(root/'assets/scene/table-matrix-reference-poster.webp')])
