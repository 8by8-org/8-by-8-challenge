/**
 * Dummy secret keys for Cloudflare Turnstile to be used in development and
 * testing.
 *
 * For more information about Cloudflare Turnstile, please see
 * {@link https://developers.cloudflare.com/turnstile}
 */
export const DummySecretKeys = <const>{
  ALWAYS_PASSES: '1x0000000000000000000000000000000AA',
  ALWAYS_BLOCKS: '2x0000000000000000000000000000000AA',
  ALREADY_SPENT: '3x0000000000000000000000000000000AA',
};
