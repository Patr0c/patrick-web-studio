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
    let timer;
    const stop = () => {
      clearTimeout(timer);
      card.classList.remove('is-boosting');
      button.setAttribute('aria-pressed', 'false');
      button.textContent = 'Antrieb starten';
      status.textContent = 'Bereit.';
    };
    stopBoosts.set(card, stop);
    button.addEventListener('click', () => {
      if (card.classList.contains('is-boosting')) { stop(); return; }
      card.classList.add('is-boosting');
      button.setAttribute('aria-pressed', 'true');
      button.textContent = 'Antrieb stoppen';
      status.textContent = 'Schub aktiv.';
      timer = setTimeout(stop, 4500);
    });
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopBoosts.forEach(stop => stop());
  });
})();
