import 'server-only';
import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';

/**
 * Verifies a CAPTCHA token generated on the client against a token
 * verification endpoint.
 *
 * @param captchaToken - The CAPTCHA token received from the client.
 * @returns A Promise\<boolean\> indicating whether or not the token is
 * valid.
 */
export async function isHuman(captchaToken: string): Promise<boolean> {
  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

  const result = await fetch(url, {
    body: JSON.stringify({
      secret: PRIVATE_ENVIRONMENT_VARIABLES.TURNSTILE_SECRET_KEY,
      response: captchaToken,
    }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const outcome = await result.json();

  return outcome.success;
}
