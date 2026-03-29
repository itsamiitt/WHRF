/* ============================================
   WRHWFOUR Dashboard — Data Store (localStorage)
   ============================================ */

const DataStore = {
  _prefix: 'wrhw_',

  _key(collection) {
    return this._prefix + collection;
  },

  getAll(collection) {
    try {
      const raw = localStorage.getItem(this._key(collection));
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  },

  _saveAll(collection, items) {
    localStorage.setItem(this._key(collection), JSON.stringify(items));
  },

  getById(collection, id) {
    return this.getAll(collection).find(i => i.id === id) || null;
  },

  create(collection, item) {
    const items = this.getAll(collection);
    item.id = item.id || crypto.randomUUID();
    item.createdAt = item.createdAt || new Date().toISOString();
    item.updatedAt = new Date().toISOString();
    items.push(item);
    this._saveAll(collection, items);
    this._logActivity(collection, 'created', item);
    return item;
  },

  update(collection, id, updates) {
    const items = this.getAll(collection);
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...updates, updatedAt: new Date().toISOString() };
    this._saveAll(collection, items);
    this._logActivity(collection, 'updated', items[idx]);
    return items[idx];
  },

  delete(collection, id) {
    const items = this.getAll(collection);
    const item = items.find(i => i.id === id);
    const filtered = items.filter(i => i.id !== id);
    this._saveAll(collection, filtered);
    if (item) this._logActivity(collection, 'deleted', item);
    return !!item;
  },

  count(collection) {
    return this.getAll(collection).length;
  },

  // --- Site Config (single object, not array) ---
  getSiteConfig() {
    try {
      const raw = localStorage.getItem(this._key('siteConfig'));
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  saveSiteConfig(config) {
    localStorage.setItem(this._key('siteConfig'), JSON.stringify(config));
  },

  // --- Activity Log ---
  _logActivity(collection, action, item) {
    const activities = this.getAll('activities');
    activities.unshift({
      id: crypto.randomUUID(),
      collection,
      action,
      itemId: item.id,
      itemName: item.name || item.title || item.companyName || 'Item',
      timestamp: new Date().toISOString()
    });
    // keep last 200
    if (activities.length > 200) activities.length = 200;
    this._saveAll('activities', activities);
  },

  getActivities(limit = 20) {
    return this.getAll('activities').slice(0, limit);
  },

  // --- Settings ---
  getSetting(key, fallback = null) {
    try {
      const raw = localStorage.getItem(this._prefix + 'setting_' + key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },

  setSetting(key, value) {
    localStorage.setItem(this._prefix + 'setting_' + key, JSON.stringify(value));
  },

  // --- Auth ---
  isLoggedIn() {
    return this.getSetting('loggedIn', false);
  },

  login(password) {
    const stored = this.getSetting('adminPassword', 'admin123');
    if (password === stored) {
      this.setSetting('loggedIn', true);
      return true;
    }
    return false;
  },

  logout() {
    this.setSetting('loggedIn', false);
  },

  // --- Export / Import ---
  exportAll() {
    const data = {};
    ['contacts', 'leads', 'deals', 'tasks', 'activities', 'siteConfig'].forEach(c => {
      data[c] = c === 'siteConfig' ? this.getSiteConfig() : this.getAll(c);
    });
    return JSON.stringify(data, null, 2);
  },

  importAll(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      Object.keys(data).forEach(c => {
        if (c === 'siteConfig') {
          this.saveSiteConfig(data[c]);
        } else {
          this._saveAll(c, data[c]);
        }
      });
      return true;
    } catch { return false; }
  },

  // --- Seed Demo Data ---
  seedDemoData() {
    if (this.count('contacts') > 0) return; // already seeded

    const contacts = [
      { id: crypto.randomUUID(), name: 'Rajesh Kumar', email: 'rajesh@manufacturing.com', phone: '+91 98765 43210', company: 'Manufacturing Corp', tags: ['enterprise', 'amc'], status: 'active' },
      { id: crypto.randomUUID(), name: 'Priya Sharma', email: 'priya@fintechsol.com', phone: '+91 87654 32109', company: 'FinTech Solutions', tags: ['startup', 'networking'], status: 'active' },
      { id: crypto.randomUUID(), name: 'Amit Mehta', email: 'amit@logisticsgroup.co', phone: '+91 76543 21098', company: 'Logistics Group', tags: ['enterprise', 'biometric'], status: 'active' },
      { id: crypto.randomUUID(), name: 'Sunita Patel', email: 'sunita@techstart.io', phone: '+91 65432 10987', company: 'TechStart IO', tags: ['startup', 'cctv'], status: 'active' },
      { id: crypto.randomUUID(), name: 'Vikram Singh', email: 'vikram@retailchain.com', phone: '+91 54321 09876', company: 'Retail Chain India', tags: ['enterprise', 'hardware'], status: 'prospect' },
      { id: crypto.randomUUID(), name: 'Neha Gupta', email: 'neha@edutech.in', phone: '+91 43210 98765', company: 'EduTech India', tags: ['education', 'server'], status: 'active' },
      { id: crypto.randomUUID(), name: 'Arjun Reddy', email: 'arjun@pharmacorp.com', phone: '+91 32109 87654', company: 'PharmaCorp', tags: ['enterprise', 'server'], status: 'prospect' },
      { id: crypto.randomUUID(), name: 'Kavita Joshi', email: 'kavita@mediahub.in', phone: '+91 21098 76543', company: 'MediaHub India', tags: ['media', 'networking'], status: 'active' }
    ];
    contacts.forEach(c => { c.createdAt = new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(); c.updatedAt = c.createdAt; });
    this._saveAll('contacts', contacts);

    const stages = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
    const sources = ['website', 'whatsapp', 'referral', 'cold-call', 'linkedin'];
    const serviceTypes = ['CCTV', 'Server', 'Networking', 'AMC', 'Biometric', 'Hardware', 'Computer Sales'];
    const leads = contacts.slice(0, 6).map((c, i) => ({
      id: crypto.randomUUID(),
      name: c.name,
      company: c.company,
      email: c.email,
      phone: c.phone,
      service: serviceTypes[i % serviceTypes.length],
      stage: stages[i % 4],
      source: sources[i % sources.length],
      value: [25000, 150000, 75000, 500000, 45000, 200000][i],
      score: ['hot', 'warm', 'cold', 'hot', 'warm', 'cold'][i],
      assignedTo: 'Admin',
      notes: '',
      createdAt: new Date(Date.now() - Math.random() * 20 * 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    }));
    this._saveAll('leads', leads);

    const dealStages = ['discovery', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
    const deals = [
      { title: 'CCTV Setup — 50 Cameras', client: 'Manufacturing Corp', contactId: contacts[0].id, value: 450000, stage: 'negotiation', probability: 70, closeDate: '2026-04-15', service: 'CCTV' },
      { title: 'Annual IT AMC — 200 Seats', client: 'FinTech Solutions', contactId: contacts[1].id, value: 1200000, stage: 'proposal', probability: 50, closeDate: '2026-05-01', service: 'AMC' },
      { title: 'Server Room Setup', client: 'Logistics Group', contactId: contacts[2].id, value: 800000, stage: 'discovery', probability: 30, closeDate: '2026-06-01', service: 'Server' },
      { title: 'Biometric System — 3 Branches', client: 'TechStart IO', contactId: contacts[3].id, value: 180000, stage: 'closed-won', probability: 100, closeDate: '2026-03-10', service: 'Biometric' },
      { title: 'Network Overhaul', client: 'Retail Chain India', contactId: contacts[4].id, value: 350000, stage: 'negotiation', probability: 60, closeDate: '2026-04-20', service: 'Networking' }
    ].map(d => ({ ...d, id: crypto.randomUUID(), createdAt: new Date(Date.now() - Math.random() * 15 * 86400000).toISOString(), updatedAt: new Date().toISOString() }));
    this._saveAll('deals', deals);

    const priorities = ['urgent', 'high', 'medium', 'low'];
    const categories = ['Follow-up', 'Site Visit', 'Quotation', 'Installation', 'Support'];
    const tasks = [
      { title: 'Follow up with Rajesh on CCTV proposal', contactId: contacts[0].id, priority: 'high', category: 'Follow-up', status: 'pending', dueDate: '2026-03-27' },
      { title: 'Schedule site visit for FinTech office', contactId: contacts[1].id, priority: 'medium', category: 'Site Visit', status: 'pending', dueDate: '2026-03-28' },
      { title: 'Prepare server room quotation', contactId: contacts[2].id, priority: 'urgent', category: 'Quotation', status: 'in-progress', dueDate: '2026-03-26' },
      { title: 'Install biometric at TechStart branch 2', contactId: contacts[3].id, priority: 'high', category: 'Installation', status: 'pending', dueDate: '2026-03-30' },
      { title: 'Resolve printer issue at Retail Chain', contactId: contacts[4].id, priority: 'low', category: 'Support', status: 'completed', dueDate: '2026-03-24' },
      { title: 'Send AMC renewal proposal to EduTech', contactId: contacts[5].id, priority: 'medium', category: 'Follow-up', status: 'pending', dueDate: '2026-04-01' }
    ].map(t => ({ ...t, id: crypto.randomUUID(), notes: '', createdAt: new Date(Date.now() - Math.random() * 10 * 86400000).toISOString(), updatedAt: new Date().toISOString() }));
    this._saveAll('tasks', tasks);

    // Seed some activities
    const activityItems = [
      { collection: 'leads', action: 'created', itemName: 'Rajesh Kumar', timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
      { collection: 'deals', action: 'updated', itemName: 'CCTV Setup — 50 Cameras', timestamp: new Date(Date.now() - 4 * 3600000).toISOString() },
      { collection: 'contacts', action: 'created', itemName: 'Sunita Patel', timestamp: new Date(Date.now() - 6 * 3600000).toISOString() },
      { collection: 'tasks', action: 'created', itemName: 'Follow up with Rajesh', timestamp: new Date(Date.now() - 8 * 3600000).toISOString() },
      { collection: 'deals', action: 'created', itemName: 'Annual IT AMC', timestamp: new Date(Date.now() - 12 * 3600000).toISOString() },
      { collection: 'contacts', action: 'created', itemName: 'Arjun Reddy', timestamp: new Date(Date.now() - 24 * 3600000).toISOString() },
      { collection: 'leads', action: 'updated', itemName: 'Priya Sharma', timestamp: new Date(Date.now() - 36 * 3600000).toISOString() },
      { collection: 'tasks', action: 'created', itemName: 'Prepare server room quotation', timestamp: new Date(Date.now() - 48 * 3600000).toISOString() }
    ].map(a => ({ ...a, id: crypto.randomUUID(), itemId: crypto.randomUUID() }));
    this._saveAll('activities', activityItems);
  }
};
