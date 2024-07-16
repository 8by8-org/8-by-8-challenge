import 'server-only';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from './services/server/keys';
import type { NextFetchEvent, NextRequest } from 'next/server';

/**
 * Middleware called on all requests matched by the regular expression defined
 * in `config.matcher`.
 *
 * For more information, see
 * {@link https://nextjs.org/docs/app/building-your-application/routing/middleware}.
 */
export async function middleware(request: NextRequest, event: NextFetchEvent) {
  return await serverContainer
    .get(SERVER_SERVICE_KEYS.Middleware)
    .processRequest(request, event);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
