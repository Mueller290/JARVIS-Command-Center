-- JARVIS five-system operating layer
-- Apply after 0001_initial_schema.sql. All records are owner-scoped.
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete set null,
  division text not null,
  name text not null,
  description text not null default '',
  status text not null default 'planned' check (status in ('idea','planned','in_progress','pending_approval','active','paused','completed')),
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  division text not null,
  status text not null default 'todo' check (status in ('todo','in_progress','blocked','done')),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.financial_entries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  division text not null,
  entry_type text not null check (entry_type in ('revenue','expense')),
  amount numeric(14,2) not null check (amount >= 0),
  description text not null,
  entry_date date not null default current_date,
  status text not null default 'planned' check (status in ('planned','pending','verified','void')),
  source_reference text,
  created_at timestamptz not null default now()
);

create table if not exists public.website_properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  division text not null,
  site_name text not null,
  domain text,
  platform text,
  registrar text,
  status text not null default 'planned' check (status in ('planned','staging','live','paused','retired')),
  last_checked_at timestamptz,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  division text not null default 'Company-wide',
  title text not null,
  content text not null,
  source_label text,
  status text not null default 'draft' check (status in ('draft','approved','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.approvals
  add column if not exists action_scope jsonb not null default '{}'::jsonb,
  add column if not exists expires_at timestamptz,
  add column if not exists consumed_at timestamptz;

create index if not exists projects_owner_status_idx on public.projects(owner_id,status);
create index if not exists tasks_owner_status_idx on public.tasks(owner_id,status);
create index if not exists finance_owner_date_idx on public.financial_entries(owner_id,entry_date desc);
create index if not exists websites_owner_status_idx on public.website_properties(owner_id,status);
create index if not exists knowledge_owner_status_idx on public.knowledge_documents(owner_id,status);

do $$
declare t text;
begin
  foreach t in array array['projects','tasks','website_properties','knowledge_documents'] loop
    execute format('drop trigger if exists %I_set_updated_at on public.%I',t,t);
    execute format('create trigger %I_set_updated_at before update on public.%I for each row execute function public.set_updated_at()',t,t);
  end loop;
end $$;

alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.financial_entries enable row level security;
alter table public.website_properties enable row level security;
alter table public.knowledge_documents enable row level security;

drop policy if exists "owner manages projects" on public.projects;
create policy "owner manages projects" on public.projects for all to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
drop policy if exists "owner manages tasks" on public.tasks;
create policy "owner manages tasks" on public.tasks for all to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
drop policy if exists "owner manages financial entries" on public.financial_entries;
create policy "owner manages financial entries" on public.financial_entries for all to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
drop policy if exists "owner manages websites" on public.website_properties;
create policy "owner manages websites" on public.website_properties for all to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
drop policy if exists "owner manages knowledge" on public.knowledge_documents;
create policy "owner manages knowledge" on public.knowledge_documents for all to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

grant select, insert, update, delete on public.projects, public.tasks,
  public.financial_entries, public.website_properties, public.knowledge_documents to authenticated;

-- Approval decisions remain separate from execution. The scope, expiry, and
-- consumption fields support a future server-side execution gate. No external
-- action may run merely because a row has status='approved'.
