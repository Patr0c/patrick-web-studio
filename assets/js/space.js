/* Crisp starfield and synchronized galactic dust for the saved website. */
(() => {
  const space = document.querySelector('.space-background');
  const galaxy = document.querySelector('.galaxy-position');
  const galaxyImage = galaxy?.querySelector('.round-galaxy');
  if (!space || !galaxy || !galaxyImage) return;

  // Keep galaxy artwork, fine stars and soft veil registered in one static layer.
  const rotating = document.createElement('div');
  rotating.className = 'galaxy-rotator';
  galaxyImage.replaceWith(rotating);
  rotating.append(galaxyImage);
  const dust = document.createElement('canvas');
  dust.className = 'galaxy-dust';
  dust.setAttribute('aria-hidden', 'true');
  rotating.append(dust);
  const fixed = document.createElement('canvas');
  fixed.className = 'static-starfield';
  fixed.setAttribute('aria-hidden', 'true');
  space.append(fixed); // fixed sky and outer-halo pinpoints stay above the spiral, never rotate

  const random = (seed) => () => {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const twinkles=document.createElement('div');twinkles.className='sky-twinkles';space.append(twinkles);
  const syncMotion=()=>{
    const save=Boolean(navigator.connection?.saveData);
    rotating.style.animation='none';
    document.documentElement.classList.toggle('studio-save-data',save);
  };
  motion.addEventListener('change',syncMotion);navigator.connection?.addEventListener('change',syncMotion);syncMotion();

  function prepare(canvas, width, height) {
    const dpr = Math.min(devicePixelRatio || 1, 1.25, Math.sqrt(2200000 / Math.max(1, width * height)));
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    const context = canvas.getContext('2d', {alpha:true});
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    return context;
  }

  function star(ctx, x, y, radius, brightness, halo = false) {
    if (halo) {
      const spread = radius * 5;
      const glow = ctx.createRadialGradient(x,y,0,x,y,spread);
      glow.addColorStop(0, 'rgba(236,247,255,' + (brightness * .34) + ')');
      glow.addColorStop(1, 'rgba(236,247,255,0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(x,y,spread,0,Math.PI*2); ctx.fill();
    }
    ctx.fillStyle = 'rgba(242,247,255,' + brightness + ')';
    ctx.beginPath(); ctx.arc(x,y,radius,0,Math.PI*2); ctx.fill();
  }

  function render() {
    const width = innerWidth, height = innerHeight;
    const fixedCtx = prepare(fixed,width,height);
    const rng = random(20261021);
    const count = Math.min(2450, Math.ceil(width * height / 680));
    for (let i=0; i<count; i++) {
      const x = rng()*width, y = rng()*height;
      const radius = .25 + rng()*.75;
      const bright = .18 + rng()*.64;
      star(fixedCtx,x,y,radius,bright,i%39===0);
    }
    twinkles.replaceChildren();
    const wink=random(20261024),winkCount=Math.min(28,Math.max(12,Math.round(width*height/49000)));
    for(let i=0;i<winkCount;i++){
      const dot=document.createElement('i');dot.className='sky-star';
      dot.style.cssText=`left:${(wink()*100).toFixed(3)}%;top:${(wink()*100).toFixed(3)}%;width:${(.8+wink()*.8).toFixed(2)}px;height:${(.8+wink()*.8).toFixed(2)}px;--star-period:${(10+wink()*11).toFixed(2)}s;--star-delay:-${(wink()*24).toFixed(2)}s`;
      twinkles.append(dot);
    }
    const bounds = galaxy.getBoundingClientRect();
    // Extra stationary pinpoints just outside the turning spiral.
    // Same seed on every redraw: no twinkling, flicker or animation cost.
    const orbitCount = Math.min(650, Math.max(220, Math.round(width * height / 2900)));
    for (let i=0; i<orbitCount; i++) {
      const angle = rng() * Math.PI * 2;
      const r = bounds.width * (.46 + Math.pow(rng(), .83) * .28);
      const x = bounds.left + bounds.width / 2 + Math.cos(angle) * r;
      const y = bounds.top + bounds.height / 2 + Math.sin(angle) * r;
      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        star(fixedCtx, x, y, .20 + rng() * .62, .24 + rng() * .53, i % 71 === 0);
      }
    }
    // A few fine glowing stars bridge the PNG's sparse edge and the fixed sky.
    // Separate seed preserves every existing star; no animation or extra canvas.
    const edgeRng = random(20261022);
    const edgeCount = Math.min(42, Math.max(16, Math.round(width * height / 30000)));
    for (let i=0; i<edgeCount; i++) {
      const angle = (i + edgeRng() * .6) / edgeCount * Math.PI * 2;
      const radius = bounds.width * (.42 + edgeRng() * .18);
      const x = bounds.left + bounds.width / 2 + Math.cos(angle) * radius;
      const y = bounds.top + bounds.height / 2 + Math.sin(angle) * radius * .84;
      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        star(fixedCtx, x, y, .40 + edgeRng() * .35, .55 + edgeRng() * .30, true);
      }
    }
    const size = bounds.width;
    if (!size) return;
    const ctx = prepare(dust,size,size);
    const centered = size/2, rand = random(19042026);
    // Paint ONCE: the canvas stays registered to the stationary galaxy.
    // A high-contrast fine star film, concentrated near the spiral core.
    // Parent galaxy opacity is handled on the image, not on this canvas.
    const countDust = Math.round(Math.min(2850, Math.max(1200, size * 2.35)));
    for (let i=0; i<countDust; i++) {
      const angle = rand()*Math.PI*2;
      const distance = Math.pow(rand(), .72) * size * .45;
      const x = centered + Math.cos(angle)*distance;
      const y = centered + Math.sin(angle)*distance;
      star(ctx, x, y, .33 + rand()*.66, .36 + rand()*.58, i % 79 === 0);
    }

    // Restrained blue/pearl microdust follows the same single rotating parent.
    for(let i=0;i<3400;i++){
      const r=Math.pow(rand(),.7)*size*.43;
      const angle=(i%4)*Math.PI*.5+r/size*12+(rand()-.5)*.55;
      const x=centered+Math.cos(angle)*r,y=centered+Math.sin(angle)*r*.78;
      ctx.fillStyle=i%3===0?'rgba(211,180,151,.25)':'rgba(164,197,228,.28)';
      ctx.fillRect(x,y,.35+rand()*.45,.35+rand()*.45);
    }
    // Clearly legible luminous pinpoints across the actual galaxy centre.
    // The glows are short-ranged and never stretch with the CSS animation.
    for (let i=0; i<135; i++) {
      const angle = rand()*Math.PI*2;
      const distance = Math.pow(rand(), .82)*size*.36;
      const x = centered + Math.cos(angle)*distance;
      const y = centered + Math.sin(angle)*distance;
      star(ctx, x, y, .85 + rand()*.65, .75 + rand()*.23, true);
    }

    // Distinct, delicate 4-point light flares, distributed across the core.
    // Not a starburst wallpaper: these are sparse, stable, small glints.
    for (let i=0; i<35; i++) {
      const angle = rand()*Math.PI*2;
      const distance = (i<5 ? rand()*.10 : Math.pow(rand(),.86)*.34)*size;
      const x = centered+Math.cos(angle)*distance;
      const y = centered+Math.sin(angle)*distance;
      const arm = Math.min(8.5, 3.7+rand()*4.6);
      const glow = ctx.createRadialGradient(x,y,0,x,y,arm*1.8);
      glow.addColorStop(0,'rgba(246,252,255,.70)');
      glow.addColorStop(.22,'rgba(189,226,255,.30)');
      glow.addColorStop(1,'rgba(162,203,255,0)');
      ctx.fillStyle=glow;
      ctx.beginPath();ctx.arc(x,y,arm*1.8,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='rgba(236,249,255,.75)';
      ctx.lineWidth=.7;
      ctx.beginPath();
      ctx.moveTo(x-arm,y);ctx.lineTo(x+arm,y);
      ctx.moveTo(x,y-arm);ctx.lineTo(x,y+arm);
      ctx.stroke();
      star(ctx,x,y,1.15+rand()*.6,.94);
    }
  }
  let queued = false;
  addEventListener('resize', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued=false; render(); });
  }, {passive:true});
  addEventListener('scene:layout', () => {
    if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render();});
  });
  render();
})();

(()=>{const update=()=>document.documentElement.classList.toggle('studio-tab-hidden',document.hidden);document.addEventListener('visibilitychange',update,{passive:true});update();})();
