import { serverContainer } from '@/services/server-container';
import { SERVICE_KEYS } from '@/services/service-keys';
import { AbstractCAPTCHATokenValidator } from '@/services/captcha-token-validator';

describe('serverContainer', () => {
  it('provides an instance of AbstractValidateCloudflareTurnstile.', () => {
    const cloudflareTurnstile =
      serverContainer.get<AbstractCAPTCHATokenValidator>(
        SERVICE_KEYS.CaptchaTokenValidator,
      );
    expect(cloudflareTurnstile).toBeInstanceOf(AbstractCAPTCHATokenValidator);
  });
});
