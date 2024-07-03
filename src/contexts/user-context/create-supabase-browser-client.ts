import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from
 * process.env and returns an instance of {@link SupabaseClient} which can be
 * used in frontend code. Throws an error if there is a problem reading these
 * environment variables.
 *
 * @returns An instance of {@link SupabaseClient}.
 */
export function createSupabaseBrowserClient(): SupabaseClient {
  const {
    NEXT_PUBLIC_SUPABASE_URL: url,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
  } = PUBLIC_ENVIRONMENT_VARIABLES;

  return createBrowserClient(url, anonKey);
}
