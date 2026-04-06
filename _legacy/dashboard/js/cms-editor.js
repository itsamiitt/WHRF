/* ============================================
   WRHWFOUR Dashboard — CMS / Landing Page Editor
   ============================================ */

const CMSEditor = {
  config: null,
  activeTab: 0,
  previewDevice: 'desktop',

  saveConfig(syncPreview = true) {
    DataStore.saveSiteConfig(this.config);
    if (syncPreview) this.syncPreview();
  },

  async loadConfig() {
    this.config = DataStore.getSiteConfig();
    if (!this.config) {
      try {
        const resp = await fetch('../data/site-config.json');
        this.config = await resp.json();
      } catch {
        this.config = this.getDefaultConfig();
      }
      this.saveConfig(false);
    }
  },

  getDefaultConfig() {
    return {
      branding: { companyName: 'WRHWFOUR', companyFullName: 'WRHWFOUR Private Limited', logoPath: 'assets/images/logo.png', faviconPath: 'assets/images/logo.png', primaryColor: '#3b82f6', fontFamily: 'Manrope' },
      contact: { address: { street: '8th Floor, World Trade Centre', city: 'Pune', state: 'Maharashtra', pincode: '411014', country: 'India' }, phones: ['+91-XXXXXXXXXX'], emails: ['contact@wrhwfour.com'], mapEmbedUrl: '', businessHours: 'Mon-Sat, 9:00 AM - 6:00 PM IST' },
      social: { linkedin: '#', instagram: '#', facebook: '#', google: '#', whatsappNumber: '91XXXXXXXXXX' },
      hero: { badgeText: 'Trusted IT Partner — Serving Pan India', headline: 'Pan-India IT Sales, Support & Infrastructure Services for Businesses', subtitle: 'Expert corporate IT solutions...', primaryCTA: { text: 'Get a Free Consultation', link: '#contact' }, secondaryCTA: { text: 'Talk on WhatsApp', link: '#' }, stats: [{ number: 500, suffix: '+', label: 'Clients Served' }, { number: 28, suffix: '+', label: 'Cities Covered' }, { number: 98, suffix: '%', label: 'Uptime SLA' }] },
      services: [],
      testimonials: [],
      seo: { title: '', description: '', keywords: '', canonicalUrl: 'https://wrhwfour.com/', ogImage: '' },
      footer: { copyrightText: 'WRHWFOUR Private Limited. All rights reserved.' }
    };
  },

  render() {
    if (!this.config) return '<div style="padding:40px;text-align:center;color:var(--text-muted)">Loading config...</div>';

    const tabs = [
      { icon: 'palette', label: 'Branding' },
      { icon: 'location_on', label: 'Contact' },
      { icon: 'share', label: 'Social' },
      { icon: 'auto_awesome', label: 'Hero' },
      { icon: 'grid_view', label: 'Services' },
      { icon: 'format_quote', label: 'Testimonials' },
      { icon: 'search', label: 'SEO' },
      { icon: 'code', label: 'Footer' }
    ];

    return `
      <div class="page-header">
        <h1>Landing Page Editor</h1>
        <div class="page-header-actions">
          <button class="btn btn-secondary" onclick="CMSEditor.exportConfig()">
            <span class="material-icons-outlined">download</span> Export JSON
          </button>
          <button class="btn btn-primary" onclick="CMSEditor.publishChanges()">
            <span class="material-icons-outlined">publish</span> Save Changes
          </button>
        </div>
      </div>

      <div class="cms-layout">
        <div class="cms-editor-panel">
          <div class="tab-bar" style="padding:0 12px;position:sticky;top:0;background:var(--bg-card);z-index:5">
            ${tabs.map((t, i) => `
              <button class="tab-btn ${i === this.activeTab ? 'active' : ''}" onclick="CMSEditor.switchTab(${i})">
                <span class="material-icons-outlined">${t.icon}</span>${t.label}
              </button>
            `).join('')}
          </div>
          <div style="padding:20px" id="cms-tab-content">
            ${this.renderTabContent(this.activeTab)}
          </div>
        </div>

        <div class="cms-preview-panel">
          <div class="cms-preview-bar">
            <span style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);margin-right:auto">Live Preview</span>
            <button class="device-btn ${this.previewDevice === 'desktop' ? 'active' : ''}" onclick="CMSEditor.setDevice('desktop')">
              <span class="material-icons-outlined" style="font-size:1rem">desktop_windows</span> Desktop
            </button>
            <button class="device-btn ${this.previewDevice === 'tablet' ? 'active' : ''}" onclick="CMSEditor.setDevice('tablet')">
              <span class="material-icons-outlined" style="font-size:1rem">tablet</span> Tablet
            </button>
            <button class="device-btn ${this.previewDevice === 'mobile' ? 'active' : ''}" onclick="CMSEditor.setDevice('mobile')">
              <span class="material-icons-outlined" style="font-size:1rem">phone_iphone</span> Mobile
            </button>
          </div>
          <iframe id="cms-preview-iframe" class="cms-preview-iframe" src="../index.html"
            style="max-width:${this.previewDevice === 'mobile' ? '390px' : this.previewDevice === 'tablet' ? '768px' : '100%'}"></iframe>
        </div>
      </div>
    `;
  },

  renderTabContent(tabIndex) {
    const c = this.config;
    switch (tabIndex) {
      case 0: return this.renderBranding(c);
      case 1: return this.renderContact(c);
      case 2: return this.renderSocial(c);
      case 3: return this.renderHero(c);
      case 4: return this.renderServices(c);
      case 5: return this.renderTestimonials(c);
      case 6: return this.renderSEO(c);
      case 7: return this.renderFooter(c);
      default: return '';
    }
  },

  renderBranding(c) {
    const b = c.branding || {};
    return `
      <h3 style="font-size:0.95rem;font-weight:700;margin-bottom:16px">General / Branding</h3>
      <div class="form-grid">
        <div class="form-group"><label>Company Name</label><input type="text" id="cms-companyName" value="${b.companyName || ''}" onchange="CMSEditor.updateField('branding.companyName', this.value)"></div>
        <div class="form-group"><label>Full Company Name</label><input type="text" id="cms-companyFull" value="${b.companyFullName || ''}" onchange="CMSEditor.updateField('branding.companyFullName', this.value)"></div>
        <div class="form-group">
          <label>Logo</label>
          <div class="file-upload-area">
            ${b.logoPath ? `<img src="../${b.logoPath}" class="file-upload-preview" id="logo-preview">` : ''}
            <input type="file" accept="image/*" onchange="CMSEditor.handleFileUpload(this, 'branding.logoPath', 'logo-preview')">
            <div class="file-upload-label">Click or drag to upload logo</div>
          </div>
        </div>
        <div class="form-group">
          <label>Favicon</label>
          <div class="file-upload-area">
            ${b.faviconPath ? `<img src="../${b.faviconPath}" class="file-upload-preview" id="favicon-preview">` : ''}
            <input type="file" accept="image/*" onchange="CMSEditor.handleFileUpload(this, 'branding.faviconPath', 'favicon-preview')">
            <div class="file-upload-label">Click or drag to upload favicon</div>
          </div>
        </div>
        <div class="form-group">
          <label>Primary Color</label>
          <div class="color-picker-group">
            <div class="color-preview" style="background:${b.primaryColor || '#3b82f6'}" onclick="document.getElementById('cms-color').click()" id="color-box"></div>
            <input type="color" id="cms-color" value="${b.primaryColor || '#3b82f6'}" onchange="CMSEditor.updateField('branding.primaryColor', this.value);document.getElementById('color-box').style.background=this.value">
            <input type="text" value="${b.primaryColor || '#3b82f6'}" style="width:100px" onchange="CMSEditor.updateField('branding.primaryColor', this.value);document.getElementById('cms-color').value=this.value;document.getElementById('color-box').style.background=this.value">
          </div>
        </div>
        <div class="form-group">
          <label>Font Family</label>
          <select onchange="CMSEditor.updateField('branding.fontFamily', this.value)">
            ${['Manrope', 'Inter', 'Roboto', 'Poppins', 'Open Sans', 'Lato', 'Outfit', 'Plus Jakarta Sans'].map(f => `<option ${b.fontFamily === f ? 'selected' : ''}>${f}</option>`).join('')}
          </select>
        </div>
      </div>`;
  },

  renderContact(c) {
    const ct = c.contact || {};
    const addr = ct.address || {};
    return `
      <h3 style="font-size:0.95rem;font-weight:700;margin-bottom:16px">Contact Details</h3>
      <div class="form-grid">
        <div class="form-group full-width"><label>Street Address</label><input type="text" value="${addr.street || ''}" onchange="CMSEditor.updateField('contact.address.street', this.value)"></div>
        <div class="form-group"><label>City</label><input type="text" value="${addr.city || ''}" onchange="CMSEditor.updateField('contact.address.city', this.value)"></div>
        <div class="form-group"><label>State</label><input type="text" value="${addr.state || ''}" onchange="CMSEditor.updateField('contact.address.state', this.value)"></div>
        <div class="form-group"><label>Pincode</label><input type="text" value="${addr.pincode || ''}" onchange="CMSEditor.updateField('contact.address.pincode', this.value)"></div>
        <div class="form-group"><label>Country</label><input type="text" value="${addr.country || ''}" onchange="CMSEditor.updateField('contact.address.country', this.value)"></div>
        <div class="form-group full-width"><label>Phone Number(s)</label><input type="text" value="${(ct.phones || []).join(', ')}" onchange="CMSEditor.updateField('contact.phones', this.value.split(',').map(s=>s.trim()))"></div>
        <div class="form-group full-width"><label>Email(s)</label><input type="text" value="${(ct.emails || []).join(', ')}" onchange="CMSEditor.updateField('contact.emails', this.value.split(',').map(s=>s.trim()))"></div>
        <div class="form-group full-width"><label>Google Maps Embed URL</label><input type="url" value="${ct.mapEmbedUrl || ''}" onchange="CMSEditor.updateField('contact.mapEmbedUrl', this.value)"></div>
        <div class="form-group full-width"><label>Business Hours</label><input type="text" value="${ct.businessHours || ''}" onchange="CMSEditor.updateField('contact.businessHours', this.value)"></div>
      </div>`;
  },

  renderSocial(c) {
    const s = c.social || {};
    return `
      <h3 style="font-size:0.95rem;font-weight:700;margin-bottom:16px">Social Media Links</h3>
      <div class="form-grid">
        <div class="form-group full-width"><label>LinkedIn URL</label><input type="url" value="${s.linkedin || ''}" onchange="CMSEditor.updateField('social.linkedin', this.value)"></div>
        <div class="form-group full-width"><label>Instagram URL</label><input type="url" value="${s.instagram || ''}" onchange="CMSEditor.updateField('social.instagram', this.value)"></div>
        <div class="form-group full-width"><label>Facebook URL</label><input type="url" value="${s.facebook || ''}" onchange="CMSEditor.updateField('social.facebook', this.value)"></div>
        <div class="form-group full-width"><label>Google Business URL</label><input type="url" value="${s.google || ''}" onchange="CMSEditor.updateField('social.google', this.value)"></div>
        <div class="form-group full-width"><label>WhatsApp Number (with country code)</label><input type="tel" value="${s.whatsappNumber || ''}" onchange="CMSEditor.updateField('social.whatsappNumber', this.value)"></div>
      </div>`;
  },

  renderHero(c) {
    const h = c.hero || {};
    const stats = h.stats || [];
    return `
      <h3 style="font-size:0.95rem;font-weight:700;margin-bottom:16px">Hero Section</h3>
      <div class="form-grid">
        <div class="form-group full-width"><label>Badge Text</label><input type="text" value="${h.badgeText || ''}" onchange="CMSEditor.updateField('hero.badgeText', this.value)"></div>
        <div class="form-group full-width"><label>Main Headline</label><textarea rows="3" onchange="CMSEditor.updateField('hero.headline', this.value)">${h.headline || ''}</textarea></div>
        <div class="form-group full-width"><label>Subtitle</label><textarea rows="3" onchange="CMSEditor.updateField('hero.subtitle', this.value)">${h.subtitle || ''}</textarea></div>
        <div class="form-group"><label>Primary CTA Text</label><input type="text" value="${h.primaryCTA?.text || ''}" onchange="CMSEditor.updateField('hero.primaryCTA.text', this.value)"></div>
        <div class="form-group"><label>Primary CTA Link</label><input type="text" value="${h.primaryCTA?.link || ''}" onchange="CMSEditor.updateField('hero.primaryCTA.link', this.value)"></div>
        <div class="form-group"><label>Secondary CTA Text</label><input type="text" value="${h.secondaryCTA?.text || ''}" onchange="CMSEditor.updateField('hero.secondaryCTA.text', this.value)"></div>
        <div class="form-group"><label>Secondary CTA Link</label><input type="text" value="${h.secondaryCTA?.link || ''}" onchange="CMSEditor.updateField('hero.secondaryCTA.link', this.value)"></div>
      </div>
      <h4 style="font-size:0.85rem;font-weight:700;margin:20px 0 12px;padding-top:12px;border-top:1px solid var(--border)">Stats</h4>
      ${stats.map((stat, i) => `
        <div style="display:flex;gap:10px;align-items:end;margin-bottom:10px">
          <div class="form-group" style="flex:1"><label>Number</label><input type="number" value="${stat.number || ''}" onchange="CMSEditor.updateStat(${i}, 'number', parseInt(this.value))"></div>
          <div class="form-group" style="width:60px"><label>Suffix</label><input type="text" value="${stat.suffix || ''}" onchange="CMSEditor.updateStat(${i}, 'suffix', this.value)"></div>
          <div class="form-group" style="flex:1"><label>Label</label><input type="text" value="${stat.label || ''}" onchange="CMSEditor.updateStat(${i}, 'label', this.value)"></div>
        </div>
      `).join('')}`;
  },

  renderServices(c) {
    const services = c.services || [];
    return `
      <h3 style="font-size:0.95rem;font-weight:700;margin-bottom:16px">Services</h3>
      <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:16px">Add, edit, or reorder the service cards shown on the landing page.</p>
      <div id="cms-services-list">
        ${services.map((s, i) => `
          <div style="background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--radius-md);padding:14px;margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
              <span style="font-weight:600;font-size:0.88rem"><span class="material-icons-outlined" style="font-size:1rem;vertical-align:middle">${s.icon || 'build'}</span> ${s.title}</span>
              <button class="btn btn-ghost btn-sm" onclick="CMSEditor.removeService(${i})" style="color:var(--error)"><span class="material-icons-outlined" style="font-size:1rem">delete</span></button>
            </div>
            <div class="form-grid">
              <div class="form-group"><label>Icon</label><input type="text" value="${s.icon || ''}" onchange="CMSEditor.updateService(${i}, 'icon', this.value)" placeholder="material icon name"></div>
              <div class="form-group"><label>Title</label><input type="text" value="${s.title || ''}" onchange="CMSEditor.updateService(${i}, 'title', this.value)"></div>
              <div class="form-group full-width"><label>Description</label><textarea rows="2" onchange="CMSEditor.updateService(${i}, 'description', this.value)">${s.description || ''}</textarea></div>
            </div>
          </div>
        `).join('')}
      </div>
      <button class="btn btn-secondary" onclick="CMSEditor.addService()"><span class="material-icons-outlined">add</span> Add Service</button>`;
  },

  renderTestimonials(c) {
    const testimonials = c.testimonials || [];
    return `
      <h3 style="font-size:0.95rem;font-weight:700;margin-bottom:16px">Testimonials</h3>
      <div id="cms-testimonials-list">
        ${testimonials.map((t, i) => `
          <div style="background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--radius-md);padding:14px;margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
              <span style="font-weight:600;font-size:0.88rem">${t.author || 'New Testimonial'}</span>
              <button class="btn btn-ghost btn-sm" onclick="CMSEditor.removeTestimonial(${i})" style="color:var(--error)"><span class="material-icons-outlined" style="font-size:1rem">delete</span></button>
            </div>
            <div class="form-grid">
              <div class="form-group full-width"><label>Quote</label><textarea rows="2" onchange="CMSEditor.updateTestimonial(${i}, 'text', this.value)">${t.text || ''}</textarea></div>
              <div class="form-group"><label>Author</label><input type="text" value="${t.author || ''}" onchange="CMSEditor.updateTestimonial(${i}, 'author', this.value)"></div>
              <div class="form-group"><label>Role / Company</label><input type="text" value="${t.role || ''}" onchange="CMSEditor.updateTestimonial(${i}, 'role', this.value)"></div>
              <div class="form-group"><label>Initials</label><input type="text" value="${t.initials || ''}" maxlength="2" onchange="CMSEditor.updateTestimonial(${i}, 'initials', this.value)" style="width:60px"></div>
              <div class="form-group"><label>Rating (1-5)</label><input type="number" value="${t.rating || 5}" min="1" max="5" onchange="CMSEditor.updateTestimonial(${i}, 'rating', parseInt(this.value))"></div>
            </div>
          </div>
        `).join('')}
      </div>
      <button class="btn btn-secondary" onclick="CMSEditor.addTestimonial()"><span class="material-icons-outlined">add</span> Add Testimonial</button>`;
  },

  renderSEO(c) {
    const s = c.seo || {};
    return `
      <h3 style="font-size:0.95rem;font-weight:700;margin-bottom:16px">SEO Settings</h3>
      <div class="form-grid">
        <div class="form-group full-width"><label>Page Title</label><input type="text" value="${s.title || ''}" onchange="CMSEditor.updateField('seo.title', this.value)"></div>
        <div class="form-group full-width"><label>Meta Description</label><textarea rows="3" onchange="CMSEditor.updateField('seo.description', this.value)">${s.description || ''}</textarea></div>
        <div class="form-group full-width"><label>Keywords (comma separated)</label><input type="text" value="${s.keywords || ''}" onchange="CMSEditor.updateField('seo.keywords', this.value)"></div>
        <div class="form-group full-width"><label>Canonical URL</label><input type="url" value="${s.canonicalUrl || ''}" onchange="CMSEditor.updateField('seo.canonicalUrl', this.value)"></div>
        <div class="form-group">
          <label>OG Image</label>
          <div class="file-upload-area">
            <input type="file" accept="image/*" onchange="CMSEditor.handleFileUpload(this, 'seo.ogImage', 'og-preview')">
            <div class="file-upload-label">Upload OG Image (1200x630 recommended)</div>
          </div>
        </div>
      </div>`;
  },

  renderFooter(c) {
    const f = c.footer || {};
    return `
      <h3 style="font-size:0.95rem;font-weight:700;margin-bottom:16px">Footer</h3>
      <div class="form-grid">
        <div class="form-group full-width"><label>Copyright Text</label><input type="text" value="${f.copyrightText || ''}" onchange="CMSEditor.updateField('footer.copyrightText', this.value)"></div>
        <div class="form-group"><label>Privacy Policy URL</label><input type="text" value="${f.privacyPolicyUrl || ''}" onchange="CMSEditor.updateField('footer.privacyPolicyUrl', this.value)"></div>
        <div class="form-group"><label>Terms of Service URL</label><input type="text" value="${f.termsUrl || ''}" onchange="CMSEditor.updateField('footer.termsUrl', this.value)"></div>
      </div>
      <h4 style="font-size:0.85rem;font-weight:700;margin:20px 0 12px;padding-top:12px;border-top:1px solid var(--border)">Client Logos</h4>
      <div class="form-group">
        <label>Company names (comma separated)</label>
        <input type="text" value="${(c.clientLogos || []).join(', ')}" onchange="CMSEditor.updateField('clientLogos', this.value.split(',').map(s=>s.trim()).filter(Boolean))">
      </div>`;
  },

  // --- Update helpers ---
  updateField(path, value) {
    const keys = path.split('.');
    let obj = this.config;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    this.saveConfig();
  },

  updateStat(index, key, value) {
    if (this.config.hero?.stats?.[index]) {
      this.config.hero.stats[index][key] = value;
      this.saveConfig();
    }
  },

  updateService(index, key, value) {
    if (this.config.services?.[index]) {
      this.config.services[index][key] = value;
      this.saveConfig();
    }
  },

  addService() {
    if (!this.config.services) this.config.services = [];
    this.config.services.push({ id: Date.now().toString(), icon: 'build', title: 'New Service', description: 'Describe this service...' });
    this.saveConfig();
    this.refreshTab();
  },

  removeService(index) {
    this.config.services.splice(index, 1);
    this.saveConfig();
    this.refreshTab();
  },

  updateTestimonial(index, key, value) {
    if (this.config.testimonials?.[index]) {
      this.config.testimonials[index][key] = value;
      this.saveConfig();
    }
  },

  addTestimonial() {
    if (!this.config.testimonials) this.config.testimonials = [];
    this.config.testimonials.push({ text: 'Customer review text...', author: 'New Client', role: 'Position, Company', initials: 'NC', rating: 5 });
    this.saveConfig();
    this.refreshTab();
  },

  removeTestimonial(index) {
    this.config.testimonials.splice(index, 1);
    this.saveConfig();
    this.refreshTab();
  },

  handleFileUpload(input, field, previewId) {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.updateField(field, e.target.result);
      const preview = document.getElementById(previewId);
      if (preview) { preview.src = e.target.result; }
      else {
        const area = input.closest('.file-upload-area');
        if (area) {
          const img = document.createElement('img');
          img.src = e.target.result;
          img.id = previewId;
          img.className = 'file-upload-preview';
          area.insertBefore(img, area.firstChild);
        }
      }
      UI.toast('Image uploaded (stored in browser)', 'success');
    };
    reader.readAsDataURL(file);
  },

  syncPreview() {
    const iframe = document.getElementById('cms-preview-iframe');
    const previewWindow = iframe?.contentWindow;
    if (!iframe) return;

    try {
      if (previewWindow?.SiteConfigRuntime?.applyConfig) {
        const snapshot = JSON.parse(JSON.stringify(this.config));
        previewWindow.SiteConfigRuntime.applyConfig(snapshot);
        return;
      }
    } catch {
      // Fall back to reloading the iframe when direct sync is not available.
    }

    iframe.src = iframe.src;
  },

  switchTab(index) {
    this.activeTab = index;
    this.refreshTab();
    document.querySelectorAll('.cms-editor-panel .tab-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
  },

  refreshTab() {
    const content = document.getElementById('cms-tab-content');
    if (content) content.innerHTML = this.renderTabContent(this.activeTab);
  },

  setDevice(device) {
    this.previewDevice = device;
    const iframe = document.getElementById('cms-preview-iframe');
    if (iframe) {
      iframe.style.maxWidth = device === 'mobile' ? '390px' : device === 'tablet' ? '768px' : '100%';
    }
    document.querySelectorAll('.device-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.trim().toLowerCase().includes(device));
    });
  },

  publishChanges() {
    this.saveConfig();
    UI.toast('Changes saved to browser storage and preview updated.', 'success');
  },

  exportConfig() {
    const json = JSON.stringify(this.config, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'site-config.json'; a.click();
    URL.revokeObjectURL(url);
    UI.toast('Config exported!', 'success');
  },

  async afterRender() {
    if (!this.config) {
      await this.loadConfig();
      this.refresh();
    }
  },

  refresh() {
    const content = document.getElementById('page-content');
    if (content) { content.innerHTML = this.render(); }
  }
};
