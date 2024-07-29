import { redirectIfOTPNotSent } from '@/services/server/redirect-if-otp-not-sent/redirect-if-otp-not-sent';
import { Builder } from 'builder-pattern';
import { ICookies } from '@/services/server/cookies/i-cookies';
import { NextRequest } from 'next/server';
import { willBeRedirected } from '@/utils/shared/will-be-redirected';

describe('redirectIfOTPNotSent', () => {
  it('redirects the user if it fails to load an email for sign in.', async () => {
    const cookies = Builder<ICookies>()
      .loadEmailForSignIn(() => Promise.resolve(''))
      .build();
    const request = new NextRequest(
      'https://challenge.8by8.us/signin-with-otp',
    );
    const response = await redirectIfOTPNotSent(cookies, request);
    expect(willBeRedirected(response)).toBe(true);
  });

  it('does not redirect the user if it loads an email for sign in.', async () => {
    const cookies = Builder<ICookies>()
      .loadEmailForSignIn(() => Promise.resolve('user@example.com'))
      .build();
    const request = new NextRequest(
      'https://challenge.8by8.us/signin-with-otp',
    );
    const response = await redirectIfOTPNotSent(cookies, request);
    expect(willBeRedirected(response)).toBe(false);
  });
});
