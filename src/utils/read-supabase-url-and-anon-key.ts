import { z } from 'zod';

export function readSupabaseUrlAndAnonKey(): [string, string] {
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

  return [url, anonKey];
}
