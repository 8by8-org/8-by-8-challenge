-- Create user table, create an index on invite_code, enable row level security, and set a policy
create table public.users (
  id uuid not null references auth.users on delete cascade,
  email varchar(320) unique not null,
  name varchar(255) not null,
  avatar char(1) not null,
  type varchar(255) not null,
  -- Set the challenge end date to 8 days in the future and save as Unix seconds
  challenge_end_timestamp bigint not null default extract(epoch from now() + interval '8 days'),
  completed_challenge boolean not null default false,
  invite_code varchar(30) unique not null,
  primary key (id)
);

create index invite_code_idx on public.users (invite_code);

alter table public.users enable row level security;

create policy "Users can view their own user data."
on public.users for select
using ( (select auth.uid()) = id );

-- Create completed_actions table, enable row level security, and set a policy
create table public.completed_actions (
  id serial,
  election_reminders boolean not null default false,
  register_to_vote boolean not null default false,
  shared_challenge boolean not null default false,
  user_id uuid unique not null references public.users on delete cascade,
  primary key (id, user_id)
);

alter table public.completed_actions enable row level security;

create policy "Users can view their own completed actions."
on public.completed_actions for select
using ((select auth.uid()) = user_id);

-- Create badges table, enable row level security, and set a policy
create table public.badges (
  id serial,
  action varchar(255),
  player_name varchar(255),
  player_avatar char(1),
  challenger_id uuid not null references public.users on delete cascade,
  primary key (id, challenger_id)
);

alter table public.badges enable row level security;

create policy "Users can view their own badges."
on public.badges for select
using ((select auth.uid()) = challenger_id);

-- Create invited_by table, enable row level security, and set a policy
create table public.invited_by (
  id serial,
  player_id uuid unique not null references public.users on delete cascade,
  challenger_invite_code varchar(30) not null,
  challenger_name varchar(255) not null,
  challenger_avatar char(1) not null,
  primary key (id, player_id)
);

alter table public.invited_by enable row level security;

create policy "Users can view their own invited by data."
on public.invited_by for select
using ((select auth.uid()) = player_id);

-- Create contributed_to table, enable row level security, and set a policy
create table public.contributed_to (
  id serial,
  player_id uuid not null references public.users on delete cascade,
  challenger_name varchar(255) not null,
  challenger_avatar char(1) not null,
  primary key (id, player_id)
);

alter table public.contributed_to enable row level security;

create policy "Users can view their own contributed to data."
on public.contributed_to for select
using ((select auth.uid()) = player_id);

-- Create a function that creates new rows in public.users and public.completed_actions
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (
    id,
    email,
    name, 
    avatar,
    type,
    invite_code
  ) values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'avatar',
    new.raw_user_meta_data ->> 'type',
    new.raw_user_meta_data ->> 'invite_code'
  );

  insert into public.completed_actions (
    user_id
  ) values (
    new.id
  );

  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();