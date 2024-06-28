import 'server-only';
import { injectable } from 'inversify';
import {
  CaptchaTokenValidator,
  VerifyTokenParams,
} from './captcha-token-validator';
import { z } from 'zod';

const envSchema = z.object({
  TURNSTILE_SECRET_KEY: z
    .string()
    .min(1, 'Could not read TURNSTILE_SECRET_KEY from environment variables.'),
});

/**
 * An implementation of {@link CaptchaTokenValidator} that validates
 * a Cloudflare Turnstile token.
 */
@injectable()
export class CloudflareTurnstileTokenValidator
  implements CaptchaTokenValidator
{
  public async isHuman({ captchaToken }: VerifyTokenParams): Promise<boolean> {
    const env = envSchema.parse(process.env);
    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const secret_key = env.TURNSTILE_SECRET_KEY;

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
}
