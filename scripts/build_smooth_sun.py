"""Offline 0.42x sun at a true 60fps; original recordings remain archived.
Requires ffmpeg with minterpolate, libx264, libvpx-vp9. Sun interpolation is slow;
--skip-sun reuses the completed master when rebuilding the small delivery files.
"""
from pathlib import Path
import argparse,subprocess,json,tempfile
ROOT=Path(__file__).resolve().parents[1];V=ROOT/'assets/video'
p=argparse.ArgumentParser();p.add_argument('--skip-sun',action='store_true');args=p.parse_args()
def run(*items):subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-nostdin','-y',*map(str,items)],check=True)
if not args.skip_sun:
 run('-i',V/'sun-desktop.mp4','-vf','mpdecimate,setpts=(PTS-STARTPTS)/0.42,minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1:search_param=12','-c:v','libx264','-preset','medium','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart','-an',V/'sun-smooth-desktop.mp4')
 # Close the original recording's discontinuous loop with a gentle 0.8s
 # crossfade into its own opening; end and start then meet continuously.
 duration=float(json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','json',str(V/'sun-smooth-desktop.mp4')]))['format']['duration'])
 with tempfile.TemporaryDirectory(dir=V) as directory:
  loop=Path(directory)/'loop.mp4'
  graph=f'[0:v]split[body][head];[body]trim=start=0.8,setpts=PTS-STARTPTS[a];[head]trim=duration=0.8,setpts=PTS-STARTPTS[b];[a][b]xfade=transition=fade:duration=0.8:offset={duration-1.6:.6f},format=yuv420p[v]'
  run('-i',V/'sun-smooth-desktop.mp4','-filter_complex',graph,'-map','[v]','-c:v','libx264','-preset','fast','-crf','21','-movflags','+faststart','-an',loop)
  loop.replace(V/'sun-smooth-desktop.mp4')
run('-i',V/'sun-smooth-desktop.mp4','-vf','scale=320:320','-c:v','libx264','-preset','fast','-crf','22','-movflags','+faststart','-an',V/'sun-smooth-mobile.mp4')
# Alpha is premultiplied over black offline. The existing screen-blended corona
# layer makes this optically equivalent, while allowing ordinary H.264 decode.
run('-f','lavfi','-i','color=c=black:s=512x512:r=60','-c:v','libvpx-vp9','-i',V/'sun-corona.webm','-filter_complex','[0:v][1:v]overlay=shortest=1:format=auto,tpad=stop_mode=clone:stop_duration=0.034,format=yuv420p[v]','-map','[v]','-t','33.5','-c:v','libx264','-preset','fast','-crf','21','-movflags','+faststart','-an',V/'sun-corona-smooth-desktop.mp4')
run('-i',V/'sun-corona-smooth-desktop.mp4','-vf','scale=384:384','-c:v','libx264','-preset','fast','-crf','21','-movflags','+faststart','-an',V/'sun-corona-smooth-mobile.mp4')
