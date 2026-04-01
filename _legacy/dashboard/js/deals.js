/* ============================================
   WRHWFOUR Dashboard — Deals Tracker
   ============================================ */

const Deals = {
  stages: [
    { id: 'discovery', label: 'Discovery' },
    { id: 'proposal', label: 'Proposal' },
    { id: 'negotiation', label: 'Negotiation' },
    { id: 'closed-won', label: 'Closed Won' },
    { id: 'closed-lost', label: 'Closed Lost' }
  ],

  render() {
    const deals = DataStore.getAll('deals');
    const openDeals = deals.filter(d => !['closed-won', 'closed-lost'].includes(d.stage));
    const wonValue = deals.filter(d => d.stage === 'closed-won').reduce((s, d) => s + (d.value || 0), 0);
    const pipelineValue = openDeals.reduce((s, d) => s + (d.value || 0), 0);
    const avgProbability = openDeals.length ? Math.round(openDeals.reduce((s, d) => s + (d.probability || 0), 0) / openDeals.length) : 0;

    return `
      <div class="page-header">
        <h1>Deals</h1>
        <div class="page-header-actions">
          <button class="btn btn-primary" onclick="Deals.openAddModal()">
            <span class="material-icons-outlined">add</span> New Deal
          </button>
        </div>
      </div>

      <div class="stats-grid">
        ${UI.StatCard('monetization_on', 'Pipeline Value', UI.formatCurrency(pipelineValue), null, '#3b82f6')}
        ${UI.StatCard('emoji_events', 'Won Revenue', UI.formatCurrency(wonValue), null, '#22c55e')}
        ${UI.StatCard('trending_up', 'Open Deals', openDeals.length, null, '#f59e0b')}
        ${UI.StatCard('speed', 'Avg. Probability', avgProbability + '%', null, '#8b5cf6')}
      </div>

      <div class="card" style="margin-bottom:20px">
        <div class="card-header-row">
          <span class="card-title">Pipeline Stages</span>
        </div>
        <div style="display:flex;gap:4px;height:28px;border-radius:var(--radius-md);overflow:hidden">
          ${this.stages.filter(s => s.id !== 'closed-lost').map(s => {
            const count = deals.filter(d => d.stage === s.id).length;
            const val = deals.filter(d => d.stage === s.id).reduce((r, d) => r + (d.value || 0), 0);
            const pct = pipelineValue + wonValue > 0 ? Math.max((val / (pipelineValue + wonValue)) * 100, 8) : 25;
            const colors = { discovery: '#06b6d4', proposal: '#3b82f6', negotiation: '#f59e0b', 'closed-won': '#22c55e' };
            return `<div style="width:${pct}%;background:${colors[s.id] || '#5a5e76'};display:flex;align-items:center;justify-content:center;font-size:0.68rem;font-weight:700;color:#fff;border-radius:4px" title="${s.label}: ${UI.formatCurrency(val)} (${count})">${count}</div>`;
          }).join('')}
        </div>
      </div>

      ${UI.DataTable(
        [
          { key: 'title', label: 'Deal', render: (v, item) => `<div style="font-weight:600;color:var(--text-primary)">${v}</div><div style="font-size:0.72rem;color:var(--text-muted)">${item.client || ''}</div>` },
          { key: 'service', label: 'Service', render: v => `<span class="tag">${v || '—'}</span>` },
          { key: 'value', label: 'Value', render: v => `<span style="font-weight:700;color:var(--success)">${UI.formatCurrency(v)}</span>` },
          { key: 'stage', label: 'Stage', render: v => {
            const colors = { discovery: 'info', proposal: 'primary', negotiation: 'warning', 'closed-won': 'success', 'closed-lost': 'error' };
            return UI.Badge(v.replace('closed-', ''), colors[v] || 'default');
          }},
          { key: 'probability', label: 'Probability', render: v => `
            <div style="display:flex;align-items:center;gap:8px">
              <div style="flex:1;height:6px;background:var(--bg-surface);border-radius:3px;max-width:80px">
                <div style="width:${v || 0}%;height:100%;background:var(--accent);border-radius:3px;transition:width 0.3s"></div>
              </div>
              <span style="font-size:0.78rem;font-weight:600">${v || 0}%</span>
            </div>` },
          { key: 'closeDate', label: 'Close Date', render: v => UI.formatDate(v) }
        ],
        deals,
        item => `
          <button class="btn btn-ghost btn-sm btn-icon-only" onclick="Deals.openEditModal('${item.id}')" title="Edit">
            <span class="material-icons-outlined" style="font-size:1rem">edit</span>
          </button>
          <button class="btn btn-ghost btn-sm btn-icon-only" onclick="Deals.deleteDeal('${item.id}')" title="Delete" style="color:var(--error)">
            <span class="material-icons-outlined" style="font-size:1rem">delete</span>
          </button>
        `
      )}
    `;
  },

  afterRender() {},

  refresh() {
    const content = document.getElementById('page-content');
    if (content) { content.innerHTML = this.render(); this.afterRender(); }
  },

  openAddModal() {
    const contacts = DataStore.getAll('contacts');
    const content = `
      <div class="form-grid">
        <div class="form-group full-width"><label>Deal Title *</label><input type="text" id="d-title" placeholder="e.g. CCTV Setup — 50 Cameras"></div>
        <div class="form-group"><label>Client</label><input type="text" id="d-client"></div>
        <div class="form-group">
          <label>Linked Contact</label>
          <select id="d-contact"><option value="">— None —</option>${contacts.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label>Service</label>
          <select id="d-service"><option>CCTV</option><option>Server</option><option>Networking</option><option>AMC</option><option>Biometric</option><option>Hardware</option><option>Computer Sales</option></select>
        </div>
        <div class="form-group"><label>Value (₹)</label><input type="number" id="d-value" placeholder="500000"></div>
        <div class="form-group"><label>Probability (%)</label><input type="number" id="d-prob" value="30" min="0" max="100"></div>
        <div class="form-group"><label>Expected Close Date</label><input type="date" id="d-close"></div>
      </div>`;
    const actions = `
      <button class="btn btn-outline" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="Deals.saveNew()"><span class="material-icons-outlined">save</span> Save Deal</button>`;
    UI.openModal('New Deal', content, actions);
  },

  saveNew() {
    const title = document.getElementById('d-title')?.value.trim();
    if (!title) { UI.toast('Deal title is required', 'error'); return; }
    DataStore.create('deals', {
      title,
      client: document.getElementById('d-client')?.value.trim(),
      contactId: document.getElementById('d-contact')?.value,
      service: document.getElementById('d-service')?.value,
      value: parseInt(document.getElementById('d-value')?.value) || 0,
      probability: parseInt(document.getElementById('d-prob')?.value) || 0,
      closeDate: document.getElementById('d-close')?.value,
      stage: 'discovery'
    });
    UI.closeModal();
    UI.toast('Deal created!', 'success');
    this.refresh();
  },

  openEditModal(id) {
    const d = DataStore.getById('deals', id);
    if (!d) return;
    const contacts = DataStore.getAll('contacts');
    const content = `
      <div class="form-grid">
        <div class="form-group full-width"><label>Deal Title *</label><input type="text" id="d-title" value="${d.title || ''}"></div>
        <div class="form-group"><label>Client</label><input type="text" id="d-client" value="${d.client || ''}"></div>
        <div class="form-group">
          <label>Linked Contact</label>
          <select id="d-contact"><option value="">— None —</option>${contacts.map(c => `<option value="${c.id}" ${d.contactId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label>Service</label>
          <select id="d-service">${['CCTV','Server','Networking','AMC','Biometric','Hardware','Computer Sales'].map(s=>`<option ${d.service===s?'selected':''}>${s}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label>Stage</label>
          <select id="d-stage">${this.stages.map(s => `<option value="${s.id}" ${d.stage === s.id ? 'selected' : ''}>${s.label}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label>Value (₹)</label><input type="number" id="d-value" value="${d.value || ''}"></div>
        <div class="form-group"><label>Probability (%)</label><input type="number" id="d-prob" value="${d.probability || 0}" min="0" max="100"></div>
        <div class="form-group"><label>Expected Close Date</label><input type="date" id="d-close" value="${d.closeDate || ''}"></div>
      </div>`;
    const actions = `
      <button class="btn btn-outline" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="Deals.saveEdit('${id}')"><span class="material-icons-outlined">save</span> Update</button>`;
    UI.openModal('Edit Deal', content, actions);
  },

  saveEdit(id) {
    const title = document.getElementById('d-title')?.value.trim();
    if (!title) { UI.toast('Title is required', 'error'); return; }
    DataStore.update('deals', id, {
      title,
      client: document.getElementById('d-client')?.value.trim(),
      contactId: document.getElementById('d-contact')?.value,
      service: document.getElementById('d-service')?.value,
      stage: document.getElementById('d-stage')?.value,
      value: parseInt(document.getElementById('d-value')?.value) || 0,
      probability: parseInt(document.getElementById('d-prob')?.value) || 0,
      closeDate: document.getElementById('d-close')?.value
    });
    UI.closeModal();
    UI.toast('Deal updated', 'success');
    this.refresh();
  },

  deleteDeal(id) {
    UI.confirm('Delete this deal?', () => {
      DataStore.delete('deals', id);
      UI.toast('Deal deleted', 'success');
      this.refresh();
    });
  }
};
