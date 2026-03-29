/* ============================================
   WRHWFOUR PRIVATE LIMITED — Landing Page JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  function getRuntimeConfig() {
    return window.SiteConfigRuntime?.getCurrentConfig?.() || null;
  }

  function firstConfiguredValue(value, fallback = '') {
    if (Array.isArray(value)) {
      const match = value.find(item => typeof item === 'string' && item.trim());
      return match || fallback;
    }
    return typeof value === 'string' && value.trim() ? value : fallback;
  }

  function buildLeadMessage(data) {
    const lines = [
      'New WRHW enquiry',
      `Name: ${data.name || '-'}`,
      `Company: ${data.company || '-'}`,
      `Phone: ${data.phone || '-'}`,
      `Email: ${data.email || '-'}`,
      `Service: ${data.service || '-'}`,
      `Message: ${data.message || '-'}`
    ];

    return lines.join('\n');
  }

  function routeLead(data) {
    const config = getRuntimeConfig();
    const domMailLink = document.querySelector('a[href^="mailto:"]');
    const domWhatsAppLink = document.querySelector('a[href*="wa.me/"]');
    const domEmail = domMailLink?.getAttribute('href')?.replace(/^mailto:/, '') || 'contact@wrhwfour.com';
    const domWhatsApp = domWhatsAppLink?.getAttribute('href')?.match(/wa\.me\/(\d+)/)?.[1] || '';
    const whatsappNumber = config?.social?.whatsappNumber || domWhatsApp;
    const emailAddress = firstConfiguredValue(config?.contact?.emails, domEmail);
    const message = buildLeadMessage(data);
    const subject = encodeURIComponent(`New enquiry from ${data.name || 'Website Visitor'}`);
    const body = encodeURIComponent(message);
    const sanitizedWhatsApp = String(whatsappNumber || '').replace(/[^\d]/g, '');

    if (sanitizedWhatsApp) {
      const whatsappUrl = `https://wa.me/${sanitizedWhatsApp}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener');
      return {
        ok: true,
        channel: 'whatsapp',
        detail: 'WhatsApp opened with the enquiry details.'
      };
    }

    if (emailAddress) {
      window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
      return {
        ok: true,
        channel: 'email',
        detail: 'Your email app was opened with the enquiry details.'
      };
    }

    return {
      ok: false,
      channel: 'none',
      detail: 'No WhatsApp number or email is configured for lead routing.'
    };
  }

  // --- Navbar Scroll Effect ---
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  function handleScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to Top visibility
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
      if (window.scrollY > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- Mobile Menu Toggle ---
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
      // Animate hamburger to X
      const spans = navToggle.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when clicking a link
    const mobileLinks = navLinks.querySelectorAll('a:not(.nav-cta)');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // --- Smooth Scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    const targetSelector = anchor.getAttribute('href');
    if (!targetSelector || targetSelector === '#') {
      return;
    }

    anchor.addEventListener('click', function (e) {
      let target;

      try {
        target = document.querySelector(targetSelector);
      } catch (error) {
        return;
      }

      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Back to Top ---
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Intersection Observer for Fade-in Animations ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
    observer.observe(el);
  });

  // --- Counter Animations ---
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1500;
    const start = performance.now();

    function update(timestamp) {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.floor(eased * target);
      el.textContent = prefix + current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // --- Inquiry Form Handling ---
  const form = document.getElementById('inquiry-form');
  const formSuccess = document.getElementById('form-success');
  const formSuccessText = formSuccess?.querySelector('p');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const fields = form.querySelectorAll('[required]');
      let valid = true;

      fields.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = 'var(--error)';
          field.addEventListener('input', () => {
            field.style.borderColor = 'transparent';
          }, { once: true });
        }
      });

      // Email validation
      const emailField = form.querySelector('#email');
      if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
          valid = false;
          emailField.style.borderColor = 'var(--error)';
        }
      }

      // Phone validation
      const phoneField = form.querySelector('#phone');
      if (phoneField && phoneField.value) {
        const phoneRegex = /^[\d\s+\-()]{7,15}$/;
        if (!phoneRegex.test(phoneField.value)) {
          valid = false;
          phoneField.style.borderColor = 'var(--error)';
        }
      }

      if (valid) {
        // Collect form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
          data[key] = value;
        });

        const leadRoute = routeLead(data);
        if (!leadRoute.ok) {
          const fallbackEmail = getRuntimeConfig()?.contact?.emails?.[0] || 'contact@wrhwfour.com';
          window.alert(`Lead routing is not configured. Please update your contact email or WhatsApp number. Current fallback: ${fallbackEmail}`);
          return;
        }

        // Show success message
        form.style.display = 'none';
        if (formSuccessText) {
          formSuccessText.textContent = leadRoute.detail;
        }
        formSuccess.classList.add('show');

        // Reset after 5s
        setTimeout(() => {
          form.reset();
          form.style.display = 'block';
          if (formSuccessText) {
            formSuccessText.textContent = 'Our solution architect will contact you within 2 business hours. We look forward to partnering with you.';
          }
          formSuccess.classList.remove('show');
        }, 5000);
      }
    });
  }

  // --- Active Nav Link Highlight ---
  const sections = document.querySelectorAll('section[id]');
  function highlightNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);

      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.style.color = '';
          link.classList.add('active-link');
        } else {
          link.classList.remove('active-link');
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  // --- Service Card Stagger ---
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 80}ms`;
  });

  // --- Typing Effect for Hero (subtle) ---
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) {
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(20px)';
    setTimeout(() => {
      heroTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      heroTitle.style.opacity = '1';
      heroTitle.style.transform = 'translateY(0)';
    }, 200);
  }

  // --- WhatsApp tooltip auto-show ---
  const whatsappFab = document.querySelector('.whatsapp-fab');
  if (whatsappFab) {
    setTimeout(() => {
      const tooltip = whatsappFab.querySelector('.fab-tooltip');
      if (tooltip) {
        tooltip.style.opacity = '1';
        setTimeout(() => {
          tooltip.style.opacity = '';
        }, 3000);
      }
    }, 4000);
  }

  // --- Year in Footer ---
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
