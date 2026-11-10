/**
 * HAWK PROPERTY SURVEYS - ANIMATIONS & ACCORDIONS
 * IntersectionObserver reveals, stat counters, accordion logic, and filter interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initStatCounters();
  initAccordions();
  initFilters();
});

/* Scroll Reveal Animations */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.service-card, .why-card, .report-card, .guide-card, .process-step, .trust-item'
  );

  animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index % 4 * 0.1}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index % 4 * 0.1}s`;
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}

/* Numeric Stat Counters */
function initStatCounters() {
  const counterElements = document.querySelectorAll('[data-counter]');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-counter'), 10);
        const prefix = entry.target.getAttribute('data-prefix') || '';
        const suffix = entry.target.getAttribute('data-suffix') || '';
        animateValue(entry.target, 0, target, 1500, prefix, suffix);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => observer.observe(el));
}

function animateValue(obj, start, end, duration, prefix, suffix) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeOutQuad = 1 - (1 - progress) * (1 - progress);
    const current = Math.floor(easeOutQuad * (end - start) + start);
    obj.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.textContent = `${prefix}${end.toLocaleString()}${suffix}`;
    }
  };
  window.requestAnimationFrame(step);
}

/* Accordion Component */
function initAccordions() {
  const triggers = document.querySelectorAll('.accordion-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const parentGroup = item.closest('.faq-group') || item.parentElement;
      const isOpen = item.classList.contains('active');

      // Close siblings in same group
      if (parentGroup) {
        parentGroup.querySelectorAll('.accordion-item').forEach(sibling => {
          if (sibling !== item) {
            sibling.classList.remove('active');
            const siblingContent = sibling.querySelector('.accordion-content');
            if (siblingContent) siblingContent.style.maxHeight = null;
          }
        });
      }

      // Toggle current
      if (isOpen) {
        item.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // Open first item by default if exists
  const firstTrigger = document.querySelector('.accordion-item:first-child .accordion-trigger');
  if (firstTrigger) {
    firstTrigger.click();
  }
}

/* Category Filters & Search */
function initFilters() {
  const filterBtns = document.querySelectorAll('[data-filter]');
  const filterItems = document.querySelectorAll('[data-category]');
  const searchInput = document.getElementById('searchFilterInput');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');
        filterItems.forEach(item => {
          const itemCat = item.getAttribute('data-category');
          if (category === 'all' || itemCat.includes(category)) {
            item.style.display = '';
            item.style.opacity = '1';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      filterItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(term)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}
