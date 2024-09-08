import 'server-only';
import { inject } from 'undecorated-di';
import { cookies } from 'next/headers';
import { DateTime } from 'luxon';
import { CookieNames } from '@/constants/cookie-names';
import type { ICookies } from './i-cookies';

/**
 * An implementation of {@link ICookies}. Provides a mechanism for setting
 * cookies to track various settings, such as the email address to which a
 * one-time passcode was sent. This improves user experience by allowing certain
 * components to be rendered on the server with the user's information
 * pre-populated.
 */
export const Cookies = inject(
  class Cookies implements ICookies {
    setEmailForSignIn(email: string): Promise<void> {
      return new Promise(resolve => {
        cookies().set(CookieNames.EmailForSignIn, email, {
          expires: this.getEmailForSignInCookieExpiry(),
          sameSite: 'strict',
        });
        resolve();
      });
    }

    loadEmailForSignIn(): Promise<string> {
      return new Promise(resolve => {
        const cookie = cookies().get(CookieNames.EmailForSignIn);
        resolve(cookie?.value ?? '');
      });
    }

    clearEmailForSignIn(): void {
      cookies().delete(CookieNames.EmailForSignIn);
    }

    getInviteCode(): string | undefined {
      return cookies().get(CookieNames.InviteCode)?.value;
    }

    clearInviteCode(): void {
      cookies().delete(CookieNames.InviteCode);
    }

    private getEmailForSignInCookieExpiry() {
      return DateTime.now().plus({ hours: 1 }).toMillis();
    }
  },
  [],
);
