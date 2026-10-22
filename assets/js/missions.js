/* CSS motion only while visible. Boost is an optional, bounded interaction. */
(() => {
  const cards = [...document.querySelectorAll('.mission-card')];
  if (!cards.length) return;
  const stopBoosts = new Map();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      entry.target.classList.toggle('is-inview', entry.isIntersecting);
      if (!entry.isIntersecting) stopBoosts.get(entry.target)?.();
    }
  }, {threshold:.15});
  cards.forEach(card => observer.observe(card));
  for (const button of document.querySelectorAll('.engine-trigger')) {
    const card = button.closest('.mission-card');
    const status = card.querySelector('.engine-status');
    let timer, hovered = false, boosted = false;
    const update = () => {
      const powered = hovered || boosted;
      card.classList.toggle('is-powered', powered);
      card.classList.toggle('is-boosting', boosted);
      button.setAttribute('aria-pressed', String(boosted));
      button.setAttribute('aria-label', boosted ? 'Antrieb stoppen' : 'Antrieb starten');
      status.textContent = powered ? 'Schub aktiv.' : 'Bereit.';
    };
    const stop = () => {
      clearTimeout(timer);
      hovered = false;
      boosted = false;
      update();
    };
    stopBoosts.set(card, stop);
    card.addEventListener('pointerenter', event => {
      hovered = event.pointerType !== 'touch';
      update();
    });
    card.addEventListener('pointerleave', () => { hovered = false; update(); });
    card.addEventListener('pointercancel', () => { hovered = false; update(); });
    button.addEventListener('click', () => {
      clearTimeout(timer);
      boosted = !boosted;
      update();
      if (boosted) timer = setTimeout(() => { boosted = false; update(); }, 4500);
    });
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopBoosts.forEach(stop => stop());
  });
})();
