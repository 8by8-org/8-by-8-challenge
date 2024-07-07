import 'server-only';
import { cookies } from 'next/headers';
import { EMAIL_FOR_SIGNIN_COOKIE_KEY } from './email-for-signin-cookie-key';

export function getEmailForSignInFromCookie() {
  const cookie = cookies().get(EMAIL_FOR_SIGNIN_COOKIE_KEY);
  return cookie?.value ?? '';
}
