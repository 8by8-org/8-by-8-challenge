create table public.keep_alive (
  id bigserial primary key,
  created_at timestamp not null default current_timestamp
);

insert into public.keep_alive default values;

revoke all on public.keep_alive from anon, authenticated;
grant select on public.keep_alive to anon, authenticated;