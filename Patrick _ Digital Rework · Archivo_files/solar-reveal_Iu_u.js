// Two full-width layouts, one shared cut. Dragging changes clipping only.
(()=>{
 const hero=document.querySelector('.hero'),old=hero?.querySelector('.hero-old'),fresh=hero?.querySelector('.hero-new'),handle=hero?.querySelector('.compare-handle'),fire=hero?.querySelector('.comparison-fire');
 if(!hero||!old||!fresh||!handle||!fire)return;
 const NS='http://www.w3.org/2000/svg';
 const shape=[0,0];
 let position=new URLSearchParams(location.search).has('font')?0:50,width=0,height=0,pending=0,drag=null;
 function render(){
  pending=0;hero.style.setProperty('--reveal',`${position}%`);
  hero.classList.toggle('comparison-at-edge',position===0||position===100);
  const cut=shape.map((x,i)=>`calc(var(--reveal) + ${x}px) ${i/(shape.length-1)*100}%`);
  old.style.clipPath=position===0?'inset(0 100% 0 0)':position===100?'none':`polygon(0 0,${cut.join(',')},0 100%)`;
  fresh.style.clipPath=position===100?'inset(0 0 0 100%)':position===0?'none':`polygon(calc(var(--reveal)) -120px,100% -120px,100% 100%,${[...cut].reverse().join(',')})`;
  fire.style.opacity=position===0||position===100?'0':'1';
  handle.setAttribute('aria-valuenow',String(Math.round(position)));
  handle.setAttribute('aria-valuetext',`${Math.round(position)} Prozent alter Entwurf links, ${100-Math.round(position)} Prozent neues Design rechts.`);
 }
 function set(value){position=Math.max(0,Math.min(100,value));if(!pending)pending=requestAnimationFrame(render);}
 function geometry(){
  const box=hero.getBoundingClientRect();if(box.width===width&&box.height===height)return;
  width=box.width;height=box.height;fire.setAttribute('viewBox',`0 0 80 ${height}`);fire.setAttribute('preserveAspectRatio','none');
  const points=shape.map((x,i)=>[40+x,height*i/(shape.length-1)]);
  const path=`M40 -65 L${points.map(p=>p.join(' ')).join(' L')}`;
  fire.querySelectorAll('.fire-bloom,.fire-edge,.fire-core').forEach(el=>el.setAttribute('d',path));
  const flames=fire.querySelector('.fire-flames'),embers=fire.querySelector('.fire-embers');flames.replaceChildren();embers.replaceChildren();
  points.slice(1,-1).forEach(([x,y],i)=>{
   const g=document.createElementNS(NS,'g');g.setAttribute('transform',`translate(${x},${y})`);
   const flame=document.createElementNS(NS,'path');flame.setAttribute('class','solar-flame');
   const side=i%2?1:-1;flame.setAttribute('d',`M0 5 Q${side*16} -1 ${side*8} -${24+i%4*5} Q${side*1} -12 0 5`);flame.style.setProperty('--delay',`${-i*.29}s`);g.appendChild(flame);flames.appendChild(g);
   const group=document.createElementNS(NS,'g');group.setAttribute('transform',`translate(${x},${y+14})`);
   const ember=document.createElementNS(NS,'circle');ember.setAttribute('class','solar-ember');ember.setAttribute('r',String(.6+i%3*.3));ember.style.setProperty('--drift',`${side*(8+i%4*4)}px`);ember.style.setProperty('--delay',`${-i*.37}s`);group.appendChild(ember);embers.appendChild(group);
  });
  render();
 }
 handle.addEventListener('pointerdown',e=>{
  if(e.pointerType==='mouse'&&e.button!==0)return;
  e.preventDefault();handle.focus({preventScroll:true});handle.setPointerCapture(e.pointerId);
  drag={id:e.pointerId,box:hero.getBoundingClientRect()};hero.classList.add('comparison-dragging');
 });
 handle.addEventListener('pointermove',e=>{if(drag?.id===e.pointerId)set((e.clientX-drag.box.left)/drag.box.width*100);});
 function release(e){if(drag?.id!==e.pointerId)return;drag=null;hero.classList.remove('comparison-dragging');}
 handle.addEventListener('pointerup',release);handle.addEventListener('pointercancel',release);handle.addEventListener('lostpointercapture',release);
 handle.addEventListener('keydown',e=>{
  const step=e.shiftKey?10:2;
  const values={ArrowLeft:position-step,ArrowRight:position+step,Home:0,End:100};
  if(Object.hasOwn(values,e.key)){e.preventDefault();set(values[e.key]);}
 });
 handle.addEventListener('dblclick',()=>set(50));
 // Keyboard users always see a focused link in the current design.
 fresh.addEventListener('focusin',()=>set(0));
 const resize=new ResizeObserver(geometry);resize.observe(hero);
 const visibility=new IntersectionObserver(entries=>hero.classList.toggle('reveal-paused',!entries[0].isIntersecting));visibility.observe(hero);
 hero.classList.add('comparison-ready');geometry();
})();
