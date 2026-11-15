create table public.entries (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  date date not null,
  word_count integer not null check (word_count > 0),
  description text,
  created_at timestamptz not null default now()
);

create index entries_user_date on public.entries (user_id, date);

alter table public.entries enable row level security;

revoke all on public.entries from anon;
revoke all on public.entries from authenticated;
grant select, insert on public.entries to authenticated;

create policy "read own entries" on public.entries
  for select to authenticated using (user_id = (select auth.uid()));

create policy "insert own entries" on public.entries
  for insert to authenticated with check (user_id = (select auth.uid()));
