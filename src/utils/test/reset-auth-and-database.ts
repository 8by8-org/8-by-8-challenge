import 'server-only';
import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';
import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';
import { deleteAuthUsers } from './delete-auth-users';
import { clearTable } from './clear-table';

/**
 * Clears all data between from the auth/database provider(s). Intended to be
 * called between tests to ensure that tests are not coupled.
 *
 * @remarks
 * This will clear all data from auth and database, so use with caution.
 */
export async function resetAuthAndDatabase() {
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
