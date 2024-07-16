import 'server-only';
import { inject } from 'undecorated-di';
import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';
import { ServerError } from '@/errors/server-error';
import type { CaptchaValidator } from './captcha-validator';

/**
 * Provides a method for verifying whether a request made to an API route
 * originated from a human user based on a Cloudflare Turnstile captcha token
 * sent with the request.
 */
export const CloudflareTurnstileValidator = inject(
  class CloudflareTurnstileValidator implements CaptchaValidator {
    private siteVerifyUrl =
      'https://challenges.cloudflare.com/turnstile/v0/siteverify';

    async isHuman(captchaToken: string): Promise<boolean> {
      try {
        const result = await fetch(this.siteVerifyUrl, {
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
      } catch (e) {
        throw new ServerError(
          'There was a problem verifying the captcha token.',
          500,
        );
      }
    }
  },
  [],
);
