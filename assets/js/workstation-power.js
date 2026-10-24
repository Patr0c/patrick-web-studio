/* One-way, accessible night → boot → on interaction. Shared media time drives it. */
(() => {
 'use strict';
 const hero=document.querySelector('.immersive-hero'),stage=hero?.querySelector('.scene-stage'),sun=hero?.querySelector('.scene-sun'),moon=hero?.querySelector('.scene-moon');
 if(!stage||!sun||!moon)return;
 hero.dataset.power='night';stage.dataset.power='night';
 document.documentElement.dataset.scenePower='night';
 // A single circle, one shared rotation: the two arms are exactly 180° apart.
 // Moon begins at (2061,312); sun ends at (499,312). Hidden halves pass below
 // the desk horizon, with no crossfade between unrelated static positions.
 const orbit=document.createElement('div');orbit.className='celestial-orbit';
 const angle=Math.atan2(-688,781)*180/Math.PI;
 orbit.style.setProperty('--moon-angle',angle+'deg');
 orbit.style.setProperty('--sun-angle',(angle+180)+'deg');
 orbit.style.setProperty('--orbit-travel',(-2*angle)+'deg');
 const moonArm=document.createElement('div'),sunArm=document.createElement('div');
 moonArm.className='celestial-arm moon-arm';sunArm.className='celestial-arm sun-arm';
 const moonButton=document.createElement('button');moonButton.type='button';moonButton.className='moon-trigger';moonButton.setAttribute('aria-label','Mond versenken und Sonne aufgehen lassen');
 const moonPicture=moon.closest('picture');moonButton.append(moonPicture);moonArm.append(moonButton);sunArm.append(sun);orbit.append(moonArm,sunArm);hero.querySelector('.hero-new').prepend(orbit);
 for(const property of ['left','top','width','height'])sun.style.removeProperty(property);
 sun.removeAttribute('role');sun.removeAttribute('aria-label');sun.removeAttribute('tabindex');sun.setAttribute('aria-hidden','true');
 const circuit=document.createElement('div');circuit.className='boot-circuit';stage.querySelector('.scene-native').append(circuit);
 for(const name of ['boot-circuit-base','boot-circuit-sweep']){const image=new Image();image.src='assets/scene/seated/boot-matrix.webp';image.alt='';image.width=4096;image.height=1440;image.className=name;circuit.append(image);}
 const native=stage.querySelector('.scene-native'),geometry=JSON.parse(document.getElementById('scene-geometry').textContent);
 const reflection=document.createElement('div');reflection.className='moon-reflection';native.append(reflection);
 geometry.screens.forEach(screen=>{const led=document.createElement('i');led.className='monitor-led';led.style.left=(screen.quad[2][0]-14)+'px';led.style.top=(screen.quad[2][1]+9)+'px';native.append(led);});
 function activate(){
  if(hero.dataset.power!=='night')return;
  hero.dataset.power=stage.dataset.power='boot';document.documentElement.dataset.scenePower='boot';
  moonButton.disabled=true;moonButton.blur();
  hero.dispatchEvent(new CustomEvent('workstation:power',{bubbles:true}));
  // Reduced-motion / data-saver users get the same final state immediately.
  if(matchMedia('(prefers-reduced-motion:reduce)').matches||navigator.connection?.saveData){hero.dataset.power=stage.dataset.power='on';hero.dispatchEvent(new Event('workstation:ready'));}
 }
 moonButton.addEventListener('click',activate);
 hero.addEventListener('workstation:ready',()=>{document.documentElement.dataset.scenePower='on';});
 const galaxy=document.querySelector('.galaxy-position'),sphere=document.createElement('div');sphere.className='particle-sphere';sphere.setAttribute('aria-hidden','true');
 for(let i=0;i<6;i++){const img=new Image();img.src=`assets/scene/seated/particle-${i}.webp`;img.alt='';img.width=img.height=960;img.style.setProperty('--period',`${29+i*3}s`);img.style.setProperty('--delay',`${-i*7}s`);sphere.append(img);}
 galaxy.after(sphere);galaxy.hidden=true; // Artwork, rotation speed and source stay available as fallback.
 dispatchEvent(new Event('scene:orbit-ready'));
})();
