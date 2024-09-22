revoke execute on all functions in schema public from public;
revoke execute on all functions in schema public from anon, authenticated;
alter default privileges in schema public revoke execute on functions from public;
alter default privileges in schema public revoke execute on functions from anon, authenticated;

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
  contributed_to contributed_to_obj[]
);

create function get_user_by_id(user_id uuid)
/*
  Returning a record instead of a user_obj allows null to be returned.
  If the return type was user_obj, an object with each of its fields set to null
  would be returned instead.
*/
returns record
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