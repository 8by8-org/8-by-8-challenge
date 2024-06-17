import { ValidateCloudflareTurnstile } from '@/services/server/validate-cloudflare-turnstile';
import { DummySecretKeys } from '@/constants/dummy-secret-keys';

describe('ValidateCloudflareTurnstile', () => {
  let validateCloudflareTurnstile: ValidateCloudflareTurnstile;

  beforeEach(() => {
    validateCloudflareTurnstile = new ValidateCloudflareTurnstile();
  });

  it('returns true with a secret key that always passes', async () => {
    const result = await validateCloudflareTurnstile.verifyToken({
      turnstileToken: 'test-token',
    });

    expect(result).toBe(true);
  });

  it('returns true with a secret key that always fails', async () => {
    process.env.NEXT_PRIVATE_TURNSTILE_SECRET_KEY =
      DummySecretKeys.ALWAYS_BLOCKS;
    const result = await validateCloudflareTurnstile.verifyToken({
      turnstileToken: 'test-token',
    });

    expect(result).toBe(false);
  });

  it('returns false with a secret key that is already spent', async () => {
    process.env.NEXT_PRIVATE_TURNSTILE_SECRET_KEY =
      DummySecretKeys.ALREADY_SPENT;
    const result = await validateCloudflareTurnstile.verifyToken({
      turnstileToken: 'test-token',
    });

    expect(result).toBe(false);
  });

  it('returns false without a token', async () => {
    process.env.NEXT_PRIVATE_TURNSTILE_SECRET_KEY = undefined;
    const result = await validateCloudflareTurnstile.verifyToken({
      turnstileToken: '',
    });

    expect(result).toBe(false);
  });
});
