import { serverContainer } from '@/services/server/server-container';
import { SERVER_SERVICE_KEYS } from '@/services/server/server-service-keys';
import { AbstractCAPTCHATokenValidator } from '@/services/server/abstract-captcha-token-validator';

describe('serverContainer', () => {
  it('provides an instance of AbstractValidateCloudflareTurnstile.', () => {
    const cloudflareTurnstile =
      serverContainer.get<AbstractCAPTCHATokenValidator>(
        SERVER_SERVICE_KEYS.CAPTCHATokenValidator,
      );
    expect(cloudflareTurnstile).toBeInstanceOf(AbstractCAPTCHATokenValidator);
  });
});
