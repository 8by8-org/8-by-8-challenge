import {
  NextResponse,
  type NextRequest,
  type NextFetchEvent,
} from 'next/server';
import { SearchParams } from '@/constants/search-params';
import { CookieNames } from '@/constants/cookie-names';
import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';
import type { ChainedMiddleware } from './chained-middleware';

export function setInviteCodeCookie(
  next: ChainedMiddleware,
): ChainedMiddleware {
  return (
    request: NextRequest,
    event: NextFetchEvent,
    response?: NextResponse,
  ) => {
    const inviteCode = request.nextUrl.searchParams.get(
      SearchParams.InviteCode,
    );

    if (inviteCode) {
      request.nextUrl.searchParams.delete(SearchParams.InviteCode);
      const response = NextResponse.redirect(request.nextUrl);
      response.cookies.set(CookieNames.InviteCode, inviteCode, {
        httpOnly: true,
        sameSite: 'lax',
        secure: PRIVATE_ENVIRONMENT_VARIABLES.APP_ENV === 'production',
      });

      return response;
    }

    return next(request, event, response);
  };
}
