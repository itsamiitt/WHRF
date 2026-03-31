/* ============================================
   WRHWFOUR Dashboard — Channels / Integrations
   ============================================ */

const Channels = {
  render() {
    return `
      <div class="page-header">
        <h1>Channels & Integrations</h1>
        <p style="color:var(--text-secondary);font-size:0.85rem;margin-top:4px">Connect communication channels and third-party services.</p>
      </div>

      <div class="channels-grid">
        <!-- Gmail -->
        <div class="channel-card">
          <div class="channel-card-header">
            <div class="channel-icon" style="background:#ea433520;color:#ea4335">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 18h-2V9.25L12 13 6 9.25V18H4V6h1.2l6.8 4.25L18.8 6H20v12zm0-14H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/></svg>
            </div>
            <div>
              <div class="channel-name">Gmail</div>
              <div class="channel-status disconnected"><span class="dot"></span> Not Connected</div>
            </div>
          </div>
          <div class="channel-desc">Send, read, and track emails directly from the CRM. Sync conversations with contacts automatically.</div>
          <button class="btn btn-secondary" onclick="Channels.connectGmail()">
            <span class="material-icons-outlined">link</span> Connect Gmail
          </button>
        </div>

        <!-- WhatsApp -->
        <div class="channel-card">
          <div class="channel-card-header">
            <div class="channel-icon" style="background:#25d36620;color:#25d366">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </div>
            <div>
              <div class="channel-name">WhatsApp Business</div>
              <div class="channel-status disconnected"><span class="dot"></span> Not Connected</div>
            </div>
          </div>
          <div class="channel-desc">Receive and respond to WhatsApp inquiries. Auto-log conversations and manage quick replies.</div>
          <button class="btn btn-secondary" onclick="Channels.connectWhatsApp()">
            <span class="material-icons-outlined">link</span> Connect WhatsApp
          </button>
        </div>

        <!-- OpenAI / Codex -->
        <div class="channel-card">
          <div class="channel-card-header">
            <div class="channel-icon" style="background:#10a37f20;color:#10a37f">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071.005l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071-.006l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.661zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg>
            </div>
            <div>
              <div class="channel-name">OpenAI / Codex</div>
              <div class="channel-status disconnected"><span class="dot"></span> Not Connected</div>
            </div>
          </div>
          <div class="channel-desc">AI-powered assistance for drafting emails, generating proposals, and smart lead scoring suggestions.</div>
          <button class="btn btn-secondary" onclick="Channels.connectOpenAI()">
            <span class="material-icons-outlined">link</span> Connect
          </button>
        </div>

        <!-- SMS -->
        <div class="channel-card">
          <div class="channel-card-header">
            <div class="channel-icon" style="background:#3b82f620;color:#3b82f6">
              <span class="material-icons-outlined" style="font-size:1.5rem">sms</span>
            </div>
            <div>
              <div class="channel-name">SMS Gateway</div>
              <div class="channel-status disconnected"><span class="dot"></span> Not Connected</div>
            </div>
          </div>
          <div class="channel-desc">Send automated SMS notifications for appointment reminders, invoice updates, and service alerts.</div>
          <button class="btn btn-secondary" onclick="Channels.comingSoon()">
            <span class="material-icons-outlined">schedule</span> Coming Soon
          </button>
        </div>

        <!-- Calendar -->
        <div class="channel-card">
          <div class="channel-card-header">
            <div class="channel-icon" style="background:#4285f420;color:#4285f4">
              <span class="material-icons-outlined" style="font-size:1.5rem">calendar_month</span>
            </div>
            <div>
              <div class="channel-name">Google Calendar</div>
              <div class="channel-status disconnected"><span class="dot"></span> Not Connected</div>
            </div>
          </div>
          <div class="channel-desc">Sync tasks and appointments with Google Calendar. Schedule site visits and follow-ups automatically.</div>
          <button class="btn btn-secondary" onclick="Channels.comingSoon()">
            <span class="material-icons-outlined">schedule</span> Coming Soon
          </button>
        </div>

        <!-- Payments -->
        <div class="channel-card">
          <div class="channel-card-header">
            <div class="channel-icon" style="background:#635bff20;color:#635bff">
              <span class="material-icons-outlined" style="font-size:1.5rem">payments</span>
            </div>
            <div>
              <div class="channel-name">Razorpay</div>
              <div class="channel-status disconnected"><span class="dot"></span> Not Connected</div>
            </div>
          </div>
          <div class="channel-desc">Accept payments and generate invoices. Track payment status for deals and service contracts.</div>
          <button class="btn btn-secondary" onclick="Channels.comingSoon()">
            <span class="material-icons-outlined">schedule</span> Coming Soon
          </button>
        </div>
      </div>
    `;
  },

  afterRender() {},

  connectGmail() {
    UI.openModal('Connect Gmail', `
      <div style="text-align:center;padding:20px 0">
        <div style="width:64px;height:64px;border-radius:16px;background:#ea433520;display:flex;align-items:center;justify-content:center;margin:0 auto 16px">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#ea4335"><path d="M20 18h-2V9.25L12 13 6 9.25V18H4V6h1.2l6.8 4.25L18.8 6H20v12zm0-14H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/></svg>
        </div>
        <h3 style="margin-bottom:8px">Gmail Integration</h3>
        <p style="color:var(--text-secondary);font-size:0.85rem;margin-bottom:24px">To connect Gmail, you'll need to configure OAuth credentials in the backend server. This feature requires server-side setup.</p>
        <div class="form-group" style="text-align:left;margin-bottom:12px">
          <label>Client ID</label>
          <input type="text" placeholder="your-client-id.apps.googleusercontent.com">
        </div>
        <div class="form-group" style="text-align:left">
          <label>Client Secret</label>
          <input type="password" placeholder="Your client secret">
        </div>
      </div>
    `, `
      <button class="btn btn-outline" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="UI.toast('Gmail integration requires backend setup','info');UI.closeModal()">Save & Connect</button>
    `);
  },

  connectWhatsApp() {
    UI.openModal('Connect WhatsApp', `
      <div style="text-align:center;padding:20px 0">
        <div style="width:64px;height:64px;border-radius:16px;background:#25d36620;display:flex;align-items:center;justify-content:center;margin:0 auto 16px">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
        </div>
        <h3 style="margin-bottom:8px">WhatsApp Business</h3>
        <p style="color:var(--text-secondary);font-size:0.85rem;margin-bottom:24px">Connect via WhatsApp Business API or scan QR code with WhatsApp Web. Requires backend webhook configuration.</p>
        <div class="form-group" style="text-align:left">
          <label>WhatsApp Business Phone Number</label>
          <input type="tel" placeholder="+91 XXXXX XXXXX">
        </div>
      </div>
    `, `
      <button class="btn btn-outline" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="UI.toast('WhatsApp integration requires backend setup','info');UI.closeModal()">Save & Connect</button>
    `);
  },

  connectOpenAI() {
    UI.openModal('Connect OpenAI', `
      <div style="text-align:center;padding:20px 0">
        <div style="width:64px;height:64px;border-radius:16px;background:#10a37f20;display:flex;align-items:center;justify-content:center;margin:0 auto 16px">
          <span style="font-size:2rem;color:#10a37f;font-weight:800">AI</span>
        </div>
        <h3 style="margin-bottom:8px">OpenAI Integration</h3>
        <p style="color:var(--text-secondary);font-size:0.85rem;margin-bottom:24px">Enable AI-powered features: email drafting, lead scoring suggestions, and proposal generation.</p>
        <div class="form-group" style="text-align:left">
          <label>API Key</label>
          <input type="password" placeholder="sk-...">
        </div>
      </div>
    `, `
      <button class="btn btn-outline" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="UI.toast('OpenAI API key saved (demo)','success');UI.closeModal()">Save Key</button>
    `);
  },

  comingSoon() {
    UI.toast('This integration is coming soon!', 'info');
  }
};
