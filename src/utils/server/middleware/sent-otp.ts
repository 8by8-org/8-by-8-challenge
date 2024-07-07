import 'server-only';
import { getEmailForSignInFromCookie } from '../email-for-signin-cookie/get-email-for-signin-from-cookie';
import {
  NextResponse,
  type NextMiddleware,
  type NextRequest,
} from 'next/server';

export const sentOTP: NextMiddleware = async (request: NextRequest) => {
  const emailForSignIn = getEmailForSignInFromCookie();

  if (!emailForSignIn) {
    return NextResponse.redirect(new URL('/signin', request.nextUrl.origin));
  }
};
