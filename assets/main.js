(function () {
  const body = document.body;
  const drawer = document.getElementById('drawer');
  const backdrop = document.getElementById('backdrop');
  const menuBtn = document.getElementById('menuButton');
  const closeBtn = document.getElementById('closeButton');

  const focusableSelector = 'a[href], button:not([disabled])';
  let lastFocused = null;

  function openDrawer() {
    lastFocused = document.activeElement;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden','false');
    menuBtn.setAttribute('aria-expanded','true');

    backdrop.hidden = false;
    requestAnimationFrame(()=>backdrop.classList.add('show'));
    body.classList.add('no-scroll');

    const firstLink = drawer.querySelector(focusableSelector);
    if (firstLink) firstLink.focus();

    drawer.addEventListener('keydown', trapTab);
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden','true');
    menuBtn.setAttribute('aria-expanded','false');
    backdrop.classList.remove('show');

    const onEnd = () => {
      body.classList.remove('no-scroll');
      backdrop.hidden = true;
      drawer.removeEventListener('transitionend', onEnd);
    };
    drawer.addEventListener('transitionend', onEnd);

    if (lastFocused) lastFocused.focus();
    drawer.removeEventListener('keydown', trapTab);
  }

  function trapTab(e) {
    if (e.key !== 'Tab') return;
    const focusables = drawer.querySelectorAll(focusableSelector);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  }

  menuBtn.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer(); });
  drawer.addEventListener('click', e => { if (e.target.closest('a[href]')) closeDrawer(); });
})();
