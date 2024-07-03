/**
 * Dummy site keys for Cloudflare Turnstile to be used in development and
 * testing.
 *
 * For more information about Cloudflare Turnstile, please see
 * {@link https://developers.cloudflare.com/turnstile}
 */
export const CLOUDFLARE_TURNSTILE_DUMMY_SITE_KEYS = <const>{
  ALWAYS_PASSES: '1x00000000000000000000AA',
  ALWAYS_BLOCKS: '2x00000000000000000000AB',
  FORCES_CHALLENGE: '3x00000000000000000000FF',
};
