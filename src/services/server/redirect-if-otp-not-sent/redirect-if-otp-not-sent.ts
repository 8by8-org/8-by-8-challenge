import 'server-only';
import { bind } from 'undecorated-di';
import { NextResponse, type NextRequest } from 'next/server';
import { SERVER_SERVICE_KEYS } from '../keys';
import type { ICookies } from '../cookies/i-cookies';

export const redirectIfOTPNotSent = bind(
  async (cookies: ICookies, request: NextRequest) => {
    const emailForSignIn = await cookies.loadEmailForSignIn();

    if (!emailForSignIn) {
      return NextResponse.redirect(new URL('/signin', request.nextUrl.origin));
    }
  },
  [SERVER_SERVICE_KEYS.Cookies],
);
