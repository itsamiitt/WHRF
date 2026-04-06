# WHRF

This repository currently contains two site surfaces:

- a legacy static marketing site built from HTML, CSS, and client-side JavaScript
- a newer Next.js + Prisma application under [`app/`](/c:/Users/Administrator/Downloads/WHRF/app)

Deployment scripts and infrastructure helpers have been intentionally removed from this repo. The focus here is local development and application code.

## Local Setup

1. Install dependencies:

```powershell
corepack pnpm install
```

2. Copy the example environment file and fill in the required values:

```powershell
Copy-Item .env.example .env
```

3. Generate the Prisma client:

```powershell
corepack pnpm prisma:generate
```

4. Prepare the database schema:

```powershell
corepack pnpm prisma:push
```

5. Seed local data if needed:

```powershell
corepack pnpm prisma:seed
```

6. Start the Next.js app:

```powershell
corepack pnpm dev
```

## Useful Commands

```powershell
corepack pnpm dev
corepack pnpm build
corepack pnpm start
corepack pnpm prisma:generate
corepack pnpm prisma:migrate
corepack pnpm prisma:push
corepack pnpm prisma:seed
```

## Project Notes

- The Prisma schema lives in [`prisma/schema.prisma`](/c:/Users/Administrator/Downloads/WHRF/prisma/schema.prisma).
- Legacy static assets still exist in the repo for content migration and compatibility.
- The protected admin area depends on runtime environment variables for auth and database access.
