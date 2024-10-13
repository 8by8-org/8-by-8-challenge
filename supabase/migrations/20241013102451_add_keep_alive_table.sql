create table keep_alive (
  id bigserial primary key,
  created_at timestamp not null default current_timestamp
);

insert into keep_alive default values;

revoke all privileges on keep_alive from anon, authenticated;