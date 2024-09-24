import 'server-only';
import {
  NextResponse,
  type NextRequest,
  type NextFetchEvent,
} from 'next/server';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import type { ChainedMiddleware } from './chained-middleware';

export const UNINVITED_ONLY_ROUTES = ['/challengerwelcome'];

export function wasNotInvited(next: ChainedMiddleware): ChainedMiddleware {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response?: NextResponse,
  ) => {
    if (UNINVITED_ONLY_ROUTES.includes(request.nextUrl.pathname)) {
      const cookies = serverContainer.get(SERVER_SERVICE_KEYS.Cookies);
      const inviteCode = cookies.getInviteCode();

      if (inviteCode) {
        return NextResponse.redirect(
          new URL('/playerwelcome', request.nextUrl.origin),
        );
      }
    }

    return next(request, event, response);
  };
}
