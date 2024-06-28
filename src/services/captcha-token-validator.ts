export interface VerifyTokenParams {
  captchaToken: string;
}

/**
 * A service that handles CAPTCHA token verification.
 */
export interface CaptchaTokenValidator {
  isHuman({ captchaToken }: VerifyTokenParams): Promise<boolean>;
}
