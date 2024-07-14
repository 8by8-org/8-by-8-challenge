import type { SupabaseClient } from '@supabase/supabase-js';

export async function deleteAuthUsers(
  supabase: SupabaseClient,
): Promise<number> {
  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers();

  if (error) throw error;

  for (const user of users) {
    const { error } = await supabase.auth.admin.deleteUser(user.id);
    if (error) throw error;
  }

  return users.length;
}
