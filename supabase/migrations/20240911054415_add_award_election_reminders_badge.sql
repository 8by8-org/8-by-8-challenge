create function count_badges(user_id uuid)
returns integer
language plpgsql strict
security invoker
as
$$
declare
  badge_count integer;
begin
  select count(*) from badges
  into badge_count
  where badges.challenger_id = count_badges.user_id;

  return badge_count;
end;
$$;

create function award_badge(
  user_id uuid,
  action_type varchar(255),
  player_name varchar(255),
  player_avatar char(1)
)
returns void
-- this function should not be run in strict mode as several parameters can be null
language plpgsql
security invoker
as
$$
declare
  badge_count integer;
begin
  badge_count = count_badges(user_id);

  if badge_count < 8 then
    insert into badges (challenger_id, action_type, player_name, player_avatar)
    values (award_badge.user_id, award_badge.action_type, award_badge.player_name, award_badge.player_avatar);

    badge_count = count_badges(user_id);

    if badge_count >= 8 then
      update users
      set completed_challenge = true
      where users.id = user_id;
    end if;
  end if;
end;
$$;

create function update_contributed_to(
  player_id uuid,
  challenger_invite_code varchar(30),
  challenger_name varchar(255),
  challenger_avatar char(1)
)
returns void
language plpgsql strict
security invoker
as
$$
begin
  if not exists (
    select * from contributed_to
    where contributed_to.player_id = update_contributed_to.player_id
    and contributed_to.challenger_invite_code = update_contributed_to.challenger_invite_code
  ) then
    insert into contributed_to (player_id, challenger_invite_code, challenger_name, challenger_avatar)
    values (
      update_contributed_to.player_id, 
      update_contributed_to.challenger_invite_code, 
      update_contributed_to.challenger_name, 
      update_contributed_to.challenger_avatar
    );
  end if;
end;
$$;

create function award_badge_to_challenger(player_id uuid, challenger_invite_code varchar)
returns void
language plpgsql strict
security invoker
as $$
declare
  challenger_id uuid;
  challenger_name varchar;
  challenger_avatar char;
  player_name varchar;
  player_avatar char;
begin 
  select id, user_name, avatar 
  into challenger_id, challenger_name, challenger_avatar
  from users
  where users.invite_code = challenger_invite_code;

  if challenger_id is null or challenger_name is null or challenger_avatar is null then
    return;
  end if;

  select user_name, avatar 
  into player_name, player_avatar
  from users
  where users.id = player_id;

  assert player_name is not null, 'award_badge_to_challenger() ERROR: player_name must not be null';
  assert player_avatar is not null, 'award_badge_to_challenger() ERROR: player_avatar must not be null';

  perform award_badge(challenger_id, null, player_name, player_avatar);

  perform update_contributed_to(
    award_badge_to_challenger.player_id, 
    award_badge_to_challenger.challenger_invite_code, 
    challenger_name, 
    challenger_avatar
  );
end;
$$;

create function award_action_badge(
  player_id uuid,
  action_type varchar
)
returns void
language plpgsql strict
security invoker
as $$
<<award_action_badge_body>>
declare
  challenger_invite_code varchar;
begin
  select invited_by.challenger_invite_code from invited_by
  into award_action_badge_body.challenger_invite_code
  where invited_by.player_id = award_action_badge.player_id;

  perform award_badge(player_id, action_type, null, null);

  if challenger_invite_code is not null then
    perform award_badge_to_challenger(award_action_badge.player_id, challenger_invite_code);
  end if;
end;
$$;

create function should_award_election_reminders_badge(user_id uuid)
returns boolean
language plpgsql strict
security invoker
as 
$$
begin
  update completed_actions
  set election_reminders = true
  where completed_actions.user_id = should_award_election_reminders_badge.user_id
  and completed_actions.election_reminders = false;

  return found;
end;
$$;

create function award_election_reminders_badge(user_id uuid)
returns record
language plpgsql strict
security invoker
as 
$$
declare
  should_award_badge boolean;
begin
  should_award_badge = should_award_election_reminders_badge(user_id);

  if should_award_badge = true then
    perform award_action_badge(award_election_reminders_badge.user_id, 'electionReminders');
  end if;

  return get_user_by_id(user_id);
end;
$$;
