/* ============================================
   WRHWFOUR Dashboard — Tasks Module
   ============================================ */

const Tasks = {
  filterStatus: '',
  filterPriority: '',

  render() {
    const tasks = this.getFiltered();
    const pending = DataStore.getAll('tasks').filter(t => t.status === 'pending').length;
    const inProgress = DataStore.getAll('tasks').filter(t => t.status === 'in-progress').length;
    const completed = DataStore.getAll('tasks').filter(t => t.status === 'completed').length;

    return `
      <div class="page-header">
        <h1>Tasks</h1>
        <div class="page-header-actions">
          <button class="btn btn-primary" onclick="Tasks.openAddModal()">
            <span class="material-icons-outlined">add_task</span> New Task
          </button>
        </div>
      </div>

      <div class="stats-grid">
        ${UI.StatCard('pending_actions', 'Pending', pending, null, '#f59e0b')}
        ${UI.StatCard('sync', 'In Progress', inProgress, null, '#3b82f6')}
        ${UI.StatCard('check_circle', 'Completed', completed, null, '#22c55e')}
      </div>

      <div class="filter-bar">
        <select class="search-input" style="max-width:160px;padding-left:14px" onchange="Tasks.filterStatus=this.value;Tasks.refresh()">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select class="search-input" style="max-width:160px;padding-left:14px" onchange="Tasks.filterPriority=this.value;Tasks.refresh()">
          <option value="">All Priority</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      ${UI.DataTable(
        [
          { key: 'title', label: 'Task', render: (v, item) => `<div style="font-weight:600;color:var(--text-primary)">${v}</div><div style="font-size:0.72rem;color:var(--text-muted)">${item.category || ''}</div>` },
          { key: 'priority', label: 'Priority', render: v => {
            const colors = { urgent: 'error', high: 'warning', medium: 'primary', low: 'default' };
            return UI.Badge(v, colors[v] || 'default');
          }},
          { key: 'status', label: 'Status', render: v => {
            const colors = { pending: 'warning', 'in-progress': 'primary', completed: 'success' };
            return UI.Badge(v, colors[v] || 'default');
          }},
          { key: 'dueDate', label: 'Due Date', render: (v) => {
            const isOverdue = v && new Date(v) < new Date() ;
            return `<span style="${isOverdue ? 'color:var(--error);font-weight:600' : ''}">${UI.formatDate(v)}</span>`;
          }},
          { key: 'createdAt', label: 'Created', render: v => UI.timeAgo(v) }
        ],
        tasks,
        item => `
          ${item.status !== 'completed' ? `<button class="btn btn-ghost btn-sm btn-icon-only" onclick="Tasks.markDone('${item.id}')" title="Complete" style="color:var(--success)">
            <span class="material-icons-outlined" style="font-size:1rem">check_circle</span>
          </button>` : ''}
          <button class="btn btn-ghost btn-sm btn-icon-only" onclick="Tasks.openEditModal('${item.id}')" title="Edit">
            <span class="material-icons-outlined" style="font-size:1rem">edit</span>
          </button>
          <button class="btn btn-ghost btn-sm btn-icon-only" onclick="Tasks.deleteTask('${item.id}')" title="Delete" style="color:var(--error)">
            <span class="material-icons-outlined" style="font-size:1rem">delete</span>
          </button>
        `
      )}
    `;
  },

  afterRender() {},

  getFiltered() {
    let items = DataStore.getAll('tasks');
    if (this.filterStatus) items = items.filter(t => t.status === this.filterStatus);
    if (this.filterPriority) items = items.filter(t => t.priority === this.filterPriority);
    return items.sort((a, b) => {
      const pOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return (pOrder[a.priority] || 9) - (pOrder[b.priority] || 9);
    });
  },

  refresh() {
    const content = document.getElementById('page-content');
    if (content) { content.innerHTML = this.render(); this.afterRender(); }
  },

  openAddModal() {
    const contacts = DataStore.getAll('contacts');
    const content = `
      <div class="form-grid">
        <div class="form-group full-width"><label>Task Title *</label><input type="text" id="t-title"></div>
        <div class="form-group">
          <label>Priority</label>
          <select id="t-priority"><option value="medium">Medium</option><option value="urgent">Urgent</option><option value="high">High</option><option value="low">Low</option></select>
        </div>
        <div class="form-group">
          <label>Category</label>
          <select id="t-category"><option>Follow-up</option><option>Site Visit</option><option>Quotation</option><option>Installation</option><option>Support</option></select>
        </div>
        <div class="form-group"><label>Due Date</label><input type="date" id="t-due"></div>
        <div class="form-group">
          <label>Linked Contact</label>
          <select id="t-contact"><option value="">— None —</option>${contacts.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}</select>
        </div>
        <div class="form-group full-width"><label>Notes</label><textarea id="t-notes" rows="3"></textarea></div>
      </div>`;
    const actions = `
      <button class="btn btn-outline" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="Tasks.saveNew()"><span class="material-icons-outlined">save</span> Save Task</button>`;
    UI.openModal('New Task', content, actions);
  },

  saveNew() {
    const title = document.getElementById('t-title')?.value.trim();
    if (!title) { UI.toast('Title is required', 'error'); return; }
    DataStore.create('tasks', {
      title,
      priority: document.getElementById('t-priority')?.value || 'medium',
      category: document.getElementById('t-category')?.value,
      dueDate: document.getElementById('t-due')?.value,
      contactId: document.getElementById('t-contact')?.value,
      notes: document.getElementById('t-notes')?.value.trim(),
      status: 'pending'
    });
    UI.closeModal();
    UI.toast('Task created!', 'success');
    this.refresh();
  },

  openEditModal(id) {
    const t = DataStore.getById('tasks', id);
    if (!t) return;
    const contacts = DataStore.getAll('contacts');
    const content = `
      <div class="form-grid">
        <div class="form-group full-width"><label>Task Title *</label><input type="text" id="t-title" value="${t.title || ''}"></div>
        <div class="form-group">
          <label>Priority</label>
          <select id="t-priority">${['urgent','high','medium','low'].map(p=>`<option ${t.priority===p?'selected':''}>${p}</option>`).join('')}</select>
        </div>
        <div class="form-group">
          <label>Category</label>
          <select id="t-category">${['Follow-up','Site Visit','Quotation','Installation','Support'].map(c=>`<option ${t.category===c?'selected':''}>${c}</option>`).join('')}</select>
        </div>
        <div class="form-group">
          <label>Status</label>
          <select id="t-status">${['pending','in-progress','completed'].map(s=>`<option ${t.status===s?'selected':''}>${s}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label>Due Date</label><input type="date" id="t-due" value="${t.dueDate || ''}"></div>
        <div class="form-group">
          <label>Linked Contact</label>
          <select id="t-contact"><option value="">— None —</option>${contacts.map(c => `<option value="${c.id}" ${t.contactId===c.id?'selected':''}>${c.name}</option>`).join('')}</select>
        </div>
        <div class="form-group full-width"><label>Notes</label><textarea id="t-notes" rows="3">${t.notes || ''}</textarea></div>
      </div>`;
    const actions = `
      <button class="btn btn-outline" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="Tasks.saveEdit('${id}')"><span class="material-icons-outlined">save</span> Update</button>`;
    UI.openModal('Edit Task', content, actions);
  },

  saveEdit(id) {
    const title = document.getElementById('t-title')?.value.trim();
    if (!title) { UI.toast('Title is required', 'error'); return; }
    DataStore.update('tasks', id, {
      title,
      priority: document.getElementById('t-priority')?.value,
      category: document.getElementById('t-category')?.value,
      status: document.getElementById('t-status')?.value,
      dueDate: document.getElementById('t-due')?.value,
      contactId: document.getElementById('t-contact')?.value,
      notes: document.getElementById('t-notes')?.value.trim()
    });
    UI.closeModal();
    UI.toast('Task updated', 'success');
    this.refresh();
  },

  markDone(id) {
    DataStore.update('tasks', id, { status: 'completed' });
    UI.toast('Task completed! ✓', 'success');
    this.refresh();
  },

  deleteTask(id) {
    UI.confirm('Delete this task?', () => {
      DataStore.delete('tasks', id);
      UI.toast('Task deleted', 'success');
      this.refresh();
    });
  }
};
