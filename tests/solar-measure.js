addEventListener('load',()=>{
 scrollTo(0,0);
 if(document.getElementById('solar-qa'))return;
 const video=document.querySelector('.sun-video');const box=document.createElement('pre');box.id='solar-qa';box.style='position:fixed;right:8px;top:4px;max-width:520px;white-space:pre-wrap;font:12px monospace;color:#fff;background:#000d;padding:10px;z-index:99999';box.textContent='Prüfe sichtbare Hauptseite ohne iframe…';document.body.append(box);
 const start=()=>{const before=video.getVideoPlaybackQuality(),begin=performance.now(),media=video.currentTime;let callbacks=0,last=0,maxGap=0,rafs=0;const animation=()=>{rafs++;if(performance.now()-begin<8000)requestAnimationFrame(animation);};requestAnimationFrame(animation);
  const frame=(now,meta)=>{callbacks++;if(last)maxGap=Math.max(maxGap,meta.mediaTime-last);last=meta.mediaTime;if(performance.now()-begin<8000)video.requestVideoFrameCallback(frame);};video.requestVideoFrameCallback(frame);
  setTimeout(()=>{const after=video.getVideoPlaybackQuality();box.textContent=JSON.stringify({seconds:(performance.now()-begin)/1000,mediaSeconds:video.currentTime-media,total:after.totalVideoFrames-before.totalVideoFrames,dropped:after.droppedVideoFrames-before.droppedVideoFrames,callbacks,maxGap,rafs},null,2)},8200);
 };
 if(video.paused)video.addEventListener('playing',start,{once:true});else start();
});
