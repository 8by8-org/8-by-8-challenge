import 'server-only';
import { inject } from 'undecorated-di';
import { cookies } from 'next/headers';
import { DateTime } from 'luxon';
import { CookieNames } from '@/constants/cookie-names';
import { Encryptor } from '../encryptor/encryptor';
import { SERVER_SERVICE_KEYS } from '../keys';
import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';
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
    constructor(private encryptor: Encryptor) {}

    async setEmailForSignIn(email: string): Promise<void> {
      const encryptionKey =
        await PRIVATE_ENVIRONMENT_VARIABLES.CRYPTO_KEY_COOKIES;
      const encryptedEmail = await this.encryptor.encrypt(email, encryptionKey);

      return new Promise(resolve => {
        cookies().set(CookieNames.EmailForSignIn, encryptedEmail, {
          expires: this.getEmailForSignInCookieExpiry(),
          httpOnly: true,
          sameSite: 'strict',
          secure: PRIVATE_ENVIRONMENT_VARIABLES.APP_ENV === 'production',
        });
        resolve();
      });
    }

    async loadEmailForSignIn(): Promise<string> {
      const encryptionKey =
        await PRIVATE_ENVIRONMENT_VARIABLES.CRYPTO_KEY_COOKIES;

      return new Promise(resolve => {
        const encryptedEmail = cookies().get(CookieNames.EmailForSignIn);
        const encryptedEmailAsString = encryptedEmail?.value ?? '';
        if (encryptedEmailAsString === '') {
          return resolve('');
        }
        const cookie = this.encryptor.decrypt(
          encryptedEmailAsString,
          encryptionKey,
        );
        resolve(cookie);
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
  [SERVER_SERVICE_KEYS.Encryptor],
);
