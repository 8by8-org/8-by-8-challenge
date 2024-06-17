import 'server-only';
import { injectable } from 'inversify';
import {
  AbstractValidateCloudflareTurnstile,
  VerifyTokenParams,
} from './abstract-validate-cloudflare-turnstile';
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PRIVATE_TURNSTILE_SECRET_KEY: z
    .string()
    .min(1, 'Please provide a value'),
});

/**
 * An implementation of {@link AbstractValidateCloudflareTurnstile} that validates
 * a Cloudflare Turnstile token.
 */
@injectable()
export class ValidateCloudflareTurnstile extends AbstractValidateCloudflareTurnstile {
  public constructor() {
    super();
  }

  public async verifyToken({
    turnstileToken,
  }: VerifyTokenParams): Promise<boolean> {
    const env = envSchema.parse(process.env);
    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const secret_key = env.NEXT_PRIVATE_TURNSTILE_SECRET_KEY;

    const result = await fetch(url, {
      body: JSON.stringify({
        secret: secret_key,
        response: turnstileToken,
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
