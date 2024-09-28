create function make_player_hybrid(user_id uuid)
returns void
language plpgsql strict
security invoker
as 
$$
<<make_player_hybrid_body>>
declare
  challenger_invite_code varchar;
begin
  update users set user_type = 'hybrid'
  where users.id = make_player_hybrid.user_id
  and users.user_type = 'player';

  if found = true then
    select invited_by.challenger_invite_code from invited_by
    into make_player_hybrid_body.challenger_invite_code
    where invited_by.player_id = make_player_hybrid.user_id;

    if make_player_hybrid_body.challenger_invite_code is not null then
      perform award_badge_to_challenger(user_id, challenger_invite_code);
    end if;
  end if;
end;
$$;

create function make_hybrid(user_id uuid)
returns record
language plpgsql strict
security invoker
as
$$
<<make_hybrid_body>>
declare 
  user_type varchar;
begin 
  select users.user_type from public.users
  into make_hybrid_body.user_type
  where users.id = make_hybrid.user_id;

  if make_hybrid_body.user_type = 'player' then
    perform make_player_hybrid(user_id);
  else
    if make_hybrid_body.user_type = 'challenger' then
      update users set user_type = 'hybrid'
      where users.id = make_hybrid.user_id;
    end if;
  end if;

  return get_user_by_id(user_id);
end;
$$;