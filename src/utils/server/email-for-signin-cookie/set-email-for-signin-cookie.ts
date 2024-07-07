import 'server-only';
import { cookies } from 'next/headers';
import { EMAIL_FOR_SIGNIN_COOKIE_KEY } from './email-for-signin-cookie-key';
import { DateTime } from 'luxon';

export function setEmailForSignInCookie(email: string) {
  cookies().set(EMAIL_FOR_SIGNIN_COOKIE_KEY, email, {
    expires: DateTime.now().plus({ hours: 1 }).toMillis(),
    sameSite: 'strict',
  });
}
