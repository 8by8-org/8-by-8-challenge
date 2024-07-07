import 'server-only';
import { SIGNED_IN_ONLY_ROUTES } from './constants/signed-in-only-routes';
import { SIGNED_OUT_ONLY_ROUTES } from './constants/signed-out-only-routes';
import { isSignedInWithSupabase } from './utils/supabase/is-signed-in-with-supabase';
import { isSignedOutFromSupabase } from './utils/supabase/is-signed-out-from-supabase';
import { refreshSupabaseSession } from './utils/supabase/refresh-supabase-session';
import { NextFetchEvent, type NextRequest } from 'next/server';
import { sentOTP } from './utils/server/middleware/sent-otp';
import type { NextMiddlewareResult } from 'next/dist/server/web/types';

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  if (isSignedInOnlyRoute(request.nextUrl.pathname)) {
    return await isSignedInWithSupabase(request, event);
  }

  if (isSignedOutOnlyRoute(request.nextUrl.pathname)) {
    const response = await isSignedOutFromSupabase(request, event);

    if (shouldCheckIfSentOTP(request, response)) {
      return sentOTP(request, event);
    } else {
      return response;
    }
  }

  return await refreshSupabaseSession(request, event);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

function isSignedInOnlyRoute(pathname: string) {
  return SIGNED_IN_ONLY_ROUTES.some(route => pathname.match(route));
}

function isSignedOutOnlyRoute(pathname: string) {
  return SIGNED_OUT_ONLY_ROUTES.some(route => pathname.match(route));
}

function shouldCheckIfSentOTP(
  request: NextRequest,
  response: NextMiddlewareResult,
) {
  return (
    !response?.redirected &&
    request.nextUrl.pathname.includes('/signin-with-otp')
  );
}
