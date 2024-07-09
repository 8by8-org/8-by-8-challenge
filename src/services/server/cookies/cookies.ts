import 'server-only';
import { inject } from 'undecorated-di';
import { cookies } from 'next/headers';
import { DateTime } from 'luxon';
import type { ICookies } from './i-cookies';

export const Cookies = inject(
  class Cookies implements ICookies {
    private emailForSignInCookieName = '8by8-email-for-signin';

    setEmailForSignIn(email: string): void {
      cookies().set(this.emailForSignInCookieName, email, {
        expires: this.getEmailForSignInCookieExpiry(),
        sameSite: 'strict',
      });
    }

    loadEmailForSignIn(): string {
      const cookie = cookies().get(this.emailForSignInCookieName);
      return cookie?.value ?? '';
    }

    clearEmailForSignIn(): void {
      cookies().delete(this.emailForSignInCookieName);
    }

    private getEmailForSignInCookieExpiry() {
      return DateTime.now().plus({ hours: 1 }).toMillis();
    }
  },
  [],
);
