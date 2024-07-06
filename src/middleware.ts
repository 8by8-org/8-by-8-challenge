import 'server-only';
import { SIGNED_IN_ONLY_ROUTES } from './constants/signed-in-only-routes';
import { SIGNED_OUT_ONLY_ROUTES } from './constants/signed-out-only-routes';
import { isSignedInWithSupabase } from './utils/middleware/is-signed-in-with-supabase';
import { isSignedOutFromSupabase } from './utils/middleware/is-signed-out-from-supabase';
import { refreshSupabaseSession } from './utils/middleware/refresh-supabase-session';
import { NextFetchEvent, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  if (isSignedInOnlyRoute(request.nextUrl.pathname)) {
    return await isSignedInWithSupabase(request, event);
  }

  if (isSignedOutOnlyRoute(request.nextUrl.pathname)) {
    return await isSignedOutFromSupabase(request, event);
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
