/* Material-consistent, source-driven lighting. Shares scene.js's visibility/RAF;
   never redraws source imagery or starts a second animation loop. */
window.createSceneLighting = (stage, native, sun, geometry) => {
 'use strict';
 const ns='http://www.w3.org/2000/svg',video=sun.querySelector('.sun-video');
 const byId=id=>geometry.layers.find(layer=>layer.id===id);
 const node=(tag,attrs={})=>{const e=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,String(v)));return e;};
 const pad=byId('mousepad');
 const shadows=node('svg',{class:'scene-object-shadows',viewBox:'0 0 2560 1440','aria-hidden':'true'});
 const defs=node('defs');shadows.append(defs);
 const mask=node('mask',{id:'scene-pad-receiver',maskUnits:'userSpaceOnUse',x:pad.x,y:pad.y,width:pad.width,height:pad.height,style:'mask-type:alpha'});
 mask.append(node('image',{href:'assets/scene/'+pad.file,x:pad.x,y:pad.y,width:pad.width,height:pad.height}));defs.append(mask);
 for(const [id,blur,opacity] of [['scene-shadow-contact',1.1,.46],['scene-shadow-cast',3,.24]]){
  const filter=node('filter',{id,x:'-25%',y:'-60%',width:'160%',height:'230%','color-interpolation-filters':'sRGB'});
  filter.append(node('feGaussianBlur',{in:'SourceAlpha',stdDeviation:blur}));
  filter.append(node('feColorMatrix',{type:'matrix',values:`0 0 0 0 0.004 0 0 0 0 0.008 0 0 0 0 0.012 0 0 0 ${opacity} 0`}));defs.append(filter);
 }
 const receiver=node('g',{mask:'url(#scene-pad-receiver)'});shadows.append(receiver);
 const casts=[];
 for(const [id,height] of [['keyboard',9],['mouse',22]]){
  const layer=byId(id);
  const cast=node('g',{filter:'url(#scene-shadow-cast)'});
  cast.append(node('image',{href:'assets/scene/'+layer.file,x:layer.x,y:layer.y,width:layer.width,height:layer.height}));receiver.append(cast);
  const contact=node('g',{filter:'url(#scene-shadow-contact)',transform:'translate(1.2 1.5)'});
  contact.append(node('image',{href:'assets/scene/'+layer.file,x:layer.x,y:layer.y,width:layer.width,height:layer.height}));receiver.append(contact);
  casts.push({element:cast,layer,height});
 }
 native.append(shadows);
 const padShadow=node('svg',{class:'scene-pad-shadow',viewBox:'0 0 2560 1440','aria-hidden':'true'});
 const padContact=node('g',{filter:'url(#scene-shadow-contact)',transform:'translate(1.7 1)',opacity:.45});
 padContact.append(node('image',{href:'assets/scene/'+pad.file,x:pad.x,y:pad.y,width:pad.width,height:pad.height}));
 padShadow.append(padContact);native.append(padShadow);
 // Broad, feathered wavefronts only illuminate actual material alpha. Live
 // screen faces are excluded by the existing measured material-light mask.
 const waves=node('svg',{class:'scene-solar-waves',viewBox:'0 0 2560 1440','aria-hidden':'true'});
 const waveDefs=node('defs'),soft=node('filter',{id:'scene-solar-wave-soft',filterUnits:'userSpaceOnUse',x:0,y:0,width:2560,height:1440});
 soft.append(node('feGaussianBlur',{stdDeviation:19}));waveDefs.append(soft);waves.append(waveDefs);
 const rings=Array.from({length:3},()=>{const ring=node('circle',{cx:499,cy:312,r:900,fill:'none','stroke-width':95,filter:'url(#scene-solar-wave-soft)'});waves.append(ring);return ring;});
 native.append(waves);
 const sampler=document.createElement('canvas');sampler.width=12;sampler.height=12;
 const ctx=sampler.getContext('2d',{willReadFrequently:true});
 let source={x:499,y:312},last=-Infinity,lastSample=-Infinity,sampling=true,tone=.5,waveNear=450,waveRange=2200;
 function sample(now){
  if(!sampling||!ctx||video.readyState<2||now-lastSample<700)return;
  lastSample=now;
  try{
   ctx.drawImage(video,0,0,12,12);const pixels=ctx.getImageData(0,0,12,12).data;let red=0,green=0,n=0;
   for(let y=3;y<9;y++)for(let x=3;x<9;x++){const i=(y*12+x)*4;red+=pixels[i];green+=pixels[i+1];n++;}
   if(red>0)tone=tone*.7+Math.max(0,Math.min(1,(green/red-.35)*2.2))*.3;
  }catch{sampling=false;}
 }
 function tick(now=0,force=false){
  if(!force&&now-last<125)return;last=now;sample(now);
  const duration=Number.isFinite(video.duration)&&video.duration>0?video.duration:20;
  const phase=(video.currentTime%duration)/duration,angle=phase*Math.PI*2;
  const pulse=.5+.5*Math.sin(angle*2+.3),shimmer=.5+.5*Math.sin(angle*5-.4);
  const warmth=Math.max(0,Math.min(1,.35*tone+.45*pulse+.2*shimmer));
  native.style.setProperty('--solar-rgb',`255 ${Math.round(168+warmth*53)} ${Math.round(92+warmth*65)}`);
  native.style.setProperty('--solar-strength',(.46+pulse*.22+shimmer*.035).toFixed(3));
  shadows.style.opacity=(.8+pulse*.16).toFixed(3);
  rings.forEach((ring,i)=>{
   const travel=(phase*2+i/3)%1;
   ring.setAttribute('r',String(waveNear+travel*waveRange));
   ring.setAttribute('opacity',String(Math.sin(travel*Math.PI)**2*(.065+pulse*.035)));
  });
  stage.dataset.solarPhase=phase.toFixed(4);stage.dataset.solarLightSource=`${Math.round(source.x)},${Math.round(source.y)}`;
 }
 function setSource(x,y){
  source={x,y};const distance=Math.hypot(1280-x,1250-y);waveNear=Math.max(200,distance*.35);waveRange=Math.max(2200,distance*1.3);rings.forEach(ring=>{ring.setAttribute('cx',String(x));ring.setAttribute('cy',String(y));});
  native.style.setProperty('--sun-native-y',`${y}px`);
  casts.forEach(({element,layer,height})=>{
   const dx=layer.x+layer.width/2-x,dy=layer.y+layer.height/2-y,length=Math.hypot(dx,dy)||1;
   // The shallow desktop plane compresses the vertical projection. Contact
   // shadow stays at the feet; only the softer cast shadow extends away.
   element.setAttribute('transform',`translate(${(dx/length*height).toFixed(2)} ${(dy/length*height*.45).toFixed(2)})`);
  });tick(performance.now(),true);
 }
 return {tick,setSource};
};
