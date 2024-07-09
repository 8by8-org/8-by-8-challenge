import 'server-only';
import { inject } from 'undecorated-di';
import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';
import type { CaptchaValidator } from './captcha-validator';

export const CloudflareTurnstileValidator = inject(
  class CloudflareTurnstileValidator implements CaptchaValidator {
    async isHuman(captchaToken: string): Promise<boolean> {
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
  },
  [],
);
