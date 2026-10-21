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

// Start the solar video after first paint, and pause whenever it is out of view.
(()=>{
 const sun=document.querySelector('.sun-video'),hero=document.querySelector('.hero');
 if(!sun||!hero)return;
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 let visible=true,started=false;
 sun.muted=true;sun.defaultMuted=true;sun.autoplay=false;sun.removeAttribute('autoplay');
 sun.preload='none';
 function update(){
  if(started && visible && !document.hidden && !motion.matches && !navigator.connection?.saveData){
   if(sun.paused)sun.play().catch(()=>{});
  } else if(!sun.paused) sun.pause();
 }
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;update();},{threshold:.03}).observe(hero);
 function begin(){started=true;update();}
 if('requestIdleCallback' in window)requestIdleCallback(begin,{timeout:1300});
 else setTimeout(begin,550);
 motion.addEventListener('change',update);
 document.addEventListener('visibilitychange',update);
 window.addEventListener('pagehide',()=>sun.pause());
 window.addEventListener('pageshow',update);
})();
