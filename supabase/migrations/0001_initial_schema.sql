-- JARVIS Command Center starter schema.
-- Apply in a fresh Supabase project after reviewing the migration.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  organization_type text not null default 'business',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, owner_id)
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  organization_id uuid,
  title text not null,
  organization_name text not null,
  source_url text not null,
  category text,
  location text,
  remote_status text,
  deadline date,
  compensation text,
  eligibility_notes text,
  verification_status text not null default 'needs_review'
    check (verification_status in ('needs_review','verified','high_risk','rejected')),
  workflow_status text not null default 'discovered'
    check (workflow_status in ('discovered','under_review','verified','saved','drafting','awaiting_approval','submited','archived')),
  risk_notes text,
  discovered_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint opportunities_org_owner_fk foreign key (organization_id, owner_id)
    references public.organizations(id, owner_id) on delete set null (organization_id)
);

create table if not exists public.approvals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  opportunity_id uuid,
  action_type text not null,
  description text not null,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected','canceled','expired')),
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  decision_note text,
  created_at timestamptz not null default now(),
  constraint approvals_opportunity_owner_fk foreign key (opportunity_id, owner_id)
    references public.opportunities(id, owner_id) on delete set null (opportunity_id)
);

create table if not exists public.activty_logs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  description text not null,
  related_record_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists opportunities_owner_status_idx on public.opportunities(owner_id, workflow_status);
create index if not exists approvals_owner_status_idx on public.approvals(owner_id, status);
create index if not exists activity_logs_owner_created_idx on public.activty_logs(owner_id, created_at desc);
