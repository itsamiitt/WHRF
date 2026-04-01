/* ============================================
   WRHWFOUR Dashboard — Home / Analytics
   ============================================ */

const DashboardHome = {
  render() {
    const contacts = DataStore.count('contacts');
    const leads = DataStore.getAll('leads').filter(l => !['won', 'lost'].includes(l.stage));
    const deals = DataStore.getAll('deals');
    const tasks = DataStore.getAll('tasks').filter(t => t.status !== 'completed');
    const wonDeals = deals.filter(d => d.stage === 'closed-won');
    const totalRevenue = wonDeals.reduce((s, d) => s + (d.value || 0), 0);
    const pipelineValue = deals.filter(d => !['closed-won', 'closed-lost'].includes(d.stage)).reduce((s, d) => s + (d.value || 0), 0);
    const activities = DataStore.getActivities(8);

    return `
      <div class="page-header">
        <div>
          <h1>Dashboard</h1>
          <p style="color:var(--text-secondary);font-size:0.85rem;margin-top:4px">Welcome back! Here's what's happening today.</p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-primary" onclick="App.navigate('contacts', {action:'add'})">
            <span class="material-icons-outlined">person_add</span> Add Contact
          </button>
        </div>
      </div>

      <div class="stats-grid">
        ${UI.StatCard('people', 'Total Contacts', contacts, 12, '#3b82f6')}
        ${UI.StatCard('leaderboard', 'Active Leads', leads.length, 8, '#f59e0b')}
        ${UI.StatCard('monetization_on', 'Pipeline Value', UI.formatCurrency(pipelineValue), 15, '#22c55e')}
        ${UI.StatCard('task_alt', 'Pending Tasks', tasks.length, -3, '#ef4444')}
      </div>

      <div class="content-grid">
        <div class="card">
          <div class="card-header-row">
            <span class="card-title">Revenue Overview</span>
            <span style="font-size:0.75rem;color:var(--text-muted)">Last 6 months</span>
          </div>
          <div class="chart-canvas-wrap">
            <canvas id="revenue-chart"></canvas>
          </div>
        </div>
        <div class="card">
          <div class="card-header-row">
            <span class="card-title">Lead Sources</span>
          </div>
          <div class="chart-canvas-wrap">
            <canvas id="sources-chart"></canvas>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <div class="card">
          <div class="card-header-row">
            <span class="card-title">Recent Activity</span>
            <button class="btn btn-ghost btn-sm" onclick="App.navigate('contacts')">View All</button>
          </div>
          <div class="activity-feed">
            ${activities.length ? activities.map(a => `
              <div class="activity-item">
                <div class="activity-dot ${a.action}"></div>
                <div class="activity-text"><strong>${a.itemName}</strong> was ${a.action} in ${a.collection}</div>
                <div class="activity-time">${UI.timeAgo(a.timestamp)}</div>
              </div>
            `).join('') : '<div class="empty-state">No recent activity</div>'}
          </div>
        </div>
        <div class="card">
          <div class="card-header-row">
            <span class="card-title">Upcoming Tasks</span>
            <button class="btn btn-ghost btn-sm" onclick="App.navigate('tasks')">View All</button>
          </div>
          <div class="activity-feed">
            ${tasks.slice(0, 5).map(t => `
              <div class="activity-item">
                <div class="activity-dot" style="background:${
                  t.priority === 'urgent' ? 'var(--error)' :
                  t.priority === 'high' ? 'var(--warning)' :
                  t.priority === 'medium' ? 'var(--accent)' : 'var(--text-muted)'
                }"></div>
                <div class="activity-text">
                  <strong>${t.title}</strong>
                  <div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px">Due: ${UI.formatDate(t.dueDate)}</div>
                </div>
                ${UI.Badge(t.priority, t.priority === 'urgent' ? 'error' : t.priority === 'high' ? 'warning' : 'default')}
              </div>
            `).join('') || '<div class="empty-state">No pending tasks</div>'}
          </div>
        </div>
      </div>
    `;
  },

  afterRender() {
    this.drawRevenueChart();
    this.drawSourcesChart();
  },

  drawRevenueChart() {
    const canvas = document.getElementById('revenue-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width, h = rect.height;

    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const values = [180000, 320000, 450000, 280000, 520000, 380000];
    const maxVal = Math.max(...values) * 1.2;
    const barW = 36;
    const gap = (w - 60) / months.length;
    const baseY = h - 40;
    const chartH = h - 70;

    // Grid lines
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || '#2a2e42';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = baseY - (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(w - 10, y);
      ctx.stroke();

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#5a5e76';
      ctx.font = '10px Manrope, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('₹' + Math.round((maxVal / 4) * i / 1000) + 'K', 36, y + 3);
    }

    // Bars
    const gradient = ctx.createLinearGradient(0, baseY - chartH, 0, baseY);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, '#3b82f680');

    months.forEach((m, i) => {
      const x = 50 + gap * i + (gap - barW) / 2;
      const barH = (values[i] / maxVal) * chartH;

      ctx.fillStyle = gradient;
      this.roundRect(ctx, x, baseY - barH, barW, barH, 6);
      ctx.fill();

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#5a5e76';
      ctx.font = '11px Manrope, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(m, x + barW / 2, baseY + 18);
    });
  },

  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  },

  drawSourcesChart() {
    const canvas = document.getElementById('sources-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width, h = rect.height;

    const data = [
      { label: 'Website', value: 35, color: '#3b82f6' },
      { label: 'WhatsApp', value: 25, color: '#22c55e' },
      { label: 'Referral', value: 20, color: '#f59e0b' },
      { label: 'Cold Call', value: 12, color: '#8b5cf6' },
      { label: 'LinkedIn', value: 8, color: '#06b6d4' }
    ];

    const cx = Math.min(w * 0.35, 120);
    const cy = h / 2;
    const radius = Math.min(cx - 10, cy - 20, 80);
    const innerRadius = radius * 0.58;
    const total = data.reduce((s, d) => s + d.value, 0);
    let startAngle = -Math.PI / 2;

    data.forEach(d => {
      const sliceAngle = (d.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = d.color;
      ctx.fill();
      startAngle += sliceAngle;
    });

    // Inner circle for donut
    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-card').trim() || '#1a1d2e';
    ctx.fillStyle = bgColor;
    ctx.fill();

    // Center text
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#e8eaf0';
    ctx.font = 'bold 18px Manrope, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(total, cx, cy + 2);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#5a5e76';
    ctx.font = '10px Manrope, sans-serif';
    ctx.fillText('Total Leads', cx, cy + 16);

    // Legend
    const legendX = Math.min(w * 0.55, 180);
    data.forEach((d, i) => {
      const ly = 30 + i * 38;
      ctx.fillStyle = d.color;
      this.roundRect(ctx, legendX, ly, 12, 12, 3);
      ctx.fill();

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#e8eaf0';
      ctx.font = '12px Manrope, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(d.label, legendX + 20, ly + 10);

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#5a5e76';
      ctx.font = '11px Manrope, sans-serif';
      ctx.fillText(d.value + '%', legendX + 20 + ctx.measureText(d.label).width + 10, ly + 10);
    });
  }
};
