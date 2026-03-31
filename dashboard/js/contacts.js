/* ============================================
   WRHWFOUR Dashboard — Contacts Module
   ============================================ */

const Contacts = {
  searchTerm: '',
  filterTag: '',

  render() {
    const contacts = this.getFiltered();
    return `
      <div class="page-header">
        <h1>Contacts</h1>
        <div class="page-header-actions">
          <button class="btn btn-secondary btn-sm" onclick="Contacts.exportCSV()">
            <span class="material-icons-outlined">download</span> Export
          </button>
          <button class="btn btn-primary" onclick="Contacts.openAddModal()">
            <span class="material-icons-outlined">person_add</span> Add Contact
          </button>
        </div>
      </div>

      <div class="filter-bar">
        ${UI.SearchBar('Search contacts...', 'contacts-search')}
        <select id="contacts-filter-tag" class="search-input" style="max-width:180px;padding-left:14px" onchange="Contacts.filterTag=this.value;Contacts.refresh()">
          <option value="">All Tags</option>
          <option value="enterprise">Enterprise</option>
          <option value="startup">Startup</option>
          <option value="education">Education</option>
          <option value="media">Media</option>
        </select>
        <select id="contacts-filter-status" class="search-input" style="max-width:160px;padding-left:14px" onchange="Contacts.filterStatus=this.value;Contacts.refresh()">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="prospect">Prospect</option>
        </select>
      </div>

      ${UI.DataTable(
        [
          { key: 'name', label: 'Name', render: (v, item) => `<div style="font-weight:600;color:var(--text-primary)">${v}</div><div style="font-size:0.72rem;color:var(--text-muted)">${item.email}</div>` },
          { key: 'phone', label: 'Phone' },
          { key: 'company', label: 'Company', render: v => `<span style="color:var(--text-primary)">${v || '—'}</span>` },
          { key: 'tags', label: 'Tags', render: v => (v || []).map(t => `<span class="tag">${t}</span>`).join('') || '—' },
          { key: 'status', label: 'Status', render: v => UI.Badge(v || 'active', v === 'prospect' ? 'warning' : 'success') },
          { key: 'createdAt', label: 'Added', render: v => UI.formatDate(v) }
        ],
        contacts,
        item => `
          <button class="btn btn-ghost btn-sm btn-icon-only" onclick="Contacts.openDetail('${item.id}')" title="View">
            <span class="material-icons-outlined" style="font-size:1rem">visibility</span>
          </button>
          <button class="btn btn-ghost btn-sm btn-icon-only" onclick="Contacts.openEditModal('${item.id}')" title="Edit">
            <span class="material-icons-outlined" style="font-size:1rem">edit</span>
          </button>
          <button class="btn btn-ghost btn-sm btn-icon-only" onclick="Contacts.deleteContact('${item.id}')" title="Delete" style="color:var(--error)">
            <span class="material-icons-outlined" style="font-size:1rem">delete</span>
          </button>
        `,
        { selectable: true }
      )}
    `;
  },

  afterRender() {
    const searchEl = document.getElementById('contacts-search');
    if (searchEl) {
      searchEl.value = this.searchTerm;
      searchEl.addEventListener('input', (e) => {
        this.searchTerm = e.target.value;
        this.refresh();
      });
    }
  },

  getFiltered() {
    let items = DataStore.getAll('contacts');
    if (this.searchTerm) {
      const s = this.searchTerm.toLowerCase();
      items = items.filter(c => c.name?.toLowerCase().includes(s) || c.email?.toLowerCase().includes(s) || c.company?.toLowerCase().includes(s) || c.phone?.includes(s));
    }
    if (this.filterTag) {
      items = items.filter(c => (c.tags || []).includes(this.filterTag));
    }
    if (this.filterStatus) {
      items = items.filter(c => c.status === this.filterStatus);
    }
    return items;
  },

  refresh() {
    const content = document.getElementById('page-content');
    if (content) {
      content.innerHTML = this.render();
      this.afterRender();
    }
  },

  openAddModal() {
    const content = `
      <div class="form-grid">
        <div class="form-group"><label>Full Name *</label><input type="text" id="c-name" required></div>
        <div class="form-group"><label>Email *</label><input type="email" id="c-email" required></div>
        <div class="form-group"><label>Phone</label><input type="tel" id="c-phone"></div>
        <div class="form-group"><label>Company</label><input type="text" id="c-company"></div>
        <div class="form-group"><label>Tags (comma separated)</label><input type="text" id="c-tags" placeholder="enterprise, amc"></div>
        <div class="form-group">
          <label>Status</label>
          <select id="c-status"><option value="active">Active</option><option value="prospect">Prospect</option></select>
        </div>
        <div class="form-group full-width"><label>Notes</label><textarea id="c-notes" rows="3"></textarea></div>
      </div>`;
    const actions = `
      <button class="btn btn-outline" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="Contacts.saveNew()">
        <span class="material-icons-outlined">save</span> Save Contact
      </button>`;
    UI.openModal('Add New Contact', content, actions);
  },

  saveNew() {
    const name = document.getElementById('c-name')?.value.trim();
    const email = document.getElementById('c-email')?.value.trim();
    if (!name || !email) { UI.toast('Name and email are required', 'error'); return; }
    DataStore.create('contacts', {
      name,
      email,
      phone: document.getElementById('c-phone')?.value.trim(),
      company: document.getElementById('c-company')?.value.trim(),
      tags: (document.getElementById('c-tags')?.value || '').split(',').map(t => t.trim()).filter(Boolean),
      status: document.getElementById('c-status')?.value || 'active',
      notes: document.getElementById('c-notes')?.value.trim()
    });
    UI.closeModal();
    UI.toast('Contact added successfully', 'success');
    this.refresh();
  },

  openEditModal(id) {
    const c = DataStore.getById('contacts', id);
    if (!c) return;
    const content = `
      <div class="form-grid">
        <div class="form-group"><label>Full Name *</label><input type="text" id="c-name" value="${c.name || ''}"></div>
        <div class="form-group"><label>Email *</label><input type="email" id="c-email" value="${c.email || ''}"></div>
        <div class="form-group"><label>Phone</label><input type="tel" id="c-phone" value="${c.phone || ''}"></div>
        <div class="form-group"><label>Company</label><input type="text" id="c-company" value="${c.company || ''}"></div>
        <div class="form-group"><label>Tags</label><input type="text" id="c-tags" value="${(c.tags || []).join(', ')}"></div>
        <div class="form-group">
          <label>Status</label>
          <select id="c-status">
            <option value="active" ${c.status === 'active' ? 'selected' : ''}>Active</option>
            <option value="prospect" ${c.status === 'prospect' ? 'selected' : ''}>Prospect</option>
          </select>
        </div>
        <div class="form-group full-width"><label>Notes</label><textarea id="c-notes" rows="3">${c.notes || ''}</textarea></div>
      </div>`;
    const actions = `
      <button class="btn btn-outline" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="Contacts.saveEdit('${id}')">
        <span class="material-icons-outlined">save</span> Update
      </button>`;
    UI.openModal('Edit Contact', content, actions);
  },

  saveEdit(id) {
    const name = document.getElementById('c-name')?.value.trim();
    const email = document.getElementById('c-email')?.value.trim();
    if (!name || !email) { UI.toast('Name and email are required', 'error'); return; }
    DataStore.update('contacts', id, {
      name, email,
      phone: document.getElementById('c-phone')?.value.trim(),
      company: document.getElementById('c-company')?.value.trim(),
      tags: (document.getElementById('c-tags')?.value || '').split(',').map(t => t.trim()).filter(Boolean),
      status: document.getElementById('c-status')?.value,
      notes: document.getElementById('c-notes')?.value.trim()
    });
    UI.closeModal();
    UI.toast('Contact updated', 'success');
    this.refresh();
  },

  deleteContact(id) {
    UI.confirm('Are you sure you want to delete this contact?', () => {
      DataStore.delete('contacts', id);
      UI.toast('Contact deleted', 'success');
      this.refresh();
    });
  },

  openDetail(id) {
    const c = DataStore.getById('contacts', id);
    if (!c) return;
    const deals = DataStore.getAll('deals').filter(d => d.contactId === id);
    const tasks = DataStore.getAll('tasks').filter(t => t.contactId === id);

    const content = `
      <div style="padding-top:16px">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px">
          <div class="sidebar-avatar" style="width:56px;height:56px;font-size:1.2rem">${(c.name || '??').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}</div>
          <div>
            <h3 style="font-size:1.15rem;font-weight:700">${c.name}</h3>
            <div style="color:var(--text-secondary);font-size:0.85rem">${c.company || 'No company'}</div>
          </div>
          ${UI.Badge(c.status || 'active', c.status === 'prospect' ? 'warning' : 'success')}
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">
          <div><div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:4px">Email</div><div style="font-size:0.88rem">${c.email || '—'}</div></div>
          <div><div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:4px">Phone</div><div style="font-size:0.88rem">${c.phone || '—'}</div></div>
          <div><div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:4px">Tags</div><div>${(c.tags || []).map(t=>`<span class="tag">${t}</span>`).join('') || '—'}</div></div>
          <div><div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:4px">Added</div><div style="font-size:0.88rem">${UI.formatDate(c.createdAt)}</div></div>
        </div>

        ${c.notes ? `<div style="margin-bottom:24px"><div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:6px">Notes</div><div style="font-size:0.85rem;color:var(--text-secondary)">${c.notes}</div></div>` : ''}

        <h4 style="font-size:0.88rem;font-weight:700;margin-bottom:12px;padding-top:8px;border-top:1px solid var(--border)">Associated Deals (${deals.length})</h4>
        ${deals.length ? deals.map(d => `
          <div style="padding:10px 0;border-bottom:1px solid var(--border-light);display:flex;justify-content:space-between;align-items:center">
            <div><div style="font-weight:600;font-size:0.85rem">${d.title}</div><div style="font-size:0.72rem;color:var(--text-muted)">${d.service} · ${d.stage}</div></div>
            <span style="font-weight:700;color:var(--success);font-size:0.88rem">${UI.formatCurrency(d.value)}</span>
          </div>
        `).join('') : '<div style="color:var(--text-muted);font-size:0.82rem;padding:8px 0">No deals associated</div>'}

        <h4 style="font-size:0.88rem;font-weight:700;margin:20px 0 12px;padding-top:8px;border-top:1px solid var(--border)">Tasks (${tasks.length})</h4>
        ${tasks.length ? tasks.map(t => `
          <div style="padding:10px 0;border-bottom:1px solid var(--border-light);display:flex;justify-content:space-between;align-items:center">
            <div><div style="font-weight:600;font-size:0.85rem">${t.title}</div><div style="font-size:0.72rem;color:var(--text-muted)">Due: ${UI.formatDate(t.dueDate)}</div></div>
            ${UI.Badge(t.status, t.status === 'completed' ? 'success' : t.status === 'in-progress' ? 'primary' : 'default')}
          </div>
        `).join('') : '<div style="color:var(--text-muted);font-size:0.82rem;padding:8px 0">No tasks associated</div>'}
      </div>
    `;
    UI.openDrawer(content, { width: '520px' });
  },

  exportCSV() {
    const contacts = DataStore.getAll('contacts');
    if (!contacts.length) { UI.toast('No contacts to export', 'warning'); return; }
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Tags', 'Status', 'Created'];
    const rows = contacts.map(c => [c.name, c.email, c.phone, c.company, (c.tags||[]).join(';'), c.status, c.createdAt].map(v => `"${(v||'').replace(/"/g,'""')}"`).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'contacts_export.csv'; a.click();
    URL.revokeObjectURL(url);
    UI.toast('Contacts exported!', 'success');
  }
};
