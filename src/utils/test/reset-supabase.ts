import 'server-only';
import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';
import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Clears all data between from Supabase. Intended to be called between tests to
 * ensure that tests are not coupled.
 *
 * @remarks
 * This will clear all data from Supabase auth and database, so use with caution.
 */
export async function resetSupabase() {
  const supabase = createBrowserClient(
    PUBLIC_ENVIRONMENT_VARIABLES.NEXT_PUBLIC_SUPABASE_URL,
    PRIVATE_ENVIRONMENT_VARIABLES.SUPABASE_SERVICE_ROLE_KEY,
  );
  /*
    Most of these delete operations will cascade (for instance, deleting a user 
    from auth.users will delete the corresponding row in public.users, which
    will delete the corresponding rows in badges, contributed_to, etc.), but 
    each table should be cleared in case rows were created in that table that do 
    not reference a user.
  */
  await deleteAuthUsers(supabase);
  await clearTable('users', supabase);
  await clearTable('completed_actions', supabase);
  await clearTable('badges', supabase);
  await clearTable('contributed_to', supabase);
  await clearTable('invited_by', supabase);
}

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

export async function clearTable(
  tableName: string,
  supabase: SupabaseClient,
): Promise<number> {
  const { data: rows, error } = await supabase.from(tableName).select();

  if (error) throw new error();

  for (const row of rows) {
    const { error } = await supabase.from(tableName).delete().eq('id', row.id);
    if (error) throw error;
  }

  return rows.length;
}
