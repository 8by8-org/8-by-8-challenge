import { NextMiddlewareResult } from 'next/dist/server/web/types';

/**
 * Returns true if the status of the provided nextMiddlewareResult indicates
 * that the user will be redirected.
 *
 * @param nextMiddlewareResult - {@link NextMiddlewareResult}
 * @returns A boolean indicating whether or not the user will be redirected.
 */
export function willBeRedirected(nextMiddlewareResult: NextMiddlewareResult) {
  if (!nextMiddlewareResult) return false;

  const redirectCodes = [307, 308];

  return redirectCodes.includes(nextMiddlewareResult.status);
}
