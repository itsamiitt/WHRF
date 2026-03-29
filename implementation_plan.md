# WRHWFOUR CRM/CMS Dashboard — Implementation Plan

## Background & Goal

WRHWFOUR Private Limited currently has a **static HTML landing page** ([index.html](file:///c:/Users/Administrator/Downloads/WHRF/index.html)) with CSS/JS assets, service pages, contact, about, privacy, and terms pages. There is **no backend or admin panel**.

This plan proposes building a **dedicated admin dashboard** that acts as both:

1. **CRM (Customer Relationship Management)** — manage leads, contacts, deals, tasks, and communication channels.
2. **CMS (Content Management System)** — customize every aspect of the public-facing landing page (logo, favicon, address, hero section, services, testimonials, SEO, etc.) from a visual editor.

---

## User Review Required

> [!IMPORTANT]
> **Technology Choice**: The plan uses **Vite + vanilla HTML/CSS/JS** (no React) to keep the dashboard lightweight, self-contained, and deployable as static files — matching the existing site. If you'd prefer React, Next.js, or another framework, let me know.

> [!IMPORTANT]
> **No Backend**: This first version stores all CRM/CMS data in **localStorage / IndexedDB** for demonstration. A real backend (Node.js, Firebase, Supabase, etc.) can be added later. The architecture is designed so the data layer can be swapped without rewriting the UI.

> [!WARNING]
> **Scope**: This is a large project. The plan below is the full vision. We can build it incrementally — starting with the dashboard shell + CMS editor, then adding CRM modules. Let me know your priority order.

---

## Architecture Overview

```
WHRF/
├── index.html                  # Public landing page (existing)
├── about.html, contact.html    # Existing pages
├── services/                   # Existing service pages
├── assets/                     # Existing CSS/JS/images
│
├── dashboard/                  # NEW — Admin Dashboard
│   ├── index.html              # Dashboard entry point
│   ├── css/
│   │   ├── dashboard.css       # Core design system & layout
│   │   ├── crm.css             # CRM-specific styles
│   │   └── cms.css             # CMS editor styles
│   ├── js/
│   │   ├── app.js              # SPA router & shell controller
│   │   ├── store.js            # Data layer (localStorage abstraction)
│   │   ├── components.js       # Reusable UI component library
│   │   ├── dashboard-home.js   # Home / analytics view
│   │   ├── contacts.js         # CRM — Contacts module
│   │   ├── leads.js            # CRM — Leads pipeline
│   │   ├── deals.js            # CRM — Deals tracker
│   │   ├── tasks.js            # CRM — Activity & tasks
│   │   ├── channels.js         # Channels & integrations
│   │   ├── cms-editor.js       # CMS — Landing page customizer
│   │   └── settings.js         # General settings
│   └── img/                    # Dashboard-specific assets
│
└── data/
    └── site-config.json        # CMS config consumed by the landing page
```

---

## Proposed Changes

### Component 1: Dashboard Foundation

#### [NEW] [index.html](file:///c:/Users/Administrator/Downloads/WHRF/dashboard/index.html)
- Single-page HTML shell with sidebar, header, and main content area
- Imports all CSS/JS modules
- Login gate (simple password check stored in localStorage)
- Responsive meta tags and dashboard-specific fonts

#### [NEW] [dashboard.css](file:///c:/Users/Administrator/Downloads/WHRF/dashboard/css/dashboard.css)
Premium dark-mode-first design system:
- CSS custom properties: color palette (dark navy/slate + electric blue accent), typography (Inter/Manrope), spacing, radii, shadows
- Sidebar layout (collapsible, 260px width, glass-morphism)
- Header bar with search, notifications bell, user avatar
- Card components, stat widgets, tables, modals, drawers, toasts
- Smooth transitions & micro-animations throughout
- Responsive breakpoints (mobile sidebar becomes bottom nav)

#### [NEW] [app.js](file:///c:/Users/Administrator/Downloads/WHRF/dashboard/js/app.js)
- Hash-based SPA router (`#/dashboard`, `#/contacts`, `#/leads`, `#/deals`, `#/tasks`, `#/channels`, `#/cms`, `#/settings`)
- Sidebar active-state management
- Page transition animations
- Login/logout flow
- Global event bus for inter-module communication

#### [NEW] [store.js](file:///c:/Users/Administrator/Downloads/WHRF/dashboard/js/store.js)
- `DataStore` class wrapping localStorage with JSON serialization
- Collections: `contacts`, `leads`, `deals`, `tasks`, `activities`, `siteConfig`
- CRUD helpers: `getAll()`, `getById()`, `create()`, [update()](file:///c:/Users/Administrator/Downloads/WHRF/assets/script.js#124-137), `delete()`
- Seed data generator for demo
- Export/import JSON functionality

#### [NEW] [components.js](file:///c:/Users/Administrator/Downloads/WHRF/dashboard/js/components.js)
Reusable UI factories:
- `StatCard(icon, label, value, trend)` — animated stat widget
- `DataTable(columns, data, actions)` — sortable/searchable table
- `Modal(title, content, actions)` — overlay dialog
- `Drawer(content)` — slide-in panel
- `Toast(message, type)` — notification popup
- `KanbanBoard(columns, cards)` — drag-and-drop pipeline
- `FormBuilder(fields)` — dynamic form generator
- `Tabs(items)` — tabbed content switcher
- `DropdownMenu(items)` — context/action menu

---

### Component 2: Dashboard Home

#### [NEW] [dashboard-home.js](file:///c:/Users/Administrator/Downloads/WHRF/dashboard/js/dashboard-home.js)
- **4 stat cards**: Total Contacts, Active Leads, Open Deals, Pending Tasks — each with trend indicator
- **Revenue chart**: Bar chart (drawn with Canvas API) showing monthly revenue
- **Lead sources**: Donut chart showing lead origins (website, WhatsApp, referral, etc.)
- **Recent activity feed**: Timeline of latest actions (lead created, deal updated, etc.)
- **Quick actions**: Buttons for "Add Contact", "New Lead", "Create Task"

---

### Component 3: CRM Modules

#### [NEW] [contacts.js](file:///c:/Users/Administrator/Downloads/WHRF/dashboard/js/contacts.js)
- **Contacts table** with columns: Name, Email, Phone, Company, Tags, Last Activity
- **Search & filter bar** (by tag, company, date range)
- **Add/Edit contact modal** with form fields
- **Contact detail drawer** (overview tab, activity timeline tab, deals tab)
- **Bulk actions**: select multiple → export CSV, delete, add tag
- **Import contacts** from CSV

#### [NEW] [leads.js](file:///c:/Users/Administrator/Downloads/WHRF/dashboard/js/leads.js)
- **Kanban board view** with columns: New → Contacted → Qualified → Proposal Sent → Won / Lost
- **List view toggle** (table format)
- **Lead card**: Name, company, value, source, assigned to, days in stage
- **Drag-and-drop** between columns
- **Add lead modal** with service type selector matching WRHWFOUR's services
- **Lead scoring** indicator (hot/warm/cold)

#### [NEW] [deals.js](file:///c:/Users/Administrator/Downloads/WHRF/dashboard/js/deals.js)
- **Deals pipeline** similar to leads but with monetary values
- **Deal cards** showing: client name, service, estimated value, probability, close date
- **Pipeline value summary** bar showing total value per stage
- **Deal detail drawer** with notes, attachments reference, activity log

#### [NEW] [tasks.js](file:///c:/Users/Administrator/Downloads/WHRF/dashboard/js/tasks.js)
- **Task list** with priorities (urgent/high/medium/low), due dates, status
- **Task categories**: Follow-up, Site Visit, Quotation, Installation, Support
- **Calendar mini-view** showing tasks per day
- **Quick-add task** inline form
- **Task detail modal** with description, linked contact/deal, notes

#### [NEW] [crm.css](file:///c:/Users/Administrator/Downloads/WHRF/dashboard/css/crm.css)
- Kanban board styles with drag feedback
- Contact/deal cards with status indicators
- Table styles with hover/selection states
- Drawer and modal overrides for CRM context

---

### Component 4: CMS — Landing Page Customizer

#### [NEW] [cms-editor.js](file:///c:/Users/Administrator/Downloads/WHRF/dashboard/js/cms-editor.js)
A visual editor with tabbed panels to customize every section of the landing page:

**Tab 1 — General / Branding**
- Company name (text input)
- Logo upload (file input + preview, saves as Base64 or path)
- Favicon upload (file input + preview)
- Primary color picker
- Font family selector

**Tab 2 — Contact Details**
- Address (street, city, state, pincode)
- Phone number(s)
- Email address(es)
- Google Maps embed URL
- Business hours

**Tab 3 — Social Media**
- LinkedIn URL
- Instagram URL
- Facebook URL
- Google Business URL
- WhatsApp number

**Tab 4 — Hero Section**
- Badge text ("Trusted IT Partner — Serving Pan India")
- Main headline (rich text)
- Subtitle text
- Primary CTA text & link
- Secondary CTA text & link
- Stats: 3 configurable stat items (number, suffix, label)

**Tab 5 — Services**
- Add / Edit / Remove / Reorder service cards
- Each card: icon (material icon picker), title, description, link
- Service page toggle (generate dedicated page)

**Tab 6 — About Section**
- Section label, headline, description paragraphs
- Highlights (icon + text, add/remove)
- About image upload

**Tab 7 — Why Choose Us**
- Section header (label, headline, description)
- Feature cards (add/edit/remove): icon, title, description

**Tab 8 — Testimonials**
- Add / Edit / Remove testimonials
- Each: quote text, author name, author role, rating, avatar initials

**Tab 9 — Client Logos**
- Add/remove client logo names

**Tab 10 — SEO Settings**
- Page title
- Meta description
- Keywords
- OG image upload
- Canonical URL
- Schema.org data editor (JSON)

**Tab 11 — Footer**
- Quick links editor
- Copyright text
- Privacy policy / Terms links

**Live Preview Panel**
- Split-screen: editor on left, live preview iframe on right
- Preview updates in real-time as fields change
- Device toggle buttons (desktop / tablet / mobile preview)

**Publish / Export**
- "Publish" button generates updated [index.html](file:///c:/Users/Administrator/Downloads/WHRF/index.html) with all CMS changes baked in
- "Export JSON" downloads the site config
- "Import JSON" loads a previous config

#### [NEW] [cms.css](file:///c:/Users/Administrator/Downloads/WHRF/dashboard/css/cms.css)
- Split-pane layout (editor + preview)
- Tab navigation styles
- Form field styling within editor panels
- Color picker, icon picker, image upload preview styles
- Drag-to-reorder list items

#### [NEW] [site-config.json](file:///c:/Users/Administrator/Downloads/WHRF/data/site-config.json)
Default config pre-populated from current [index.html](file:///c:/Users/Administrator/Downloads/WHRF/index.html) values:
```json
{
  "branding": {
    "companyName": "WRHWFOUR",
    "logoPath": "assets/images/logo.png",
    "faviconPath": "assets/images/logo.png",
    "primaryColor": "#3b82f6",
    "fontFamily": "Manrope"
  },
  "contact": {
    "address": "8th Floor, World Trade Centre...",
    "phone": "+91-XXXXXXXXXX",
    "email": "contact@wrhwfour.com",
    "mapEmbedUrl": "https://www.google.com/maps/embed?..."
  },
  "social": { "linkedin": "#", "instagram": "#", "facebook": "#" },
  "hero": { ... },
  "services": [ ... ],
  "testimonials": [ ... ],
  "seo": { ... }
}
```

---

### Component 5: Channels & Integrations

#### [NEW] [channels.js](file:///c:/Users/Administrator/Downloads/WHRF/dashboard/js/channels.js)
- Integration cards grid showing available channels
- **Gmail**: Connect button, OAuth status indicator, sent/received stats
- **WhatsApp**: Connect button, QR code placeholder, chat status
- **OpenAI / Codex**: Connect button, API key input, AI suggestion toggles
- Each card shows: connected/disconnected badge, last sync time, action buttons
- Links to relevant settings/configuration

---

### Component 6: General Settings

#### [NEW] [settings.js](file:///c:/Users/Administrator/Downloads/WHRF/dashboard/js/settings.js)
- **Profile**: Admin name, email, password change
- **Appearance**: Light/dark mode toggle, accent color
- **Data Management**: Export all data as JSON, import data, reset/clear data
- **About**: Version info, links

---

## Verification Plan

### Browser Testing (Automated via browser tool)
1. **Open** `dashboard/index.html` on local file server
2. **Login flow**: Enter demo credentials → verify redirect to dashboard home
3. **Navigation**: Click each sidebar item → verify correct page loads
4. **CRM — Contacts**: Add a contact → verify it appears in table → open detail drawer → edit → delete
5. **CRM — Leads**: Create a lead → verify kanban card appears → drag to next column → verify stage change
6. **CRM — Deals**: Add a deal → verify pipeline value updates
7. **CMS Editor**: Change company name → verify live preview updates → change logo → change hero text → publish → verify [index.html](file:///c:/Users/Administrator/Downloads/WHRF/index.html) output
8. **Responsive**: Resize browser to mobile → verify sidebar collapses → verify tables scroll horizontally

### Manual Verification
1. **Open the dashboard** in a browser at `http://localhost:PORT/dashboard/index.html`
2. **Navigate through all CRM pages** to confirm data loads and CRUD operations work
3. **Open CMS editor** → change the company logo, address, and hero text → click "Publish" → open updated [index.html](file:///c:/Users/Administrator/Downloads/WHRF/index.html) in a new tab to confirm changes are reflected
4. **Toggle dark/light mode** in settings → confirm the theme changes smoothly across all pages

> [!NOTE]
> Since the existing project has no test framework, all verification will be manual/browser-based. Once a backend is introduced, we can add integration tests.
