/* iPhone: one bounded 2D canvas. All perspective/masking is baked offline.
   No desktop controller, SVG atlas, CSS filters, WebGL or autoplay at load. */
(() => {
 'use strict';
 const hero=document.querySelector('.phone-hero'),canvas=document.getElementById('phone-scene');
 if(!hero||!canvas)return;
 const g=JSON.parse(document.getElementById('phone-geometry').textContent),ctx=canvas.getContext('2d',{alpha:false});
 const moonButton=hero.querySelector('.phone-moon'),chooser=hero.querySelector('.phone-project-switch'),villa=hero.querySelector('.phone-villa'),status=document.getElementById('phone-status');
 const motion=matchMedia('(prefers-reduced-motion: reduce)'),save=()=>Boolean(navigator.connection?.saveData);
 const images={moon:moonButton.querySelector('img')},media=[];
 // If the browser cannot allocate even the bounded canvas, keep useful stills.
 if(!ctx){
  const still=new Image();still.src='assets/iphone/scene-night.webp';still.alt='Digital-Rework-Workstation';still.className='phone-static';canvas.replaceWith(still);
  Object.assign(moonButton.style,{left:'76%',top:'70%',width:'48px',height:'48px'});
  moonButton.addEventListener('click',()=>{still.src='assets/iphone/scene-hrservice.webp';moonButton.hidden=true;hero.dataset.state='on';status.textContent='Arbeitsstation eingeschaltet.';const sun=new Image();sun.src='assets/iphone/sun-poster.webp';sun.alt='Sonne';sun.className='phone-static-sun';hero.append(sun);});
  return;
 }
 let state='night',elapsed=0,lastPaint=0,raf=0,visible=true,running=false,w=1,h=1,dpr=1,s=1,stageY=0,project='hrservice',sunVideo,matrixVideo;
 const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
 function image(name,file){
  return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{images[name]=im;resolve(im);};im.onerror=()=>reject(new Error('Image unavailable: '+file));im.src='assets/iphone/'+file;});
 }
 function video(file){
  const v=document.createElement('video');v.muted=true;v.defaultMuted=true;v.playsInline=true;v.setAttribute('playsinline','');v.loop=true;v.preload='metadata';v.className='phone-media';v.setAttribute('aria-hidden','true');v.tabIndex=-1;v.src='assets/iphone/'+file;hero.append(v);media.push(v);
  v.play().catch(()=>{});return v;
 }
 function resize(){
  w=hero.clientWidth;h=hero.clientHeight;dpr=Math.min(devicePixelRatio||1,1.25,600/w,Math.sqrt(640000/(w*h)));
  canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);s=w/g.nativeWidth;stageY=h-g.nativeHeight*s;
  const mx=(2061+40)*s,my=stageY+312*s,body=322*s,size=Math.max(48,body);
  Object.assign(moonButton.style,{left:(mx-size/2)+'px',top:(my-size/2)+'px',width:size+'px',height:size+'px',padding:Math.max(0,(size-body)/2)+'px'});
  for(const [element,index] of [[chooser,0],[villa,2]]){
   const [x0,y0,x1,y1]=g.screenBounds[index];Object.assign(element.style,{left:x0*s+'px',top:stageY+y0*s+'px',width:(x1-x0)*s+'px',height:Math.max(44,(y1-y0)*s)+'px'});
  }
  hero.dataset.canvasPixels=String(canvas.width*canvas.height);draw();
 }
 let seed=20261024;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const stars=Array.from({length:150},()=>[random(),random(),.25+random()*.5,random()*6.28]);
 function scene(im,alpha=1){if(im?.complete&&im.naturalWidth){ctx.globalAlpha=alpha;ctx.drawImage(im,0,stageY,w,g.nativeHeight*s);ctx.globalAlpha=1;}}
 function draw(){
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;ctx.fillStyle='#02040a';ctx.fillRect(0,0,w,h);
  const powered=state==='boot'||state==='on',light=powered?smooth(elapsed/3):0;
  for(const [x,y,r,p] of stars){ctx.fillStyle=`rgba(228,240,255,${(.07+light*.5)*(.6+.4*Math.sin(elapsed*.4+p))})`;ctx.beginPath();ctx.arc(x*w,y*h,r,0,Math.PI*2);ctx.fill();}
  if(powered&&images.particles){ctx.globalAlpha=(.22+.08*Math.sin(elapsed*.13))*light;const size=840*s;ctx.drawImage(images.particles,(1771+40)*s-size/2,stageY+750*s-size/2,size,size);ctx.globalAlpha=1;}
  // Same circle and diametrically opposite centers as the desktop edition.
  const orbit=smooth(elapsed/2.8),angle=Math.atan2(-688,781)+orbit*(-2*Math.atan2(-688,781)),r=Math.hypot(781,688)*s,cx=(1280+40)*s,cy=stageY+1000*s,body=322*s;
  if(powered){
   const sx=cx-Math.cos(angle)*r,sy=cy-Math.sin(angle)*r,size=body*1.455;
   const solar=sunVideo?.readyState>=2?sunVideo:images.sun;
   if(solar){ctx.save();ctx.beginPath();ctx.arc(sx,sy,size*.49,0,Math.PI*2);ctx.clip();ctx.globalAlpha=smooth(elapsed/.8);ctx.globalCompositeOperation='screen';ctx.drawImage(solar,sx-size/2,sy-size/2,size,size);ctx.restore();}
   if(orbit<1&&images.moon.complete){ctx.globalAlpha=(1-orbit)*.62;ctx.drawImage(images.moon,cx+Math.cos(angle)*r-body/2,cy+Math.sin(angle)*r-body/2,body,body);ctx.globalAlpha=1;}
  }
  scene(images.night);
  if(powered){
   scene(images[project],light);
   if(state!=='on'){
    ctx.fillStyle='#020405';for(const q of g.screenQuads){ctx.beginPath();q.forEach(([x,y],i)=>{if(i)ctx.lineTo(x*s,stageY+y*s);else ctx.moveTo(x*s,stageY+y*s);});ctx.closePath();ctx.fill();}
   }
   const matrix=matrixVideo?.readyState>=2?matrixVideo:images.matrix;
   if(matrix){ctx.globalCompositeOperation='screen';ctx.globalAlpha=smooth(elapsed/1.2);ctx.drawImage(matrix,0,stageY+g.matrixCrop/0.4*s,w,g.matrixHeight/0.4*s);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;}
   const progress=(elapsed-.7)/2.4;
   if(state==='boot'&&progress>0&&progress<1&&images.circuit){const y=1150-progress*700,band=100;ctx.globalAlpha=Math.sin(progress*Math.PI)*.8;ctx.drawImage(images.circuit,0,y*.4,g.width,band*.4,0,stageY+y*s,w,band*s);ctx.globalAlpha=1;}
   const t=(sunVideo?.readyState>=2?sunVideo.currentTime:elapsed)%33.5,q=(t-5)/10;
   if(q>0&&q<1&&images.wave){
    const index=q*7,lo=Math.floor(index),mix=index-lo,env=smooth(q*6)*smooth((1-q)*5);
    for(const [i,a] of [[lo,1-mix],[Math.min(7,lo+1),mix]]){ctx.globalAlpha=a*env*(elapsed<33.5?1:.7);ctx.drawImage(images.wave,0,i*176,g.width,176,0,stageY+1000*s,w,440*s);}ctx.globalAlpha=1;
   }
   const size=Math.min(32,Math.max(21,w*.057));ctx.font=`800 ${size}px Archivo,Arial,sans-serif`;const text='DIGITAL REWORK.',total=ctx.measureText(text).width,left=(w-total)/2,y=h*.31;
   ctx.globalAlpha=light;ctx.fillStyle='#f7fff5';ctx.fillText('DIGITAL ',left,y);ctx.strokeStyle='#19e50f';ctx.lineWidth=.8;ctx.strokeText('REWORK.',left+ctx.measureText('DIGITAL ').width,y);ctx.globalAlpha=1;
  }
  for(const [x,y] of g.leds){ctx.globalAlpha=state==='on'?.8:(.15+.5*Math.max(0,Math.sin(elapsed*2.4)));ctx.fillStyle='#19e50f';ctx.beginPath();ctx.arc(x*s,stageY+y*s,.7,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
 }
 function ready(){state='on';hero.dataset.state=state;chooser.hidden=false;villa.hidden=false;status.textContent='Arbeitsstation eingeschaltet.';canvas.setAttribute('aria-label','Rauchglas-Workstation mit scharfer Matrix, violetter Tastatur und drei Projektmonitoren.');}
 function frame(now){
  raf=0;if(!running)return;raf=requestAnimationFrame(frame);if(now-lastPaint<50)return;
  // Keep real time when the browser throttles a visible frame; hidden/offscreen
  // pauses reset lastPaint in sync(), so they never advance the startup clock.
  elapsed+=Math.max(0,(now-lastPaint)/1000);lastPaint=now;if(state==='boot'&&elapsed>=3.6)ready();draw();
 }
 function sync(){
  const next=(state==='boot'||state==='on')&&visible&&!document.hidden&&!motion.matches&&!save();
  running=next;hero.dataset.animating=String(next);
  if(next){lastPaint=performance.now();if(!raf)raf=requestAnimationFrame(frame);media.forEach(v=>{if(v.paused)v.play().catch(()=>{});});}
  else{cancelAnimationFrame(raf);raf=0;media.forEach(v=>v.pause());if(motion.matches||save()){if(state==='boot'){elapsed=6;ready();}draw();}}
 }
 moonButton.addEventListener('click',async()=>{
  if(state!=='night')return;state='loading';moonButton.blur();moonButton.disabled=true;moonButton.setAttribute('aria-busy','true');status.textContent='Arbeitsstation wird eingeschaltet.';
  if(!motion.matches&&!save()){sunVideo=video('sun.mp4');matrixVideo=video('matrix.mp4');}
  try{
   await Promise.all([image('hrservice','scene-hrservice.webp'),image('sun','sun-poster.webp'),image('matrix','matrix-poster.webp'),image('circuit','circuit.webp'),image('wave','floor-wave.png'),image('particles','particles.webp')]);
   media.forEach(v=>{if(v.readyState>0)v.currentTime=0;});state='boot';elapsed=0;hero.dataset.state=state;moonButton.hidden=true;moonButton.removeAttribute('aria-busy');sync();draw();
  }catch(error){media.forEach(v=>v.pause());state='night';moonButton.disabled=false;moonButton.removeAttribute('aria-busy');status.textContent='Die Grafiken konnten nicht geladen werden. Bitte erneut auf den Mond tippen.';}
 });
 chooser.addEventListener('click',async()=>{const next=project==='hrservice'?'wagner':'hrservice';chooser.disabled=true;try{if(!images[next])await image(next,'scene-'+next+'.webp');project=next;chooser.setAttribute('aria-label',`Linke Vorschau von ${next==='wagner'?'Gasthof Wagner auf HRService':'HRService auf Gasthof Wagner'} wechseln`);draw();}catch(error){status.textContent='Die nächste Projektvorschau konnte nicht geladen werden.';}finally{chooser.disabled=false;}});
 new ResizeObserver(resize).observe(hero);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.01}).observe(hero);
 document.addEventListener('visibilitychange',sync);motion.addEventListener('change',sync);navigator.connection?.addEventListener('change',sync);
 window.addEventListener('pagehide',()=>{visible=false;sync();});window.addEventListener('pageshow',()=>{visible=true;sync();});
 image('night','scene-night.webp').then(draw).catch(()=>{});document.fonts?.ready.then(draw);resize();
 // Retained optional rocket-button feedback; no animated SVG or extra loop.
 document.querySelector('.engine-trigger')?.addEventListener('click',event=>{const b=event.currentTarget,on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',on?'Antrieb stoppen':'Antrieb starten');document.querySelector('.engine-status').textContent=on?'Antrieb aktiv.':'Bereit.';});
})();
