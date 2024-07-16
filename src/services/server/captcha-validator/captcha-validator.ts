/**
 * Provides a method for verifying whether a request made to an API route
 * originated from a human user based on a captcha token sent with the request.
 */
export interface CaptchaValidator {
  isHuman(captchaToken: string): Promise<boolean>;
}
