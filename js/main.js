document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Countdown to price increase (24 August, 23:59, current year) ---------- */
  (function countdown(){
    const now = new Date();
    let year = now.getFullYear();
    let target = new Date(year, 7, 24, 23, 59, 0); // month 7 = August
    if (target < now) target = new Date(year + 1, 7, 24, 23, 59, 0);

    const elD = document.querySelector('.js-cd-days');
    const elH = document.querySelector('.js-cd-hours');
    const elM = document.querySelector('.js-cd-mins');
    const elS = document.querySelector('.js-cd-secs');
    if (!elD) return;

    function pad(n){ return String(n).padStart(2,'0'); }

    function tick(){
      const diff = Math.max(0, target - new Date());
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      elD.textContent = pad(days);
      elH.textContent = pad(hours);
      elM.textContent = pad(mins);
      elS.textContent = pad(secs);
    }
    tick();
    setInterval(tick, 1000);
  })();

  /* ---------- Applications counter — gentle count-up on load ---------- */
  (function countUp(){
    const el = document.querySelector('.js-count');
    if (!el) return;
    const target = parseInt(el.dataset.count, 10) || 0;
    let current = 0;
    const duration = 1400;
    const start = performance.now();
    function step(t){
      const progress = Math.min(1, (t - start) / duration);
      current = Math.floor(progress * target);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  })();

  /* ---------- Scroll reveal ---------- */
  (function reveal(){
    const items = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)){
      items.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    items.forEach(el => io.observe(el));
  })();

  /* ---------- Accordion (program + FAQ) ---------- */
  document.querySelectorAll('.acc-trigger').forEach(btn => {
    const panel = btn.nextElementSibling;
    const item = btn.closest('.acc-item');
    if (item.classList.contains('is-open')){
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      // close siblings within the same accordion
      const group = item.parentElement;
      group.querySelectorAll('.acc-item.is-open').forEach(other => {
        if (other !== item){
          other.classList.remove('is-open');
          other.querySelector('.acc-trigger').setAttribute('aria-expanded','false');
          other.querySelector('.acc-panel').style.maxHeight = null;
        }
      });
      if (isOpen){
        item.classList.remove('is-open');
        btn.setAttribute('aria-expanded','false');
        panel.style.maxHeight = null;
      } else {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded','true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Cursor glow (desktop only) ---------- */
  (function cursorGlow(){
    const glow = document.querySelector('.cursor-glow');
    if (!glow || window.matchMedia('(pointer: coarse)').matches) return;
    window.addEventListener('mousemove', (e) => {
      glow.style.opacity = '1';
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
    window.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  })();

  /* ---------- Smooth scroll for CTA anchors (native smooth-scroll via CSS already handles href="#..."; this just ensures focus for a11y) ---------- */
  document.querySelectorAll('.js-scroll-cta').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(() => {
        const target = document.getElementById('final-cta');
        if (target) target.setAttribute('tabindex', '-1');
      }, 600);
    });
  });

});
