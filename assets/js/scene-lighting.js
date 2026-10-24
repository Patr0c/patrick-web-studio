/* Real Cycles light-group images preserve the common camera, occlusion,
   cast shadows and PBR reflections. Only contribution intensity changes.
   No moving gradient stamps, SVG shadow copies or additional animation loop. */
window.createSceneLighting = (stage, native, sun) => {
 'use strict';
 const hero=stage.closest('.hero-new'),video=sun.querySelector('.sun-video'),corona=sun.querySelector('.solar-corona-video');
 const mobile=matchMedia('(max-width:760px)'),layers={};
 for(const name of ['sun','galaxy','flare']){
  const picture=document.createElement('picture');picture.className='scene-picture';
  const source=document.createElement('source');source.media='(max-width:760px)';source.srcset=`assets/scene/seated/light-${name}-mobile.webp`;
  const img=document.createElement('img');img.src=`assets/scene/seated/light-${name}.webp`;img.className='seated-light';img.alt='';img.setAttribute('aria-hidden','true');img.width=4096;img.height=1000;img.decoding='async';
  picture.append(source,img);hero.append(picture);layers[name]=img;
 }
 let active=false,last=-Infinity;
 const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
 function flareAt(t){if(t<2)return 0;if(t<17)return smooth((t-2)/15);if(t<19)return 1;if(t<31.5)return 1-smooth((t-19)/12.5);return 0;}
 function tick(now=0,force=false){
  if(!force&&(!active||now-last<1000/(mobile.matches?20:30)))return;last=now;
  const t=video.currentTime||0,phase=t/(video.duration||108.733333)*Math.PI*2;
  const shimmer=.5+.5*(Math.sin(phase*13)*.58+Math.sin(phase*23+.6)*.27+Math.sin(phase*37+1.1)*.15);
  const burst=Math.pow(flareAt(corona?.currentTime||0),1.8);
  layers.sun.style.opacity=String(.025+shimmer*.055);
  layers.flare.style.opacity=String(burst*.28);
  layers.galaxy.style.opacity=String(Math.pow(Math.max(0,Math.sin(phase*5-1.4)),8)*.16);
  stage.dataset.flareReflection=burst.toFixed(3);
 }
 function setSource(x,y){stage.dataset.solarLightSource=`${Math.round(x)},${Math.round(y)}`;tick(performance.now(),true);}
 function setActive(value){active=value;if(!value)last=-Infinity;}
 return {tick,setSource,setActive};
};
