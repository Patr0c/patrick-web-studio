/* Crisp starfield and synchronized galactic dust for the saved website. */
(() => {
  const space = document.querySelector('.space-background');
  const galaxy = document.querySelector('.galaxy-position');
  const galaxyImage = galaxy?.querySelector('.round-galaxy');
  if (!space || !galaxy || !galaxyImage) return;

  // Keep galaxy artwork, fine stars and soft veil in the same rotation layer.
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
  space.prepend(fixed);

  const random = (seed) => () => {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) rotating.style.animation = 'none';

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
    const count = Math.min(1150, Math.ceil(width * height / 1350));
    for (let i=0; i<count; i++) {
      const x = rng()*width, y = rng()*height;
      const radius = .25 + rng()*.75;
      const bright = .18 + rng()*.64;
      star(fixedCtx,x,y,radius,bright,i%31===0);
    }
    const size = galaxy.getBoundingClientRect().width;
    if (!size) return;
    const ctx = prepare(dust,size,size);
    const centered = size/2, rand = random(19042026);
    const countDust = Math.round(Math.min(950,Math.max(350,size*.95)));
    for (let i=0; i<countDust; i++) {
      // A light granular star film follows the visible circular galaxy.
      const angle = rand()*Math.PI*2;
      const distance = Math.sqrt(rand())*size*.68;
      const x = centered+Math.cos(angle)*distance;
      const y = centered+Math.sin(angle)*distance;
      star(ctx,x,y,.21+rand()*.66,.16+rand()*.58,i%58===0);
    }
  }
  let queued = false;
  addEventListener('resize', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued=false; render(); });
  }, {passive:true});
  render();
})();

(()=>{const update=()=>document.documentElement.classList.toggle('studio-tab-hidden',document.hidden);document.addEventListener('visibilitychange',update,{passive:true});update();})();
