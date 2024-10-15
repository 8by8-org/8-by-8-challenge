import { CSRF_COOKIE, CSRF_HEADER } from './constants';
import type { NextRequest } from 'next/server';

export function validateCSRFToken(request: NextRequest) {
  const cookie = request.cookies.get(CSRF_COOKIE);
  const header = request.headers.get(CSRF_HEADER);

  if (!cookie || !cookie.value || !header) return false;

  return header === cookie.value;
}
