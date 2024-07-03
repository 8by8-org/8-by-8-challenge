import { z } from 'zod';

/**
 * Public environment variables available to both client-side and server-side
 * code.
 */
export const PUBLIC_ENVIRONMENT_VARIABLES = {
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z
    .string({
      required_error:
        'Could not find environment variable NEXT_PUBLIC_TURNSTILE_SITE_KEY.',
    })
    .parse(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY),
  NEXT_PUBLIC_SUPABASE_URL: z
    .string({
      required_error:
        'Could not find environment variable NEXT_PUBLIC_SUPABASE_URL.',
    })
    .parse(process.env.NEXT_PUBLIC_SUPABASE_URL),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string({
      required_error:
        'Could not find environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    })
    .parse(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
};
