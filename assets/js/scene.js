/* The current GIMP scene: one native grid, measured projective screen faces,
   one bounded tabletop renderer and separately masked keyboard/light layers. */
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
 const flow=window.createTextmodeFlow?.(stage.querySelector('.textmode-canvas'));
 const lighting=window.createSceneLighting?.(stage,native,sun,geometry);
 const ns='http://www.w3.org/2000/svg',ripples=stage.querySelector('.keyboard-ripples');
 for(let i=0;i<15;i++){
  const circle=document.createElementNS(ns,'circle');
  circle.setAttribute('cx',String(66+(i*173)%811));circle.setAttribute('cy',String(35+(i*47)%130));circle.setAttribute('r','165');circle.classList.add('rain-ring');
  circle.style.setProperty('--rain-duration',`${4.5+(i%5)*.53}s`);circle.style.setProperty('--rain-delay',`${-i*.81}s`);ripples.append(circle);
 }
 // Atlas of fine unknown glyphs: painted once, reused by the table renderer.
 const paths=['M2 2h8v12H2zM2 7h8M6 2v12','M2 2h8L2 14h8M6 3v10','M6 1 11 8 6 15 1 8zM1 8h10','M2 2v12h8V8H4M2 5h6','M1 4h10M3 1v14M8 4v8h3','M2 1v5h8v9M1 10h7','M2 2h8v4H5v8H2M5 10h5','M1 1h10M6 1v14M2 6h8M2 11h8','M2 1v14M2 4h8v8H5M6 1v3','M1 3h10L3 13h8M2 7h8','M1 8 6 1l5 7-5 7zM6 5v6','M2 2h3v12h5V2M1 8h10','M1 1h4v10h6v4M8 1v6h3','M1 2h10L6 8v7M1 12h10','M2 1v14h8M2 5h8v5H6','M1 4h10v8H1zM4 1v14M8 1v14'];
 const atlas=document.createElement('canvas');atlas.width=paths.length*28;atlas.height=40;
 const ac=atlas.getContext('2d');ac.lineWidth=1.1;ac.strokeStyle='#39ff14';ac.shadowColor='#19e50f';ac.shadowBlur=1.25;
 paths.forEach((path,i)=>{ac.save();ac.translate(i*28+3,3);ac.scale(1.7,1.7);ac.stroke(new Path2D(path));ac.restore();});
 const canvas=stage.querySelector('.table-flow-canvas'),ctx=canvas.getContext('2d',{alpha:true});
 let seed=134117;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 // Continuous straight ribbons: 20 of every 24 rows contain a glyph, even
 // between wave crests. Cache the repeating texture once; no glyph mutation.
 const planeWidth=2400,planeHeight=850,ribbonWidth=20,rowCount=24;
 const ribbons=document.createElement('canvas');ribbons.width=paths.length*ribbonWidth;ribbons.height=planeHeight*3;
 const rc=ribbons.getContext('2d');
 for(let variant=0;variant<paths.length;variant++)for(let row=0;row<rowCount;row++){
  if((row+variant)%6===0)continue;
  const glyph=(variant+row*7)%paths.length;
  const y=row*planeHeight/rowCount;
  rc.globalAlpha=.82+.18*((row*13+variant*7)%17)/16;
  for(let repeat=0;repeat<3;repeat++)rc.drawImage(atlas,glyph*28,0,28,40,variant*ribbonWidth+3,y+repeat*planeHeight,14,32);
 }
 const columns=Array.from({length:302},(_,i)=>({u:(i+.5)/302,speed:(.062+random()*.045)*1.2,phase:random(),strength:.45+random()*.55,g:Math.floor(random()*paths.length)}));
 project(canvas,geometry.table_quad,planeWidth,planeHeight);
 let raf=0,previous=0,last=0,time=13.7,frames=0;
 function drawTable(){
  const sx=canvas.width/planeWidth,sy=canvas.height/planeHeight;
  ctx.setTransform(sx,0,0,sy,0,0);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;ctx.clearRect(0,0,planeWidth,planeHeight);
  for(const col of columns){
   const offset=((time*col.speed+col.phase)%1)*planeHeight;
   ctx.globalAlpha=Math.min(1,col.strength*1.15*1.15*1.4);
   // Scrolling the cached strip moves every character continuously along
   // its straight line. Identical interior copies make wrapping seamless.
   ctx.drawImage(ribbons,col.g*ribbonWidth,planeHeight*2-offset,ribbonWidth,planeHeight,col.u*planeWidth-7.1,0,14.2,planeHeight);
  }
  // A wide travelling brightness wave, with a permanently visible base.
  // The wave changes light only; it never bends or wipes the code paths.
  const wave=ctx.createLinearGradient(0,0,0,planeHeight);
  for(let i=0;i<=64;i++){
   const v=i/64;
   const edge=Math.max(0,Math.min(1,v/.025,(1-v)/.025));
   const fade=edge*edge*(3-2*edge);
   const brightness=(.48+.52*Math.pow(.5+.5*Math.cos((v-time*.16)*Math.PI*2),2))*fade;
   wave.addColorStop(v,`rgba(255,255,255,${brightness})`);
  }
  ctx.globalAlpha=1;ctx.globalCompositeOperation='destination-in';ctx.fillStyle=wave;ctx.fillRect(0,0,planeWidth,planeHeight);
  ctx.globalCompositeOperation='source-over';frames++;if(frames%60===0)canvas.dataset.frames=String(frames);
 }
 function frame(now){
  raf=0;if(!active)return;
  if(now-last>=1000/60){if(previous)time+=Math.min((now-previous)/1000,.1);previous=now;last=now-((now-last)%(1000/60));drawTable();}
  lighting?.tick(now);raf=requestAnimationFrame(frame);
 }
 function setTable(value){if(!value){cancelAnimationFrame(raf);raf=0;previous=0;}else if(!raf)raf=requestAnimationFrame(frame);canvas.dataset.running=String(value);}
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
  if(event.target.matches?.('.project-preview video')){external=event.target;pauseVideos();}
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
  canvas.width=Math.max(960,Math.min(2400,Math.round(box.width*Math.min(devicePixelRatio||1,1.5)*1.4)));canvas.height=Math.round(canvas.width*planeHeight/planeWidth);drawTable();flow?.resize();
  const source=sun.getBoundingClientRect(),x=(source.left+source.width/2-box.left)/scale,y=(source.top+source.height/2-box.top)/scale;
  native.style.setProperty('--sun-native-x',`${x}px`);lighting?.setSource(x,y);
  dispatchEvent(new CustomEvent('scene:layout'));
 }
 function update(){
  const next=!unloading&&visible&&!document.hidden&&!motion.matches&&!navigator.connection?.saveData&&Number(compare?.getAttribute('aria-valuenow'))!==100;
  const changed=active!==next;active=next;stage.classList.toggle('scene-paused',!active);document.documentElement.classList.toggle('scene-light-paused',!active);stage.dataset.effects=active?'running':'paused';flow?.setActive(active);lighting?.setActive(active);setTable(active);
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
