/* ============================================
   WRHWFOUR Dashboard — Reusable UI Components
   ============================================ */

const UI = {
  // --- Stat Card ---
  StatCard(icon, label, value, trend = null, color = 'var(--accent)') {
    const trendHtml = trend !== null ? `
      <span class="stat-trend ${trend >= 0 ? 'up' : 'down'}">
        <span class="material-icons-outlined">${trend >= 0 ? 'trending_up' : 'trending_down'}</span>
        ${Math.abs(trend)}%
      </span>` : '';
    return `
      <div class="stat-card">
        <div class="stat-card-icon" style="background:${color}20;color:${color}">
          <span class="material-icons-outlined">${icon}</span>
        </div>
        <div class="stat-card-body">
          <div class="stat-card-value">${value}</div>
          <div class="stat-card-label">${label}${trendHtml}</div>
        </div>
      </div>`;
  },

  // --- Data Table ---
  DataTable(columns, data, actions = null, options = {}) {
    const id = options.id || 'data-table-' + Math.random().toString(36).substr(2, 6);
    const selectable = options.selectable || false;
    const headerCells = columns.map(col =>
      `<th data-key="${col.key}" ${col.sortable !== false ? 'class="sortable"' : ''}>${col.label}</th>`
    ).join('');
    const actionHeader = actions ? '<th>Actions</th>' : '';
    const checkHeader = selectable ? '<th class="col-check"><input type="checkbox" class="select-all"></th>' : '';

    const rows = data.map(item => {
      const cells = columns.map(col => {
        const val = col.render ? col.render(item[col.key], item) : (item[col.key] || '—');
        return `<td>${val}</td>`;
      }).join('');
      const actionCells = actions ? `<td class="row-actions">${actions(item)}</td>` : '';
      const checkCell = selectable ? `<td class="col-check"><input type="checkbox" data-id="${item.id}"></td>` : '';
      return `<tr data-id="${item.id}">${checkCell}${cells}${actionCells}</tr>`;
    }).join('');

    return `
      <div class="table-wrapper" id="${id}">
        <table class="data-table">
          <thead><tr>${checkHeader}${headerCells}${actionHeader}</tr></thead>
          <tbody>${rows.length ? rows : `<tr><td colspan="${columns.length + (actions ? 1 : 0) + (selectable ? 1 : 0)}" class="empty-state">No data found</td></tr>`}</tbody>
        </table>
      </div>`;
  },

  // --- Modal ---
  Modal(title, content, actions = '', options = {}) {
    const size = options.size || 'md';
    return `
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal modal-${size}">
          <div class="modal-header">
            <h3>${title}</h3>
            <button class="modal-close" onclick="UI.closeModal()">
              <span class="material-icons-outlined">close</span>
            </button>
          </div>
          <div class="modal-body">${content}</div>
          ${actions ? `<div class="modal-footer">${actions}</div>` : ''}
        </div>
      </div>`;
  },

  openModal(title, content, actions = '', options = {}) {
    const existing = document.getElementById('modal-overlay');
    if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', this.Modal(title, content, actions, options));
    requestAnimationFrame(() => {
      document.getElementById('modal-overlay').classList.add('active');
    });
  },

  closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
    }
  },

  // --- Drawer ---
  openDrawer(content, options = {}) {
    const width = options.width || '480px';
    const existing = document.getElementById('drawer-overlay');
    if (existing) existing.remove();
    const html = `
      <div class="drawer-overlay" id="drawer-overlay">
        <div class="drawer" style="width:${width}">
          <button class="drawer-close" onclick="UI.closeDrawer()">
            <span class="material-icons-outlined">close</span>
          </button>
          <div class="drawer-content">${content}</div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    requestAnimationFrame(() => {
      document.getElementById('drawer-overlay').classList.add('active');
    });
  },

  closeDrawer() {
    const overlay = document.getElementById('drawer-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
    }
  },

  // --- Toast ---
  toast(message, type = 'info', duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      document.body.insertAdjacentHTML('beforeend', '<div id="toast-container" class="toast-container"></div>');
      container = document.getElementById('toast-container');
    }
    const icons = { success: 'check_circle', error: 'error', warning: 'warning', info: 'info' };
    const id = 'toast-' + Date.now();
    const html = `
      <div class="toast toast-${type}" id="${id}">
        <span class="material-icons-outlined toast-icon">${icons[type] || 'info'}</span>
        <span class="toast-msg">${message}</span>
        <button class="toast-dismiss" onclick="document.getElementById('${id}').remove()">
          <span class="material-icons-outlined">close</span>
        </button>
      </div>`;
    container.insertAdjacentHTML('beforeend', html);
    requestAnimationFrame(() => document.getElementById(id)?.classList.add('show'));
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) { el.classList.remove('show'); setTimeout(() => el.remove(), 350); }
    }, duration);
  },

  // --- Kanban Board ---
  KanbanBoard(columns, options = {}) {
    const cols = columns.map(col => {
      const cards = col.cards.map(card => `
        <div class="kanban-card" draggable="true" data-id="${card.id}" data-stage="${col.id}">
          <div class="kanban-card-header">
            <span class="kanban-card-title">${card.title || card.name}</span>
            ${card.score ? `<span class="lead-score score-${card.score}">${card.score}</span>` : ''}
          </div>
          ${card.company ? `<div class="kanban-card-company">${card.company}</div>` : ''}
          ${card.value ? `<div class="kanban-card-value">₹${Number(card.value).toLocaleString('en-IN')}</div>` : ''}
          ${card.service ? `<span class="kanban-card-tag">${card.service}</span>` : ''}
        </div>
      `).join('');
      return `
        <div class="kanban-column" data-stage="${col.id}">
          <div class="kanban-column-header">
            <span class="kanban-col-title">${col.label}</span>
            <span class="kanban-col-count">${col.cards.length}</span>
          </div>
          <div class="kanban-cards" data-stage="${col.id}">${cards}</div>
        </div>`;
    }).join('');
    return `<div class="kanban-board">${cols}</div>`;
  },

  // --- Tabs ---
  Tabs(items, activeIndex = 0) {
    const tabs = items.map((item, i) =>
      `<button class="tab-btn ${i === activeIndex ? 'active' : ''}" data-tab="${i}">${item.icon ? `<span class="material-icons-outlined">${item.icon}</span>` : ''}${item.label}</button>`
    ).join('');
    const panels = items.map((item, i) =>
      `<div class="tab-panel ${i === activeIndex ? 'active' : ''}" data-tab-panel="${i}">${item.content}</div>`
    ).join('');
    return `<div class="tabs"><div class="tab-bar">${tabs}</div><div class="tab-panels">${panels}</div></div>`;
  },

  initTabs(container) {
    const btns = container.querySelectorAll('.tab-btn');
    const panels = container.querySelectorAll('.tab-panel');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        container.querySelector(`[data-tab-panel="${btn.dataset.tab}"]`)?.classList.add('active');
      });
    });
  },

  // --- Badge ---
  Badge(text, variant = 'default') {
    return `<span class="badge badge-${variant}">${text}</span>`;
  },

  // --- Search Bar ---
  SearchBar(placeholder = 'Search...', id = 'search-input') {
    return `
      <div class="search-bar">
        <span class="material-icons-outlined search-icon">search</span>
        <input type="text" id="${id}" class="search-input" placeholder="${placeholder}">
      </div>`;
  },

  // --- Confirm Dialog ---
  confirm(message, onConfirm) {
    const content = `<p style="margin:0;font-size:0.95rem;color:var(--text-secondary)">${message}</p>`;
    const actions = `
      <button class="btn btn-outline" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-danger" id="confirm-action-btn">Delete</button>`;
    this.openModal('Confirm Action', content, actions);
    setTimeout(() => {
      document.getElementById('confirm-action-btn')?.addEventListener('click', () => {
        UI.closeModal();
        onConfirm();
      });
    }, 50);
  },

  // --- Format helpers ---
  formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  },

  formatCurrency(num) {
    return '₹' + Number(num || 0).toLocaleString('en-IN');
  },

  timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + 'm ago';
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + 'h ago';
    const days = Math.floor(hrs / 24);
    if (days < 7) return days + 'd ago';
    return UI.formatDate(dateStr);
  }
};
