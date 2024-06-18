import 'server-only';
import { injectable } from 'inversify';

export interface VerifyTokenParams {
  captchaToken: string;
}

/**
 * A service class that handles CAPTCHA token verification.
 */
@injectable()
export abstract class AbstractCAPTCHATokenValidator {
  public abstract isHuman({
    captchaToken,
  }: VerifyTokenParams): Promise<boolean>;
}
