create function should_award_shared_challenge_badge(user_id uuid)
returns boolean
language plpgsql strict
security invoker
as 
$$
begin
  update completed_actions
  set shared_challenge = true
  where completed_actions.user_id = should_award_shared_challenge_badge.user_id
  and completed_actions.shared_challenge = false;

  return found;
end;
$$;

create function award_shared_challenge_badge(user_id uuid)
returns record
language plpgsql strict
security invoker
as 
$$
declare
  should_award_badge boolean;
begin
  should_award_badge = should_award_shared_challenge_badge(user_id);

  if should_award_badge = true then
    perform award_action_badge(award_shared_challenge_badge.user_id, 'sharedChallenge');
  end if;

  return get_user_by_id(user_id);
end;
$$;


