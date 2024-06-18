import { CloudflareTurnstileTokenValidator } from '@/services/server/cloudflare-turnstile-token-validator';
import { DummySecretKeys } from '@/constants/dummy-secret-keys';

describe('ValidateCloudflareTurnstile', () => {
  let validateCloudflareTurnstile: CloudflareTurnstileTokenValidator;

  beforeEach(() => {
    validateCloudflareTurnstile = new CloudflareTurnstileTokenValidator();
  });

  it('returns true with a secret key that always passes', async () => {
    const result = await validateCloudflareTurnstile.isHuman({
      captchaToken: 'test-token',
    });

    expect(result).toBe(true);
  });

  it('returns true with a secret key that always fails', async () => {
    process.env.NEXT_PRIVATE_TURNSTILE_SECRET_KEY =
      DummySecretKeys.ALWAYS_BLOCKS;
    const result = await validateCloudflareTurnstile.isHuman({
      captchaToken: 'test-token',
    });

    expect(result).toBe(false);
  });

  it('returns false with a secret key that is already spent', async () => {
    process.env.NEXT_PRIVATE_TURNSTILE_SECRET_KEY =
      DummySecretKeys.ALREADY_SPENT;
    const result = await validateCloudflareTurnstile.isHuman({
      captchaToken: 'test-token',
    });

    expect(result).toBe(false);
  });

  it('returns false without a token', async () => {
    process.env.NEXT_PRIVATE_TURNSTILE_SECRET_KEY = undefined;
    const result = await validateCloudflareTurnstile.isHuman({
      captchaToken: '',
    });

    expect(result).toBe(false);
  });
});
