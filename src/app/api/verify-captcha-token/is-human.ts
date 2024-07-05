import 'server-only';
import { readPrivateEnvironmentVariables } from '@/utils/environment/read-private-environment-variables';

export async function isHuman(captchaToken: string): Promise<boolean> {
  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  const { TURNSTILE_SECRET_KEY } = readPrivateEnvironmentVariables();

  const result = await fetch(url, {
    body: JSON.stringify({
      secret: TURNSTILE_SECRET_KEY,
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
