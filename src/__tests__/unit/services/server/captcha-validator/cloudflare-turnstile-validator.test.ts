import { CloudflareTurnstileValidator } from '@/services/server/captcha-validator/cloudflare-turnstile-validator';
import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';
import { CLOUDFLARE_TURNSTILE_DUMMY_SECRET_KEYS } from '@/constants/cloudflare-turnstile-dummy-secret-keys';
import { ServerError } from '@/errors/server-error';

describe('CloudflareTurnstileValidator', () => {
  afterEach(jest.restoreAllMocks);

  it('resolves with true when the token is successfully validated.', async () => {
    jest.replaceProperty(
      PRIVATE_ENVIRONMENT_VARIABLES,
      'TURNSTILE_SECRET_KEY',
      CLOUDFLARE_TURNSTILE_DUMMY_SECRET_KEYS.ALWAYS_PASSES,
    );

    const validator = new CloudflareTurnstileValidator();
    const isHuman = await validator.isHuman('test-token');
    expect(isHuman).toBe(true);
  });

  it('resolves with false when the token is invalid.', async () => {
    jest.replaceProperty(
      PRIVATE_ENVIRONMENT_VARIABLES,
      'TURNSTILE_SECRET_KEY',
      CLOUDFLARE_TURNSTILE_DUMMY_SECRET_KEYS.ALWAYS_BLOCKS,
    );

    const validator = new CloudflareTurnstileValidator();
    const isHuman = await validator.isHuman('test-token');
    expect(isHuman).toBe(false);
  });

  it('resolves with false when the token is already spent.', async () => {
    jest.replaceProperty(
      PRIVATE_ENVIRONMENT_VARIABLES,
      'TURNSTILE_SECRET_KEY',
      CLOUDFLARE_TURNSTILE_DUMMY_SECRET_KEYS.ALREADY_SPENT,
    );

    const validator = new CloudflareTurnstileValidator();
    const isHuman = await validator.isHuman('test-token');
    expect(isHuman).toBe(false);
  });

  it(`throws a ServerError with a statusCode of 500 if an unknown error is
  encountered while validating the token.`, async () => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
      throw new Error('Network error.');
    });

    const validator = new CloudflareTurnstileValidator();
    await expect(validator.isHuman('test-token')).rejects.toThrow(
      new ServerError('There was a problem verifying the captcha token.', 500),
    );
  });
});
