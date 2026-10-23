/* Alpha-registered contact shadows and spherical-source surface reflections.
   Shares scene.js visibility/RAF; no video readback or additional frame loop. */
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
 // One low-resolution reflection compositor replaces the large SVG blur
 // surfaces and readbacks. The emitting sphere has no cone or visible beam.
 const canvas=document.createElement('canvas');canvas.className='scene-reflection-field';canvas.setAttribute('aria-hidden','true');
 canvas.width=768;canvas.height=192;native.append(canvas);
 const ctx=canvas.getContext('2d',{alpha:true}),corona=sun.querySelector('.solar-corona-video');
 const sprite=(r,g,b)=>{
  const image=document.createElement('canvas');image.width=128;image.height=128;
  const c=image.getContext('2d'),gradient=c.createRadialGradient(64,64,0,64,64,64);
  gradient.addColorStop(0,`rgba(${r},${g},${b},.9)`);gradient.addColorStop(.26,`rgba(${r},${g},${b},.56)`);gradient.addColorStop(.62,`rgba(${r},${g},${b},.16)`);gradient.addColorStop(1,`rgba(${r},${g},${b},0)`);
  c.fillStyle=gradient;c.fillRect(0,0,128,128);return image;
 };
 const gold=sprite(255,187,101),white=sprite(255,225,178),red=sprite(255,76,38),orange=sprite(255,157,80),blue=sprite(156,181,231);
 let source={x:499,y:312},active=false,frames=0,last=-Infinity,lastStats=-Infinity;
 const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
 function flareAt(t){if(t<2)return 0;if(t<17)return smooth((t-2)/15);if(t<19)return 1;if(t<31.5)return 1-smooth((t-19)/12.5);return 0;}
 function spot(image,x,y,width,height,angle,opacity){
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha=opacity;ctx.drawImage(image,-width/2,-height/2,width,height);ctx.restore();
 }
 function tick(now=0,force=false){
  if(!force&&(!active||now-last<1000/30-1))return;last=now;
  const t=video.currentTime||0,ct=corona?.currentTime||0,phase=t/(video.duration||108.733333)*Math.PI*2;
  const shimmer=.5+.5*(Math.sin(phase*13)*.58+Math.sin(phase*23+.6)*.27+Math.sin(phase*37+1.1)*.15);
  const burst=Math.pow(flareAt(ct),1.8),intensity=.7+shimmer*.3;
  const distance=Math.hypot(1280-source.x,1250-source.y),falloff=Math.max(.48,Math.min(1,1500/distance));
  ctx.setTransform(canvas.width/2560,0,0,canvas.height/640,0,-800*canvas.height/640);ctx.clearRect(0,800,2560,640);ctx.globalCompositeOperation='lighter';
  // Diffuse incident light, plus moving grazing reflections in the platform
  // plane. No fixed gradient stamps or light-emitting patches on individual tiles.
  spot(gold,source.x+130,1100,3600,1800,0,.05*intensity*falloff);
  for(let i=0;i<12;i++){
   const y=865+i*44+Math.sin(phase*5+i*.7)*28;
   const slope=(.035+i*.095)*Math.min(1,1600/Math.max(1,Math.abs(y-source.y)));
   const x=source.x+(y-source.y)*slope+Math.sin(phase*7+i*1.3)*72;
   const angle=Math.atan2((y-source.y)*.13,x-source.x+50);
   const pulse=.55+.45*Math.sin(phase*14-i*.63);
   spot(i%3===0?white:gold,x,y,310+i*13,30+i%3*12,angle,(.055+pulse*.047)*intensity*falloff);
   if(burst>.001){
    spot(orange,x+Math.sin(ct*.67+i)*42,y+15,410,70,angle,.17*burst*(.6+pulse*.4)*falloff);
    spot(red,x+70,y+31,290,42,angle,.085*burst*(.6+.4*Math.sin(ct*.54+i))*falloff);
   }
  }
  // The secondary galaxy glow is occasional and weaker than the sun.
  const galaxyPulse=Math.pow(Math.max(0,Math.sin(phase*5-1.4)),8);
  spot(blue,1780+Math.sin(phase*4)*140,1050+Math.sin(phase*7)*65,690,240,-.4,.045*galaxyPulse);
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  frames++;
  if(now-lastStats>=1000){
   lastStats=now;stage.dataset.solarPhase=(t/(video.duration||110)).toFixed(4);
   stage.dataset.flareReflection=burst.toFixed(3);canvas.dataset.frames=String(frames);
  }
 }
 function setSource(x,y){
  source={x,y};stage.dataset.solarLightSource=`${Math.round(x)},${Math.round(y)}`;
  casts.forEach(({element,layer,height})=>{
   const dx=layer.x+layer.width/2-x,dy=layer.y+layer.height/2-y,length=Math.hypot(dx,dy)||1;
   element.setAttribute('transform',`translate(${(dx/length*height).toFixed(2)} ${(dy/length*height*.45).toFixed(2)})`);
  });tick(performance.now(),true);
 }
 function setActive(value){active=value;canvas.dataset.running=String(value);if(!value)last=-Infinity;}
 return {tick,setSource,setActive};
};
