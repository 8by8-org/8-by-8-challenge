import { cookies } from 'next/headers';
import { EMAIL_FOR_SIGNIN_COOKIE_KEY } from './email-for-signin-cookie-key';

export function deleteEmailForSignInCookie() {
  cookies().delete(EMAIL_FOR_SIGNIN_COOKIE_KEY);
}
