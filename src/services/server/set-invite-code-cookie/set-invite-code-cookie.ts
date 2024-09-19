import { bind } from 'undecorated-di';
import { NextRequest, NextResponse } from 'next/server';
import { SearchParams } from '@/constants/search-params';
import { CookieNames } from '@/constants/cookie-names';

export const setInviteCodeCookie = bind(function setInviteCodeCookie(
  request: NextRequest,
) {
  const inviteCode = request.nextUrl.searchParams.get(SearchParams.InviteCode);
  request.nextUrl.searchParams.delete(SearchParams.InviteCode);
  const response = NextResponse.redirect(request.nextUrl);

  if (inviteCode) {
    response.cookies.set(CookieNames.InviteCode, inviteCode);
  }

  return response;
}, []);
