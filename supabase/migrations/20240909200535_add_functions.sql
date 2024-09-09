create function count_badges(user_id uuid)
returns integer
as $$
declare 
  badge_count integer;
begin
  select count(*)
  from badges
  where badges.challenger_id = user_id
  into badge_count;

  return badge_count;
end;
$$
language plpgsql;

create function award_badge(
  challenger_id uuid, 
  action varchar, 
  player_name varchar,
  player_avatar char
)
returns void
as $$
declare
  badge_count integer;
begin
  badge_count := count_badges(challenger_id);

  if badge_count < 8 then
    insert into badges (challenger_id, action, player_name, player_avatar)
    values (challenger_id, action, player_name, player_avatar);

    badge_count := count_badges(challenger_id);

    if badge_count >= 8 then
      update users set completed_challenge = true where id = challenger_id;
    end if;
  end if;
end;
$$
language plpgsql;

create function update_contributed_to(
  player_id uuid,
  challenger_invite_code varchar,
  challenger_name varchar,
  challenger_avatar char
)
returns void
as $$
begin
  if not exists (
    select * from contributed_to 
    where contributed_to.player_id = player_id
    and contributed_to.challenger_invite_code = challenger_invite_code
  ) then
    insert into contributed_to (player_id, challenger_invite_code, challenger_name, challenger_avatar)
    values (player_id, challenger_invite_code, challenger_name, challenger_avatar);
  end if;
end;
$$ language plpgsql;

create function award_badge_to_challenger(player_id uuid, invite_code varchar)
returns void
as $$
declare
  challenger_id uuid;
  challenger_name varchar;
  challenger_avatar char;
  player_name varchar;
  player_avatar char;
begin 
  select id, name, avatar 
  into challenger_id, challenger_name, challenger_avatar
  from users
  where users.invite_code = invite_code;

  select name, avatar 
  into player_name, player_avatar
  from users
  where users.id = player_id;

  perform award_badge(challenger_id, null, player_name, player_avatar);

  perform update_contributed_to(
    player_id, 
    invite_code, 
    challenger_name, 
    challenger_avatar
  );
end;
$$ language plpgsql;

create function award_action_badge(
  player_id uuid,
  action varchar
)
returns void
as $$
declare
  invite_code varchar;
begin
  select invite_code from users
  into invite_code
  where users.id = player_id;

  perform award_badge(player_id, action, null, null);

  if invite_code is not null then
    perform award_badge_to_challenger(player_id, invite_code);
  end if;
end;
$$ language plpgsql;

create function award_election_reminders_badge(user_id uuid)
returns void
as $$
declare
  has_completed_election_reminders boolean; 
begin
  select election_reminders from completed_actions
  into has_completed_election_reminders
  where completed_actions.user_id = user_id;

  if has_completed_election_reminders != true then
    update completed_actions
    set completed_actions.election_reminders = true
    where completed_actions.user_id = user_id;

    perform award_action_badge(user_id, 'electionReminders');
  end if;
end;
$$ language plpgsql;
