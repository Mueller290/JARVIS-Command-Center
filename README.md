# JARVIS Command Center

A dark, responsive command workspace for the planned Aliyah Mueller Enterprises operating environment.

## Current development status

The `codex/jarvis-five-systems` branch contains the first interactive five-system workspace increment:

- **Business HQ** — capture division, project, task, and priority records.
- **Financial Command** — capture financial planning notes and distinguish planned items from verified records.
- **Website Command** — maintain a working inventory of digital properties and website issues.
- **Company Knowledge** — capture company reference notes and operating policies.
- **Approval Center** — record action requests for owner review.

The interface preserves the existing JARVIS dark/cyan visual direction. The current browser UI saves records in that browser's local storage only. It is a development workspace, **not yet a cloud-synced, authenticated production application**.

## Supabase database

The database migrations are cumulative and intended for a fresh project:

1. Review and apply `supabase/migrations/0001_initial_schema.sql`.
2. Review and apply `supabase/migrations/0002_five_systems.sql`.

The second migration adds owner-scoped tables for projects, tasks, financial entries, website properties, and company knowledge, plus approval scope/expiry/consumption fields. Row-level security is enabled.

Applying migrations does not by itself connect the UI to Supabase. Authentication, server-side data access, approval execution gates, and integration tests remain required before real company data or external actions are enabled.

## Run locally

Requirements: Node.js 20 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open the local URL printed by Next.js. Supabase variables can be filled in after configuring a Supabase project:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Never place service-role keys or AI provider secrets in browser code or commit `.env.local`.

## Safety and company boundaries

- The planned company blueprint is not proof that the LLC has been legally formed, a service is licensed, a domain is registered, or revenue has been earned.
- Crowned by Grace Photography remains completely separate from the parent-company structure and consolidated reporting.
- Financial goals and planning allocations are not actual revenue, profit, or cash.
- The Approval Center currently records requests only. An approval row is not permission to execute an external action. Any future executor must independently verify a fresh, unexpired, action-scoped approval server-side immediately before execution and record the result.
- Do not store protected health information in this general-purpose workspace. Any clinical workflow needs a separately designed compliant system.
- No paid services, purchases, legal filings, production publishing, DNS changes, or external commitments are authorized by this code change.

## Not yet complete

- Supabase sign-in, session management, protected routes, and live UI/database sync.
- Server-side approval enforcement and external action execution.
- Company Knowledge retrieval integrated into an AI assistant.
- Live website monitoring, analytics, and opportunity discovery.
- Full financial ledger/reporting and reconciliation.
- Automated functional/browser tests, verified production build, and deployment.

Do not treat this development increment as production-ready until these items are implemented and tested.
