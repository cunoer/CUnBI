(function () {
  'use strict';

  const scrollContainer = document.getElementById('horizontalScroll');
  const panels = document.querySelectorAll('.panel');
  const navLinks = document.querySelectorAll('.nav-link');
  const progressFill = document.getElementById('progressFill');
  const scrollTargets = document.querySelectorAll('.scroll-to, [data-target]');

  function scrollToPanel(panelId) {
    const panel = document.getElementById(panelId);
    if (!panel || !scrollContainer) return;
    scrollContainer.scrollTo({
      left: panel.offsetLeft,
      behavior: 'smooth'
    });
  }

  function updateActiveNav() {
    if (!scrollContainer) return;

    const scrollLeft = scrollContainer.scrollLeft;
    const containerWidth = scrollContainer.clientWidth;
    const maxScroll = scrollContainer.scrollWidth - containerWidth;

    if (progressFill && maxScroll > 0) {
      progressFill.style.width = (scrollLeft / maxScroll) * 100 + '%';
    }

    let activeIndex = 0;
    panels.forEach((panel, index) => {
      const panelLeft = panel.offsetLeft;
      const panelCenter = panelLeft + panel.offsetWidth / 2;
      const viewCenter = scrollLeft + containerWidth / 2;

      if (viewCenter >= panelLeft && viewCenter < panelLeft + panel.offsetWidth) {
        activeIndex = index;
      }

      const rect = panel.getBoundingClientRect();
      if (rect.left < window.innerWidth * 0.6 && rect.right > window.innerWidth * 0.4) {
        panel.classList.add('in-view');
      }
    });

    navLinks.forEach((link, index) => {
      link.classList.toggle('active', index === activeIndex);
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = link.getAttribute('data-target');
      if (target) scrollToPanel(target);
    });
  });

  scrollTargets.forEach(el => {
    el.addEventListener('click', e => {
      const target = el.getAttribute('data-target');
      if (target) {
        e.preventDefault();
        scrollToPanel(target);
      }
    });
  });

  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', updateActiveNav, { passive: true });

    let wheelTimeout;
    scrollContainer.addEventListener('wheel', e => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  }

  document.addEventListener('keydown', e => {
    if (!scrollContainer) return;
    const step = scrollContainer.clientWidth * 0.8;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      scrollContainer.scrollBy({ left: step, behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      scrollContainer.scrollBy({ left: -step, behavior: 'smooth' });
    }
  });

  updateActiveNav();
  panels[0]?.classList.add('in-view');
})();
