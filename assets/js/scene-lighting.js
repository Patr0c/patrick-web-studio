/* Baked camera-registered PBR passes; the corona media clock also drives the
   floor-plane wave, so stalls, pause/resume and loops cannot accumulate drift. */
window.createSceneLighting = (stage,native,sun,geometry) => {
 'use strict';
 const hero=stage.closest('.hero-new'),root=stage.closest('.immersive-hero'),video=sun.querySelector('.sun-video'),corona=sun.querySelector('.solar-corona-video');
 const mobile=matchMedia('(max-width:760px)'),layers={};
 for(const name of ['sun','flare']){
  const picture=document.createElement('picture');picture.className='scene-picture';
  const source=document.createElement('source');source.media='(max-width:760px)';source.srcset=`assets/scene/seated/light-${name}-mobile.webp`;
  const img=new Image();img.src=`assets/scene/seated/light-${name}.webp`;img.className='seated-light';img.alt='';img.width=4096;img.height=1000;picture.append(source,img);hero.append(picture);layers[name]=img;
 }
 const plane=document.createElement('div');plane.className='platform-wave-plane';plane.style.width='1200px';plane.style.height='1200px';
 const wave=document.createElement('div');wave.className='platform-wave';plane.append(wave);const floorMask=document.createElement('div');floorMask.className='platform-wave-mask';floorMask.append(plane);native.querySelector('.scene-floor').append(floorMask);
 // Pin-hole projection of a real horizontal floor rectangle at world z=0.
 const cam=geometry.camera,C=cam.location,R=cam.right,U=cam.up,F=cam.forward;
 const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
 function project(P){const v=P.map((x,i)=>x-C[i]),z=dot(v,F);return [2048+1750*dot(v,R)/z,785-1750*dot(v,U)/z];}
 const p=[project([-9,13,0]),project([9,13,0]),project([9,-.5,0]),project([-9,-.5,0])];
 const [a,b,c,d]=p,dx1=b[0]-c[0],dx2=d[0]-c[0],dx3=a[0]-b[0]+c[0]-d[0],dy1=b[1]-c[1],dy2=d[1]-c[1],dy3=a[1]-b[1]+c[1]-d[1],den=dx1*dy2-dx2*dy1,g=(dx3*dy2-dx2*dy3)/den,h=(dx1*dy3-dx3*dy1)/den;
 plane.style.transform=`matrix3d(${(b[0]-a[0]+g*b[0])/1200},${(b[1]-a[1]+g*b[1])/1200},0,${g/1200},${(d[0]-a[0]+h*d[0])/1200},${(d[1]-a[1]+h*d[1])/1200},0,${h/1200},0,0,1,0,${a[0]},${a[1]},0,1)`;
 let active=false,last=-Infinity;
 const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
 function flareAt(t){if(t<2)return 0;if(t<17)return smooth((t-2)/15);if(t<19)return 1;if(t<31.5)return 1-smooth((t-19)/12.5);return 0;}
 function tick(now=0,force=false){
  if(!force&&(!active||now-last<1000/(mobile.matches?20:30)))return;last=now;
  const powered=root.dataset.power!=='night',t=corona?.currentTime||0,phase=(video.currentTime||0)/(video.duration||108.733333)*Math.PI*2;
  const shimmer=.5+.5*(Math.sin(phase*13)*.58+Math.sin(phase*23+.6)*.27+Math.sin(phase*37+1.1)*.15);
  const burst=Math.pow(flareAt(t),1.8);
  layers.sun.style.opacity=powered?String(.025+shimmer*.055):'0';layers.flare.style.opacity=powered?String(burst*.28):'0';
  // Sampled outer-corona energy becomes visible at4s. Wave starts at5s,
  // one second later; its broad warm crest traverses the actual floor plane.
  const q=(t-5)/10,envelope=smooth(q*6)*smooth((1-q)*5);
  wave.style.opacity=powered?String(envelope*.9):'0';wave.style.transform=`translateX(${(-50+Math.max(0,Math.min(1,q))*100).toFixed(3)}%)`;
  stage.dataset.flareReflection=burst.toFixed(3);stage.dataset.platformWavePhase=q.toFixed(3);
  if(root.dataset.power==='boot'&&t>=3.6){root.dataset.power=stage.dataset.power='on';root.dispatchEvent(new Event('workstation:ready'));}
 }
 function setSource(x,y){stage.dataset.solarLightSource=`${Math.round(x)},${Math.round(y)}`;tick(performance.now(),true);}
 function setActive(value){active=value;if(!value)last=-Infinity;}
 return {tick,setSource,setActive};
};
