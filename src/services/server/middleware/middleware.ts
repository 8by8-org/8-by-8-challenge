import 'server-only';
import { inject } from 'undecorated-di';
import { SERVER_SERVICE_KEYS } from '../keys';
import { SIGNED_IN_ONLY_ROUTES } from '@/constants/signed-in-only-routes';
import { SIGNED_OUT_ONLY_ROUTES } from '@/constants/signed-out-only-routes';
import type { IMiddleware } from './i-middleware.interface';
import type { NextRequest, NextFetchEvent } from 'next/server';
import type {
  NextMiddleware,
  NextMiddlewareResult,
} from 'next/dist/server/web/types';

export const Middleware = inject(
  class Middleware implements IMiddleware {
    constructor(
      private redirectIfOTPNotSent: NextMiddleware,
      private redirectIfSignedIn: NextMiddleware,
      private redirectIfSignedOut: NextMiddleware,
      private refreshSession: NextMiddleware,
    ) {}

    async processRequest(
      request: NextRequest,
      event: NextFetchEvent,
    ): Promise<NextMiddlewareResult> {
      if (this.isSignedInOnlyRoute(request.nextUrl.pathname)) {
        return await this.redirectIfSignedOut(request, event);
      }

      if (this.isSignedOutOnlyRoute(request.nextUrl.pathname)) {
        const response = await this.redirectIfSignedIn(request, event);

        if (this.shouldCheckIfSentOTP(request, response)) {
          return this.redirectIfOTPNotSent(request, event);
        } else {
          return response;
        }
      }

      return await this.refreshSession(request, event);
    }

    private isSignedInOnlyRoute(pathname: string) {
      return SIGNED_IN_ONLY_ROUTES.some(route => pathname.match(route));
    }

    private isSignedOutOnlyRoute(pathname: string) {
      return SIGNED_OUT_ONLY_ROUTES.some(route => pathname.match(route));
    }

    private shouldCheckIfSentOTP(
      request: NextRequest,
      response: NextMiddlewareResult,
    ) {
      return (
        !response?.redirected &&
        request.nextUrl.pathname.includes('/signin-with-otp')
      );
    }
  },
  [
    SERVER_SERVICE_KEYS.redirectIfOTPNotSent,
    SERVER_SERVICE_KEYS.redirectIfSignedIn,
    SERVER_SERVICE_KEYS.redirectIfSignedOut,
    SERVER_SERVICE_KEYS.refreshSession,
  ],
);