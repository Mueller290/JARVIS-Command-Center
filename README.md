# JARVIS Command Center — Foundation Preview

This is the first implementation foundation for the existing `Mueller290/JARVIS-Command-Center` project. It is a responsive Next.js dashboard preview with a Supabase schema starter.

## Included
- Responsive JARVIS-themed dashboard and navigation
- Opportunity Watch and Approval Center preview panels
- Business module overview
- Next.js / React / TypeScript project configuration
- Supabase browser-client entry point
- Initial PostgreSQL schema with owner-scoped RLS policies
- Approval decision RPC that records a decision but does not perform an external action

## Not yet implemented
- Real authentication screens or protected routes
- Supabase migration execution or live database connection
- Real opportunity discovery, verification, or submissions
- Voice processing, AI command execution, integrations, notifications
- MFA enforcement, desktop/mobile native packaging, deployment

The dashboard deliberately labels itself as a preview and does not pretend that live actions are connected.

## Run locally
1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env.local` and fill in the Supabase project URL and anon key when available.
3. Run `npm install`.
4. Run `npm run dev` and open the local address shown in the terminal.

## Database
Review `supabase/migrations/0001_initial_schema.sql` before applying it to a new Supabase project. It uses PostgreSQL 15's column-list form of `ON DELETE SET NULL`. Test the migration and RLS with at least two separate user accounts before using real data.

## Security notes
- Never commit `.env.local` or any secrets.
- Never expose the Supabase service-role key or OpenAI API key to browser code.
- Approval records are not execution permissions. Any external action must independently check a fresh approval server-side immediately before execution.
- Do not store protected health information in this general-purpose workspace. Keep any clinical workflow in a separately designed compliant system.
