import { DBUserAdapter } from './db-user-adapter';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { User } from '@/model/types/user';

export async function loadUser(
  userId: string,
  supabase: SupabaseClient,
): Promise<User | null> {
  const { data: dbUser, error: dbError } = await supabase
    .from('users')
    .select(
      `*,
    completed_actions (election_reminders, register_to_vote, shared_challenge),
    badges (action, player_name, player_avatar),
    invited_by (challenger_invite_code, challenger_name, challenger_avatar),
    contributed_to (challenger_name, challenger_avatar)`,
    )
    .eq('id', userId)
    .limit(1)
    .single();

  if (!dbUser || dbError) {
    await supabase.auth.signOut();
    throw new Error('Could not find user in the database.');
  }

  return DBUserAdapter.adaptDBUser(dbUser);
}
