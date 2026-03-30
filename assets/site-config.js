/* ============================================
   WRHWFOUR Landing Page Runtime Config
   ============================================ */

(function () {
  const STORAGE_KEY = 'wrhw_siteConfig';
  let currentConfig = null;

  function query(selector, root = document) {
    return root.querySelector(selector);
  }

  function queryAll(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  function normalizeArray(value) {
    return Array.isArray(value) ? value.filter(Boolean) : [];
  }

  function firstValue(value, fallback = '') {
    if (Array.isArray(value)) {
      return value.find(isNonEmptyString) || fallback;
    }
    return isNonEmptyString(value) ? value : fallback;
  }

  function formatAddress(address) {
    if (!address || typeof address !== 'object') return '';
    return [
      address.street,
      address.city,
      address.state,
      address.pincode,
      address.country
    ].filter(isNonEmptyString).join(', ');
  }

  function formatHeadline(hero) {
    if (!isNonEmptyString(hero?.headline)) return '';
    const headline = hero.headline;
    const accentText = hero.accentText;

    if (!isNonEmptyString(accentText) || headline.includes('<span')) {
      return headline;
    }

    const accentMarkup = `<span class="accent">${escapeHtml(accentText)}</span>`;
    const escapedAccent = accentText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return headline.replace(new RegExp(escapedAccent), accentMarkup);
  }

  function setNodeText(selector, value) {
    const node = query(selector);
    if (node && isNonEmptyString(value)) node.textContent = value;
  }

  function setNodeHtml(selector, value) {
    const node = query(selector);
    if (node && isNonEmptyString(value)) node.innerHTML = value;
  }

  function setNodeAttr(selector, attr, value) {
    const node = query(selector);
    if (node && isNonEmptyString(value)) node.setAttribute(attr, value);
  }

  function hexToRgb(hex) {
    const normalized = hex.replace('#', '');
    const fullHex = normalized.length === 3
      ? normalized.split('').map(char => char + char).join('')
      : normalized;
    const intVal = Number.parseInt(fullHex, 16);
    return {
      r: (intVal >> 16) & 255,
      g: (intVal >> 8) & 255,
      b: intVal & 255
    };
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b]
      .map(value => Math.max(0, Math.min(255, value)).toString(16).padStart(2, '0'))
      .join('');
  }

  function shiftColor(hex, amount) {
    if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex || '')) return hex;
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(r + amount, g + amount, b + amount);
  }

  function getContrastColor(hex) {
    if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex || '')) return '#ffffff';
    const { r, g, b } = hexToRgb(hex);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 160 ? '#0f172a' : '#ffffff';
  }

  function ensureFooterCompanyName() {
    const footerBrand = query('.footer-brand');
    const logo = query('.footer-brand .nav-logo');
    if (!footerBrand || !logo) return null;

    let companyName = query('.footer-company-name', footerBrand);
    if (!companyName) {
      companyName = document.createElement('div');
      companyName.className = 'footer-company-name';
      logo.insertAdjacentElement('afterend', companyName);
    }

    return companyName;
  }

  function buildWhatsAppLink(number, message) {
    const sanitized = String(number || '').replace(/[^\d]/g, '');
    if (!sanitized) return '#';
    return `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`;
  }

  function applySeo(config) {
    const seo = config.seo || {};
    const branding = config.branding || {};
    const companyName = branding.companyFullName || branding.companyName;

    if (isNonEmptyString(seo.title)) document.title = seo.title;
    setNodeAttr('meta[name="description"]', 'content', seo.description);
    setNodeAttr('meta[name="keywords"]', 'content', seo.keywords);
    setNodeAttr('meta[name="author"]', 'content', companyName);
    setNodeAttr('link[rel="canonical"]', 'href', seo.canonicalUrl);
    setNodeAttr('meta[property="og:title"]', 'content', seo.title);
    setNodeAttr('meta[property="og:description"]', 'content', seo.description);
    setNodeAttr('meta[property="og:url"]', 'content', seo.canonicalUrl);
    setNodeAttr('meta[property="og:image"]', 'content', seo.ogImage);
    setNodeAttr('meta[name="twitter:title"]', 'content', seo.title);
    setNodeAttr('meta[name="twitter:description"]', 'content', seo.description);
  }

  function applyBranding(config) {
    const branding = config.branding || {};
    const companyDisplayName = branding.companyName || branding.companyFullName;
    const logoPath = branding.logoPath;
    const faviconPath = branding.faviconPath || logoPath;
    const primaryColor = branding.primaryColor;

    if (isNonEmptyString(companyDisplayName)) {
      const footerCompanyName = ensureFooterCompanyName();
      if (footerCompanyName) footerCompanyName.textContent = companyDisplayName;
      const navLogo = query('.navbar .nav-logo');
      if (navLogo) navLogo.setAttribute('aria-label', `${companyDisplayName} Home`);
    }

    if (isNonEmptyString(branding.tagline)) {
      const footerCopy = query('.footer-brand > p');
      if (footerCopy) footerCopy.textContent = branding.tagline;
    }

    if (isNonEmptyString(logoPath)) {
      queryAll('.nav-logo img, .footer-brand .nav-logo img').forEach(img => {
        img.src = logoPath;
      });
    }

    if (isNonEmptyString(faviconPath)) {
      setNodeAttr('link[rel="icon"]', 'href', faviconPath);
    }

    if (isNonEmptyString(primaryColor) && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(primaryColor)) {
      const rootStyle = document.documentElement.style;
      rootStyle.setProperty('--primary', primaryColor);
      rootStyle.setProperty('--primary-container', shiftColor(primaryColor, 26));
      rootStyle.setProperty('--primary-light', shiftColor(primaryColor, 42));
      rootStyle.setProperty('--on-primary', getContrastColor(primaryColor));
    }

    if (isNonEmptyString(branding.fontFamily)) {
      document.body.style.fontFamily = `'${branding.fontFamily}', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
    }
  }

  function applyHero(config) {
    const hero = config.hero || {};
    const services = normalizeArray(config.services);

    setNodeText('.hero-badge span:last-child', hero.badgeText);
    setNodeHtml('.hero h1', formatHeadline(hero));
    setNodeText('.hero-subtitle', hero.subtitle);

    const primaryButton = query('#hero-cta-primary');
    if (primaryButton) {
      const icon = hero.primaryCTA?.icon || 'headset_mic';
      const text = hero.primaryCTA?.text || 'Get a Free Consultation';
      primaryButton.innerHTML = `<span class="material-icons-outlined btn-icon">${escapeHtml(icon)}</span>${escapeHtml(text)}`;
      if (isNonEmptyString(hero.primaryCTA?.link)) primaryButton.href = hero.primaryCTA.link;
    }

    const secondaryButton = query('#hero-cta-whatsapp');
    if (secondaryButton) {
      const iconHtml = secondaryButton.querySelector('svg')?.outerHTML || '';
      const text = hero.secondaryCTA?.text || 'Talk on WhatsApp';
      secondaryButton.innerHTML = `${iconHtml}${escapeHtml(text)}`;
      if (isNonEmptyString(hero.secondaryCTA?.link)) secondaryButton.href = hero.secondaryCTA.link;
    }

    const stats = normalizeArray(hero.stats);
    queryAll('.hero-stat').forEach((statEl, index) => {
      const stat = stats[index];
      if (!stat) return;
      const numberEl = query('.stat-number', statEl);
      const labelEl = query('.stat-label', statEl);
      if (numberEl) {
        numberEl.dataset.count = stat.number ?? 0;
        numberEl.dataset.suffix = stat.suffix || '';
        numberEl.textContent = `${stat.number ?? 0}${stat.suffix || ''}`;
      }
      if (labelEl) labelEl.textContent = stat.label || '';
    });

    const heroServices = query('.hero-service-list');
    if (heroServices && services.length) {
      heroServices.innerHTML = services.slice(0, 5).map(service => `
        <div class="hero-service-item">
          <div class="service-check">&#10003;</div>
          <span class="service-text">${escapeHtml(service.title || 'Service')}</span>
        </div>
      `).join('');
    }
  }

  function applyServices(config) {
    const services = normalizeArray(config.services);
    const serviceGrid = query('.services-grid');
    if (!serviceGrid || !services.length) return;

    serviceGrid.innerHTML = services.map(service => {
      const serviceId = escapeHtml(service.id || String(Date.now()));
      const serviceTitle = escapeHtml(service.title || 'Service');
      const serviceDescription = escapeHtml(service.description || '');
      const serviceIcon = escapeHtml(service.icon || 'build');
      const servicePage = escapeHtml(service.page || '#contact');

      return `
        <div class="service-card fade-in" id="service-${serviceId}">
          <div class="service-icon">
            <span class="material-icons-outlined">${serviceIcon}</span>
          </div>
          <h3>${serviceTitle}</h3>
          <p>${serviceDescription}</p>
          <a href="${servicePage}" class="service-link">
            Learn More <span class="material-icons-outlined">arrow_forward</span>
          </a>
        </div>
      `;
    }).join('');
  }

  function applyTestimonials(config) {
    const testimonials = normalizeArray(config.testimonials);
    const grid = query('.testimonials-grid');
    if (!grid || !testimonials.length) return;

    grid.innerHTML = testimonials.map(testimonial => {
      const rating = Math.max(1, Math.min(5, Number(testimonial.rating) || 5));
      const stars = new Array(rating).fill('&#9733;').join('');
      return `
        <div class="testimonial-card fade-in">
          <div class="testimonial-quote">"</div>
          <div class="testimonial-rating">${new Array(rating).fill('<span class="star">&#9733;</span>').join('')}</div>
          <p>${escapeHtml(testimonial.text || '')}</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar">${escapeHtml(testimonial.initials || 'NA')}</div>
            <div class="testimonial-info">
              <div class="author-name">${escapeHtml(testimonial.author || 'Client')}</div>
              <div class="author-role">${escapeHtml(testimonial.role || '')}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function applyClientLogos(config) {
    const logos = normalizeArray(config.clientLogos);
    const strip = query('.logo-strip');
    if (!strip || !logos.length) return;

    strip.innerHTML = logos.map(logo => `<span class="client-logo">${escapeHtml(logo)}</span>`).join('');
  }

  function applyFooter(config) {
    const branding = config.branding || {};
    const contact = config.contact || {};
    const social = config.social || {};
    const footer = config.footer || {};
    const companyName = branding.companyName || branding.companyFullName || 'WRHWFOUR';
    const phone = firstValue(contact.phones);
    const email = firstValue(contact.emails);
    const address = formatAddress(contact.address);

    const footerCompanyName = ensureFooterCompanyName();
    if (footerCompanyName) footerCompanyName.textContent = companyName;

    const footerContactItems = queryAll('.footer-col .footer-contact-item');
    if (footerContactItems[0] && isNonEmptyString(address)) {
      const addressNode = query('p', footerContactItems[0]);
      if (addressNode) addressNode.textContent = address;
    }
    if (footerContactItems[1] && isNonEmptyString(email)) {
      const emailLink = query('a', footerContactItems[1]);
      if (emailLink) {
        emailLink.textContent = email;
        emailLink.href = `mailto:${email}`;
      }
    }
    if (footerContactItems[2] && isNonEmptyString(phone)) {
      const phoneLink = query('a', footerContactItems[2]);
      if (phoneLink) {
        phoneLink.textContent = phone;
        phoneLink.href = `tel:${phone.replace(/[^\d+]/g, '')}`;
      }
    }

    if (isNonEmptyString(contact.mapEmbedUrl)) {
      setNodeAttr('.footer-map iframe', 'src', contact.mapEmbedUrl);
    }

    const socialLinks = queryAll('.footer-social a');
    const socialMap = [social.linkedin, social.instagram, social.facebook, social.google];
    socialLinks.forEach((link, index) => {
      if (isNonEmptyString(socialMap[index])) link.href = socialMap[index];
    });

    const whatsappLink = buildWhatsAppLink(social.whatsappNumber, 'Hi WRHWFOUR, I need IT support');
    const floatingWhatsapp = query('#whatsapp-fab');
    if (floatingWhatsapp && whatsappLink !== '#') floatingWhatsapp.href = whatsappLink;

    const secondaryButton = query('#hero-cta-whatsapp');
    if (secondaryButton && !isNonEmptyString(config.hero?.secondaryCTA?.link) && whatsappLink !== '#') {
      secondaryButton.href = whatsappLink;
    }

    const footerBottomCopy = query('.footer-bottom p');
    if (footerBottomCopy && isNonEmptyString(footer.copyrightText)) {
      footerBottomCopy.innerHTML = `&copy; <span id="footer-year">${new Date().getFullYear()}</span> ${escapeHtml(footer.copyrightText)}`;
    }

    const footerBottomLinks = queryAll('.footer-bottom p a');
    if (footerBottomLinks[0] && isNonEmptyString(footer.privacyPolicyUrl)) {
      footerBottomLinks[0].href = footer.privacyPolicyUrl;
    }
    if (footerBottomLinks[1] && isNonEmptyString(footer.termsUrl)) {
      footerBottomLinks[1].href = footer.termsUrl;
    }
  }

  function applyConfig(config) {
    if (!config || typeof config !== 'object') return;
    currentConfig = config;

    applySeo(config);
    applyBranding(config);
    applyHero(config);
    applyServices(config);
    applyTestimonials(config);
    applyClientLogos(config);
    applyFooter(config);
  }

  async function loadConfig() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        applyConfig(parsed);
        return parsed;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    try {
      const response = await fetch('/api/public/site-config', { cache: 'no-store' });
      if (!response.ok) return null;
      const config = await response.json();
      applyConfig(config);
      return config;
    } catch {
      return null;
    }
  }

  window.SiteConfigRuntime = {
    applyConfig,
    loadConfig,
    getCurrentConfig: () => currentConfig
  };

  window.addEventListener('storage', event => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try {
      applyConfig(JSON.parse(event.newValue));
    } catch {
      // Ignore malformed updates from other tabs.
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      void loadConfig();
    });
  } else {
    void loadConfig();
  }
})();
