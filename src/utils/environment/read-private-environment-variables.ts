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
    GOOGLE_MAPS_API_KEY: z
      .string({
        required_error:
          'Could not load environment variable GOOGLE_MAPS_API_KEY',
      })
      .parse(process.env.GOOGLE_MAPS_API_KEY),
    VOTER_REGISTRATION_REPO_ENCRYPTION_KEY: z
      .string({
        required_error:
          'Could not load environment variable VOTER_REGISTRATION_REPO_ENCRYPTION_KEY',
      })
      .transform(async (key: string): Promise<CryptoKey> => {
        const rawKey = new Uint8Array(
          atob(key)
            .split('')
            .map(char => char.charCodeAt(0)),
        );
        const cryptoKey = await crypto.subtle.importKey(
          'raw',
          rawKey,
          { name: 'AES-GCM' },
          true,
          ['encrypt', 'decrypt'],
        );
        return cryptoKey;
      })
      .parseAsync(process.env.VOTER_REGISTRATION_REPO_ENCRYPTION_KEY),
  };
}
