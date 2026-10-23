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
 const ray=document.createElementNS(ns,'svg');ray.classList.add('scene-galaxy-ray');ray.setAttribute('viewBox','0 0 2560 1440');ray.setAttribute('aria-hidden','true');
 ray.innerHTML='<defs><linearGradient id="galaxy-ray-ink" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#c6deff"/><stop offset="1" stop-color="#b7a1d0" stop-opacity=".1"/></linearGradient></defs><path d="M1771 953C1830 1040 1450 1110 1370 1390" fill="none" stroke="url(#galaxy-ray-ink)" stroke-width="45"/>';
 native.append(ray);
 // Atlas of fine unknown glyphs: painted once, reused by the table renderer.
 const paths=['M2 2h8v12H2zM2 7h8M6 2v12','M2 2h8L2 14h8M6 3v10','M6 1 11 8 6 15 1 8zM1 8h10','M2 2v12h8V8H4M2 5h6','M1 4h10M3 1v14M8 4v8h3','M2 1v5h8v9M1 10h7','M2 2h8v4H5v8H2M5 10h5','M1 1h10M6 1v14M2 6h8M2 11h8','M2 1v14M2 4h8v8H5M6 1v3','M1 3h10L3 13h8M2 7h8','M1 8 6 1l5 7-5 7zM6 5v6','M2 2h3v12h5V2M1 8h10','M1 1h4v10h6v4M8 1v6h3','M1 2h10L6 8v7M1 12h10','M2 1v14h8M2 5h8v5H6','M1 4h10v8H1zM4 1v14M8 1v14'];
 const atlas=document.createElement('canvas');atlas.width=paths.length*28;atlas.height=40;
 const ac=atlas.getContext('2d');ac.lineWidth=1.1;ac.strokeStyle='#39ff14';ac.shadowColor='#19e50f';ac.shadowBlur=1.25;
 paths.forEach((path,i)=>{ac.save();ac.translate(i*28+3,3);ac.scale(1.7,1.7);ac.stroke(new Path2D(path));ac.restore();});
 const canvas=stage.querySelector('.table-flow-canvas'),ctx=canvas.getContext('2d',{alpha:true});
 let seed=134117;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const cells=[];
 // Fine perspective-compressed glyphs follow the narrow rear glass strip.
 const rearCells=Array.from({length:151},(_,i)=>({x:275+i*13.3,g:Math.floor(random()*paths.length)}));
 for(let row=0;row<16;row++)for(let col=0;col<151;col++){
  if(random()>.86)continue;cells.push({u:(col+.5)/151,v:(row+.5)/16,g:Math.floor(random()*paths.length),phase:random()});
 }
 let raf=0,previous=0,last=0,time=13.7,frames=0;
 function drawTable(){
  const sx=canvas.width/2560,sy=canvas.height/310;ctx.setTransform(sx,0,0,sy,0,0);ctx.clearRect(0,0,2560,310);
  for(const c of cells){
   const p=c.v+Math.sin(c.u*8+time*.3)*.13-time*.16;
   const wave=Math.exp(-Math.pow(Math.sin(p*Math.PI*1.5),2)*(28/1.44));
   const q=c.u+Math.sin(c.v*5-time*.2)*.14-time*.07;
   const cross=Math.exp(-Math.pow(Math.sin(q*Math.PI*2),2)*(38/1.44))*.36;
   const brightness=Math.min(1,(.035+wave*.83+cross)*1.15)*(c.phase*.35+.65);
   if(brightness<.06)continue;
   const left=260-215*c.v,right=2300+220*c.v;
   const x=left+(right-left)*c.u,y=33+c.v*247;
   const size=9+c.v*4.5,glyph=(c.g+Math.floor(time*.6+c.phase*9))%paths.length;
   ctx.globalAlpha=brightness;ctx.drawImage(atlas,glyph*28,0,28,40,x,y,size,size*1.43*1.2);
  }
  for(const c of rearCells){
   const wave=.2+.8*Math.pow(.5+.5*Math.sin(c.x*.012-time*1.1),3);
   ctx.globalAlpha=wave;ctx.drawImage(atlas,c.g*28,0,28,40,c.x,46,5,7.2);
  }
  ctx.globalAlpha=1;frames++;if(frames%30===0)canvas.dataset.frames=String(frames);
 }
 function frame(now){raf=0;if(!active)return;if(now-last>=1000/30){if(previous)time+=Math.min((now-previous)/1000,.1)*1.2;previous=now;last=now;drawTable();lighting?.tick(now);}raf=requestAnimationFrame(frame);}
 function setTable(value){if(!value){cancelAnimationFrame(raf);raf=0;previous=0;}else if(!raf)raf=requestAnimationFrame(frame);canvas.dataset.running=String(value);}
 // Only one recording is decoded at a time. The monitor rotates through all 3.
 const carousel=stage.querySelector('.scene-carousel'),slides=[...carousel.querySelectorAll('[data-project-slide]')];
 const videos=slides.map(slide=>slide.querySelector('video')),dots=[...carousel.querySelectorAll('[data-show-project]')];
 videos.forEach((video,i)=>{
  video.addEventListener('playing',()=>{
   const reveal=()=>slides[i].classList.add('has-video-frame');
   if('requestVideoFrameCallback' in video)video.requestVideoFrameCallback(reveal);else reveal();
  });
  video.addEventListener('error',()=>slides[i].classList.remove('has-video-frame'));
 });
 const pauseButton=carousel.querySelector('.carousel-pause');
 let index=0,timer=0,hold=false,hovered=false,manual=false,revision=0,external=null;
 const resets=new Map();
 function scheduleReset(video){
  if(resets.has(video))return;
  resets.set(video,setTimeout(()=>{
   resets.delete(video);if(video===videos[index]&&hovered&&active)return;
   if(video.readyState>0)video.currentTime=0;
   slides[videos.indexOf(video)].classList.remove('has-video-frame');
  },10000));
 }
 function clearRotation(){clearTimeout(timer);timer=0;}
 function pauseVideos(){revision++;videos.forEach(video=>{video.pause();scheduleReset(video);});}
 function arm(){clearRotation();if(active&&!hold&&!manual&&!external)timer=setTimeout(()=>show((index+1)%slides.length),12000);}
 function playCurrent(){
  pauseVideos();if(!active||!hovered||external)return;
  const video=videos[index],version=revision;
  clearTimeout(resets.get(video));resets.delete(video);
  video.muted=true;video.play().then(()=>{if(version!==revision||!active||!hovered||external||video!==videos[index])video.pause();}).catch(()=>{});
 }
 function show(next){
  index=next;slides.forEach((slide,i)=>{const on=i===index;slide.classList.toggle('is-active',on);slide.setAttribute('aria-hidden',String(!on));slide.tabIndex=on?0:-1;dots[i].setAttribute('aria-pressed',String(on));});
  carousel.querySelector('.project-counter').textContent=String(index+1).padStart(2,'0');carousel.dataset.project=String(index);playCurrent();arm();
 }
 dots.forEach((button,i)=>button.addEventListener('click',()=>show(i)));
 pauseButton.addEventListener('click',()=>{manual=!manual;pauseButton.setAttribute('aria-pressed',String(manual));pauseButton.setAttribute('aria-label',manual?'Projektwechsel fortsetzen':'Projektwechsel pausieren');pauseButton.textContent=manual?'▶':'Ⅱ';arm();});
 carousel.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch'){hovered=true;hold=true;playCurrent();arm();}});
 function leave(){hovered=false;hold=carousel.contains(document.activeElement);pauseVideos();arm();}
 carousel.addEventListener('pointerleave',leave);
 carousel.addEventListener('pointercancel',leave);
 carousel.addEventListener('focusin',()=>{hold=true;arm();});
 carousel.addEventListener('focusout',event=>{if(!carousel.contains(event.relatedTarget)){hold=false;arm();}});
 document.addEventListener('play',event=>{
  if(event.target.matches?.('.project-preview video')){external=event.target;pauseVideos();clearRotation();}
  if(videos.includes(event.target))document.querySelectorAll('.project-preview video').forEach(video=>video.pause());
 },true);
 document.addEventListener('pause',event=>{if(event.target===external){external=null;playCurrent();arm();}},true);
 function fit(){
  const box=stage.getBoundingClientRect();scale=box.width/2560;stage.style.setProperty('--scene-scale',String(scale));
  document.documentElement.style.setProperty('--scene-unit',`${scale}px`);document.documentElement.style.setProperty('--scene-top',`${box.top+scrollY}px`);
  if(phone.matches){if(sun.parentElement===native)hero.querySelector('.hero-new').prepend(sun);}
  else if(sun.parentElement!==native)native.prepend(sun);
  canvas.width=Math.max(480,Math.min(1440,Math.round(box.width*Math.min(devicePixelRatio||1,1.5))));canvas.height=Math.round(canvas.width*310/2560);drawTable();flow?.resize();
  const source=sun.getBoundingClientRect(),x=(source.left+source.width/2-box.left)/scale,y=(source.top+source.height/2-box.top)/scale;
  native.querySelector('.scene-light-cone path').setAttribute('d',`M${x} ${y}L-200 1440H2500Z`);
  const gradient=native.querySelector('#solar-air');gradient.setAttribute('gradientUnits','userSpaceOnUse');gradient.setAttribute('cx',String(x));gradient.setAttribute('cy',String(y));gradient.setAttribute('r',String(Math.max(2400,Math.hypot(2560-x,1440-y)*1.15)));
  native.style.setProperty('--sun-native-x',`${x}px`);lighting?.setSource(x,y);
  dispatchEvent(new CustomEvent('scene:layout'));
 }
 function update(){
  const next=!unloading&&visible&&!document.hidden&&!motion.matches&&!navigator.connection?.saveData&&Number(compare?.getAttribute('aria-valuenow'))!==100;
  const changed=active!==next;active=next;stage.classList.toggle('scene-paused',!active);document.documentElement.classList.toggle('scene-light-paused',!active);stage.dataset.effects=active?'running':'paused';flow?.setActive(active);setTable(active);
  if(changed){if(active){playCurrent();arm();}else{pauseVideos();clearRotation();}}
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
