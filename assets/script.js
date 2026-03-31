/* ============================================
   WRHWFOUR Private Limited - Public Site JS
   ============================================ */

const SiteRuntime = (() => {
  const STORAGE_KEY = 'wrhw_siteConfig';
  const PAGE_PREFIX = location.pathname.includes('/services/') ? '../' : '';
  const DEFAULT_WHATSAPP_TEXT = 'Hi WRHWFOUR, I need IT support';

  let activeConfig = null;

  function safeJSONParse(raw) {
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function getStoredConfig() {
    try {
      return safeJSONParse(localStorage.getItem(STORAGE_KEY));
    } catch {
      return null;
    }
  }

  async function loadConfig() {
    const storedConfig = getStoredConfig();
    if (storedConfig) {
      return storedConfig;
    }

    const candidates = ['data/site-config.json', '../data/site-config.json'];
    for (const candidate of candidates) {
      try {
        const response = await fetch(candidate, { cache: 'no-store' });
        if (response.ok) {
          return await response.json();
        }
      } catch {
        // Ignore failed candidates and keep trying.
      }
    }

    return null;
  }

  function escapeHtml(value = '') {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function richText(value = '') {
    const normalized = String(value).replace(/<br\s*\/?>/gi, '\n');
    return escapeHtml(normalized).replace(/\n/g, '<br>');
  }

  function slugify(value = '') {
    return String(value)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function resolveProjectPath(value = '') {
    if (!value) return '';
    if (/^(https?:|mailto:|tel:|#|data:)/i.test(value)) {
      return value;
    }
    if (value.startsWith('./') || value.startsWith('../')) {
      return value;
    }
    return PAGE_PREFIX + value.replace(/^\/+/, '');
  }

  function normalizePhoneHref(phone = '') {
    const normalized = String(phone).replace(/[^+\d]/g, '');
    return normalized ? `tel:${normalized}` : '#';
  }

  function normalizeWhatsAppNumber(number = '') {
    return String(number).replace(/\D/g, '');
  }

  function buildWhatsAppUrl(number, message = DEFAULT_WHATSAPP_TEXT) {
    const normalized = normalizeWhatsAppNumber(number);
    if (!normalized) return '#';
    return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
  }

  function hexToRgb(hex) {
    const normalized = String(hex).trim().replace('#', '');
    if (!/^[0-9a-f]{6}$/i.test(normalized)) {
      return null;
    }

    return {
      r: parseInt(normalized.slice(0, 2), 16),
      g: parseInt(normalized.slice(2, 4), 16),
      b: parseInt(normalized.slice(4, 6), 16)
    };
  }

  function rgbToHex(r, g, b) {
    const toHex = (value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function mixColors(baseHex, targetHex, amount) {
    const base = hexToRgb(baseHex);
    const target = hexToRgb(targetHex);
    if (!base || !target) {
      return baseHex;
    }

    return rgbToHex(
      base.r + (target.r - base.r) * amount,
      base.g + (target.g - base.g) * amount,
      base.b + (target.b - base.b) * amount
    );
  }

  function setText(target, value) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (element && value !== undefined && value !== null) {
      element.textContent = value;
    }
  }

  function setHtml(target, value) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (element && value !== undefined && value !== null) {
      element.innerHTML = value;
    }
  }

  function updateTheme(config) {
    const branding = config.branding || {};
    const primaryColor = branding.primaryColor || '#002045';
    const fontFamily = branding.fontFamily || 'Manrope';
    const primaryContainer = mixColors(primaryColor, '#0f172a', 0.2);
    const primaryLight = mixColors(primaryColor, '#ffffff', 0.18);
    const primaryFixed = mixColors(primaryColor, '#ffffff', 0.82);
    const primaryFixedDim = mixColors(primaryColor, '#ffffff', 0.62);

    let styleTag = document.getElementById('site-config-overrides');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'site-config-overrides';
      document.head.appendChild(styleTag);
    }

    styleTag.textContent = `
      :root {
        --primary: ${primaryColor};
        --primary-container: ${primaryContainer};
        --primary-light: ${primaryLight};
        --primary-fixed: ${primaryFixed};
        --primary-fixed-dim: ${primaryFixedDim};
      }

      body,
      input,
      textarea,
      select,
      button {
        font-family: '${fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .display-lg,
      .headline-md,
      .page-hero h1,
      .content-section h2,
      .content-section h3,
      .nav-brand,
      .card-title,
      .section-header h2 {
        font-family: '${fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
    `;
  }

  function updateSharedBranding(config) {
    const branding = config.branding || {};
    const companyName = branding.companyName || 'WRHWFOUR';
    const companyFullName = branding.companyFullName || `${companyName} Private Limited`;
    const logoPath = resolveProjectPath(branding.logoPath || 'assets/images/logo.png');
    const faviconPath = resolveProjectPath(branding.faviconPath || branding.logoPath || 'assets/images/logo.png');

    document.querySelectorAll('.nav-brand').forEach((element) => {
      element.textContent = companyName;
    });

    document.querySelectorAll('.nav-logo img').forEach((image) => {
      image.src = logoPath;
      image.alt = `${companyFullName} logo`;
    });

    document.querySelectorAll('link[rel="icon"]').forEach((icon) => {
      icon.href = faviconPath;
    });

    if (document.querySelector('.hero')) {
      document.querySelectorAll('a.nav-logo[href="#"]').forEach((link) => {
        link.setAttribute('href', '#hero');
      });
    }
  }

  function updateSocialLinks(config) {
    const social = config.social || {};
    const linkMap = [
      { labels: ['linkedin'], value: social.linkedin },
      { labels: ['instagram'], value: social.instagram },
      { labels: ['facebook'], value: social.facebook },
      { labels: ['google business', 'google'], value: social.google }
    ];

    linkMap.forEach(({ labels, value }) => {
      if (!value) return;

      document.querySelectorAll('a[aria-label], a[title]').forEach((anchor) => {
        const label = `${anchor.getAttribute('aria-label') || ''} ${anchor.getAttribute('title') || ''}`.toLowerCase();
        if (labels.some((candidate) => label.includes(candidate))) {
          anchor.href = value;
          anchor.target = '_blank';
          anchor.rel = 'noopener';
        }
      });
    });
  }

  function updateContactLinks(config) {
    const contact = config.contact || {};
    const social = config.social || {};
    const phone = (contact.phones || [])[0] || '+91-XXXXXXXXXX';
    const email = (contact.emails || [])[0] || 'contact@wrhwfour.com';
    const address = contact.address || {};
    const formattedAddress = [
      address.street,
      [address.city, address.state].filter(Boolean).join(', '),
      [address.pincode, address.country].filter(Boolean).join(', ')
    ].filter(Boolean).join(', ');
    const whatsappNumber = social.whatsappNumber || normalizeWhatsAppNumber(phone);

    document.querySelectorAll('a[href^="tel:"]').forEach((anchor) => {
      anchor.href = normalizePhoneHref(phone);
      anchor.textContent = phone;
    });

    document.querySelectorAll('a[href^="mailto:"]').forEach((anchor) => {
      anchor.href = `mailto:${email}`;
      anchor.textContent = email;
    });

    document.querySelectorAll('a[href*="wa.me"], .whatsapp-fab').forEach((anchor) => {
      if (anchor.tagName !== 'A') return;
      anchor.href = buildWhatsAppUrl(whatsappNumber);
      anchor.target = '_blank';
      anchor.rel = 'noopener';
    });

    updateSocialLinks(config);

    document.querySelectorAll('.footer .footer-contact-item').forEach((item) => {
      const emailLink = item.querySelector('a[href^="mailto:"]');
      const phoneLink = item.querySelector('a[href^="tel:"]');
      const textNode = item.querySelector('p');

      if (emailLink) {
        emailLink.href = `mailto:${email}`;
        emailLink.textContent = email;
        return;
      }

      if (phoneLink) {
        phoneLink.href = normalizePhoneHref(phone);
        phoneLink.textContent = phone;
        return;
      }

      if (textNode && formattedAddress) {
        textNode.textContent = formattedAddress;
      }
    });

    const footerMap = document.querySelector('.footer-map iframe');
    if (footerMap && contact.mapEmbedUrl) {
      footerMap.src = contact.mapEmbedUrl;
    }

    const contactCards = document.querySelectorAll('.contact-info-card');
    contactCards.forEach((card) => {
      const heading = card.querySelector('h4')?.textContent?.trim().toLowerCase();
      if (!heading) return;

      if (heading.includes('office') && formattedAddress) {
        const paragraph = card.querySelector('p');
        if (paragraph) paragraph.textContent = formattedAddress;
      }

      if (heading === 'phone') {
        const anchor = card.querySelector('a[href^="tel:"]');
        if (anchor) {
          anchor.href = normalizePhoneHref(phone);
          anchor.textContent = phone;
        }
      }

      if (heading === 'email') {
        const anchor = card.querySelector('a[href^="mailto:"]');
        if (anchor) {
          anchor.href = `mailto:${email}`;
          anchor.textContent = email;
        }
      }

      if (heading.includes('whatsapp')) {
        const anchor = card.querySelector('a');
        if (anchor) {
          anchor.href = buildWhatsAppUrl(whatsappNumber);
        }
      }
    });

    const largeMap = document.querySelector('.contact-map-large iframe');
    if (largeMap && contact.mapEmbedUrl) {
      largeMap.src = contact.mapEmbedUrl;
    }
  }

  function renderHeroHeadline(hero = {}) {
    const baseHeadline = hero.headline || 'Pan-India IT Sales, Support & Infrastructure Services for Businesses';
    const accentText = hero.accentText;
    let html = richText(baseHeadline);

    if (accentText && baseHeadline.includes(accentText)) {
      const safeAccent = escapeHtml(accentText);
      html = richText(baseHeadline).replace(safeAccent, `<span class="accent">${safeAccent}</span>`);
    }

    return html;
  }

  function renderHeroButton(label, iconName) {
    return `
      <span class="material-icons-outlined btn-icon">${escapeHtml(iconName)}</span>
      ${escapeHtml(label)}
    `;
  }

  function renderWhatsAppButton(label) {
    return `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
      </svg>
      ${escapeHtml(label)}
    `;
  }

  function updateHomePage(config) {
    if (!document.querySelector('.hero')) {
      return;
    }

    const hero = config.hero || {};
    const about = config.about || {};
    const services = config.services || [];
    const whyUs = config.whyUs || {};
    const testimonials = config.testimonials || [];
    const clientLogos = config.clientLogos || [];
    const social = config.social || {};

    setText('.hero-badge span:last-child', hero.badgeText);
    setHtml('.hero h1', renderHeroHeadline(hero));
    setText('.hero-subtitle', hero.subtitle);

    const primaryCta = document.getElementById('hero-cta-primary');
    if (primaryCta && hero.primaryCTA) {
      primaryCta.href = resolveProjectPath(hero.primaryCTA.link || '#contact');
      primaryCta.innerHTML = renderHeroButton(hero.primaryCTA.text || 'Get a Free Consultation', hero.primaryCTA.icon || 'headset_mic');
    }

    const secondaryCta = document.getElementById('hero-cta-whatsapp');
    if (secondaryCta && hero.secondaryCTA) {
      secondaryCta.href = hero.secondaryCTA.link || buildWhatsAppUrl(social.whatsappNumber);
      secondaryCta.innerHTML = renderWhatsAppButton(hero.secondaryCTA.text || 'Talk on WhatsApp');
    }

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats && Array.isArray(hero.stats) && hero.stats.length) {
      heroStats.innerHTML = hero.stats.map((stat) => `
        <div class="hero-stat">
          <div class="stat-number counter-animate" data-count="${Number(stat.number) || 0}" data-suffix="${escapeHtml(stat.suffix || '')}">0</div>
          <div class="stat-label">${escapeHtml(stat.label || '')}</div>
        </div>
      `).join('');
    }

    setText('.about .label-md', about.label);
    setHtml('.about h2', richText(about.headline || 'Your Partner in Professional IT Infrastructure'));

    const aboutParagraphs = document.querySelectorAll('.about-content p');
    (about.paragraphs || []).slice(0, aboutParagraphs.length).forEach((paragraph, index) => {
      setText(aboutParagraphs[index], paragraph);
    });

    const aboutHighlights = document.querySelector('.about-highlights');
    if (aboutHighlights && Array.isArray(about.highlights) && about.highlights.length) {
      aboutHighlights.innerHTML = about.highlights.map((highlight) => `
        <div class="about-highlight">
          <div class="highlight-icon">
            <span class="material-icons-outlined">${escapeHtml(highlight.icon || 'check_circle')}</span>
          </div>
          <span class="highlight-text">${escapeHtml(highlight.text || '')}</span>
        </div>
      `).join('');
    }

    const yearsEl = document.querySelector('.about-float-card .float-number');
    if (yearsEl && about.yearsExperience !== undefined) {
      yearsEl.dataset.count = Number(about.yearsExperience) || 0;
      yearsEl.textContent = '0';
    }

    const servicesHeader = document.querySelector('.services .section-header');
    if (servicesHeader) {
      setText(servicesHeader.querySelector('.label-md'), 'Enterprise Grade Services');
      setHtml(servicesHeader.querySelector('h2'), 'Comprehensive IT Solutions for<br>Modern Businesses');
    }

    const servicesGrid = document.querySelector('.services-grid');
    if (servicesGrid && services.length) {
      servicesGrid.innerHTML = services.map((service) => {
        const serviceId = service.id || slugify(service.title);
        const serviceLink = `#service-${serviceId}-detail`;
        return `
          <div class="service-card fade-in" id="service-${escapeHtml(serviceId)}">
            <div class="service-icon">
              <span class="material-icons-outlined">${escapeHtml(service.icon || 'build')}</span>
            </div>
            <h3>${escapeHtml(service.title || '')}</h3>
            <p>${escapeHtml(service.description || '')}</p>
            <a href="${serviceLink}" class="service-link">
              View Service <span class="material-icons-outlined">arrow_forward</span>
            </a>
          </div>
        `;
      }).join('');
    }

    setText('.why-us .label-md', whyUs.label);
    setHtml('.why-us h2', richText(whyUs.headline || 'Why Businesses Choose Us'));
    const whySubtitle = document.querySelector('.why-us .section-header p');
    if (whySubtitle && whyUs.subtitle) {
      whySubtitle.textContent = whyUs.subtitle;
    }

    const whyGrid = document.querySelector('.why-grid');
    if (whyGrid && Array.isArray(whyUs.features) && whyUs.features.length) {
      whyGrid.innerHTML = whyUs.features.map((feature) => `
        <div class="why-card fade-in">
          <div class="why-icon">
            <span class="material-icons-outlined">${escapeHtml(feature.icon || 'check_circle')}</span>
          </div>
          <h3>${escapeHtml(feature.title || '')}</h3>
          <p>${escapeHtml(feature.description || '')}</p>
        </div>
      `).join('');
    }

    const testimonialsGrid = document.querySelector('.testimonials-grid');
    if (testimonialsGrid && testimonials.length) {
      testimonialsGrid.innerHTML = testimonials.map((testimonial) => `
        <div class="testimonial-card fade-in">
          <div class="testimonial-quote">"</div>
          <div class="testimonial-rating">${new Array(Math.max(1, Math.min(Number(testimonial.rating) || 5, 5))).fill('<span class="star">&#9733;</span>').join('')}</div>
          <p>${escapeHtml(testimonial.text || '')}</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar">${escapeHtml(testimonial.initials || 'CL')}</div>
            <div class="testimonial-info">
              <div class="author-name">${escapeHtml(testimonial.author || '')}</div>
              <div class="author-role">${escapeHtml(testimonial.role || '')}</div>
            </div>
          </div>
        </div>
      `).join('');
    }

    const logoStrip = document.querySelector('.logo-strip');
    if (logoStrip && clientLogos.length) {
      logoStrip.innerHTML = clientLogos.map((logo) => `<span class="client-logo">${escapeHtml(logo)}</span>`).join('');
    }
  }

  function updateContactPage(config) {
    if (!document.querySelector('.contact-grid')) {
      return;
    }

    const companyName = config.branding?.companyName || 'WRHWFOUR';
    const heroTitle = document.querySelector('.page-hero h1');
    if (heroTitle) {
      heroTitle.innerHTML = `Get in Touch with<br>${escapeHtml(companyName)}`;
    }
  }

  function updateFooter(config) {
    const footer = config.footer || {};
    const companyFullName = config.branding?.companyFullName || 'WRHWFOUR Private Limited';

    const footerBottom = document.querySelector('.footer-bottom p');
    if (footerBottom) {
      footerBottom.innerHTML = `&copy; <span id="footer-year">${new Date().getFullYear()}</span> ${escapeHtml(footer.copyrightText || `${companyFullName}. All rights reserved.`)}`;
    }
  }

  function updateHomeSEO(config) {
    if (!document.querySelector('.hero')) {
      return;
    }

    const seo = config.seo || {};
    const updateMetaTag = (selector, value) => {
      if (!value) return;
      const meta = document.querySelector(selector);
      if (meta) meta.setAttribute('content', value);
    };

    if (seo.title) document.title = seo.title;
    updateMetaTag('meta[name="description"]', seo.description);
    updateMetaTag('meta[name="keywords"]', seo.keywords);
    updateMetaTag('meta[property="og:title"]', seo.title);
    updateMetaTag('meta[property="og:description"]', seo.description);
    updateMetaTag('meta[property="og:url"]', seo.canonicalUrl);
    updateMetaTag('meta[property="og:image"]', resolveProjectPath(seo.ogImage || 'assets/images/og-image.png'));
    updateMetaTag('meta[name="twitter:title"]', seo.title);
    updateMetaTag('meta[name="twitter:description"]', seo.description);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && seo.canonicalUrl) {
      canonical.href = seo.canonicalUrl;
    }
  }

  function refreshDynamicSections() {
    document.querySelectorAll('.service-card').forEach((card, index) => {
      card.style.transitionDelay = `${index * 80}ms`;
    });

    if (typeof window.__WRHWObserveFadeIns === 'function') {
      window.__WRHWObserveFadeIns();
    }

    if (typeof window.__WRHWObserveCounters === 'function') {
      window.__WRHWObserveCounters();
    }
  }

  function applyConfig(config) {
    if (!config) return;

    activeConfig = config;
    updateTheme(config);
    updateSharedBranding(config);
    updateContactLinks(config);
    updateHomePage(config);
    updateContactPage(config);
    updateFooter(config);
    updateHomeSEO(config);
    refreshDynamicSections();
  }

  function initLiveUpdates() {
    window.addEventListener('message', (event) => {
      if (event.data?.type !== 'wrhw-site-config-update' || !event.data.config) {
        return;
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(event.data.config));
      } catch {
        // Ignore storage failures and still update the page.
      }

      applyConfig(event.data.config);
    });
  }

  return {
    applyConfig,
    initLiveUpdates,
    loadConfig,
    resolveProjectPath,
    get activeConfig() {
      return activeConfig;
    }
  };
})();

function createId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `wrhw-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getCollection(collection) {
  try {
    const raw = localStorage.getItem(`wrhw_${collection}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCollection(collection, items) {
  try {
    localStorage.setItem(`wrhw_${collection}`, JSON.stringify(items));
  } catch {
    // Ignore storage failures on unsupported contexts.
  }
}

function saveInquiryToCRM(payload) {
  try {
    const now = new Date().toISOString();
    const contacts = getCollection('contacts');
    const leads = getCollection('leads');
    const activities = getCollection('activities');

    let contact = contacts.find((item) => (
      (payload.email && item.email === payload.email) ||
      (payload.phone && item.phone === payload.phone)
    ));

    if (!contact) {
      contact = {
        id: createId(),
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        company: payload.company,
        tags: ['website'],
        status: 'prospect',
        notes: payload.message || '',
        createdAt: now,
        updatedAt: now
      };
      contacts.unshift(contact);
    } else {
      contact.name = payload.name || contact.name;
      contact.email = payload.email || contact.email;
      contact.phone = payload.phone || contact.phone;
      contact.company = payload.company || contact.company;
      contact.notes = payload.message || contact.notes || '';
      contact.updatedAt = now;
    }

    leads.unshift({
      id: createId(),
      name: payload.name,
      company: payload.company,
      email: payload.email,
      phone: payload.phone,
      service: payload.serviceLabel,
      stage: 'new',
      source: 'website',
      value: 0,
      score: 'warm',
      assignedTo: 'Website',
      notes: payload.message || '',
      createdAt: now,
      updatedAt: now
    });

    activities.unshift({
      id: createId(),
      collection: 'leads',
      action: 'created',
      itemId: createId(),
      itemName: payload.name || 'Website Inquiry',
      timestamp: now
    });

    if (activities.length > 200) {
      activities.length = 200;
    }

    saveCollection('contacts', contacts);
    saveCollection('leads', leads);
    saveCollection('activities', activities);
  } catch {
    // The public form should still succeed even if CRM persistence fails.
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const backToTop = document.getElementById('back-to-top');
  let fadeObserver = null;
  let counterObserver = null;

  SiteRuntime.initLiveUpdates();
  const siteConfig = await SiteRuntime.loadConfig();
  if (siteConfig) {
    SiteRuntime.applyConfig(siteConfig);
  }

  function handleScroll() {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }

    if (backToTop) {
      backToTop.classList.toggle('visible', window.scrollY > 600);
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
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

    navLinks.querySelectorAll('a:not(.nav-cta)').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.querySelectorAll('span').forEach((span) => {
          span.style.transform = 'none';
          span.style.opacity = '1';
        });
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function onAnchorClick(event) {
      const href = this.getAttribute('href');
      if (!href || href === '#') {
        return;
      }

      const target = document.querySelector(href);
      if (!target) {
        return;
      }

      event.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function observeFadeIns() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach((element) => {
        element.classList.add('visible');
      });
      return;
    }

    if (!fadeObserver) {
      fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });
    }

    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach((element) => {
      if (!element.classList.contains('visible')) {
        fadeObserver.observe(element);
      }
    });
  }

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'), 10) || 0;
    const suffix = element.getAttribute('data-suffix') || '';
    const prefix = element.getAttribute('data-prefix') || '';
    const duration = 1500;
    const start = performance.now();

    function update(timestamp) {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      element.textContent = `${prefix}${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = `${prefix}${target}${suffix}`;
      }
    }

    requestAnimationFrame(update);
  }

  function observeCounters() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-count]').forEach(animateCounter);
      return;
    }

    if (!counterObserver) {
      counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
    }

    document.querySelectorAll('[data-count]').forEach((counter) => {
      if (counter.textContent === '0' || counter.classList.contains('counter-animate')) {
        counterObserver.observe(counter);
      }
    });
  }

  window.__WRHWObserveFadeIns = observeFadeIns;
  window.__WRHWObserveCounters = observeCounters;

  observeFadeIns();
  observeCounters();

  const form = document.getElementById('inquiry-form');
  const formSuccess = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = 'var(--error)';
          field.addEventListener('input', () => {
            field.style.borderColor = 'transparent';
          }, { once: true });
        }
      });

      const emailField = form.querySelector('#email');
      if (emailField?.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
          isValid = false;
          emailField.style.borderColor = 'var(--error)';
        }
      }

      const phoneField = form.querySelector('#phone');
      if (phoneField?.value) {
        const phoneRegex = /^[\d\s+\-()]{7,20}$/;
        if (!phoneRegex.test(phoneField.value)) {
          isValid = false;
          phoneField.style.borderColor = 'var(--error)';
        }
      }

      if (!isValid) {
        return;
      }

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      const serviceLabels = {
        cctv: 'CCTV Installation & Maintenance',
        computer: 'Computer / CPU Sales & Repair',
        server: 'Server Installation & Maintenance',
        biometric: 'Biometric Attendance Machines',
        amc: 'Corporate IT AMC',
        networking: 'Networking Solutions',
        hardware: 'Hardware Support',
        other: 'Other / Multiple Services'
      };

      saveInquiryToCRM({
        name: payload.name || '',
        company: payload.company || '',
        phone: payload.phone || '',
        email: payload.email || '',
        message: payload.message || '',
        serviceLabel: serviceLabels[payload.service] || payload.service || 'General Inquiry'
      });

      form.style.display = 'none';
      if (formSuccess) {
        formSuccess.classList.add('show');
      }

      setTimeout(() => {
        form.reset();
        form.style.display = 'block';
        formSuccess?.classList.remove('show');
      }, 5000);
    });
  }

  const sections = document.querySelectorAll('section[id]');
  function highlightNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);

      if (link) {
        link.classList.toggle('active-link', scrollY >= top && scrollY < top + height);
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 80}ms`;
  });

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

  const whatsappFab = document.querySelector('.whatsapp-fab');
  if (whatsappFab) {
    setTimeout(() => {
      const tooltip = whatsappFab.querySelector('.fab-tooltip');
      if (!tooltip) return;
      tooltip.style.opacity = '1';
      setTimeout(() => {
        tooltip.style.opacity = '';
      }, 3000);
    }, 4000);
  }

  const yearElement = document.getElementById('footer-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
