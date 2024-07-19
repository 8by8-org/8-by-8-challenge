import 'server-only';
import { bind } from 'undecorated-di';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';
import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';
import type { SupabaseClient } from '@supabase/supabase-js';

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
 */
export const createSupabaseServerClient = bind(
  function createSupabaseServerClient() {
    const cookieStore = cookies();
    const { NEXT_PUBLIC_SUPABASE_URL: url } = PUBLIC_ENVIRONMENT_VARIABLES;

    const { SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey } =
      PRIVATE_ENVIRONMENT_VARIABLES;

    return createServerClient(url, serviceRoleKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    });
  },
  [],
);
