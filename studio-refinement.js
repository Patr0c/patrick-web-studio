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
    const count = Math.min(2200, Math.ceil(width * height / 740));
    for (let i=0; i<count; i++) {
      const x = rng()*width, y = rng()*height;
      const radius = .25 + rng()*.75;
      const bright = .18 + rng()*.64;
      star(fixedCtx,x,y,radius,bright,i%39===0);
    }
    const bounds = galaxy.getBoundingClientRect();
    // Extra stationary pinpoints just outside the turning spiral.
    // Same seed on every redraw: no twinkling, flicker or animation cost.
    const orbitCount = Math.min(480, Math.max(160, Math.round(width * height / 4000)));
    for (let i=0; i<orbitCount; i++) {
      const angle = rng() * Math.PI * 2;
      const r = bounds.width * (.43 + Math.pow(rng(), .82) * .30);
      const x = bounds.left + bounds.width / 2 + Math.cos(angle) * r;
      const y = bounds.top + bounds.height / 2 + Math.sin(angle) * r;
      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        star(fixedCtx, x, y, .20 + rng() * .62, .24 + rng() * .53, i % 71 === 0);
      }
    }
    const size = bounds.width;
    if (!size) return;
    const ctx = prepare(dust,size,size);
    const centered = size/2, rand = random(19042026);
    const countDust = Math.round(Math.min(1650, Math.max(620, size * 1.48)));
    for (let i=0; i<countDust; i++) {
      // A light granular star film follows the visible circular galaxy.
      const angle = rand()*Math.PI*2;
      const distance = Math.sqrt(rand()) * size * .485;
      const x = centered+Math.cos(angle)*distance;
      const y = centered+Math.sin(angle)*distance;
      star(ctx, x, y, .17 + rand() * .60, .18 + rand() * .64, i % 66 === 0);
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
