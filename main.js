/* Soléa Bay Resort & Spa — site scripts (no libraries, no build step) */
(function () {
  'use strict';

  var doc = document;
  var header = doc.querySelector('.site-header');
  var toggle = doc.querySelector('.nav-toggle');
  var menu = doc.getElementById('mobile-menu');

  /* Header turns solid once you scroll past the top */
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile menu */
  function setMenu(open) {
    if (!menu || !toggle) return;
    var wasOpen = menu.classList.contains('is-open');
    menu.classList.toggle('is-open', open);
    doc.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
    if (open) {
      var first = menu.querySelector('a');
      if (first) window.setTimeout(function () { first.focus({ preventScroll: true }); }, 60);
    } else if (wasOpen && menu.contains(doc.activeElement)) {
      toggle.focus();
    }
  }
  if (menu && toggle) {
    toggle.addEventListener('click', function () {
      setMenu(!menu.classList.contains('is-open'));
    });
    menu.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('a') : null;
      if (link) setMenu(false);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1040 && menu.classList.contains('is-open')) setMenu(false);
    });
  }

  /* Mark the current page in the navigation */
  var here = (window.location.pathname.split('/').pop() || 'index').replace(/\.html$/, '');
  var navLinks = doc.querySelectorAll('[data-nav]');
  for (var n = 0; n < navLinks.length; n++) {
    if (navLinks[n].getAttribute('data-nav') === here) navLinks[n].setAttribute('aria-current', 'page');
  }

  /* Fade-up reveal on scroll */
  var items = doc.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    for (var i = 0; i < items.length; i++) io.observe(items[i]);
  } else {
    for (var j = 0; j < items.length; j++) items[j].classList.add('is-visible');
  }

  /* Photos fade in once loaded (a missing photo leaves the colour gradient) */
  var photos = doc.querySelectorAll('.ph img');
  function markLoaded(img) { img.classList.add('is-loaded'); }
  for (var p = 0; p < photos.length; p++) {
    (function (img) {
      if (img.complete && img.naturalWidth > 0) markLoaded(img);
      else img.addEventListener('load', function () { markLoaded(img); });
    })(photos[p]);
  }

  /* Plan-your-stay dates: no past dates, departure after arrival */
  var checkin = doc.querySelector('[data-checkin]');
  var checkout = doc.querySelector('[data-checkout]');
  function iso(d) {
    var m = d.getMonth() + 1;
    var day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }
  if (checkin && checkout) {
    var today = new Date();
    var tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    checkin.min = iso(today);
    checkout.min = iso(tomorrow);
    checkin.addEventListener('change', function () {
      if (!checkin.value) return;
      var next = new Date(checkin.value + 'T00:00:00');
      next.setDate(next.getDate() + 1);
      checkout.min = iso(next);
      if (checkout.value && checkout.value <= checkin.value) checkout.value = '';
    });
  }

  /* Footer year */
  var years = doc.querySelectorAll('[data-year]');
  for (var y = 0; y < years.length; y++) years[y].textContent = String(new Date().getFullYear());
})();
