(function () {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  // ── Custom cursor ──────────────────────────────
  if (!isTouch) {
    const cursor = document.querySelector('.cursor');
    let raf;

    document.addEventListener('mousemove', (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top  = e.clientY + 'px';
      });
    });

    document.querySelectorAll('.card, a, button').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
    });
  }

  // ── Staggered entrance ─────────────────────────
  const cards = document.querySelectorAll('.card');

  requestAnimationFrame(() => {
    cards.forEach((card, i) => {
      card.style.transitionDelay = (i * 48) + 'ms';
      card.classList.add('in');
    });

    // Clear delays after animation completes so hover transitions aren't delayed
    setTimeout(() => {
      cards.forEach(c => c.style.transitionDelay = '');
    }, cards.length * 48 + 600);
  });

  // ── Card 3D tilt ───────────────────────────────
  if (!isTouch) {
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r    = card.getBoundingClientRect();
        const x    = ((e.clientX - r.left) / r.width  - 0.5) * 9;
        const y    = ((e.clientY - r.top)  / r.height - 0.5) * 9;
        card.style.transform = `perspective(900px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.018)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
})();
