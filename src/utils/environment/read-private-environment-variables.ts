import 'server-only';
import { z } from 'zod';

/**
 * Reads and validates private environment variables. Can only be invoked from
 * server-side code.
 */
export function readPrivateEnvironmentVariables() {
  return {
    TURNSTILE_SECRET_KEY: z
      .string({
        required_error:
          'Could not load environment variable TURNSTILE_SECRET_KEY.',
      })
      .parse(process.env.TURNSTILE_SECRET_KEY),
    SUPABASE_SERVICE_ROLE_KEY: z
      .string({
        required_error:
          'Could not load environment variable SUPABASE_SERVICE_ROLE_KEY',
      })
      .parse(process.env.SUPABASE_SERVICE_ROLE_KEY),
  };
}
