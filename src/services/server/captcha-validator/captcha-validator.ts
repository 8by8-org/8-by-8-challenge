export interface CaptchaValidator {
  isHuman(captchaToken: string): Promise<boolean>;
}
