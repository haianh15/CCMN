update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || jsonb_build_object(
    'must_change_password',
    true
  )
where raw_user_meta_data ->> 'must_change_password' = 'true';

create or replace function public.copy_first_password_requirement_to_app_metadata()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.raw_user_meta_data ->> 'must_change_password' = 'true' then
    new.raw_app_meta_data := coalesce(new.raw_app_meta_data, '{}'::jsonb)
      || jsonb_build_object('must_change_password', true);
  end if;
  return new;
end;
$$;

drop trigger if exists copy_first_password_requirement on auth.users;
create trigger copy_first_password_requirement
  before insert or update of raw_user_meta_data on auth.users
  for each row execute function public.copy_first_password_requirement_to_app_metadata();

revoke all on function public.copy_first_password_requirement_to_app_metadata() from public, anon, authenticated;

create table if not exists public.first_password_change_requests (
  request_id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null check (status in ('processing', 'completed', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists first_password_change_one_processing_request_per_user
  on public.first_password_change_requests (user_id)
  where status = 'processing';

alter table public.first_password_change_requests enable row level security;
revoke all on public.first_password_change_requests from public, anon, authenticated;
grant select, insert, update on public.first_password_change_requests to service_role;

drop policy if exists "Users can read their own app data" on public.app_state;
create policy "Users can read their own app data"
  on public.app_state for select to authenticated
  using (
    (select auth.uid()) = user_id
    and (select auth.jwt() -> 'app_metadata' ->> 'must_change_password') is distinct from 'true'
  );

drop policy if exists "Users can create their own app data" on public.app_state;
create policy "Users can create their own app data"
  on public.app_state for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and (select auth.jwt() -> 'app_metadata' ->> 'must_change_password') is distinct from 'true'
  );

drop policy if exists "Users can update their own app data" on public.app_state;
create policy "Users can update their own app data"
  on public.app_state for update to authenticated
  using (
    (select auth.uid()) = user_id
    and (select auth.jwt() -> 'app_metadata' ->> 'must_change_password') is distinct from 'true'
  )
  with check (
    (select auth.uid()) = user_id
    and (select auth.jwt() -> 'app_metadata' ->> 'must_change_password') is distinct from 'true'
  );
