/* =====================================================================
   MtnCargo — visual behaviour of the one-pager

   Text content and language switching live in i18n.js.
   ===================================================================== */

(function () {
    'use strict';

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


    /* ---------- Scroll reveal ---------- */

    var revealElements = document.querySelectorAll('.reveal');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {

        revealElements.forEach(function (el) {
            el.classList.add('visible');
        });

    } else {

        var revealObserver = new IntersectionObserver(function (entries, observer) {

            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });

        }, { threshold: 0.15 });

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });

    }


    /* ---------- Subtle hero parallax ----------
       Skipped on mobile and when reduced motion is requested.
       Updates are throttled to one per animation frame. */

    var heroImage = document.querySelector('.hero img');

    if (heroImage && !prefersReducedMotion && window.innerWidth >= 700) {

        var ticking = false;

        var update = function () {
            heroImage.style.transform =
                'translateY(' + (window.scrollY * 0.15) + 'px) scale(1.05)';
            ticking = false;
        };

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });

    }


    /* ---------- Smooth anchor scrolling ---------- */

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {

        anchor.addEventListener('click', function (event) {

            var href = this.getAttribute('href');

            if (!href || href === '#') {
                return;
            }

            var target;

            try {
                target = document.querySelector(href);
            } catch (e) {
                return;                        // not a valid selector
            }

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });

            /* Keep the URL shareable without triggering a second jump. */
            if (window.history && window.history.replaceState) {
                window.history.replaceState(null, '', href);
            }

        });

    });

})();
