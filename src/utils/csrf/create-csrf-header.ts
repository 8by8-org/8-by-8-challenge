import { readCookie } from '../client/read-cookie';
import { CSRF_COOKIE, CSRF_HEADER } from './constants';

/**
 * Can only be called from client-side code. Reads a CSRF token from a cookie
 * and returns an object that can be provided to the headers property of the
 * options object for a fetch request.
 */
export function createCSRFHeader() {
  const token = readCookie(CSRF_COOKIE);

  return {
    [CSRF_HEADER]: token,
  };
}
