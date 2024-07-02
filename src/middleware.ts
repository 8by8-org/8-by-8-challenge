import 'server-only';
import { serverContainer } from './services/server-container';
import { NextFetchEvent, type NextRequest } from 'next/server';
import { SERVICE_KEYS } from './services/service-keys';

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  for (const [key, value] of Array.from(request.headers.entries())) {
    console.log(key);
    console.log(value);
    console.log();
  }
  console.log(request.url);

  if (isSignedInOnlyRoute(request.nextUrl.pathname)) {
    const isSignedIn = serverContainer.get(SERVICE_KEYS.isSignedIn);
    return await isSignedIn(request, event);
  } else if (isSignedOutOnlyRoute(request.nextUrl.pathname)) {
    const isSignedOut = serverContainer.get(SERVICE_KEYS.isSignedOut);
    return await isSignedOut(request, event);
  } else {
    const refreshSession = serverContainer.get(SERVICE_KEYS.refreshSession);
    return await refreshSession(request, event);
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

function isSignedInOnlyRoute(pathname: string) {
  const signedInOnlyRoutes = ['/progress'];
  return signedInOnlyRoutes.some(route => pathname.match(route));
}

function isSignedOutOnlyRoute(pathname: string) {
  const signedOutOnlyRoutes = ['/signup', '/signin', '/signin-with-otp'];
  return signedOutOnlyRoutes.some(route => pathname.match(route));
}
