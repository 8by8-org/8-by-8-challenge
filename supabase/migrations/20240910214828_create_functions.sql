create type completed_actions_obj as (
  election_reminders boolean,
  register_to_vote boolean,
  shared_challenge boolean
);

create type badge_obj as (
  action_type varchar(255), 
  player_name varchar(255), 
  player_avatar char(1)
);

create type invited_by_obj as (
  challenger_invite_code varchar(30),
  challenger_name varchar(255), 
  challenger_avatar char(1)
);

create type contributed_to_obj as (
  challenger_name varchar(255),
  challenger_avatar char(1)
);

create type user_obj as (
  id uuid,
  email varchar,
  user_name varchar,
  avatar char,
  user_type varchar,
  challenge_end_timestamp bigint,
  completed_challenge boolean,
  invite_code varchar,
  completed_actions completed_actions_obj,
  badges badge_obj[],
  invited_by invited_by_obj,
  contributed_to contributed_to_obj[]
);

create function get_user_by_id(user_id uuid)
returns user_obj
language plpgsql
as
$$
declare
  user user_obj;
begin
  if not exists (select * from users where users.id = user_id) then
    return null;
  end if;

  select 
    id, 
    email, 
    user_name, 
    avatar, 
    user_type, 
    challenge_end_timestamp, 
    completed_challenge,
    invite_code
  from users
  into user
  where users.id = user_id;

  select (election_reminders, register_to_vote, shared_challenge)::completed_actions_obj
  from public.completed_actions
  into user.completed_actions
  where public.completed_actions.user_id = get_user_by_id.user_id
  limit 1;

  select (challenger_invite_code, challenger_name, challenger_avatar)::invited_by_obj
  from invited_by
  into user.invited_by
  where invited_by.player_id = user_id
  limit 1;

  select array(
    select (action_type, player_name, player_avatar)::badge_obj
    from badges
    where badges.challenger_id = user_id
  ) into user.badges;

  select array(
    select (challenger_name, challenger_avatar)::contributed_to_obj
    from contributed_to
    where contributed_to.player_id = user_id
  ) into user.contributed_to;

  return user;
end;
$$;