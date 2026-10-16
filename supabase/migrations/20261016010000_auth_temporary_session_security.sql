create table if not exists public.password_change_security_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  failed_attempts integer not null default 0 check (failed_attempts >= 0),
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.password_change_security_state enable row level security;
revoke all on public.password_change_security_state from anon, authenticated;

create or replace function public.check_password_change_lock()
returns timestamptz
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  account_id uuid := auth.uid();
  current_lock timestamptz;
begin
  if account_id is null then
    raise exception 'Authentication required';
  end if;

  select locked_until into current_lock
  from public.password_change_security_state
  where user_id = account_id;

  if current_lock is not null and current_lock <= now() then
    update public.password_change_security_state
    set failed_attempts = 0, locked_until = null, updated_at = now()
    where user_id = account_id;
    return null;
  end if;
  return current_lock;
end;
$$;

create or replace function public.record_password_change_failure()
returns timestamptz
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  account_id uuid := auth.uid();
  next_attempts integer;
  current_lock timestamptz;
begin
  if account_id is null then
    raise exception 'Authentication required';
  end if;

  insert into public.password_change_security_state (user_id, failed_attempts)
  values (account_id, 1)
  on conflict (user_id) do update
    set failed_attempts = case
      when public.password_change_security_state.locked_until > now() then public.password_change_security_state.failed_attempts
      when public.password_change_security_state.locked_until is not null then 1
      else public.password_change_security_state.failed_attempts + 1
    end,
    updated_at = now();

  select failed_attempts, locked_until
  into next_attempts, current_lock
  from public.password_change_security_state
  where user_id = account_id
  for update;

  if current_lock is not null and current_lock > now() then
    return current_lock;
  end if;

  if next_attempts >= 5 then
    current_lock := now() + interval '15 minutes';
    update public.password_change_security_state
    set locked_until = current_lock, updated_at = now()
    where user_id = account_id;
  end if;
  return current_lock;
end;
$$;

create or replace function public.clear_password_change_failures()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  delete from public.password_change_security_state where user_id = auth.uid();
end;
$$;

create table if not exists public.auth_security_events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) on delete set null,
  event text not null,
  created_at timestamptz not null default now()
);

alter table public.auth_security_events enable row level security;
revoke all on public.auth_security_events from anon, authenticated;

create or replace function public.record_auth_security_event(p_event text)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;
  if p_event not in (
    'LOGIN_SUCCESS',
    'FIRST_LOGIN_PENDING',
    'FIRST_PASSWORD_CHANGE_SUCCESS',
    'PASSWORD_CHANGE_FAILED',
    'PASSWORD_CHANGE_SUCCESS',
    'PASSWORD_CHANGE_LOCKED',
    'ACCOUNT_ACCESS_RESTRICTED'
  ) then
    raise exception 'Unsupported security event';
  end if;

  insert into public.auth_security_events (user_id, event)
  values (auth.uid(), p_event);
end;
$$;

revoke all on function public.check_password_change_lock() from public, anon;
revoke all on function public.record_password_change_failure() from public, anon;
revoke all on function public.clear_password_change_failures() from public, anon;
revoke all on function public.record_auth_security_event(text) from public, anon;
grant execute on function public.check_password_change_lock() to authenticated;
grant execute on function public.record_password_change_failure() to authenticated;
grant execute on function public.clear_password_change_failures() to authenticated;
grant execute on function public.record_auth_security_event(text) to authenticated;

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
