import 'server-only';
import * as middlewares from './middlewares';
import type { NextRequest, NextFetchEvent } from 'next/server';

/**
 * Middleware called on all requests matched by the regular expression defined
 * in `config.matcher`.
 *
 * For more information, see
 * {@link https://nextjs.org/docs/app/building-your-application/routing/middleware}.
 */
export async function middleware(request: NextRequest, event: NextFetchEvent) {
  return await middlewares.chainMiddleware([
    middlewares.csrfProtection,
    middlewares.rateLimit,
    middlewares.setInviteCodeCookie,
    middlewares.isSignedOut,
    middlewares.wasInvited,
    middlewares.wasNotInvited,
    middlewares.sentOTP,
    middlewares.isSignedIn,
    middlewares.isChallengerOrHybrid,
    middlewares.isPlayerOrHybrid,
    middlewares.hasNotRegistered,
    middlewares.hasRegistered,
    middlewares.hasNotSignedUpForReminders,
    middlewares.refreshSession,
  ])(request, event);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
