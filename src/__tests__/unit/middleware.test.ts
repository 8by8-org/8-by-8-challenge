import { middleware, config } from '@/middleware';
import { SIGNED_IN_ONLY_ROUTES } from '@/constants/signed-in-only-routes';
import { SIGNED_OUT_ONLY_ROUTES } from '@/constants/signed-out-only-routes';
import { getSignedInRequest } from '@/utils/test/get-signed-in-request';
import { willBeRedirected } from '@/utils/shared/will-be-redirected';
import { resetAuthAndDatabase } from '@/utils/test/reset-auth-and-database';
import { Builder } from 'builder-pattern';
import { NextFetchEvent, NextRequest } from 'next/server';
import { MockNextCookies } from '@/utils/test/mock-next-cookies';

const mockCookies = new MockNextCookies();

jest.mock('next/headers', () => ({
  ...jest.requireActual('next/headers'),
  cookies: () => mockCookies.cookies(),
}));

describe('middleware', () => {
  afterEach(() => {
    mockCookies.cookies().clear();
    return resetAuthAndDatabase();
  });

  afterAll(() => {
    jest.unmock('next/headers');
  });

  it(`redirects the user if the route it receives is signed-in only and the user
  is signed out.`, async () => {
    for (const route of SIGNED_IN_ONLY_ROUTES) {
      const request = new NextRequest('https://challenge.8by8.us' + route, {
        method: 'GET',
      });

      const response = await middleware(
        request,
        Builder<NextFetchEvent>().build(),
      );

      expect(willBeRedirected(response)).toBe(true);
    }
  });

  it(`does not redirect the user if the route it receives is signed-in only and
  the user is signed in.`, async () => {
    for (const route of SIGNED_IN_ONLY_ROUTES) {
      const request = await getSignedInRequest(
        'https://challenge.8by8.us' + route,
        {
          method: 'GET',
        },
      );
      const response = await middleware(
        request,
        Builder<NextFetchEvent>().build(),
      );
      expect(willBeRedirected(response)).toBe(false);

      await resetAuthAndDatabase();
    }
  });

  it(`redirects the user if the route it receives is signed-out only and the
  user is signed in.`, async () => {
    for (const route of SIGNED_OUT_ONLY_ROUTES) {
      const request = await getSignedInRequest(
        'https://challenge.8by8.us' + route,
        {
          method: 'GET',
        },
      );

      const response = await middleware(
        request,
        Builder<NextFetchEvent>().build(),
      );

      expect(willBeRedirected(response)).toBe(true);

      await resetAuthAndDatabase();
    }
  });

  it(`does not redirect the user if the route it receives is signed-out only and
  the user is signed out.`, async () => {
    for (const route of SIGNED_OUT_ONLY_ROUTES) {
      if (route === '/signin-with-otp') continue;

      const request = new NextRequest('https://challenge.8by8.us' + route, {
        method: 'GET',
      });

      const response = await middleware(
        request,
        Builder<NextFetchEvent>().build(),
      );

      expect(willBeRedirected(response)).toBe(false);
    }
  });

  it(`redirects the user if they are signed out but haven't been sent a one-time
  passcode and the route can only be accessed if an OTP has been sent.`, async () => {
    const request = new NextRequest(
      'https://challenge.8by8.us/signin-with-otp',
      {
        method: 'GET',
      },
    );

    const response = await middleware(
      request,
      Builder<NextFetchEvent>().build(),
    );

    expect(willBeRedirected(response)).toBe(true);
  });

  test(`no other requests are redirected.`, async () => {
    const otherRoutes = ['/', '/why-8by8'];

    for (const route of otherRoutes) {
      const request = new NextRequest('https://challenge.8by8.us' + route, {
        method: 'GET',
      });

      const response = await middleware(
        request,
        Builder<NextFetchEvent>().build(),
      );

      expect(willBeRedirected(response)).toBe(false);
    }
  });

  test('config.matcher does NOT match static resources.', () => {
    const staticResourceRequestUrls = [
      'http://localhost:3000/_next/static/media/8by8-rally.a7bac02f.png',
      'http://localhost:3000/_next/static/media/blob-1.e19b1571.svg',
      'http://localhost:3000/_next/static/media/blob-2.581054b9.svg',
      'http://localhost:3000/_next/static/media/blob-3.bc83ae4f.svg',
      'http://localhost:3000/_next/static/media/8by8-logo.a39d7aad.svg',
      'http://localhost:3000/_next/static/media/feedback-icon.e6274520.svg',
      'http://localhost:3000/_next/static/media/yellow-curve.0236528a.svg',
      'http://localhost:3000/_next/static/media/teal-curve.8a426c54.svg',
    ];

    for (const pattern of config.matcher) {
      const regexp = new RegExp(pattern);
      for (const resourceUrl of staticResourceRequestUrls) {
        expect(regexp.test(resourceUrl)).toBe(false);
      }
    }
  });
});
