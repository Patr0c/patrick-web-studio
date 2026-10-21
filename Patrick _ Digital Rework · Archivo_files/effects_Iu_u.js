// Project recordings play only while their preview is hovered.
(()=>{
 const previews=[...document.querySelectorAll('.project-preview')];
 const states=previews.map(preview=>({preview,video:preview.querySelector('video'),visible:false,timer:0}));
 function stop(s){
  s.video.pause();s.preview.classList.remove('is-playing');
  if(s.timer)return;
  s.timer=setTimeout(()=>{s.timer=0;if(!document.hidden&&s.visible&&s.preview.matches(':hover'))return;try{s.video.currentTime=0;}catch{}},10000);
 }
 function play(s){
  if(document.hidden||!s.visible||!s.preview.matches(':hover'))return;
  clearTimeout(s.timer);s.timer=0;
  s.video.play().then(()=>{if(!s.preview.matches(':hover')||!s.visible||document.hidden)stop(s);else s.preview.classList.add('is-playing');}).catch(()=>{});
 }
 const watcher=new IntersectionObserver(entries=>entries.forEach(entry=>{
  const s=states.find(s=>s.preview===entry.target);s.visible=entry.isIntersecting;
  if(s.visible&&s.preview.matches(':hover'))play(s);else stop(s);
 }),{threshold:.05});
 for(const s of states){
  s.video.muted=true;s.video.autoplay=false;s.video.removeAttribute('autoplay');s.video.pause();
  s.preview.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')play(s);});
  s.preview.addEventListener('pointerleave',()=>stop(s));
  watcher.observe(s.preview);
 }
 document.addEventListener('visibilitychange',()=>states.forEach(s=>{if(document.hidden)stop(s);else if(s.preview.matches(':hover'))play(s);}));
 const details=[...document.querySelectorAll('.services-list details')];details.forEach(item=>item.addEventListener('toggle',()=>{if(item.open)details.forEach(other=>{if(other!==item)other.open=false})}));
})();

// Document-anchored tiles scroll with the browser's compositor. Only nearby
// tiles twinkle; scrolling never waits for JavaScript to reposition the stars.
(()=>{
 const field=document.createElement('div');
 field.className='cosmic-points';field.setAttribute('aria-hidden','true');
 document.body.appendChild(field);
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const STAR_COUNT_MULTIPLIER=2,STAR_BRIGHTNESS=1.3,HALO_RADIUS=3.5,TILE_HEIGHT=768,BLEED=6;
 const tiles=[],active=new Set(),byCanvas=new WeakMap();
 let width=0,pageHeight=0,dpr=1,frame=0,layoutFrame=0,last=0;
 // Cache the two soft halos once instead of allocating gradients every frame.
 function halo(rgb){
  const sprite=document.createElement('canvas');sprite.width=sprite.height=44;
  const ctx=sprite.getContext('2d');if(!ctx)return null;
  const glow=ctx.createRadialGradient(22,22,0,22,22,22);
  glow.addColorStop(0,`rgba(${rgb},${.33})`);
  glow.addColorStop(.25,`rgba(${rgb},${.13})`);
  glow.addColorStop(1,`rgba(${rgb},0)`);
  ctx.fillStyle=glow;ctx.fillRect(0,0,44,44);return sprite;
 }
 const halos=[halo('249,249,255'),halo('192,214,255')];
 function star(){return {
  x:Math.random(),y:Math.random(),radius:.25+Math.random()*.58,
  phase:Math.random()*Math.PI*2,rate:.0002+Math.random()*.0007,
  base:.06+Math.random()*.14,peak:.25+Math.random()*.7,cool:Math.random()>.35
 };}
 function draw(tile,t){
  const ctx=tile.ctx;if(!ctx)return;
  ctx.clearRect(0,0,width,tile.height+BLEED*2);
  for(const s of tile.stars){
   const x=s.x*width,y=s.y*tile.height+BLEED;
   const pulse=motion.matches?.25:Math.pow((Math.sin(t*s.rate+s.phase)+1)/2,5);
   const alpha=Math.min(1,s.base+s.peak*pulse);
   ctx.globalAlpha=alpha;
   if(alpha>.42&&halos[+s.cool])ctx.drawImage(halos[+s.cool],x-HALO_RADIUS,y-HALO_RADIUS,HALO_RADIUS*2,HALO_RADIUS*2);
   // Brighten only the star core; the compact halo keeps its original intensity.
   ctx.globalAlpha=Math.min(1,alpha*STAR_BRIGHTNESS);
   ctx.fillStyle=s.cool?'rgb(192,214,255)':'rgb(249,249,255)';
   ctx.beginPath();ctx.arc(x,y,s.radius*(1+pulse*.35),0,Math.PI*2);ctx.fill();
  }
  ctx.globalAlpha=1;
 }
 function prepare(tile){
  const w=Math.round(width*dpr),h=Math.round((tile.height+BLEED*2)*dpr);
  if(tile.canvas.width!==w||tile.canvas.height!==h){
   tile.canvas.width=w;tile.canvas.height=h;
   tile.ctx=tile.canvas.getContext('2d');tile.ctx?.setTransform(dpr,0,0,dpr,0,0);
  }
  draw(tile,performance.now());
 }
 function animate(t){
  frame=0;if(document.hidden||motion.matches||!active.size)return;
  if(t-last>=40){last=t;for(const tile of active)draw(tile,t);}
  frame=requestAnimationFrame(animate);
 }
 function start(){
  if(frame)cancelAnimationFrame(frame);frame=0;
  if(document.hidden)return;
  if(motion.matches){for(const tile of active)draw(tile,0);}
  else if(active.size)frame=requestAnimationFrame(animate);
 }
 const visibility=new IntersectionObserver(entries=>{
  for(const entry of entries){
   const tile=byCanvas.get(entry.target);if(!tile)continue;
   if(entry.isIntersecting){active.add(tile);prepare(tile);}
   else{
    active.delete(tile);
    // Release distant backing stores, keeping memory tied to the viewport.
    tile.canvas.width=tile.canvas.height=1;tile.ctx=null;
   }
  }
  start();
 },{rootMargin:'384px 0px'});
 function layout(){
  layoutFrame=0;
  const nextWidth=document.documentElement.clientWidth;
  const nextHeight=Math.max(innerHeight,Math.ceil(document.body.getBoundingClientRect().height));
  const nextDpr=Math.min(devicePixelRatio||1,2);
  if(nextWidth===width&&nextHeight===pageHeight&&nextDpr===dpr)return;
  width=nextWidth;pageHeight=nextHeight;dpr=nextDpr;
  const count=STAR_COUNT_MULTIPLIER*Math.min(3800,Math.max(450,Math.round(width*pageHeight/2100)));
  const length=Math.ceil(pageHeight/TILE_HEIGHT);
  while(tiles.length>length){
   const tile=tiles.pop();visibility.unobserve(tile.canvas);active.delete(tile);
   byCanvas.delete(tile.canvas);tile.canvas.remove();tile.canvas.width=tile.canvas.height=1;
  }
  for(let i=0;i<length;i++){
   let tile=tiles[i];
   if(!tile){
    const canvas=document.createElement('canvas');canvas.className='cosmic-points-tile';
    canvas.width=canvas.height=1;field.appendChild(canvas);
    tile={canvas,ctx:null,height:0,stars:[]};tiles.push(tile);byCanvas.set(canvas,tile);
    visibility.observe(canvas);
   }
   const top=i*TILE_HEIGHT;tile.height=Math.min(TILE_HEIGHT,pageHeight-top);
   tile.canvas.style.top=`${top-BLEED}px`;tile.canvas.style.height=`${tile.height+BLEED*2}px`;
   const target=Math.round(count*(top+tile.height)/pageHeight)-Math.round(count*top/pageHeight);
   while(tile.stars.length<target)tile.stars.push(star());
   tile.stars.length=target;
   if(active.has(tile))prepare(tile);
  }
  start();
 }
 function scheduleLayout(){if(!layoutFrame)layoutFrame=requestAnimationFrame(layout);}
 const resize=new ResizeObserver(scheduleLayout);resize.observe(document.body);
 window.addEventListener('resize',scheduleLayout,{passive:true});
 motion.addEventListener('change',start);document.addEventListener('visibilitychange',start);
 layout();
 // A page restored from the back/forward cache keeps its observers and restarts.
 window.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);frame=0;});
 window.addEventListener('pageshow',()=>{scheduleLayout();start();});
})();

// Solar motion is independent from the three project screen recordings.
(()=>{
 const sun=document.querySelector('.sun-video'),hero=document.querySelector('.hero');if(!sun||!hero)return;
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 let visible=true;sun.muted=true;sun.defaultMuted=true;sun.playbackRate=1;
 function update(){if(!motion.matches&&visible&&!document.hidden)sun.play().catch(()=>{});else sun.pause();}
 if(motion.matches){sun.autoplay=false;sun.removeAttribute('autoplay');}
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;update();},{threshold:.05});observer.observe(hero);
 sun.addEventListener('canplay',update,{once:true});motion.addEventListener('change',update);document.addEventListener('visibilitychange',update);update();
 window.addEventListener('pagehide',()=>sun.pause());
 window.addEventListener('pageshow',update);
})();
