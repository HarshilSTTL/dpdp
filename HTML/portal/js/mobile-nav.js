/* Hamburger toggle for the off-canvas sidebar on small screens. */
(function () {
  'use strict';
  var left = document.querySelector('.header-left');
  var sidebar = document.getElementById('mainSidebar');
  if (!left || !sidebar) return;

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'nav-toggle';
  btn.setAttribute('aria-label', 'Toggle navigation menu');
  btn.setAttribute('aria-controls', 'mainSidebar');
  btn.textContent = '☰';
  left.insertBefore(btn, left.firstChild);

  var backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  document.body.appendChild(backdrop);

  function set(open) {
    document.body.classList.toggle('nav-open', open);
    btn.setAttribute('aria-expanded', String(open));
  }
  btn.addEventListener('click', function () { set(!document.body.classList.contains('nav-open')); });
  backdrop.addEventListener('click', function () { set(false); });
  sidebar.addEventListener('click', function (e) { if (e.target.closest('.sidebar-item')) set(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 768) set(false); });
})();
