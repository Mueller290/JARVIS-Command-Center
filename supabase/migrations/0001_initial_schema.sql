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
    check (workflow_status in ('discovered','under_review','verified','saved','drafting','awaiting_approval','submitted','archived')),
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
    check (status in ('pending','approved','rejected','cancelled','expired')),
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  decision_note text,
  created_at timestamptz not null default now(),
  constraint approvals_opportunity_owner_fk foreign key (opportunity_id, owner_id)
    references public.opportunities(id, owner_id) on delete set null (opportunity_id)
);

create table if not exists public.activity_logs (
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
create index if not exists activity_logs_owner_created_idx on public.activity_logs(owner_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
drop trigger if exists organizations_set_updated_at on public.organizations;
create trigger organizations_set_updated_at before update on public.organizations
for each row execute function public.set_updated_at();
drop trigger if exists opportunities_set_updated_at on public.opportunities;
create trigger opportunities_set_updated_at before update on public.opportunities
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.opportunities enable row level security;
alter table public.approvals enable row level security;
alter table public.activity_logs enable row level security;

create policy "profile owner can read" on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy "profile owner can update" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "owner manages organizations" on public.organizations for all to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "owner manages opportunities" on public.opportunities for all to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "owner reads approvals" on public.approvals for select to authenticated using (owner_id = (select auth.uid()));
create policy "owner requests approvals" on public.approvals for insert to authenticated with check (owner_id = (select auth.uid()) and status = 'pending');
create policy "owner reads activity" on public.activity_logs for select to authenticated using (owner_id = (select auth.uid()));

-- Decision changes go through this function so only a pending request can be decided.
-- This records approval; it does NOT execute the external action.
create or replace function public.decide_approval(p_approval_id uuid, p_decision text, p_decision_note text default null)
returns public.approvals language plpgsql security invoker set search_path = '' as $$
declare v_row public.approvals;
begin
  if p_decision not in ('approved','rejected') then
    raise exception 'Decision must be approved or rejected';
  end if;
  update public.approvals
     set status = p_decision, decided_at = now(), decision_note = p_decision_note
   where id = p_approval_id and owner_id = (select auth.uid()) and status = 'pending'
   returning * into v_row;
  if not found then raise exception 'Approval not found or already decided'; end if;
  insert into public.activity_logs(owner_id,event_type,description,related_record_id)
  values ((select auth.uid()), 'approval_decided', 'Approval ' || p_decision, p_approval_id);
  return v_row;
end;
$$;
revoke all on function public.decide_approval(uuid,text,text) from public;
grant execute on function public.decide_approval(uuid,text,text) to authenticated;
revoke insert, update, delete on public.activity_logs from authenticated;
revoke update, delete on public.approvals from authenticated;
grant select on public.profiles, public.organizations, public.opportunities, public.approvals, public.activity_logs to authenticated;
grant insert, update, delete on public.organizations, public.opportunities to authenticated;
grant insert on public.approvals to authenticated;
