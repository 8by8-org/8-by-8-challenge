import 'server-only';
import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';

export async function isHuman(captchaToken: string): Promise<boolean> {
  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  const secret_key = PRIVATE_ENVIRONMENT_VARIABLES.TURNSTILE_SECRET_KEY;

  const result = await fetch(url, {
    body: JSON.stringify({
      secret: secret_key,
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
