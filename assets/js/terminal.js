/* Original vector interfaces inspired by Patrick's green retro-computer reference.
   Geometry is built once; CSS moves bounded layers only while the hero is visible. */
(() => {
  const stage = document.querySelector('.workstation-stage');
  const hero = document.querySelector('.immersive-hero');
  if (!stage || !hero) return;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.classList.add('aux-displays', 'is-paused');
  svg.setAttribute('viewBox', '0 0 1774 887');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  // Four measured glass corners, clockwise, in native image coordinates.
  const panels = [
    [[207,444],[291,439],[304,510],[218,518]],
    [[319,440],[480,435],[495,503],[331,510]],
    [[658,436],[714,436],[713,458],[661,460]],
    [[758,435],[1026,435],[1032,521],[747,520]],
    [[1062,437],[1115,438],[1115,458],[1064,459]],
    [[1292,437],[1446,442],[1432,511],[1278,504]],
    [[1479,446],[1559,450],[1545,521],[1465,516]]
  ];
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
  let content = '';
  panels.forEach((points,index) => {
    const p = points.map(x => x.join(',')).join(' ');
    defs += `<clipPath id="aux-glass-${index}"><polygon points="${p}"/></clipPath><clipPath id="aux-code-${index}"><rect x="5" y="8" width="112" height="128"/></clipPath><clipPath id="aux-plot-${index}"><rect x="126" y="8" width="188" height="128"/></clipPath>`;
    const [tl,tr,,bl] = points;
    const matrix = [(tr[0]-tl[0])/320,(tr[1]-tl[1])/320,(bl[0]-tl[0])/144,(bl[1]-tl[1])/144,tl[0],tl[1]].join(' ');
    let code = '';
    const rows = Array.from({length:8},() => Array.from({length:5},() => random(glyphPaths.length)));
    for (const offset of [0,144]) rows.forEach((row,y) => row.forEach((r,x) => {
      code += `<use href="#aux-rune-${r}" x="${7+x*22}" y="${offset+7+y*18}" width="13" height="16" opacity="${.42+random(59)/100}"/>`;
    }));
    let graph = '';
    if (index === 3) {
      graph = '<g class="aux-ink"><circle cx="223" cy="66" r="51"/><ellipse cx="223" cy="66" rx="20" ry="51"/><ellipse cx="223" cy="66" rx="40" ry="51"/><ellipse cx="223" cy="66" rx="51" ry="17"/><ellipse cx="223" cy="66" rx="51" ry="35"/><path d="M172 66h102M223 15v102"/><g class="aux-radar"><ellipse cx="223" cy="66" rx="69" ry="28" transform="rotate(-23 223 66)"/><circle cx="286" cy="41" r="3" fill="#b8ffb2"/></g></g>';
    } else if (index % 2) {
      let wave = '';
      for (let x=0;x<=640;x+=8) wave += `${x},${30+random(55)} `;
      graph = `<g class="aux-ink aux-faint"><path d="M126 25h190M126 60h190M126 95h190M126 125h190M160 8v128M210 8v128M260 8v128M310 8v128"/></g><g clip-path="url(#aux-plot-${index})"><polyline class="aux-ink aux-bright aux-wave" points="${wave}" style="--wave:${3+index*.23}s"/></g>`;
      for (let i=0;i<14;i++) graph += `<rect class="aux-packets" x="${129+i*13}" y="${102-random(24)}" width="8" height="${17+random(20)}" fill="currentColor" opacity="${.25+random(60)/100}" style="animation-delay:-${i*.13}s"/>`;
    } else {
      graph = '<g class="aux-ink aux-faint">';
      for (let i=0;i<12;i++) {
        const y=12+i*10,x=130+random(80),end=235+random(78);
        graph += `<path d="M${x} ${y}h22l8 5H${end}"/><circle cx="${end}" cy="${y+5}" r="2"/>`;
      }
      graph += '</g><g class="aux-ink"><rect x="203" y="45" width="62" height="49"/><path d="M215 53h38v32h-38zM195 52h-20M195 64h-40M195 76h-24M195 88h-45M273 52h32M273 65h25M273 77h33M273 89h19"/></g>';
    }
    graph += '<g class="aux-packets" fill="currentColor">';
    for(let i=0;i<11;i++) graph += `<circle cx="${133+i*16}" cy="132" r="2.5" opacity="${.3+random(70)/100}"/>`;
    graph += '</g>';
    content += `<g clip-path="url(#aux-glass-${index})" data-aux-screen="${index+1}"><polygon points="${p}" fill="#010805"/><g transform="matrix(${matrix})"><path class="aux-ink aux-faint" d="M119 4v136M3 4h314v136H3z"/><g clip-path="url(#aux-code-${index})"><g class="aux-code" style="--flow:${1.25+index*.14}s;animation-delay:-${index*.27}s">${code}</g></g>${graph}<path class="aux-scan aux-ink aux-faint" d="M4 130h310"/></g></g>`;
  });
  svg.innerHTML = `<defs>${defs}</defs>${content}`;
  stage.insertBefore(svg, stage.querySelector('.workstation-screen'));
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  const update = () => svg.classList.toggle('is-paused', !visible || document.hidden || motion.matches || Boolean(navigator.connection?.saveData));
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); },{threshold:.03}).observe(hero);
  document.addEventListener('visibilitychange',update);
  motion.addEventListener('change',update);
  window.addEventListener('pagehide',() => svg.classList.add('is-paused'));
  window.addEventListener('pageshow',update);
})();
