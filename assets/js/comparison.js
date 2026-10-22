// Both layouts keep their width. One CSS coordinate controls the shared cut.
(() => {
  const hero = document.querySelector('.hero');
  const old = hero?.querySelector('.hero-old');
  const fresh = hero?.querySelector('.hero-new');
  const handle = hero?.querySelector('.compare-handle');
  if (!hero || !old || !fresh || !handle) return;
  let position = hero.classList.contains('immersive-hero') ? 0 : 50, pending = 0, drag = null;
  // Measure only on load/resize: a full-width hero without scrollbar overflow.
  const fitScene = () => hero.style.setProperty('--scene-width', `${document.documentElement.clientWidth}px`);
  fitScene();
  window.addEventListener('resize', fitScene, { passive: true });
  function render() {
    pending = 0;
    hero.style.setProperty('--reveal', `${position}%`);
    old.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
    fresh.style.clipPath = position === 0 ? 'none' :
      `polygon(${position}% -120px,100% -120px,100% 100%,${position}% 100%)`;
    handle.setAttribute('aria-valuenow', String(Math.round(position)));
    handle.setAttribute('aria-valuetext', `${Math.round(position)} Prozent alter Entwurf links, ${100 - Math.round(position)} Prozent neues Design rechts.`);
  }
  function set(value) {
    position = Math.max(0, Math.min(100, value));
    if (!pending) pending = requestAnimationFrame(render);
  }
  handle.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();
    handle.focus({ preventScroll: true });
    handle.setPointerCapture(event.pointerId);
    drag = { id: event.pointerId, box: hero.getBoundingClientRect() };
    hero.classList.add('comparison-dragging');
  });
  handle.addEventListener('pointermove', event => {
    if (drag?.id === event.pointerId) set((event.clientX - drag.box.left) / drag.box.width * 100);
  });
  function release(event) {
    if (drag?.id !== event.pointerId) return;
    drag = null;
    hero.classList.remove('comparison-dragging');
  }
  for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) handle.addEventListener(event, release);
  handle.addEventListener('keydown', event => {
    const step = event.shiftKey ? 10 : 2;
    const values = { ArrowLeft: position - step, ArrowRight: position + step, Home: 0, End: 100 };
    if (Object.hasOwn(values, event.key)) { event.preventDefault(); set(values[event.key]); }
  });
  handle.addEventListener('dblclick', () => set(50));
  fresh.addEventListener('focusin', () => set(0));
  new IntersectionObserver(entries => hero.classList.toggle('reveal-paused', !entries[0].isIntersecting)).observe(hero);
  hero.classList.add('comparison-ready');
  render();
})();
