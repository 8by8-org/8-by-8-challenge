import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
import { requestBodySchema } from './request-body-schema';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';

export async function POST(request: NextRequest) {
  const auth = serverContainer.get(SERVER_SERVICE_KEYS.Auth);
  const cookies = serverContainer.get(SERVER_SERVICE_KEYS.Cookies);

  try {
    const requestBody = await request.json();
    const { email, otp } = requestBodySchema.parse(requestBody);
    const user = await auth.signInWithEmailAndOTP(email, otp);
    cookies.clearEmailForSignIn();

    return NextResponse.json({ user }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: 'Bad data.' }, { status: 400 });
  }
}
