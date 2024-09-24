import { middleware, config } from '@/middleware';
import { SIGNED_IN_ONLY_ROUTES } from '@/middlewares/is-signed-in';
import { SIGNED_OUT_ONLY_ROUTES } from '@/middlewares/is-signed-out';
import { getSignedInRequest } from '@/utils/test/get-signed-in-request';
import { willBeRedirected } from '@/utils/shared/will-be-redirected';
import { resetAuthAndDatabase } from '@/utils/test/reset-auth-and-database';
import { Builder } from 'builder-pattern';
import { NextFetchEvent, NextRequest } from 'next/server';
import { MockNextCookies } from '@/utils/test/mock-next-cookies';
import { createId } from '@paralleldrive/cuid2';
import { SearchParams } from '@/constants/search-params';
import { CookieNames } from '@/constants/cookie-names';
import { SupabaseUserRecordBuilder } from '@/utils/test/supabase-user-record-builder';
import { UserType } from '@/model/enums/user-type';
import { getSignedInRequestWithUser } from '@/utils/test/get-signed-in-request-with-user';
const mockCookies = new MockNextCookies();

jest.mock('next/headers', () => ({
  ...jest.requireActual('next/headers'),
  cookies: () => mockCookies.cookies(),
}));

describe('middleware', () => {
  const host = 'https://challenge.8by8.us';

  afterEach(() => {
    mockCookies.cookies().clear();
    return resetAuthAndDatabase();
  });

  afterAll(() => {
    jest.unmock('next/headers');
  });

  it(`sets a cookie and redirects the user to the same route without the 
    inviteCode search parameter when the inviteCode search parameter is detected.`, async () => {
    const route = '/share';
    const inviteCode = createId();
    const fullPath = `${host}${route}?${SearchParams.InviteCode}=${inviteCode}`;

    const request = new NextRequest(fullPath, {
      method: 'GET',
    });

    const response = await middleware(
      request,
      Builder<NextFetchEvent>().build(),
    );

    expect(willBeRedirected(response)).toBe(true);
    const redirectedTo = response.headers.get('location')?.slice(host.length);
    expect(redirectedTo).toBe(route);
    expect(response?.headers.get('set-cookie')).toEqual(
      expect.stringContaining(`${CookieNames.InviteCode}=${inviteCode}`),
    );
  });

  it(`redirects the user to /progress if the route it receives is signed-out 
  only and the user is signed as a challenger.`, async () => {
    for (const route of SIGNED_OUT_ONLY_ROUTES) {
      const request = await getSignedInRequest(host + route, {
        method: 'GET',
      });

      const response = await middleware(
        request,
        Builder<NextFetchEvent>().build(),
      );

      expect(willBeRedirected(response)).toBe(true);
      const redirectedTo = response.headers.get('location')?.slice(host.length);
      expect(redirectedTo).toBe('/progress');
      await resetAuthAndDatabase();
    }
  });

  it(`redirects the user to /progress if the route it receives is signed-out 
  only and the user is signed as a hybrid-type user.`, async () => {
    const user = await new SupabaseUserRecordBuilder('user@example.com')
      .type(UserType.Hybrid)
      .build();

    const request = await getSignedInRequestWithUser(user, `${host}/signin`, {
      method: 'GET',
    });

    const response = await middleware(
      request,
      Builder<NextFetchEvent>().build(),
    );

    expect(willBeRedirected(response)).toBe(true);
    const redirectedTo = response.headers.get('location')?.slice(host.length);
    expect(redirectedTo).toBe('/progress');
    await resetAuthAndDatabase();
  });

  it(`redirects the user to /actions if the route it receives is signed-out 
  only and the user is signed as a player-type user.`, async () => {
    const user = await new SupabaseUserRecordBuilder('user@example.com')
      .type(UserType.Player)
      .build();

    const request = await getSignedInRequestWithUser(user, `${host}/signin`, {
      method: 'GET',
    });

    const response = await middleware(
      request,
      Builder<NextFetchEvent>().build(),
    );

    expect(willBeRedirected(response)).toBe(true);
    const redirectedTo = response.headers.get('location')?.slice(host.length);
    expect(redirectedTo).toBe('/actions');
    await resetAuthAndDatabase();
  });

  it(`does not redirect the user if the route it receives is signed-out only and
  the user is signed out.`, async () => {
    for (const route of SIGNED_OUT_ONLY_ROUTES) {
      if (route === '/signin-with-otp') continue;

      const request = new NextRequest(host + route, {
        method: 'GET',
      });

      const response = await middleware(
        request,
        Builder<NextFetchEvent>().build(),
      );

      expect(willBeRedirected(response)).toBe(false);
    }
  });

  it('redirects the user if they visit /playerwelcome without an inviteCode.', async () => {
    const request = new NextRequest(host + '/playerwelcome', {
      method: 'GET',
    });

    const response = await middleware(
      request,
      Builder<NextFetchEvent>().build(),
    );

    expect(willBeRedirected(response)).toBe(true);
    const redirectedTo = response.headers.get('location')?.slice(host.length);
    expect(redirectedTo).toBe('/challengerwelcome');
  });

  it(`does not redirect the user if they visit /playerwelcome with an 
  inviteCode.`, async () => {
    const request = new NextRequest(host + '/playerwelcome', {
      method: 'GET',
    });

    mockCookies.cookies().set(CookieNames.InviteCode, createId());

    const response = await middleware(
      request,
      Builder<NextFetchEvent>().build(),
    );

    expect(willBeRedirected(response)).toBe(false);
  });

  it('redirects the user if they visit /challengerwelcome with an inviteCode.', async () => {
    const request = new NextRequest(host + '/challengerwelcome', {
      method: 'GET',
    });

    mockCookies.cookies().set(CookieNames.InviteCode, createId());

    const response = await middleware(
      request,
      Builder<NextFetchEvent>().build(),
    );

    expect(willBeRedirected(response)).toBe(true);
    const redirectedTo = response.headers.get('location')?.slice(host.length);
    expect(redirectedTo).toBe('/playerwelcome');
  });

  it(`does not redirect the user if they visit /challengerwelcome without an 
  inviteCode.`, async () => {
    const request = new NextRequest(host + '/challengerwelcome', {
      method: 'GET',
    });

    const response = await middleware(
      request,
      Builder<NextFetchEvent>().build(),
    );

    expect(willBeRedirected(response)).toBe(false);
  });

  it(`redirects the user if the route it receives is signed-in only and the user
  is signed out.`, async () => {
    for (const route of SIGNED_IN_ONLY_ROUTES) {
      const request = new NextRequest(host + route, {
        method: 'GET',
      });

      const response = await middleware(
        request,
        Builder<NextFetchEvent>().build(),
      );

      expect(willBeRedirected(response)).toBe(true);
      const redirectedTo = response.headers.get('location')?.slice(host.length);
      expect(redirectedTo).toBe('/signin');
    }
  });

  it(`does not redirect the user if the route it receives is signed-in only and
  the user is signed in.`, async () => {
    for (const route of SIGNED_IN_ONLY_ROUTES) {
      const request = await getSignedInRequest(host + route, {
        method: 'GET',
      });
      const response = await middleware(
        request,
        Builder<NextFetchEvent>().build(),
      );
      expect(willBeRedirected(response)).toBe(false);

      await resetAuthAndDatabase();
    }
  });

  it(`redirects the user if they are signed out but haven't been sent a one-time
  passcode and the route can only be accessed if an OTP has been sent.`, async () => {
    const request = new NextRequest(`${host}/signin-with-otp`, {
      method: 'GET',
    });

    const response = await middleware(
      request,
      Builder<NextFetchEvent>().build(),
    );

    expect(willBeRedirected(response)).toBe(true);
    const redirectedTo = response.headers.get('location')?.slice(host.length);
    expect(redirectedTo).toBe('/signin');
  });

  it(`redirects the user to /register/completed if they try to access a child 
  route of /register when they have already completed this action.`, async () => {
    const user = await new SupabaseUserRecordBuilder('user@example.com')
      .completedActions({
        registerToVote: true,
      })
      .build();

    const request = await getSignedInRequestWithUser(
      user,
      host + '/register/eligibility',
      {
        method: 'GET',
      },
    );

    const response = await middleware(
      request,
      Builder<NextFetchEvent>().build(),
    );

    expect(willBeRedirected(response)).toBe(true);
    const redirectedTo = response.headers.get('location')?.slice(host.length);
    expect(redirectedTo).toBe('/register/completed');
  });

  it(`does not redirect the user to if they try to access a child route of 
  register when they have not completed this action.`, async () => {
    const user = await new SupabaseUserRecordBuilder('user@example.com')
      .completedActions({
        registerToVote: false,
      })
      .build();

    const request = await getSignedInRequestWithUser(
      user,
      host + '/register/eligibility',
      {
        method: 'GET',
      },
    );

    const response = await middleware(
      request,
      Builder<NextFetchEvent>().build(),
    );

    expect(willBeRedirected(response)).toBe(false);
  });

  it(`redirects the user to /register/eligibility if they try to access 
  /register/completed before completing this action.`, async () => {
    const user = await new SupabaseUserRecordBuilder('user@example.com')
      .completedActions({
        registerToVote: false,
      })
      .build();

    const request = await getSignedInRequestWithUser(
      user,
      host + '/register/completed',
      {
        method: 'GET',
      },
    );

    const response = await middleware(
      request,
      Builder<NextFetchEvent>().build(),
    );

    expect(willBeRedirected(response)).toBe(true);
    const redirectedTo = response.headers.get('location')?.slice(host.length);
    expect(redirectedTo).toBe('/register/eligibility');
  });

  it(`redirects the user to /reminders/completed if they try to access 
  /reminders when they have already completed this action.`, async () => {
    const user = await new SupabaseUserRecordBuilder('user@example.com')
      .completedActions({
        electionReminders: true,
      })
      .build();

    const request = await getSignedInRequestWithUser(
      user,
      host + '/reminders',
      {
        method: 'GET',
      },
    );

    const response = await middleware(
      request,
      Builder<NextFetchEvent>().build(),
    );

    expect(willBeRedirected(response)).toBe(true);
    const redirectedTo = response.headers.get('location')?.slice(host.length);
    expect(redirectedTo).toBe('/reminders/completed');
  });

  it(`does not redirect the user to if they try to access a /reminders when they 
  have not completed this action.`, async () => {
    const user = await new SupabaseUserRecordBuilder('user@example.com')
      .completedActions({
        electionReminders: false,
      })
      .build();

    const request = await getSignedInRequestWithUser(
      user,
      host + '/reminders',
      {
        method: 'GET',
      },
    );

    const response = await middleware(
      request,
      Builder<NextFetchEvent>().build(),
    );

    expect(willBeRedirected(response)).toBe(false);
  });

  it(`redirects the user if they try to access /progress while signed in as 
  a player-type user.`, async () => {
    const user = await new SupabaseUserRecordBuilder('user@example.com')
      .type(UserType.Player)
      .build();

    const request = await getSignedInRequestWithUser(user, host + '/progress', {
      method: 'GET',
    });

    const response = await middleware(
      request,
      Builder<NextFetchEvent>().build(),
    );

    expect(willBeRedirected(response)).toBe(true);
    const redirectedTo = response.headers.get('location')?.slice(host.length);
    expect(redirectedTo).toBe('/actions');
  });

  it(`does not redirect the user if they try to access /progress while signed in 
  as a challenger-type user.`, async () => {
    const user = await new SupabaseUserRecordBuilder('user@example.com')
      .type(UserType.Challenger)
      .build();

    const request = await getSignedInRequestWithUser(user, host + '/progress', {
      method: 'GET',
    });

    const response = await middleware(
      request,
      Builder<NextFetchEvent>().build(),
    );

    expect(willBeRedirected(response)).toBe(false);
  });

  it(`does not redirect the user if they try to access /progress while signed in 
  as a hybrid-type user.`, async () => {
    const user = await new SupabaseUserRecordBuilder('user@example.com')
      .type(UserType.Hybrid)
      .build();

    const request = await getSignedInRequestWithUser(user, host + '/progress', {
      method: 'GET',
    });

    const response = await middleware(
      request,
      Builder<NextFetchEvent>().build(),
    );

    expect(willBeRedirected(response)).toBe(false);
  });

  it(`redirects the user if they try to access /actions while signed in as 
  a challenger-type user.`, async () => {
    const user = await new SupabaseUserRecordBuilder('user@example.com')
      .type(UserType.Challenger)
      .build();

    const request = await getSignedInRequestWithUser(user, host + '/actions', {
      method: 'GET',
    });

    const response = await middleware(
      request,
      Builder<NextFetchEvent>().build(),
    );

    expect(willBeRedirected(response)).toBe(true);
    const redirectedTo = response.headers.get('location')?.slice(host.length);
    expect(redirectedTo).toBe('/progress');
  });

  it(`does not redirect the user if they try to access /actions while signed in 
  as a player-type user.`, async () => {
    const user = await new SupabaseUserRecordBuilder('user@example.com')
      .type(UserType.Player)
      .build();

    const request = await getSignedInRequestWithUser(user, host + '/actions', {
      method: 'GET',
    });

    const response = await middleware(
      request,
      Builder<NextFetchEvent>().build(),
    );

    expect(willBeRedirected(response)).toBe(false);
  });

  it(`does not redirect the user if they try to access /actions while signed in 
  as a hybrid-type user.`, async () => {
    const user = await new SupabaseUserRecordBuilder('user@example.com')
      .type(UserType.Hybrid)
      .build();

    const request = await getSignedInRequestWithUser(user, host + '/actions', {
      method: 'GET',
    });

    const response = await middleware(
      request,
      Builder<NextFetchEvent>().build(),
    );

    expect(willBeRedirected(response)).toBe(false);
  });

  test(`no other requests are redirected.`, async () => {
    const otherRoutes = ['/why-8by8'];

    for (const route of otherRoutes) {
      const request = new NextRequest(host + route, {
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
