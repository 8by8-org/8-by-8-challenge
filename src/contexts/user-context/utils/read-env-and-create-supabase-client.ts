import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';

/**
 * Reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from
 * process.env and returns an instance of {@link SupabaseClient} which can be
 * used in frontend code. Throws an error if there is a problem reading these
 * environment variables.
 *
 * @returns An instance of {@link SupabaseClient}.
 */
export function readEnvAndCreateSupabaseClient(): SupabaseClient {
  const url = z
    .string()
    .min(
      1,
      'Could not read NEXT_PUBLIC_SUPABASE_URL from .env file. Is this env variable defined?',
    )
    .parse(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = z
    .string()
    .min(
      1,
      'Could not read NEXT_PUBLIC_SUPABASE_ANON_KEY from .env file. Is this env variable defined?',
    )
    .parse(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return createClient(url, anonKey);
}
