/**
 * HAWK PROPERTY SURVEYS - MAIN JAVASCRIPT
 * Core navigation, mobile drawer, modal windows, and shared UI behaviors
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initModals();
  initQuickQuoteTriggers();
  highlightActiveNavLink();
  initCustomCursor();
  initHeroEffects();
  initCardGlowEffects();
  initServicesCarousel();
  initAmbientParticles();
});

/* Sticky Header Scroll Effect */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* Mobile Drawer Menu */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const backdrop = document.querySelector('.mobile-nav-backdrop');

  if (!toggleBtn || !mobileNav) return;

  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : !mobileNav.classList.contains('open');
    mobileNav.classList.toggle('open', isOpen);
    toggleBtn.classList.toggle('active', isOpen);
    if (backdrop) backdrop.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  toggleBtn.addEventListener('click', () => toggleMenu());
  if (backdrop) backdrop.addEventListener('click', () => toggleMenu(false));

  // Close menu when clicking links
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/* Modal Windows (Sample Reports & Details) */
function initModals() {
  const modals = document.querySelectorAll('.modal-backdrop');
  const closeBtns = document.querySelectorAll('[data-modal-close]');

  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = btn.closest('.modal-backdrop');
      if (modal) closeModal(modal);
    });
  });

  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal-backdrop.open');
      if (openModal) closeModal(openModal);
    }
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Global modal triggers
window.openModal = openModal;
window.closeModal = closeModal;

/* Quick Quote Modal Triggers */
function initQuickQuoteTriggers() {
  document.querySelectorAll('[data-open-quote]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const surveyType = btn.getAttribute('data-survey-type');
      const quoteModal = document.getElementById('quoteModal');
      if (quoteModal) {
        if (surveyType) {
          const select = quoteModal.querySelector('select[name="surveyType"]');
          if (select) select.value = surveyType;
        }
        openModal('quoteModal');
      } else {
        const contactSection = document.getElementById('enquirySection') || document.querySelector('.enquiry-wrapper');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.href = '/contact.html';
        }
      }
    });
  });
}

/* Active Nav Link Highlight */
function highlightActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    if (currentPath === href || (currentPath === '/' && (href === 'index.html' || href === '/')) || currentPath.endsWith(href)) {
      link.classList.add('active');
    }
  });
}

/* Bespoke Architectural Custom Cursor */
function initCustomCursor() {
  // Disable on devices with no hover or touch pointers
  if (window.matchMedia('(pointer: coarse), (hover: none)').matches) {
    return;
  }

  // Create dot and trailing ring elements if not already present
  let dot = document.getElementById('customCursorDot');
  let ring = document.getElementById('customCursorRing');

  if (!dot) {
    dot = document.createElement('div');
    dot.id = 'customCursorDot';
    dot.className = 'custom-cursor-dot';
    dot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dot);
  }

  if (!ring) {
    ring = document.createElement('div');
    ring.id = 'customCursorRing';
    ring.className = 'custom-cursor-ring';
    ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ring);
  }

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isMoving = false;

  const renderRing = () => {
    // Smooth trailing physics via linear interpolation
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

    const diffX = Math.abs(mouseX - ringX);
    const diffY = Math.abs(mouseY - ringY);
    if (diffX > 0.15 || diffY > 0.15) {
      requestAnimationFrame(renderRing);
    } else {
      isMoving = false;
    }
  };

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!document.body.classList.contains('has-custom-cursor')) {
      document.body.classList.add('has-custom-cursor');
      ringX = mouseX;
      ringY = mouseY;
    }

    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

    if (!isMoving) {
      isMoving = true;
      requestAnimationFrame(renderRing);
    }
  }, { passive: true });

  // Interactive element expansion state
  const interactiveSelectors = 'a, button, .btn, input, select, textarea, .service-card, .trust-item, .why-card, .report-card, .guide-card, .accordion-trigger, [role="button"], label[for]';

  document.addEventListener('mouseover', (e) => {
    if (e.target && e.target.closest && e.target.closest(interactiveSelectors)) {
      document.body.classList.add('cursor-hover');
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    if (e.target && e.target.closest && e.target.closest(interactiveSelectors)) {
      document.body.classList.remove('cursor-hover');
    }
  }, { passive: true });

  // Mouse click feedback
  document.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-clicking');
  });

  document.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-clicking');
  });

  // Window edge transitions
  document.addEventListener('mouseleave', () => {
    document.body.classList.remove('has-custom-cursor');
  });

  document.addEventListener('mouseenter', () => {
    document.body.classList.add('has-custom-cursor');
  });
}

/* Hero Section Interactive Parallax & Ambient Spotlight */
function initHeroEffects() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  let ticking = false;

  hero.addEventListener('mousemove', (e) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const normX = (x / rect.width) - 0.5;
        const normY = (y / rect.height) - 0.5;

        // Subtle parallax shift on background image (up to ±24px)
        hero.style.setProperty('--hero-px', `${normX * -28}px`);
        hero.style.setProperty('--hero-py', `${normY * -18}px`);

        // Dynamic warm amber spotlight tracker
        hero.style.setProperty('--hero-mx', `${(x / rect.width) * 100}%`);
        hero.style.setProperty('--hero-my', `${(y / rect.height) * 100}%`);

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    hero.style.setProperty('--hero-px', '0px');
    hero.style.setProperty('--hero-py', '0px');
    hero.style.setProperty('--hero-mx', '35%');
    hero.style.setProperty('--hero-my', '40%');
  });
}

/* Interactive Card Ambient Spotlight Tracking */
function initCardGlowEffects() {
  const cards = document.querySelectorAll('.why-card, .service-card, .report-card, .guide-card, .process-step');
  if (!cards.length) return;

  cards.forEach(card => {
    let ticking = false;

    card.addEventListener('mousemove', (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--card-mouse-x', `${x}px`);
          card.style.setProperty('--card-mouse-y', `${y}px`);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--card-mouse-x');
      card.style.removeProperty('--card-mouse-y');
    });
  });
}

/* 4-in-a-Row Full-Width Dual Carousel (Row 1 Right, Row 2 Left) with Keyframes & Controls */
function initServicesCarousel() {
  const wrapper = document.getElementById('servicesCarouselWrapper');
  const fullwidthContainer = document.querySelector('.services-carousel-fullwidth');
  const trackRight = document.getElementById('servicesTrackRight');
  const trackLeft = document.getElementById('servicesTrackLeft');
  const playToggleBtn = document.getElementById('carouselPlayToggleBtn');
  const prevBtn = document.getElementById('carouselPrevBtn');
  const nextBtn = document.getElementById('carouselNextBtn');
  const statusText = document.getElementById('carouselStatusText');

  if (!fullwidthContainer || (!trackRight && !trackLeft)) return;

  let isPlaying = true;
  let offsetRight = 0;
  let offsetLeft = 0;
  let isManualMode = false;

  // Toggle Play / Pause (Play / Off button) for both rows
  if (playToggleBtn) {
    const pauseIcon = playToggleBtn.querySelector('.pause-icon');
    const playIcon = playToggleBtn.querySelector('.play-icon');
    const toggleText = playToggleBtn.querySelector('.toggle-text');

    playToggleBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;

      if (!isPlaying) {
        fullwidthContainer.classList.add('is-paused');
        if (wrapper) wrapper.classList.add('is-paused');
        playToggleBtn.classList.add('is-off');
        if (pauseIcon) pauseIcon.style.display = 'none';
        if (playIcon) playIcon.style.display = 'inline-block';
        if (toggleText) toggleText.textContent = 'Autoplay: OFF';
        if (statusText) statusText.textContent = 'Paused · Manual Controls Active';
      } else {
        fullwidthContainer.classList.remove('is-paused');
        if (wrapper) wrapper.classList.remove('is-paused');
        playToggleBtn.classList.remove('is-off');
        if (pauseIcon) pauseIcon.style.display = 'inline-block';
        if (playIcon) playIcon.style.display = 'none';
        if (toggleText) toggleText.textContent = 'Autoplay: ON';
        if (statusText) statusText.textContent = 'Full-Width Dual Portfolio Marquee (4 per Row)';
        if (isManualMode) {
          isManualMode = false;
          if (trackRight) { trackRight.style.animation = ''; trackRight.style.transform = ''; }
          if (trackLeft) { trackLeft.style.animation = ''; trackLeft.style.transform = ''; }
          offsetRight = 0;
          offsetLeft = 0;
        }
      }
    });
  }

  // Hover Pause Notification for full-width area
  fullwidthContainer.addEventListener('mouseenter', () => {
    if (isPlaying && statusText) {
      statusText.textContent = 'Hovered · Animation Paused';
    }
  });

  fullwidthContainer.addEventListener('mouseleave', () => {
    if (isPlaying && statusText) {
      statusText.textContent = 'Full-Width Dual Portfolio Marquee (4 per Row)';
    }
  });

  // Calculate slide step: 4 cards visible on desktop (>=1200px), 3 on medium, 2 on tablet, 1 on mobile
  const getStepDistance = (targetTrack) => {
    const card = targetTrack ? targetTrack.querySelector('.service-card') : document.querySelector('.service-card');
    if (!card) return 320;
    const cardWidth = card.offsetWidth;
    const gap = 24; // 1.5rem
    const visibleCount = window.innerWidth > 1200 ? 4 : (window.innerWidth > 991 ? 3 : (window.innerWidth > 640 ? 2 : 1));
    return (cardWidth + gap) * visibleCount;
  };

  const applyManualShift = (direction) => {
    isManualMode = true;
    isPlaying = false;
    fullwidthContainer.classList.add('is-paused');
    if (wrapper) wrapper.classList.add('is-paused');

    if (playToggleBtn) {
      playToggleBtn.classList.add('is-off');
      const pauseIcon = playToggleBtn.querySelector('.pause-icon');
      const playIcon = playToggleBtn.querySelector('.play-icon');
      const toggleText = playToggleBtn.querySelector('.toggle-text');
      if (pauseIcon) pauseIcon.style.display = 'none';
      if (playIcon) playIcon.style.display = 'inline-block';
      if (toggleText) toggleText.textContent = 'Autoplay: OFF';
    }

    if (trackRight) {
      trackRight.style.animation = 'none';
      const stepRight = getStepDistance(trackRight);
      const halfWidthRight = trackRight.scrollWidth / 2;

      if (direction === 'next') {
        offsetRight += stepRight;
        if (offsetRight > 0) offsetRight = -halfWidthRight + stepRight;
      } else {
        offsetRight -= stepRight;
        if (Math.abs(offsetRight) >= halfWidthRight) offsetRight = 0;
      }
      trackRight.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      trackRight.style.transform = `translate3d(${offsetRight}px, 0, 0)`;
    }

    if (trackLeft) {
      trackLeft.style.animation = 'none';
      const stepLeft = getStepDistance(trackLeft);
      const halfWidthLeft = trackLeft.scrollWidth / 2;

      if (direction === 'next') {
        offsetLeft -= stepLeft;
        if (Math.abs(offsetLeft) >= halfWidthLeft) offsetLeft = 0;
      } else {
        offsetLeft += stepLeft;
        if (offsetLeft > 0) offsetLeft = -halfWidthLeft + stepLeft;
      }
      trackLeft.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      trackLeft.style.transform = `translate3d(${offsetLeft}px, 0, 0)`;
    }

    if (statusText) {
      statusText.textContent = 'Manual Navigation · Showing 4 Services per Row';
    }
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => applyManualShift('next'));
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => applyManualShift('prev'));
  }
}

/* Overall Website Interactive Ambient Particles */
function initAmbientParticles() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let canvas = document.getElementById('ambientParticleCanvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'ambientParticleCanvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let particles = [];
  let mouse = { x: null, y: null };
  let animId = null;

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
    createParticles();
  };

  const colors = [
    '#D99A43', // Hawk signature amber
    '#E8B66E', // light luminous amber
    '#C98935', // deep metallic amber
    '#DCDDDA'  // architectural slate coordinate
  ];

  const createParticles = () => {
    particles = [];
    const count = width > 768 ? 65 : 30;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 1.8 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        baseAlpha: Math.random() * 0.45 + 0.35,
        alpha: 0.5,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseVal: Math.random() * Math.PI
      });
    }
  };

  const onMouseMove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  };

  const onMouseLeave = () => {
    mouse.x = null;
    mouse.y = null;
  };

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  document.addEventListener('mouseleave', onMouseLeave);

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    const mouseRadius = 140;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Ambient continuous loop drift
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around viewport edges
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      // Subtle breathing luminescence
      p.pulseVal += p.pulseSpeed;
      p.alpha = p.baseAlpha + Math.sin(p.pulseVal) * 0.15;

      // Interactive mouse deflection & golden laser connection
      if (mouse.x !== null && mouse.y !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouseRadius && dist > 0) {
          const force = (mouseRadius - dist) / mouseRadius;
          const angle = Math.atan2(dy, dx);
          p.x += Math.cos(angle) * force * 2.5;
          p.y += Math.sin(angle) * force * 2.5;

          // Delicate connecting surveyor line to cursor
          ctx.strokeStyle = `rgba(217, 154, 67, ${(1 - dist / mouseRadius) * 0.35})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      }

      // Constellation coordinates to close neighbors
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist2 < 75) {
          ctx.strokeStyle = `rgba(217, 154, 67, ${(1 - dist2 / 75) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Render glowing coordinate particle
      ctx.save();
      ctx.globalAlpha = Math.max(0.1, Math.min(1, p.alpha));
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(217, 154, 67, 0.45)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (!document.hidden) {
      animId = requestAnimationFrame(draw);
    }
  };

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(draw);
    }
  });

  window.addEventListener('resize', () => {
    clearTimeout(window.__particleResizeTimer);
    window.__particleResizeTimer = setTimeout(resize, 150);
  });

  resize();
  animId = requestAnimationFrame(draw);
}
