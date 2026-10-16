create table if not exists public.app_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  revision integer not null default 1 check (revision > 0),
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

revoke all on public.app_state from anon;
grant select, insert, update on public.app_state to authenticated;

drop policy if exists "Users can read their own app data" on public.app_state;
create policy "Users can read their own app data"
  on public.app_state for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own app data" on public.app_state;
create policy "Users can create their own app data"
  on public.app_state for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own app data" on public.app_state;
create policy "Users can update their own app data"
  on public.app_state for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
