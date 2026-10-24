/* One-way, accessible night → boot → on interaction. Shared media time drives it. */
(() => {
 'use strict';
 const hero=document.querySelector('.immersive-hero'),stage=hero?.querySelector('.scene-stage'),sun=hero?.querySelector('.scene-sun');
 if(!stage||!sun)return;
 hero.dataset.power='night';stage.dataset.power='night';
 const circuit=document.createElement('div');circuit.className='boot-circuit';stage.querySelector('.scene-native').append(circuit);
 const native=stage.querySelector('.scene-native'),geometry=JSON.parse(document.getElementById('scene-geometry').textContent);
 const reflection=document.createElement('div');reflection.className='moon-reflection';native.append(reflection);
 geometry.screens.forEach(screen=>{const led=document.createElement('i');led.className='monitor-led';led.style.left=(screen.quad[2][0]-14)+'px';led.style.top=(screen.quad[2][1]+9)+'px';native.append(led);});
 function activate(){
  if(hero.dataset.power!=='night')return;
  hero.dataset.power=stage.dataset.power='boot';sun.setAttribute('aria-label','Arbeitsstation eingeschaltet');sun.setAttribute('aria-disabled','true');
  hero.dispatchEvent(new CustomEvent('workstation:power',{bubbles:true}));
  // Reduced-motion / data-saver users get the same final state immediately.
  if(matchMedia('(prefers-reduced-motion:reduce)').matches||navigator.connection?.saveData){hero.dataset.power=stage.dataset.power='on';hero.dispatchEvent(new Event('workstation:ready'));}
 }
 sun.addEventListener('click',activate);sun.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
 const galaxy=document.querySelector('.galaxy-position'),sphere=document.createElement('div');sphere.className='particle-sphere';sphere.setAttribute('aria-hidden','true');
 for(let i=0;i<6;i++){const img=new Image();img.src=`assets/scene/seated/particle-${i}.webp`;img.alt='';img.width=img.height=960;img.style.setProperty('--period',`${29+i*3}s`);img.style.setProperty('--delay',`${-i*7}s`);sphere.append(img);}
 galaxy.after(sphere);galaxy.hidden=true; // Artwork, rotation speed and source stay available as fallback.
})();
