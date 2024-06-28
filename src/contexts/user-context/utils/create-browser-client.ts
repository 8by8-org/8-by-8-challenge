import { createBrowserClient as _createBrowserClient } from '@supabase/ssr';
import { readSupabaseUrlAndAnonKey } from '../../../utils/read-supabase-url-and-anon-key';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from
 * process.env and returns an instance of {@link SupabaseClient} which can be
 * used in frontend code. Throws an error if there is a problem reading these
 * environment variables.
 *
 * @returns An instance of {@link SupabaseClient}.
 */
export function createBrowserClient(): SupabaseClient {
  const [url, anonKey] = readSupabaseUrlAndAnonKey();

  return _createBrowserClient(url, anonKey);
}
