# WRHWFOUR Private Limited — Website & CRM

## Project Overview
Full-stack Next.js 15 (TypeScript) application for WRHWFOUR Private Limited, an IT services company. Converted from static HTML pages to a React/Next.js app with a fully functional admin dashboard and CRM backend.

## Technology Stack
- **Framework**: Next.js 15 (App Router, TypeScript)
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth.js (credentials provider) + bcryptjs
- **Styling**: Custom CSS (`assets/style.css`, `assets/pages.css`) — NOT CSS modules
- **Scripts**: `assets/script.js` (navbar, FAQ, scroll) loaded via `<Script strategy="afterInteractive">`
- **Package Manager**: pnpm (monorepo)
- **Port**: 5000 with `-H 0.0.0.0`

## Project Structure

```
app/
  (public)/               # Public site routes (no auth)
    page.tsx              # Home
    about/page.tsx
    contact/page.tsx
    services/page.tsx     # Services listing
    services/[slug]/page.tsx  # Dynamic service detail pages
    privacy-policy/page.tsx
    terms-of-service/page.tsx
  admin/
    (protected)/          # Auth-guarded admin pages
      page.tsx            # Overview dashboard (with CRM stats)
      content/            # CMS page management
      leads/page.tsx      # Website form submissions
      contacts/page.tsx   # CRM Contacts (CRUD)
      deals/page.tsx      # CRM Deals / pipeline (CRUD)
      tasks/page.tsx      # CRM Tasks (CRUD)
      team/page.tsx
      settings/page.tsx
    actions.ts            # All Server Actions (leads, contacts, deals, tasks, content, users)
    layout.tsx
  api/
    auth/                 # NextAuth routes
    public/site-config/   # Public site config API

components/
  site/
    site-navbar.tsx       # SiteNavbar + HomeNavbar
    site-footer.tsx       # SiteFooter
    site-shell.tsx        # Wraps navbar + footer + WhatsApp FAB + back-to-top
  admin/
    admin-shell.tsx       # Admin sidebar + navigation
    logout-button.tsx

lib/
  services-data.ts        # Complete data for all 7 service detail pages
  prisma.ts
  auth/session.ts         # requireUser, requireRole helpers
  content/                # CMS schemas & legacy source

prisma/
  schema.prisma           # Full schema with all models

data/
  site-config.json        # Fallback site config (runtime dependency)

assets/                   # Static CSS/JS/images (served as-is)

_legacy/                  # Old HTML pages (consolidated, not served)
  index.html, about.html, contact.html, etc.
  services/*.html
  dashboard/
```

## Prisma Models
- **User** (auth, roles: ADMIN, EDITOR, SALES)
- **Lead** (website form submissions with status + activities)
- **Page / PageRevision** (CMS content management)
- **MediaAsset** (uploaded media)
- **Contact** (CRM contacts with status: PROSPECT, CUSTOMER, etc.)
- **Deal** (sales pipeline with stages: PROSPECTING → CLOSED_WON/LOST)
- **Task** (follow-ups linked to deals with status + priority)
- **Account / Session / VerificationToken** (NextAuth)

## Service Pages (7 data-driven detail pages)
All served by `app/services/[slug]/page.tsx` using `lib/services-data.ts`:
- `/services/cctv-installation`
- `/services/computer-sales-repair`
- `/services/server-installation`
- `/services/biometric-attendance`
- `/services/corporate-it-amc`
- `/services/networking-solutions`
- `/services/hardware-support`

## Admin Dashboard Features
- Content editor (CMS for public pages)
- Leads management (website form submissions)
- **Contacts CRM** — add/edit/delete contacts with status tracking
- **Deals pipeline** — full sales pipeline from prospecting to close
- **Tasks tracker** — linked to deals, with priority + due dates + overdue detection
- Team management
- Settings

## Key Configuration Notes
- CSS approach: CSS files loaded globally in `layout.tsx`, no CSS modules
- SiteShell `variant` prop: "home" | "about" | "services" | "contact" | "other"
- Home page uses `includeHomeScripts={true}` for site-config.js
- All nav links use Next.js `Link` with route paths (not `.html` extensions)
- Images use Next.js `Image` component with `/assets/...` paths
- Admin is protected by `requireUser()` / `requireRole()` session helpers
- `data/site-config.json` is a runtime dependency (do NOT move to _legacy)

## Environment Variables
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — NextAuth secret (user-provided)
- `NEXTAUTH_URL` — Auth callback URL
