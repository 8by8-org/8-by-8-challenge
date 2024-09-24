import 'server-only';
import {
  NextResponse,
  type NextRequest,
  type NextFetchEvent,
} from 'next/server';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import type { ChainedMiddleware } from './chained-middleware';

export function wasInvited(next: ChainedMiddleware): ChainedMiddleware {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response?: NextResponse,
  ) => {
    if (request.nextUrl.pathname === '/playerwelcome') {
      const cookies = serverContainer.get(SERVER_SERVICE_KEYS.Cookies);
      const inviteCode = cookies.getInviteCode();

      if (!inviteCode) {
        return NextResponse.redirect(
          new URL('/challengerwelcome', request.nextUrl.origin),
        );
      }
    }

    return next(request, event, response);
  };
}
