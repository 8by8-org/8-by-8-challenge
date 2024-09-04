import 'server-only';
import { bind } from 'undecorated-di';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';
import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';

/**
 * Retrieves [Supabase](https://supabase.com/) credentials from environment
 * variables, calls {@link createServerClient} with those credentials, and
 * returns a {@link SupabaseClient}.
 *
 * @remarks
 * This function is designated server-only and can only be called within
 * server-only code, such as API routes or server components. The client
 * returned by this function has elevated permissions, allowing it to bypass
 * row-level security in order to perform actions such as awarding one user
 * a badge in response to an action taken by another.
 *
 * This client is intended to be used by repository-type services as the
 * SSR client cannot bypass Row-level Security.
 */
export const createSupabaseServiceRoleClient = bind(
  function createSupabaseServiceRoleClient() {
    const supabase = createClient(
      PUBLIC_ENVIRONMENT_VARIABLES.NEXT_PUBLIC_SUPABASE_URL,
      PRIVATE_ENVIRONMENT_VARIABLES.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      },
    );

    return supabase;
  },
  [],
);
