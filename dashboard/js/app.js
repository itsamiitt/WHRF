/* ============================================
   WRHWFOUR Dashboard — App Router & Shell
   ============================================ */

const App = {
  currentPage: 'dashboard',
  pendingRouteState: null,

  routes: {
    'dashboard': { module: () => DashboardHome, title: 'Dashboard', icon: 'dashboard' },
    'contacts':  { module: () => Contacts,       title: 'Contacts', icon: 'people' },
    'leads':     { module: () => Leads,           title: 'Leads',    icon: 'leaderboard' },
    'deals':     { module: () => Deals,           title: 'Deals',    icon: 'monetization_on' },
    'tasks':     { module: () => Tasks,           title: 'Tasks',    icon: 'task_alt' },
    'channels':  { module: () => Channels,        title: 'Channels', icon: 'hub' },
    'cms':       { module: () => CMSEditor,        title: 'CMS Editor', icon: 'edit_note' },
    'settings':  { module: () => Settings,        title: 'Settings', icon: 'settings' }
  },

  init() {
    // Apply theme
    const theme = DataStore.getSetting('theme', 'dark');
    document.documentElement.setAttribute('data-theme', theme);

    // Check login
    if (!DataStore.isLoggedIn()) {
      this.showLogin();
      return;
    }

    // Seed demo data
    DataStore.seedDemoData();

    // Load CMS config
    CMSEditor.loadConfig();

    // Render shell
    this.renderShell();

    // Handle hash navigation
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();

    // Mobile sidebar toggle
    document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
      document.querySelector('.sidebar')?.classList.toggle('open');
    });

    // Close sidebar on overlay click (mobile)
    document.addEventListener('click', (e) => {
      const sidebar = document.querySelector('.sidebar');
      const toggle = document.getElementById('sidebar-toggle');
      if (sidebar?.classList.contains('open') && !sidebar.contains(e.target) && !toggle?.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  },

  showLogin() {
    document.getElementById('app').innerHTML = `
      <div class="login-page">
        <div class="login-card">
          <img src="../assets/images/logo.png" alt="WRHWFOUR" class="login-logo">
          <h1>Welcome Back</h1>
          <p>Sign in to the WRHWFOUR CRM Dashboard</p>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="login-pw" placeholder="Enter password" onkeydown="if(event.key==='Enter')App.doLogin()">
          </div>
          <button class="btn btn-primary" onclick="App.doLogin()">
            <span class="material-icons-outlined">login</span> Sign In
          </button>
          <div class="login-error" id="login-error">Incorrect password. Default: admin123</div>
          <p style="margin-top:20px;font-size:0.75rem;color:var(--text-muted)">Default password: <code>admin123</code></p>
        </div>
      </div>
    `;
    document.getElementById('login-pw')?.focus();
  },

  doLogin() {
    const pw = document.getElementById('login-pw')?.value;
    if (DataStore.login(pw)) {
      this.init();
    } else {
      const errEl = document.getElementById('login-error');
      if (errEl) errEl.style.display = 'block';
    }
  },

  renderShell() {
    const pendingTasks = DataStore.getAll('tasks').filter(t => t.status !== 'completed').length;
    const adminName = DataStore.getSetting('adminName', 'Admin');

    document.getElementById('app').innerHTML = `
      <div class="dashboard-layout">
        <!-- Sidebar -->
        <aside class="sidebar" id="sidebar">
          <div class="sidebar-header">
            <img src="../assets/images/logo.png" alt="WRHWFOUR" class="sidebar-logo">
            <span class="sidebar-brand">WRHWFOUR</span>
          </div>

          <nav class="sidebar-nav">
            <div class="nav-section-label">Main</div>
            <a class="nav-item" data-page="dashboard" onclick="App.navigate('dashboard')">
              <span class="material-icons-outlined">dashboard</span> Dashboard
            </a>

            <div class="nav-section-label">CRM</div>
            <a class="nav-item" data-page="contacts" onclick="App.navigate('contacts')">
              <span class="material-icons-outlined">people</span> Contacts
            </a>
            <a class="nav-item" data-page="leads" onclick="App.navigate('leads')">
              <span class="material-icons-outlined">leaderboard</span> Leads
            </a>
            <a class="nav-item" data-page="deals" onclick="App.navigate('deals')">
              <span class="material-icons-outlined">monetization_on</span> Deals
            </a>
            <a class="nav-item" data-page="tasks" onclick="App.navigate('tasks')">
              <span class="material-icons-outlined">task_alt</span> Tasks
              ${pendingTasks > 0 ? `<span class="nav-badge">${pendingTasks}</span>` : ''}
            </a>

            <div class="nav-section-label">Tools</div>
            <a class="nav-item" data-page="channels" onclick="App.navigate('channels')">
              <span class="material-icons-outlined">hub</span> Channels
            </a>
            <a class="nav-item" data-page="cms" onclick="App.navigate('cms')">
              <span class="material-icons-outlined">edit_note</span> CMS Editor
            </a>

            <div class="nav-section-label">System</div>
            <a class="nav-item" data-page="settings" onclick="App.navigate('settings')">
              <span class="material-icons-outlined">settings</span> Settings
            </a>
          </nav>

          <div class="sidebar-footer">
            <div class="sidebar-user" onclick="App.navigate('settings')">
              <div class="sidebar-avatar">${adminName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}</div>
              <div class="sidebar-user-info">
                <div class="sidebar-user-name">${adminName}</div>
                <div class="sidebar-user-role">Administrator</div>
              </div>
              <span class="material-icons-outlined" style="font-size:1rem;color:var(--text-muted)">unfold_more</span>
            </div>
          </div>
        </aside>

        <!-- Main -->
        <div class="main-wrapper">
          <header class="top-header">
            <button class="header-toggle" id="sidebar-toggle">
              <span class="material-icons-outlined">menu</span>
            </button>
            <span class="header-title" id="header-title">Dashboard</span>
            <div class="header-spacer"></div>
            <div class="header-search">
              <span class="material-icons-outlined">search</span>
              <input type="text" placeholder="Search anything..." id="global-search">
            </div>
            <div class="header-actions">
              <button class="header-btn" title="Notifications" onclick="UI.toast('No new notifications','info')">
                <span class="material-icons-outlined">notifications</span>
                <span class="notif-dot"></span>
              </button>
              <button class="header-btn theme-toggle" title="Toggle Theme" onclick="Settings.toggleTheme(document.documentElement.getAttribute('data-theme')!=='dark')">
                <span class="material-icons-outlined">${DataStore.getSetting('theme', 'dark') === 'dark' ? 'light_mode' : 'dark_mode'}</span>
              </button>
              <button class="header-btn" title="Logout" onclick="App.logout()">
                <span class="material-icons-outlined">logout</span>
              </button>
            </div>
          </header>

          <main class="page-content" id="page-content">
            <div style="text-align:center;padding:60px;color:var(--text-muted)">Loading...</div>
          </main>
        </div>
      </div>
    `;
  },

  handleRoute() {
    const hash = location.hash.replace('#/', '') || 'dashboard';
    const page = hash.split('?')[0];
    this.navigateTo(page);
  },

  navigate(page, params = {}) {
    this.pendingRouteState = params || null;
    location.hash = '#/' + page;
    // Close mobile sidebar
    document.querySelector('.sidebar')?.classList.remove('open');
  },

  navigateTo(page) {
    const route = this.routes[page];
    if (!route) { this.navigate('dashboard'); return; }

    this.currentPage = page;

    // Update active nav
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });

    // Update header title
    const headerTitle = document.getElementById('header-title');
    if (headerTitle) headerTitle.textContent = route.title;

    // Render page
    const contentEl = document.getElementById('page-content');
    if (!contentEl) return;

    contentEl.style.opacity = '0';
    contentEl.style.transform = 'translateY(8px)';

    setTimeout(() => {
      const mod = route.module();
      contentEl.innerHTML = mod.render();
      contentEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      contentEl.style.opacity = '1';
      contentEl.style.transform = 'translateY(0)';

      if (mod.afterRender) mod.afterRender();

      const routeState = this.pendingRouteState;
      this.pendingRouteState = null;
      if (routeState?.action === 'add' && typeof mod.openAddModal === 'function') {
        setTimeout(() => mod.openAddModal(routeState), 50);
      }
    }, 100);
  },

  logout() {
    UI.confirm('Are you sure you want to logout?', () => {
      DataStore.logout();
      location.hash = '';
      this.showLogin();
    });
  }
};

// --- Boot ---
document.addEventListener('DOMContentLoaded', () => App.init());
