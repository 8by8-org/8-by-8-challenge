import 'server-only';
import 'reflect-metadata';
import { serverContainer } from './services/server-container';
import { NextFetchEvent, NextMiddleware, type NextRequest } from 'next/server';
import { SERVICE_KEYS } from './services/service-keys';

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  if (isSignedInOnlyRoute(request.nextUrl.pathname)) {
    const isSignedIn = serverContainer.get<NextMiddleware>(
      SERVICE_KEYS.isSignedIn,
    );
    return await isSignedIn(request, event);
  }

  if (isSignedOutOnlyRoute(request.nextUrl.pathname)) {
    const isSignedOut = serverContainer.get<NextMiddleware>(
      SERVICE_KEYS.isSignedOut,
    );
    return await isSignedOut(request, event);
  }

  const refreshSession = serverContainer.get<NextMiddleware>(
    SERVICE_KEYS.refreshSession,
  );
  return await refreshSession(request, event);
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
