create function restart_challenge(user_id uuid, new_end_timestamp bigint)
returns record
language plpgsql strict
security invoker
as
$$
begin
  update users 
  set challenge_end_timestamp = restart_challenge.new_end_timestamp
  where users.id = restart_challenge.user_id;

  return get_user_by_id(user_id);
end;
$$
