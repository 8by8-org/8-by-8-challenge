import 'server-only';
import { injectable } from 'inversify';

export interface VerifyTokenParams {
  turnstileToken: string;
}

/**
 * A service class that handles Cloudflare Turnstile token verification.
 */
@injectable()
export abstract class AbstractValidateCloudflareTurnstile {
  public abstract verifyToken({
    turnstileToken,
  }: VerifyTokenParams): Promise<boolean>;
}
