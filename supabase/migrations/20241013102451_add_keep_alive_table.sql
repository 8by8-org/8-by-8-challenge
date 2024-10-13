create table public.keep_alive (
  id bigserial primary key,
  created_at timestamp not null default current_timestamp
);

insert into public.keep_alive default values;

alter table public.keep_alive enable row level security;

create policy "keep_alive is viewable by anyone."
on public.keep_alive for select
to authenticated, anon
using ( true );