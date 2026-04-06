/* ============================================
   WRHWFOUR Dashboard — Settings
   ============================================ */

const Settings = {
  render() {
    const isDark = DataStore.getSetting('theme', 'dark') === 'dark';
    return `
      <div class="page-header">
        <h1>Settings</h1>
      </div>

      <div class="settings-section">
        <h3><span class="material-icons-outlined" style="font-size:1.1rem;vertical-align:middle;margin-right:8px">person</span>Profile</h3>
        <div class="form-grid" style="max-width:500px">
          <div class="form-group"><label>Admin Name</label><input type="text" id="set-name" value="${DataStore.getSetting('adminName', 'Admin')}" onchange="DataStore.setSetting('adminName', this.value)"></div>
          <div class="form-group"><label>Email</label><input type="email" id="set-email" value="${DataStore.getSetting('adminEmail', 'admin@wrhwfour.com')}" onchange="DataStore.setSetting('adminEmail', this.value)"></div>
          <div class="form-group full-width">
            <label>Change Password</label>
            <input type="password" id="set-pw" placeholder="New password">
          </div>
          <div class="form-group">
            <button class="btn btn-secondary" onclick="Settings.changePassword()">Update Password</button>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h3><span class="material-icons-outlined" style="font-size:1.1rem;vertical-align:middle;margin-right:8px">palette</span>Appearance</h3>
        <div class="setting-row">
          <div>
            <div class="setting-label">Dark Mode</div>
            <div class="setting-desc">Toggle between dark and light theme</div>
          </div>
          <label class="toggle">
            <input type="checkbox" ${isDark ? 'checked' : ''} onchange="Settings.toggleTheme(this.checked)">
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div class="settings-section">
        <h3><span class="material-icons-outlined" style="font-size:1.1rem;vertical-align:middle;margin-right:8px">storage</span>Data Management</h3>
        <div class="setting-row">
          <div>
            <div class="setting-label">Export All Data</div>
            <div class="setting-desc">Download all CRM data as JSON</div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="Settings.exportData()">
            <span class="material-icons-outlined">download</span> Export
          </button>
        </div>
        <div class="setting-row">
          <div>
            <div class="setting-label">Import Data</div>
            <div class="setting-desc">Restore from a JSON backup</div>
          </div>
          <div style="position:relative">
            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('import-file').click()">
              <span class="material-icons-outlined">upload</span> Import
            </button>
            <input type="file" id="import-file" accept=".json" style="position:absolute;opacity:0;width:0;height:0" onchange="Settings.importData(this)">
          </div>
        </div>
        <div class="setting-row">
          <div>
            <div class="setting-label">Reset Demo Data</div>
            <div class="setting-desc">Re-seed demo contacts, leads, deals, and tasks</div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="Settings.resetDemo()">
            <span class="material-icons-outlined">refresh</span> Reset
          </button>
        </div>
        <div class="setting-row">
          <div>
            <div class="setting-label" style="color:var(--error)">Clear All Data</div>
            <div class="setting-desc">Permanently delete all stored data</div>
          </div>
          <button class="btn btn-danger btn-sm" onclick="Settings.clearAll()">
            <span class="material-icons-outlined">delete_forever</span> Clear
          </button>
        </div>
      </div>

      <div class="settings-section">
        <h3><span class="material-icons-outlined" style="font-size:1.1rem;vertical-align:middle;margin-right:8px">info</span>About</h3>
        <div class="setting-row">
          <div class="setting-label">WRHWFOUR CRM Dashboard</div>
          <span style="font-size:0.82rem;color:var(--text-muted)">v1.0.0</span>
        </div>
        <div class="setting-row">
          <div class="setting-label">Data Storage</div>
          <span style="font-size:0.82rem;color:var(--text-muted)">Browser localStorage</span>
        </div>
      </div>
    `;
  },

  afterRender() {},

  changePassword() {
    const pw = document.getElementById('set-pw')?.value;
    if (pw && pw.length >= 4) {
      DataStore.setSetting('adminPassword', pw);
      UI.toast('Password updated', 'success');
      document.getElementById('set-pw').value = '';
    } else {
      UI.toast('Password must be at least 4 characters', 'error');
    }
  },

  toggleTheme(isDark) {
    const theme = isDark ? 'dark' : 'light';
    DataStore.setSetting('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  },

  exportData() {
    const json = DataStore.exportAll();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'wrhwfour_crm_data.json'; a.click();
    URL.revokeObjectURL(url);
    UI.toast('Data exported!', 'success');
  },

  importData(input) {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (DataStore.importAll(e.target.result)) {
        UI.toast('Data imported successfully!', 'success');
        App.navigate('dashboard');
      } else {
        UI.toast('Failed to import data', 'error');
      }
    };
    reader.readAsText(file);
  },

  resetDemo() {
    UI.confirm('This will re-seed demo data alongside your existing data. Continue?', () => {
      ['contacts', 'leads', 'deals', 'tasks', 'activities'].forEach(c => {
        localStorage.removeItem('wrhw_' + c);
      });
      DataStore.seedDemoData();
      UI.toast('Demo data reset', 'success');
      App.navigate('dashboard');
    });
  },

  clearAll() {
    UI.confirm('This will permanently delete ALL data. This cannot be undone!', () => {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('wrhw_')) localStorage.removeItem(key);
      });
      UI.toast('All data cleared', 'success');
      App.navigate('dashboard');
    });
  }
};
