/**
 * UNSTAFF — Core JavaScript
 * Plain vanilla JavaScript • Zero external dependencies
 */

(function () {
  'use strict';

  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. Header Scroll State
     ========================================================================== */
  const header = document.querySelector('.site-header');

  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ==========================================================================
     2. Mobile Menu Navigation
     ========================================================================== */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta a');

  function toggleMobileMenu(forceClose = false) {
    if (!mobileMenuBtn || !mobileNav) return;
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    const shouldOpen = forceClose ? false : !isExpanded;

    mobileMenuBtn.setAttribute('aria-expanded', String(shouldOpen));
    mobileNav.classList.toggle('open', shouldOpen);
    mobileNav.setAttribute('aria-hidden', String(!shouldOpen));

    if (shouldOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => toggleMobileMenu());
  }

  // Close mobile menu when a navigation item is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(true);
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      toggleMobileMenu(true);
      mobileMenuBtn.focus();
    }
  });

  /* ==========================================================================
     3. Smooth Scrolling & Active Navigation Link Tracking
     ========================================================================== */
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const trackedSections = document.querySelectorAll('section[id]');

  // Active section highlighting
  if ('IntersectionObserver' in window && trackedSections.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-25% 0px -65% 0px',
      threshold: 0
    });

    trackedSections.forEach(section => navObserver.observe(section));
  }



  /* ==========================================================================
     4. Scroll-To-Top Button
     ========================================================================== */
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  function handleScrollTopVisibility() {
    if (!scrollTopBtn) return;
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleScrollTopVisibility, { passive: true });
  handleScrollTopVisibility();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  /* ==========================================================================
     5. Restrained Scroll Reveal Animations
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // If IntersectionObserver is not supported or user prefers reduced motion
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  /* ==========================================================================
     6. Recruitment Modal: ₹200 Photo Collection Task
     ========================================================================== */
  const photoPromoModal = document.getElementById('photoPromoModal');
  const promoModalOverlay = document.getElementById('promoModalOverlay');
  const promoCloseBtn = document.getElementById('promoCloseBtn');
  const promoDismissBtn = document.getElementById('promoDismissBtn');
  const promoWhatsAppBtn = document.getElementById('promoWhatsAppBtn');
  const reopenPromoBtn = document.getElementById('reopenPromoBtn');

  const PROMO_STORAGE_KEY = 'unstaff_photo_task_dismissed';
  const PROMO_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  let lastActiveElement = null;

  function isPromoEligible() {
    try {
      const dismissedAt = localStorage.getItem(PROMO_STORAGE_KEY);
      if (!dismissedAt) return true;
      const parsedTime = parseInt(dismissedAt, 10);
      if (isNaN(parsedTime)) return true;
      return (Date.now() - parsedTime) > PROMO_COOLDOWN_MS;
    } catch (e) {
      return true;
    }
  }

  function markPromoDismissed() {
    try {
      localStorage.setItem(PROMO_STORAGE_KEY, Date.now().toString());
    } catch (e) {
      // Storage unavailable / blocked
    }
  }

  function openPhotoModal(userInitiated = false) {
    if (!photoPromoModal) return;

    lastActiveElement = document.activeElement;
    photoPromoModal.classList.add('open');
    photoPromoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Ensure modal body scroll position starts at top
    const modalBody = photoPromoModal.querySelector('.promo-modal-body');
    if (modalBody) {
      modalBody.scrollTop = 0;
    }

    // Focus close button or CTA with preventScroll so badges are visible
    setTimeout(() => {
      if (promoCloseBtn) {
        promoCloseBtn.focus({ preventScroll: true });
      } else if (promoWhatsAppBtn) {
        promoWhatsAppBtn.focus({ preventScroll: true });
      }
      if (modalBody) {
        modalBody.scrollTop = 0;
      }
    }, 50);
  }

  function closePhotoModal(isDismissal = false) {
    if (!photoPromoModal || !photoPromoModal.classList.contains('open')) return;

    if (isDismissal) {
      markPromoDismissed();
    }

    photoPromoModal.classList.remove('open');
    photoPromoModal.setAttribute('aria-hidden', 'true');

    // Only restore body overflow if mobile nav is not open
    if (!mobileNav || !mobileNav.classList.contains('open')) {
      document.body.style.overflow = '';
    }

    // Return focus to reopen button or previously active element
    if (reopenPromoBtn && reopenPromoBtn.offsetParent !== null) {
      reopenPromoBtn.focus();
    } else if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  // Event Listeners for Closing
  if (promoCloseBtn) {
    promoCloseBtn.addEventListener('click', () => closePhotoModal(true));
  }

  if (promoDismissBtn) {
    promoDismissBtn.addEventListener('click', () => closePhotoModal(true));
  }

  if (promoModalOverlay) {
    promoModalOverlay.addEventListener('click', () => closePhotoModal(true));
  }

  // WhatsApp CTA click: remember dismissal so returning visitor can browse smoothly
  if (promoWhatsAppBtn) {
    promoWhatsAppBtn.addEventListener('click', () => {
      markPromoDismissed();
      // Allow link to open in new tab, then close popup
      setTimeout(() => {
        closePhotoModal(false);
      }, 300);
    });
  }

  // Reopen Floating Button
  if (reopenPromoBtn) {
    reopenPromoBtn.addEventListener('click', () => {
      openPhotoModal(true);
    });
  }

  // Keyboard Navigation: Escape key and Focus Trapping
  const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  document.addEventListener('keydown', (e) => {
    if (!photoPromoModal || !photoPromoModal.classList.contains('open')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closePhotoModal(true);
      return;
    }

    if (e.key === 'Tab') {
      const focusableEls = photoPromoModal.querySelectorAll(focusableSelectors);
      if (focusableEls.length === 0) return;

      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  });

  // Auto-display on visitor's first visit after page has settled
  function initAutoDisplay() {
    if (isPromoEligible()) {
      setTimeout(() => {
        // Only auto-open if modal hasn't already been opened or dismissed
        if (isPromoEligible() && photoPromoModal && !photoPromoModal.classList.contains('open')) {
          openPhotoModal(false);
        }
      }, 700);
    }
  }

  if (document.readyState === 'complete') {
    initAutoDisplay();
  } else {
    window.addEventListener('load', initAutoDisplay);
  }

})();

