import { middleware, config } from '@/middleware';
import { SIGNED_IN_ONLY_ROUTES } from '@/constants/signed-in-only-routes';
import { SIGNED_OUT_ONLY_ROUTES } from '@/constants/signed-out-only-routes';
import * as isSignedInModule from '@/utils/supabase/is-signed-in-with-supabase';
import * as isSignedOutModule from '@/utils/supabase/is-signed-out-from-supabase';
import * as refreshSessionModule from '@/utils/supabase/refresh-supabase-session';
import { Builder } from 'builder-pattern';
import type { NextURL } from 'next/dist/server/web/next-url';
import type { NextRequest, NextFetchEvent } from 'next/server';

jest.mock('@/utils/supabase/is-signed-in-with-supabase', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@/utils/supabase/is-signed-in-with-supabase'),
  };
});

jest.mock('@/utils/supabase/is-signed-out-from-supabase', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@/utils/supabase/is-signed-out-from-supabase'),
  };
});

jest.mock('@/utils/supabase/refresh-supabase-session', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@/utils/supabase/refresh-supabase-session'),
  };
});

describe('middleware', () => {
  const isSignedInSpy = jest
    .spyOn(isSignedInModule, 'isSignedInWithSupabase')
    .mockImplementation();

  const isSignedOutSpy = jest
    .spyOn(isSignedOutModule, 'isSignedOutFromSupabase')
    .mockImplementation();

  const refreshSessionSpy = jest
    .spyOn(refreshSessionModule, 'refreshSupabaseSession')
    .mockImplementation();

  afterEach(() => {
    isSignedInSpy.mockClear();
    isSignedOutSpy.mockClear();
    refreshSessionSpy.mockClear();
  });

  afterAll(() => {
    isSignedInSpy.mockRestore();
    isSignedOutSpy.mockRestore();
    refreshSessionSpy.mockRestore();
  });

  it(`calls isSignedInWithSupabase if the route it intercepts is signed-in 
  only.`, () => {
    for (const route of SIGNED_IN_ONLY_ROUTES) {
      const url = Builder<NextURL>().pathname(route).build();
      const request = Builder<NextRequest>().nextUrl(url).build();
      const event = Builder<NextFetchEvent>().build();

      middleware(request, event);
      expect(isSignedInSpy).toHaveBeenCalledTimes(1);

      isSignedInSpy.mockClear();
    }
  });

  it(`does NOT call isSignedOutFromSupabase if the route it intercepts is
  signed-in only.`, () => {
    for (const route of SIGNED_IN_ONLY_ROUTES) {
      const url = Builder<NextURL>().pathname(route).build();
      const request = Builder<NextRequest>().nextUrl(url).build();
      const event = Builder<NextFetchEvent>().build();

      middleware(request, event);
      expect(isSignedOutSpy).not.toHaveBeenCalled();
    }
  });

  it(`does NOT call refreshSupabaseSession if the route it intercepts is
  signed-in only.`, () => {
    for (const route of SIGNED_IN_ONLY_ROUTES) {
      const url = Builder<NextURL>().pathname(route).build();
      const request = Builder<NextRequest>().nextUrl(url).build();
      const event = Builder<NextFetchEvent>().build();

      middleware(request, event);
      expect(refreshSessionSpy).not.toHaveBeenCalled();
    }
  });

  it(`calls isSignedOutFromSupabase if the route it intercepts is signed-out 
  only.`, () => {
    for (const route of SIGNED_OUT_ONLY_ROUTES) {
      const url = Builder<NextURL>().pathname(route).build();
      const request = Builder<NextRequest>().nextUrl(url).build();
      const event = Builder<NextFetchEvent>().build();

      middleware(request, event);
      expect(isSignedOutSpy).toHaveBeenCalledTimes(1);

      isSignedOutSpy.mockClear();
    }
  });

  it(`does NOT call isSignedInWithSupabase if the route it intercepts is
  signed-out only.`, () => {
    for (const route of SIGNED_OUT_ONLY_ROUTES) {
      const url = Builder<NextURL>().pathname(route).build();
      const request = Builder<NextRequest>().nextUrl(url).build();
      const event = Builder<NextFetchEvent>().build();

      middleware(request, event);
      expect(isSignedInSpy).not.toHaveBeenCalled();
    }
  });

  it(`does NOT call refreshSupabaseSession if the route it intercepts is
  signed-out only.`, () => {
    for (const route of SIGNED_OUT_ONLY_ROUTES) {
      const url = Builder<NextURL>().pathname(route).build();
      const request = Builder<NextRequest>().nextUrl(url).build();
      const event = Builder<NextFetchEvent>().build();

      middleware(request, event);
      expect(refreshSessionSpy).not.toHaveBeenCalled();
    }
  });

  it(`calls refreshSupabaseSession if the route it intercepts is neither 
  signed-in only nor signed-out only.`, () => {
    const route = '/';

    expect(SIGNED_IN_ONLY_ROUTES.includes(route)).toBe(false);
    expect(SIGNED_OUT_ONLY_ROUTES.includes(route)).toBe(false);

    const url = Builder<NextURL>().pathname(route).build();
    const request = Builder<NextRequest>().nextUrl(url).build();
    const event = Builder<NextFetchEvent>().build();

    middleware(request, event);
    expect(refreshSessionSpy).toHaveBeenCalledTimes(1);
  });

  it(`calls neither isSignedInWithSupabase nor isSignedOutFromSupabase if the 
  route it intercepts is neither signed-in only nor signed-out only.`, () => {
    const route = '/';

    expect(SIGNED_IN_ONLY_ROUTES.includes(route)).toBe(false);
    expect(SIGNED_OUT_ONLY_ROUTES.includes(route)).toBe(false);

    const url = Builder<NextURL>().pathname(route).build();
    const request = Builder<NextRequest>().nextUrl(url).build();
    const event = Builder<NextFetchEvent>().build();

    middleware(request, event);
    expect(isSignedInSpy).not.toHaveBeenCalled();
    expect(isSignedOutSpy).not.toHaveBeenCalled();
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
