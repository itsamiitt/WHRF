/* ============================================
   WRHWFOUR Dashboard — Leads Pipeline
   ============================================ */

const Leads = {
  viewMode: 'kanban', // 'kanban' or 'list'

  stages: [
    { id: 'new', label: 'New' },
    { id: 'contacted', label: 'Contacted' },
    { id: 'qualified', label: 'Qualified' },
    { id: 'proposal', label: 'Proposal Sent' },
    { id: 'won', label: 'Won' },
    { id: 'lost', label: 'Lost' }
  ],

  render() {
    const leads = DataStore.getAll('leads');
    return `
      <div class="page-header">
        <h1>Leads Pipeline</h1>
        <div class="page-header-actions">
          <div style="display:flex;border:1px solid var(--border);border-radius:var(--radius-md);overflow:hidden">
            <button class="btn btn-sm ${this.viewMode === 'kanban' ? 'btn-primary' : 'btn-ghost'}" onclick="Leads.setView('kanban')" style="border-radius:0">
              <span class="material-icons-outlined" style="font-size:1rem">view_kanban</span> Board
            </button>
            <button class="btn btn-sm ${this.viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}" onclick="Leads.setView('list')" style="border-radius:0">
              <span class="material-icons-outlined" style="font-size:1rem">list</span> List
            </button>
          </div>
          <button class="btn btn-primary" onclick="Leads.openAddModal()">
            <span class="material-icons-outlined">add</span> Add Lead
          </button>
        </div>
      </div>
      ${this.viewMode === 'kanban' ? this.renderKanban(leads) : this.renderList(leads)}
    `;
  },

  renderKanban(leads) {
    const columns = this.stages.map(stage => ({
      id: stage.id,
      label: stage.label,
      cards: leads.filter(l => l.stage === stage.id)
    }));
    return UI.KanbanBoard(columns);
  },

  renderList(leads) {
    return UI.DataTable(
      [
        { key: 'name', label: 'Name', render: (v, item) => `<div style="font-weight:600;color:var(--text-primary)">${v}</div><div style="font-size:0.72rem;color:var(--text-muted)">${item.company || ''}</div>` },
        { key: 'service', label: 'Service', render: v => `<span class="tag">${v || '—'}</span>` },
        { key: 'stage', label: 'Stage', render: v => UI.Badge(v, v === 'won' ? 'success' : v === 'lost' ? 'error' : 'primary') },
        { key: 'score', label: 'Score', render: v => v ? `<span class="lead-score score-${v}">${v}</span>` : '—' },
        { key: 'source', label: 'Source' },
        { key: 'value', label: 'Value', render: v => `<span style="font-weight:700">${UI.formatCurrency(v)}</span>` },
        { key: 'createdAt', label: 'Created', render: v => UI.timeAgo(v) }
      ],
      leads,
      item => `
        <button class="btn btn-ghost btn-sm btn-icon-only" onclick="Leads.openEditModal('${item.id}')" title="Edit">
          <span class="material-icons-outlined" style="font-size:1rem">edit</span>
        </button>
        <button class="btn btn-ghost btn-sm btn-icon-only" onclick="Leads.deleteLead('${item.id}')" title="Delete" style="color:var(--error)">
          <span class="material-icons-outlined" style="font-size:1rem">delete</span>
        </button>
      `
    );
  },

  afterRender() {
    if (this.viewMode === 'kanban') this.initDragDrop();
  },

  initDragDrop() {
    document.querySelectorAll('.kanban-card').forEach(card => {
      card.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', card.dataset.id);
        card.classList.add('dragging');
      });
      card.addEventListener('dragend', () => card.classList.remove('dragging'));
    });

    document.querySelectorAll('.kanban-cards').forEach(col => {
      col.addEventListener('dragover', e => {
        e.preventDefault();
        col.classList.add('drag-over');
      });
      col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
      col.addEventListener('drop', e => {
        e.preventDefault();
        col.classList.remove('drag-over');
        const leadId = e.dataTransfer.getData('text/plain');
        const newStage = col.dataset.stage;
        DataStore.update('leads', leadId, { stage: newStage });
        UI.toast(`Lead moved to ${newStage}`, 'success');
        this.refresh();
      });
    });
  },

  refresh() {
    const content = document.getElementById('page-content');
    if (content) { content.innerHTML = this.render(); this.afterRender(); }
  },

  setView(mode) {
    this.viewMode = mode;
    this.refresh();
  },

  openAddModal() {
    const services = ['CCTV', 'Server', 'Networking', 'AMC', 'Biometric', 'Hardware', 'Computer Sales'];
    const content = `
      <div class="form-grid">
        <div class="form-group"><label>Name *</label><input type="text" id="l-name"></div>
        <div class="form-group"><label>Company</label><input type="text" id="l-company"></div>
        <div class="form-group"><label>Email</label><input type="email" id="l-email"></div>
        <div class="form-group"><label>Phone</label><input type="tel" id="l-phone"></div>
        <div class="form-group">
          <label>Service</label>
          <select id="l-service">${services.map(s => `<option value="${s}">${s}</option>`).join('')}</select>
        </div>
        <div class="form-group">
          <label>Source</label>
          <select id="l-source">
            <option value="website">Website</option><option value="whatsapp">WhatsApp</option>
            <option value="referral">Referral</option><option value="cold-call">Cold Call</option>
            <option value="linkedin">LinkedIn</option>
          </select>
        </div>
        <div class="form-group"><label>Estimated Value (₹)</label><input type="number" id="l-value" placeholder="50000"></div>
        <div class="form-group">
          <label>Score</label>
          <select id="l-score"><option value="hot">Hot</option><option value="warm" selected>Warm</option><option value="cold">Cold</option></select>
        </div>
      </div>`;
    const actions = `
      <button class="btn btn-outline" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="Leads.saveNew()"><span class="material-icons-outlined">save</span> Save Lead</button>`;
    UI.openModal('Add New Lead', content, actions);
  },

  saveNew() {
    const name = document.getElementById('l-name')?.value.trim();
    if (!name) { UI.toast('Name is required', 'error'); return; }
    DataStore.create('leads', {
      name,
      company: document.getElementById('l-company')?.value.trim(),
      email: document.getElementById('l-email')?.value.trim(),
      phone: document.getElementById('l-phone')?.value.trim(),
      service: document.getElementById('l-service')?.value,
      source: document.getElementById('l-source')?.value,
      value: parseInt(document.getElementById('l-value')?.value) || 0,
      score: document.getElementById('l-score')?.value,
      stage: 'new',
      assignedTo: 'Admin'
    });
    UI.closeModal();
    UI.toast('Lead added!', 'success');
    this.refresh();
  },

  openEditModal(id) {
    const l = DataStore.getById('leads', id);
    if (!l) return;
    const services = ['CCTV', 'Server', 'Networking', 'AMC', 'Biometric', 'Hardware', 'Computer Sales'];
    const content = `
      <div class="form-grid">
        <div class="form-group"><label>Name *</label><input type="text" id="l-name" value="${l.name || ''}"></div>
        <div class="form-group"><label>Company</label><input type="text" id="l-company" value="${l.company || ''}"></div>
        <div class="form-group"><label>Email</label><input type="email" id="l-email" value="${l.email || ''}"></div>
        <div class="form-group"><label>Phone</label><input type="tel" id="l-phone" value="${l.phone || ''}"></div>
        <div class="form-group">
          <label>Service</label>
          <select id="l-service">${services.map(s => `<option value="${s}" ${l.service === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
        </div>
        <div class="form-group">
          <label>Stage</label>
          <select id="l-stage">${this.stages.map(s => `<option value="${s.id}" ${l.stage === s.id ? 'selected' : ''}>${s.label}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label>Estimated Value (₹)</label><input type="number" id="l-value" value="${l.value || ''}"></div>
        <div class="form-group">
          <label>Score</label>
          <select id="l-score"><option value="hot" ${l.score==='hot'?'selected':''}>Hot</option><option value="warm" ${l.score==='warm'?'selected':''}>Warm</option><option value="cold" ${l.score==='cold'?'selected':''}>Cold</option></select>
        </div>
        <div class="form-group full-width"><label>Notes</label><textarea id="l-notes" rows="3">${l.notes || ''}</textarea></div>
      </div>`;
    const actions = `
      <button class="btn btn-outline" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="Leads.saveEdit('${id}')"><span class="material-icons-outlined">save</span> Update</button>`;
    UI.openModal('Edit Lead', content, actions);
  },

  saveEdit(id) {
    const name = document.getElementById('l-name')?.value.trim();
    if (!name) { UI.toast('Name is required', 'error'); return; }
    DataStore.update('leads', id, {
      name,
      company: document.getElementById('l-company')?.value.trim(),
      email: document.getElementById('l-email')?.value.trim(),
      phone: document.getElementById('l-phone')?.value.trim(),
      service: document.getElementById('l-service')?.value,
      stage: document.getElementById('l-stage')?.value,
      value: parseInt(document.getElementById('l-value')?.value) || 0,
      score: document.getElementById('l-score')?.value,
      notes: document.getElementById('l-notes')?.value.trim()
    });
    UI.closeModal();
    UI.toast('Lead updated', 'success');
    this.refresh();
  },

  deleteLead(id) {
    UI.confirm('Are you sure you want to delete this lead?', () => {
      DataStore.delete('leads', id);
      UI.toast('Lead deleted', 'success');
      this.refresh();
    });
  }
};
