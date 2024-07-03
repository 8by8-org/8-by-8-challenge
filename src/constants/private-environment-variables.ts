import 'server-only';
import { z } from 'zod';

/**
 * Private environment variables available to server-side code only.
 */
export const PRIVATE_ENVIRONMENT_VARIABLES = {
  TURNSTILE_SECRET_KEY: z
    .string({
      required_error:
        'Could not load environment variable TURNSTILE_SECRET_KEY.',
    })
    .parse(process.env.TURNSTILE_SECRET_KEY),
};
