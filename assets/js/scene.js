/* The current GIMP scene: one native grid, measured projective screen faces,
   one native tabletop video and separately masked keyboard/light layers. */
(() => {
 'use strict';
 const stage=document.querySelector('.scene-stage'),hero=document.querySelector('.immersive-hero');
 if(!stage||!hero)return;
 const geometry=JSON.parse(document.getElementById('scene-geometry').textContent);
 const native=stage.querySelector('.scene-native'),sun=native.querySelector('.scene-sun');
 const phone=matchMedia('(max-width:760px)'),motion=matchMedia('(prefers-reduced-motion:reduce)');
 const compare=hero.querySelector('.compare-handle');
 let visible=false,active=false,scale=.5,unloading=false;
 // Exact homography: keep all four HTML corners registered to the repaired glass.
 function project(element,points,w,h){
  const [p0,p1,p2,p3]=points,dx1=p1[0]-p2[0],dx2=p3[0]-p2[0],dx3=p0[0]-p1[0]+p2[0]-p3[0];
  const dy1=p1[1]-p2[1],dy2=p3[1]-p2[1],dy3=p0[1]-p1[1]+p2[1]-p3[1];
  const den=dx1*dy2-dx2*dy1;
  const g=Math.abs(dx3)+Math.abs(dy3)>.00001?(dx3*dy2-dx2*dy3)/den:0;
  const hq=Math.abs(dx3)+Math.abs(dy3)>.00001?(dx1*dy3-dx3*dy1)/den:0;
  const a=p1[0]-p0[0]+g*p1[0],b=p3[0]-p0[0]+hq*p3[0],d=p1[1]-p0[1]+g*p1[1],e=p3[1]-p0[1]+hq*p3[1];
  element.style.width=w+'px';element.style.height=h+'px';
  element.style.transform=`matrix3d(${a/w},${d/w},0,${g/w},${b/h},${e/h},0,${hq/h},0,0,1,0,${p0[0]},${p0[1]},0,1)`;
 }
 geometry.screens.forEach(screen=>project(stage.querySelector(`[data-screen="${screen.id}"]`),screen.quad,screen.width,screen.height));
 // Keep bezel, support geometry and live HTML faces on one camera plane.
 const monitorAssembly=stage.querySelector('.scene-monitor-assembly');
 project(monitorAssembly,geometry.monitor_perspective.canvas_quad,2560,1440);
 const lighting=window.createSceneLighting?.(stage,native,sun,geometry);
 // The supplied clean recording is the matrix source: original symbols,
 // cadence and falloff, with 110% horizontal stream density baked offline.
 // Native video compositing replaces the old per-glyph Canvas renderer.
 const tableVideo=stage.querySelector('.table-flow-video');
 tableVideo.muted=true;tableVideo.defaultMuted=true;tableVideo.autoplay=false;
 project(tableVideo,geometry.table_quad,2400,1350);
 let raf=0;
 function frame(now){
  raf=0;if(!active)return;
  lighting?.tick(now);raf=requestAnimationFrame(frame);
 }
 function setTable(value){
  tableVideo.dataset.running=String(value);
  if(!value){cancelAnimationFrame(raf);raf=0;tableVideo.pause();return;}
  if(!raf)raf=requestAnimationFrame(frame);
  if(tableVideo.paused)tableVideo.play().then(()=>{if(!active)tableVideo.pause();}).catch(()=>{});
 }
 // HRService is the fixed initial selection. Only clicks change the project;
 // playback still starts exclusively on pointer hover.
 const carousel=stage.querySelector('.scene-carousel'),slides=[...carousel.querySelectorAll('[data-project-slide]')];
 const videos=slides.map(slide=>slide.querySelector('video')),dots=[...carousel.querySelectorAll('[data-show-project]')];
 videos.forEach((video,i)=>{
  video.addEventListener('playing',()=>{
   const reveal=()=>slides[i].classList.add('has-video-frame');
   if('requestVideoFrameCallback' in video)video.requestVideoFrameCallback(reveal);else reveal();
  });
  video.addEventListener('error',()=>slides[i].classList.remove('has-video-frame'));
 });
 let index=0,hovered=false,revision=0,external=null;
 const resets=new Map();
 function scheduleReset(video){
  if(resets.has(video))return;
  resets.set(video,setTimeout(()=>{
   resets.delete(video);if(video===videos[index]&&hovered&&active)return;
   if(video.readyState>0)video.currentTime=0;
   slides[videos.indexOf(video)].classList.remove('has-video-frame');
  },10000));
 }
 function pauseVideos(){revision++;videos.forEach(video=>{video.pause();scheduleReset(video);});}
 function playCurrent(){
  pauseVideos();if(!active||!hovered||external)return;
  const video=videos[index],version=revision;
  clearTimeout(resets.get(video));resets.delete(video);
  video.muted=true;video.play().then(()=>{if(version!==revision||!active||!hovered||external||video!==videos[index])video.pause();}).catch(()=>{});
 }
 function show(next){
  index=next;slides.forEach((slide,i)=>{const on=i===index;slide.classList.toggle('is-active',on);slide.setAttribute('aria-hidden',String(!on));slide.tabIndex=on?0:-1;dots[i].setAttribute('aria-pressed',String(on));});
  carousel.dataset.project=String(index);playCurrent();
 }
 dots.forEach((button,i)=>button.addEventListener('click',()=>show(i)));
 carousel.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch'){hovered=true;playCurrent();}});
 function leave(){hovered=false;pauseVideos();}
 carousel.addEventListener('pointerleave',leave);
 carousel.addEventListener('pointercancel',leave);
 document.addEventListener('play',event=>{
  if(event.target.matches?.('.project-preview video, .scene-recording video')){external=event.target;pauseVideos();}
  if(videos.includes(event.target))document.querySelectorAll('.project-preview video').forEach(video=>video.pause());
 },true);
 document.addEventListener('pause',event=>{if(event.target===external){external=null;playCurrent();}},true);
 function fit(){
  const box=stage.getBoundingClientRect();scale=box.width/2560;stage.style.setProperty('--scene-scale',String(scale));
  document.documentElement.style.setProperty('--scene-unit',`${scale}px`);document.documentElement.style.setProperty('--scene-top',`${box.top+scrollY}px`);
  // Keep the two solar video surfaces outside the large, repainting desk layer.
  // Desktop coordinates remain exactly the same native 338/151/322 rectangle.
  const receiver=hero.querySelector('.hero-new');
  if(sun.parentElement!==receiver)receiver.prepend(sun);
  if(phone.matches){for(const property of ['left','top','width','height'])sun.style.removeProperty(property);}
  else{
   const root=receiver.getBoundingClientRect();
   sun.style.left=`${box.left-root.left+338*scale}px`;sun.style.top=`${box.top-root.top+151*scale}px`;
   sun.style.width=`${322*scale}px`;sun.style.height=`${322*scale}px`;
  }
  const source=sun.getBoundingClientRect(),x=(source.left+source.width/2-box.left)/scale,y=(source.top+source.height/2-box.top)/scale;
  native.style.setProperty('--sun-native-x',`${x}px`);lighting?.setSource(x,y);
  dispatchEvent(new CustomEvent('scene:layout'));
 }
 function update(){
  const next=!unloading&&visible&&!document.hidden&&!motion.matches&&!navigator.connection?.saveData&&Number(compare?.getAttribute('aria-valuenow'))!==100;
  const changed=active!==next;active=next;stage.classList.toggle('scene-paused',!active);document.documentElement.classList.toggle('scene-light-paused',!active);stage.dataset.effects=active?'running':'paused';lighting?.setActive(active);setTable(active);
  if(changed){if(active){playCurrent();}else{pauseVideos();}}
 }
 new ResizeObserver(fit).observe(stage);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;update();},{threshold:.04}).observe(stage);
 if(compare)new MutationObserver(update).observe(compare,{attributes:true,attributeFilter:['aria-valuenow']});
 document.addEventListener('visibilitychange',update);motion.addEventListener('change',update);phone.addEventListener('change',fit);navigator.connection?.addEventListener('change',update);
 window.addEventListener('pagehide',()=>{unloading=true;update();});window.addEventListener('pageshow',()=>{unloading=false;update();});
 stage.querySelectorAll('.scene-control').forEach(button=>button.addEventListener('click',()=>{
  button.classList.add('is-pressed');setTimeout(()=>button.classList.remove('is-pressed'),350);
  stage.querySelector('.scene-control-status').textContent=button.getAttribute('aria-label')+' gedrückt.';
  button.dispatchEvent(new CustomEvent('desk:control',{bubbles:true,detail:{id:button.dataset.controlId}}));
 }));
 fit();update();
})();
