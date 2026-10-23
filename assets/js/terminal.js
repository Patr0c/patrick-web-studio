/* Named GIMP desk layers share the native 1949 × 826 canvas.
   Build once; bounded CSS transforms, no per-frame JavaScript or canvas. */
(async () => {
  const stage = document.querySelector('.workstation-stage');
  const hero = document.querySelector('.immersive-hero');
  if (!stage || !hero) return;
  // Same right-monitor content at a readable phone size; never crop/disassemble
  // the original terminal to enlarge its physical bezels.
  const phone = matchMedia('(max-width:650px)');
  const readingCopy = document.querySelector('.workstation-mobile-copy');
  const right = stage.querySelector('.screen-right');
  const updateReading = () => {
    readingCopy.hidden = !phone.matches;
    right.setAttribute('aria-hidden', String(phone.matches));
    stage.querySelectorAll('.workstation-screen a').forEach(link => {
      if (phone.matches) link.setAttribute('tabindex','-1');
      else link.removeAttribute('tabindex');
    });
  };
  phone.addEventListener('change',updateReading);
  updateReading();
  const ns = 'http://www.w3.org/2000/svg';
  let geometry;
  try {
    const response = await fetch('assets/desk/geometry.json');
    if (!response.ok) throw new Error(`Workstation geometry: ${response.status}`);
    geometry = await response.json();
  } catch (error) {
    // Original PNG layers and both HTML monitors remain usable on fetch failure.
    console.error(error);
    return;
  }
  const svg = document.createElementNS(ns, 'svg');
  svg.classList.add('terminal-effects', 'is-paused');
  const [width,height] = geometry.canvas;
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  // Every region comes from connected components of the ACTUAL source alpha.
  const displayRegions = [...geometry.auxiliary,geometry.center];
  const panels = displayRegions.map(region => {
    const [x0,y0,x1,y1] = region.box;
    return [[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
  });
  let seed = 5222026;
  const random = max => {
    seed = (Math.imul(seed,1664525)+1013904223) >>> 0;
    return seed % max;
  };
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
  let defs = glyphPaths.map((d,i) => `<symbol id="aux-rune-${i}" viewBox="0 0 12 16"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.2"/></symbol>`).join('');
  defs += '<mask id="terminal-aux-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1949" height="826" style="mask-type:alpha"><image href="assets/desk/aux-mask.png" width="1949" height="826"/></mask><mask id="terminal-matrix-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1949" height="826" style="mask-type:alpha"><image href="assets/desk/matrix-mask.png" width="1949" height="826"/></mask>';
  let matrix = '';
  // Identical repeated 144px periods make every downward wrap seamless.
  // Fine 6×8 source-pixel runes; speeds and tail densities vary per column.
  for (const region of geometry.auxiliary) for (let x=region.box[0]+5; x<region.box[0]+29; x+=7) {
    let column = '';
    const rows = Array.from({length:12}, () => ({r:random(glyphPaths.length), a:.15+random(67)/100}));
    for (const offset of [0,144,288]) rows.forEach((row,y) => {
      column += `<use href="#aux-rune-${row.r}" x="${x}" y="${446+offset+y*12}" width="6" height="8" opacity="${row.a}"${y===11?' style="color:#39ff14;opacity:.95"':''}/>`;
    });
    matrix += `<g class="matrix-column" style="--flow:${3+random(60)/10}s;--phase:-${random(90)/10}s">${column}</g>`;
  }
  let content = '';
  let auxiliaryContent = '';
  panels.forEach((points,index) => {
    const p = points.map(x => x.join(',')).join(' ');
    defs += `<clipPath id="aux-glass-${index}"><polygon points="${p}"/></clipPath><clipPath id="aux-code-${index}"><rect x="5" y="8" width="112" height="128"/></clipPath><clipPath id="aux-plot-${index}"><rect x="126" y="8" width="188" height="128"/></clipPath>`;
    const [tl,tr,,bl] = points;
    const matrix = [(tr[0]-tl[0])/320,(tr[1]-tl[1])/320,(bl[0]-tl[0])/144,(bl[1]-tl[1])/144,tl[0],tl[1]].join(' ');
    const central = index === panels.length-1;
    let code = '';
    if (central) {
      const rows = Array.from({length:24},() => Array.from({length:16},() => random(glyphPaths.length)));
      for (const offset of [0,144]) rows.forEach((row,y) => row.forEach((r,x) => {
        code += `<use href="#aux-rune-${r}" x="${7+x*6.7}" y="${offset+7+y*6}" width="3.8" height="5" opacity="${.32+random(59)/100}"/>`;
      }));
    }
    let graph = '';
    if (central) {
      graph = '<g class="aux-ink center-grid" opacity=".65"><circle cx="222" cy="67" r="47"/><ellipse cx="222" cy="67" rx="18" ry="47"/><ellipse cx="222" cy="67" rx="36" ry="47"/><ellipse cx="222" cy="67" rx="47" ry="16"/><ellipse cx="222" cy="67" rx="47" ry="32"/><path d="M175 67h94M222 20v94M123 6v132M128 6h184v132H128z"/><path opacity=".7" d="m189 43 7-8 11 3 2 8 8 3-2 9-12 4-4 12-9-10-3-9zm33 24 7-7 14 4 8 11-9 6-7 16-9-5 1-13z"/><g class="aux-radar"><ellipse cx="222" cy="67" rx="66" ry="27" transform="rotate(-23 222 67)"/><circle cx="282" cy="42" r="1.2" fill="#39ff14"/></g></g>';
      for(let i=0;i<28;i++) graph += `<path class="aux-ink center-grid" opacity="${.2+random(45)/100}" d="M132 ${11+i*4}h${8+random(22)}M294 ${11+i*4}h${4+random(12)}"/>`;
      graph += '<g class="aux-packets center-grid" stroke="currentColor" fill="none">';
      for(let i=0;i<45;i++) graph += `<path d="M${132+i*3.9} 132v-${2+random(9)}"/>`;
      graph += '</g>';
    } else {
      // Animate light on the EXISTING photographed diagnostics. No second globe,
      // graph or frame is drawn over the user's solar-system / Earth / radar.
      graph = '<rect x="4" y="8" width="26" height="126" fill="#010904"/>';
      if(index === 0) graph += '<g class="aux-radar aux-ink" opacity=".25"><path d="M160 73h85"/><circle cx="242" cy="73" r="1.3" fill="currentColor"/></g>';
      if(index === 2) graph += '<g class="aux-radar aux-ink" opacity=".4"><path d="M105 73h54"/></g>';
      graph += '<path class="aux-scan aux-ink" opacity=".18" d="M33 130h278"/>';
    }
    auxiliaryContent += `<g class="aux-screen-light" ${central ? 'data-main-telemetry="center"' : `data-aux-screen="${displayRegions[index].id}"`}><g clip-path="url(#aux-glass-${index})"><g transform="matrix(${matrix})">${central ? `<g clip-path="url(#aux-code-${index})"><g class="aux-code" style="--flow:3.4s;animation-delay:-.7s">${code}</g></g>` : ''}${graph}</g></g></g>`;
  });
  content += `<g mask="url(#terminal-aux-mask)">${auxiliaryContent}</g><g class="matrix-light" mask="url(#terminal-matrix-mask)" data-matrix-direction="down">${matrix}</g>`;
  // Pixel-span paths are individually addressable, not fake buttons. No handlers
  // or keyboard stops until Patrick chooses interactions for these controls.
  const controls = geometry.controls.map(region => `<path data-control-id="control-${String(region.id)}" data-source-box="${region.box.join(' ')}" d="${region.path}" fill="transparent"/>`).join('');
  svg.innerHTML = `<defs>${defs}</defs>${content}<g class="workstation-control-regions" pointer-events="none">${controls}</g>`;
  stage.insertBefore(svg, stage.querySelector('.workstation-screen'));
  const labels = document.querySelector('.compare-labels');
  const fitLabels = () => {
    const stageBox = stage.getBoundingClientRect(), heroBox = hero.getBoundingClientRect();
    hero.style.setProperty('--desk-top', `${stageBox.top-heroBox.top}px`);
    labels.style.top = `${Math.max(128,stageBox.top-heroBox.top+heightToPixels(80)-42)}px`;
    labels.style.left = `${Math.max(20,stageBox.left-heroBox.left+heightToPixels(90))}px`;
    labels.style.right = `${Math.max(20,heroBox.right-stageBox.right+heightToPixels(149))}px`;
    function heightToPixels(value) { return value / width * stageBox.width; }
  };
  new ResizeObserver(fitLabels).observe(hero);
  fitLabels();
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  const update = () => svg.classList.toggle('is-paused', !visible || Number(document.querySelector('.compare-handle')?.getAttribute('aria-valuenow')) === 100 || document.hidden || motion.matches || Boolean(navigator.connection?.saveData));
  // Observe the device itself; stop when comparison completely hides it as well.
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); },{threshold:0}).observe(stage);
  new MutationObserver(update).observe(hero, {attributes:true,attributeFilter:['style']});
  document.addEventListener('visibilitychange',update);
  motion.addEventListener('change',update);
  window.addEventListener('pagehide',() => svg.classList.add('is-paused'));
  window.addEventListener('pageshow',update);
  navigator.connection?.addEventListener('change',update);

})();
