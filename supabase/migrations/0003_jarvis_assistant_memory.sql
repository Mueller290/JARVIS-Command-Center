-- Private, user-owned JARVIS conversation memory.
create table if not exists public.jarvis_memory (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) <= 4000),
  memory_type text not null default 'conversation' check (memory_type in ('conversation','preference','project')),
  created_at timestamptz not null default now()
);
create index if not exists jarvis_memory_owner_created_idx on public.jarvis_memory(owner_id, created_at desc);
alter table public.jarvis_memory enable row level security;
create policy "owner manages own JARVIS memory" on public.jarvis_memory
  for all to authenticated using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));
grant select, insert, delete on public.jarvis_memory to authenticated;
