/* Native 1949 × 826 GIMP desk: one registered layer group.
   CSS matrix only on the mousepad; one bounded GPU textmode monitor. */
(async () => {
  const stage=document.querySelector('.workstation-stage');
  const hero=document.querySelector('.immersive-hero');
  if(!stage || !hero)return;
  const phone=matchMedia('(max-width:650px)');
  const copy=document.querySelector('.workstation-mobile-copy');
  const right=stage.querySelector('.screen-right');
  const updateReading=()=>{
    copy.hidden=!phone.matches;right.setAttribute('aria-hidden',String(phone.matches));
    stage.querySelectorAll('.workstation-screen a').forEach(link=>{
      if(phone.matches)link.setAttribute('tabindex','-1');else link.removeAttribute('tabindex');
    });
  };
  phone.addEventListener('change',updateReading);updateReading();
  const fit=()=>{
    const a=stage.getBoundingClientRect(),b=hero.getBoundingClientRect();
    hero.style.setProperty('--desk-top',`${a.top-b.top}px`);
    // Crop only the upper 10% of the visible platform; retain source scale,
    // perspective and lower edge. The native floor's opaque horizon starts at 201.
    const floor=hero.querySelector('.control-floor');
    const box=floor.getBoundingClientRect();
    const sourceWidth=phone.matches?Math.max(700,box.width):box.width;
    const scale=Math.max(sourceWidth/1774,box.height/887);
    const start=Math.min(box.height,201*scale);
    floor.style.setProperty('--platform-cut',`${start+(box.height-start)*.1}px`);
    floor.dataset.visibleCrop='10';
  };
  new ResizeObserver(fit).observe(hero);fit();
  const flow=window.createTextmodeFlow?.(stage.querySelector('.textmode-canvas'));
  const ns='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(ns,'svg');
  svg.classList.add('mousepad-matrix','is-paused');
  svg.setAttribute('viewBox','0 0 1949 826');svg.setAttribute('aria-hidden','true');
  svg.setAttribute('focusable','false');
  let seed=20261023;
  const random=max=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%max;};
  const glyphPaths = [
    'M2 2h8v12H2zM2 7h8M6 2v12', 'M2 2h8L2 14h8M6 3v10',
    'M6 1 11 8 6 15 1 8zM1 8h10', 'M2 2v12h8V8H4M2 5h6',
    'M1 4h10M3 1v14M8 4v8h3', 'M2 1v5h8v9M1 10h7',
    'M2 2h8v4H5v8H2M5 10h5', 'M1 1h10M6 1v14M2 6h8M2 11h8',
    'M2 1v14M2 4h8v8H5M6 1v3', 'M1 3h10L3 13h8M2 7h8',
    'M1 8 6 1l5 7-5 7zM6 5v6', 'M2 2h3v12h5V2M1 8h10',
    'M1 1h4v10h6v4M8 1v6h3', 'M1 2h10L6 8v7M1 12h10',
    'M2 1v14h8M2 5h8v5H6', 'M1 4h10v8H1zM4 1v14M8 1v14',
    'M1 2h10M1 14h10M3 2l6 12M9 2 3 14', 'M1 1h10v5H6v9M1 10h10',
    'M1 5h10M1 11h10M3 1v14M9 1v14', 'M2 2h8v12H2M2 2l8 12'
  ];
  let defs=glyphPaths.map((d,i)=>`<symbol id="pad-rune-${i}" viewBox="0 0 12 16"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.15"/></symbol>`).join('');
  defs+='<mask id="mousepad-alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="1949" height="826" style="mask-type:alpha"><image href="assets/desk/mousepad-mask.png" width="1949" height="826"/></mask>';
  let columns='';
  for(let x=504;x<1479;x+=9){
    let column='';
    const rows=Array.from({length:16},()=>({r:random(glyphPaths.length),a:.24+random(65)/100}));
    for(const offset of [0,192])rows.forEach((row,i)=>{
      column+=`<use href="#pad-rune-${row.r}" x="${x}" y="${634+offset+i*12}" width="6.2" height="8.8" opacity="${row.a}"${i===15?' style="color:#b9ffb0;opacity:1"':''}/>`;
    });
    columns+=`<g class="pad-column" style="--flow:${2.8+random(44)/10}s;--phase:-${random(80)/10}s">${column}</g>`;
  }
  svg.innerHTML=`<defs>${defs}</defs><g mask="url(#mousepad-alpha)" data-matrix-direction="down"><g class="pad-light">${columns}</g></g>`;
  stage.insertBefore(svg,stage.querySelector('.textmode-monitor'));
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let visible=false;
  const update=()=>{
    const active=visible && !document.hidden && !motion.matches && !navigator.connection?.saveData && Number(document.querySelector('.compare-handle')?.getAttribute('aria-valuenow'))!==100;
    svg.classList.toggle('is-paused',!active);hero.classList.toggle('desk-effects-paused',!active);flow?.setActive(active);
  };
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;update();},{threshold:0}).observe(stage);
  new MutationObserver(update).observe(document.querySelector('.compare-handle'),{attributes:true,attributeFilter:['aria-valuenow']});
  document.addEventListener('visibilitychange',update);motion.addEventListener('change',update);
  navigator.connection?.addEventListener('change',update);
  window.addEventListener('pagehide',()=>{svg.classList.add('is-paused');flow?.setActive(false);});
  window.addEventListener('pageshow',update);
  // The physical controls respond now; no unchosen destinations are invented.
  stage.querySelectorAll('.desk-control').forEach(button=>{
    button.addEventListener('click',()=>{
      button.classList.remove('is-pressed');void button.offsetWidth;button.classList.add('is-pressed');
      stage.querySelector('.desk-control-status').textContent=button.getAttribute('aria-label')+' gedrückt.';
      button.dispatchEvent(new CustomEvent('desk:control',{bubbles:true,detail:{id:button.dataset.controlId}}));
    });
    button.addEventListener('animationend',()=>button.classList.remove('is-pressed'));
  });
})();
