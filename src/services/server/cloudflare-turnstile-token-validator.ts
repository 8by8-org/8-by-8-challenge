import 'server-only';
import { injectable } from 'inversify';
import {
  AbstractCAPTCHATokenValidator,
  VerifyTokenParams,
} from './abstract-captcha-token-validator';
import { z } from 'zod';

const envSchema = z.object({
  TURNSTILE_SECRET_KEY: z.string().min(1, 'Please provide a value'),
});

/**
 * An implementation of {@link AbstractCAPTCHATokenValidator} that validates
 * a Cloudflare Turnstile token.
 */
@injectable()
export class CloudflareTurnstileTokenValidator extends AbstractCAPTCHATokenValidator {
  public constructor() {
    super();
  }

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
