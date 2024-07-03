import { createBrowserClient } from '@supabase/ssr';
import { readPublicEnvironmentVariables } from '@/utils/environment/read-public-environment-variables';
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
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } =
    readPublicEnvironmentVariables();

  return createBrowserClient(
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
