// Real recording posters are visible without loading/decoding the recordings.
// Playback starts only on mouse/pen hover, and only while actually onscreen.
(() => {
  const states = [...document.querySelectorAll('.project-preview')].map(preview => ({
    preview, video: preview.querySelector('video'), visible: false, hovered: false, timer: 0, revision: 0
  })).filter(state => state.video);
  function stop(state) {
    state.revision++;
    state.video.pause();
    state.preview.classList.remove('is-playing');
    if (state.timer) return;
    state.timer = setTimeout(() => {
      state.timer = 0;
      if (state.hovered && state.visible && !document.hidden) return;
      if (state.video.readyState > 0) state.video.currentTime = 0;
    }, 10000);
  }
  function play(state) {
    if (!state.hovered || !state.visible || document.hidden) return;
    states.forEach(other => { if (other !== state) stop(other); });
    clearTimeout(state.timer); state.timer = 0;
    const revision = ++state.revision;
    state.video.play().then(() => {
      if (state.revision !== revision || !state.hovered || !state.visible || document.hidden) {
        if (!state.hovered || !state.visible || document.hidden) stop(state);
      } else state.preview.classList.add('is-playing');
    }).catch(() => {});
  }
  const watcher = new IntersectionObserver(entries => entries.forEach(entry => {
    const state = states.find(state => state.preview === entry.target);
    state.visible = entry.isIntersecting;
    if (state.visible && state.hovered) play(state); else if (!state.visible) stop(state);
  }), { threshold: .01 });
  states.forEach(state => {
    state.video.muted = true;
    state.video.autoplay = false;
    state.video.preload = 'none';
    state.preview.addEventListener('pointerenter', event => {
      state.hovered = event.pointerType !== 'touch';
      if (state.hovered) play(state);
    });
    state.preview.addEventListener('pointerleave', () => { state.hovered = false; stop(state); });
    state.preview.addEventListener('pointercancel', () => { state.hovered = false; stop(state); });
    watcher.observe(state.preview);
  });
  document.addEventListener('visibilitychange', () => states.forEach(state => {
    if (document.hidden) stop(state); else if (state.hovered) play(state);
  }));
  window.addEventListener('pagehide', () => states.forEach(stop));
  const details = [...document.querySelectorAll('.services-list details')];
  details.forEach(item => item.addEventListener('toggle', () => {
    if (item.open) details.forEach(other => { if (other !== item) other.open = false; });
  }));
})();

// Original sun and recorded corona run together only in the visible header.
(() => {
  const sun = document.querySelector('.sun-video'), hero = document.querySelector('.hero');
  const corona = document.querySelector('.solar-corona-video');
  if (!sun || !hero) return;
  const videos = [sun, corona].filter(Boolean);
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false, started = false;
  videos.forEach(video => { video.muted = true; video.defaultMuted = true; video.autoplay = false; });
  corona?.addEventListener('playing', () => corona.classList.add('is-ready'), { once: true });
  function update() {
    const active = started && visible && !document.hidden && !motion.matches && !navigator.connection?.saveData;
    videos.forEach(video => {
      if (active) { if (video.paused) video.play().catch(() => {}); }
      else video.pause();
    });
  }
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); }, { threshold: .03 }).observe(hero);
  const begin = () => { started = true; update(); };
  if ('requestIdleCallback' in window) requestIdleCallback(begin, { timeout: 1300 }); else setTimeout(begin, 550);
  motion.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  window.addEventListener('pagehide', () => videos.forEach(video => video.pause()));
  window.addEventListener('pageshow', update);
})();
