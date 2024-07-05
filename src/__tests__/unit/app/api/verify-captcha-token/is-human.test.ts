import { isHuman } from '@/app/api/verify-captcha-token/is-human';
import { CLOUDFLARE_TURNSTILE_DUMMY_SECRET_KEYS } from '@/constants/cloudflare-turnstile-dummy-secret-keys';

// there should be a better way to test this
// maybe test based on the response not on the key
// this way we are testing OUR code, not cloudflare's
describe('isHuman()', () => {
  const { TURNSTILE_SECRET_KEY } = process.env;

  afterEach(() => {
    process.env.TURNSTILE_SECRET_KEY = TURNSTILE_SECRET_KEY;
  });

  it('returns true with a secret key that always passes', async () => {
    const result = await isHuman('test-token');
    expect(result).toBe(true);
  });

  it('returns true with a secret key that always fails', async () => {
    process.env.TURNSTILE_SECRET_KEY =
      CLOUDFLARE_TURNSTILE_DUMMY_SECRET_KEYS.ALWAYS_BLOCKS;
    const result = await isHuman('test-token');

    expect(result).toBe(false);
  });

  it('returns false with a secret key that is already spent', async () => {
    process.env.TURNSTILE_SECRET_KEY =
      CLOUDFLARE_TURNSTILE_DUMMY_SECRET_KEYS.ALREADY_SPENT;
    const result = await isHuman('test-token');

    expect(result).toBe(false);
  });

  it('returns false without a token', async () => {
    process.env.TURNSTILE_SECRET_KEY = undefined;
    const result = await isHuman('');

    expect(result).toBe(false);
  });
});
