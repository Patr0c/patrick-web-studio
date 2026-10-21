// Reuse one small solar video as a living texture for every visible window.
// The canvases belong to the document, so scrolling needs no JS repositioning.
(()=>{
 function init(){
  const motion=matchMedia('(prefers-reduced-motion: reduce)'),hero=document.querySelector('.hero'),sun=document.querySelector('.sun-video');
  const source=document.createElement('video');source.src='solar-corona.mp4';source.muted=true;source.loop=true;source.playsInline=true;source.preload='auto';source.className='corona-source';source.setAttribute('aria-hidden','true');document.body.appendChild(source);
  const poster=new Image();poster.src='solar-poster.jpg';
  const ribbon=document.createElement('canvas');ribbon.width=512;ribbon.height=64;
  const texture=ribbon.getContext('2d');if(!texture)return;
  const PAD=24,active=new Set(),items=[],lookup=new WeakMap();
  let raf=0,last=0,playPending=false,textureReady=false;
  function element(tag,cls){const node=document.createElement(tag);node.className=cls;node.setAttribute('aria-hidden','true');return node;}
  function register(target,kind='frame'){
   const canvas=element('canvas',kind==='divider'?'corona-canvas corona-divider':'corona-canvas');canvas.width=canvas.height=1;(kind==='divider'?target.querySelector('.comparison-overlay')||target:target).appendChild(canvas);
   const item={target,canvas,kind,width:0,height:0,radius:20,ctx:null};items.push(item);lookup.set(kind==='divider'?canvas:target,item);
   visibility.observe(kind==='divider'?canvas:target);resize.observe(target);
  }
  function measure(item){
   const pad=innerWidth<=760?12:24;item.pad=pad;
   const w=item.kind==='divider'?56:item.target.offsetWidth+pad*2;
   const h=item.target.offsetHeight+(item.kind==='divider'?65:pad*2);
   item.width=w;item.height=h;
   if(item.kind!=='divider')item.radius=Math.min(parseFloat(getComputedStyle(item.target).borderTopLeftRadius)||17,(w-pad*2)/2,(h-pad*2)/2);
   if(item.kind!=='divider'){item.canvas.style.left=`${-pad}px`;item.canvas.style.top=`${-pad}px`;}
   item.canvas.style.width=`${w}px`;item.canvas.style.height=`${h}px`;
   if(active.has(item))allocate(item);
  }
  function allocate(item){
   if(item.canvas.width!==item.width||item.canvas.height!==item.height){item.canvas.width=item.width;item.canvas.height=item.height;item.ctx=item.canvas.getContext('2d');}
  }
  function updateSource(){
   const mainReady=sun&&!sun.paused&&sun.readyState>=2;
   if(!active.size||document.hidden||motion.matches||mainReady){source.pause();return;}
   if(source.paused&&!playPending){playPending=true;source.play().catch(()=>{}).finally(()=>{playPending=false;});}
  }
  // Unwrap the real circular solar limb into a small reusable fire ribbon.
  function sample(){
   const main=sun&&!sun.paused&&sun.readyState>=2?sun:null;
   const image=main||(source.readyState>=2?source:poster.complete&&poster.naturalWidth?poster:null);
   if(!image)return false;
   const size=image.videoWidth||image.naturalWidth,center=size/2,start=size*.410,range=size*.125;
   const step=4,tangent=size*Math.PI*.855/(ribbon.width/step);
   texture.setTransform(1,0,0,1,0,0);texture.clearRect(0,0,512,64);
   for(let x=0;x<512;x+=step){
    const angle=x/512*Math.PI*2,rx=Math.cos(angle),ry=Math.sin(angle),tx=-ry,ty=rx;
    const sx=step/tangent,sy=64/range;
    texture.save();texture.beginPath();texture.rect(x,0,step+.6,64);texture.clip();
    texture.setTransform(tx*sx,rx*sy,ty*sx,ry*sy,x+step/2-(center*tx+center*ty)*sx,(-center*rx-center*ry-start)*sy);
    texture.drawImage(image,0,0,size,size);texture.restore();
   }
   texture.setTransform(1,0,0,1,0,0);textureReady=true;return true;
  }
  function segment(ctx,x,y,tx,ty,nx,ny,length,phase,depth=19){
   ctx.save();ctx.transform(tx,ty,nx,ny,x,y);
   ctx.drawImage(ribbon,phase%470,0,42,64,-.6,-3,length+1.2,depth);ctx.restore();
  }
  function straight(ctx,x,y,tx,ty,nx,ny,length,phase,depth=19){
   if(length<=0)return;
   ctx.save();ctx.transform(tx,ty,nx,ny,x,y);
   ctx.drawImage(ribbon,0,0,512,64,0,-3,length,depth);ctx.restore();
  }
  function paint(item){
   if(!textureReady||!item.ctx)return;
   const {ctx,width:w,height:h}=item;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,w,h);ctx.globalCompositeOperation='lighten';
   if(item.kind==='divider'){
    straight(ctx,28,0,0,1,-1,0,h,0,22);straight(ctx,28,0,0,1,1,0,h,210,22);
    ctx.fillStyle='#fff1b9';ctx.fillRect(27.3,0,1.4,h);return;
   }
   const r=item.radius,PAD=item.pad,left=PAD,right=w-PAD,top=PAD,bottom=h-PAD,ww=right-left,hh=bottom-top;
   const isHero=item.target===hero;
   if(isHero&&innerWidth>760){
    const a=.41,b=.59;
    straight(ctx,left+r,top,1,0,0,-1,Math.max(0,ww*a-r),0);
    straight(ctx,left+ww*b,top,1,0,0,-1,Math.max(0,ww*(1-b)-r),100);
   }else straight(ctx,left+r,top,1,0,0,-1,ww-r*2,0);
   straight(ctx,right,top+r,0,1,1,0,hh-r*2,130);
   straight(ctx,right-r,bottom,-1,0,0,1,ww-r*2,250);
   straight(ctx,left,bottom-r,0,-1,-1,0,hh-r*2,380);
   const corners=[[left+r,top+r,Math.PI],[right-r,top+r,Math.PI*1.5],[right-r,bottom-r,0],[left+r,bottom-r,Math.PI*.5]];
   for(let c=0;c<4;c++)for(let i=0;i<10;i++){
    const angle=corners[c][2]+(i+.5)/10*Math.PI/2,nx=Math.cos(angle),ny=Math.sin(angle),len=(r+18)*Math.PI/20+1;
    segment(ctx,corners[c][0]+nx*r,corners[c][1]+ny*r,-ny,nx,nx,ny,len,c*100+i*8);
   }
  }
  function tick(t){
   raf=0;if(document.hidden||motion.matches||!active.size)return;
   if(t-last>=48){last=t;updateSource();if(sample())for(const item of active)paint(item);}
   raf=requestAnimationFrame(tick);
  }
  function start(){
   if(raf)cancelAnimationFrame(raf);raf=0;updateSource();
   if(document.hidden||!active.size)return;
   if(sample())for(const item of active)paint(item);
   if(!motion.matches)raf=requestAnimationFrame(tick);
  }
  const visibility=new IntersectionObserver(entries=>{
   for(const entry of entries){const item=lookup.get(entry.target);if(!item)continue;
    if(entry.isIntersecting){active.add(item);measure(item);allocate(item);}
    else{active.delete(item);item.canvas.width=item.canvas.height=1;item.ctx=null;}
   }start();
  },{rootMargin:'100px 0px'});
  const resize=new ResizeObserver(entries=>{for(const {target} of entries){for(const item of items)if(item.target===target)measure(item);}if(textureReady)for(const item of active)paint(item);});
  document.querySelectorAll('.solar-window,.project-preview,.category-trigger,.orbit-window,.concept-dialog').forEach(node=>register(node));
  if(hero)register(hero,'divider');
  source.addEventListener('loadeddata',start);poster.addEventListener('load',start);
  sun?.addEventListener('playing',start);sun?.addEventListener('pause',start);
  motion.addEventListener('change',start);document.addEventListener('visibilitychange',start);
  window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);raf=0;source.pause();});
  window.addEventListener('pageshow',start);
 }
 if(document.readyState==='complete')init();else document.addEventListener('DOMContentLoaded',init,{once:true});
})();
