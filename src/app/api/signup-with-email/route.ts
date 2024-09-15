import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
import { requestBodySchema } from './request-body-schema';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { ServerError } from '@/errors/server-error';

export async function POST(request: NextRequest) {
  const captchaValidator = serverContainer.get(
    SERVER_SERVICE_KEYS.CaptchaValidator,
  );
  const auth = serverContainer.get(SERVER_SERVICE_KEYS.Auth);
  const cookies = serverContainer.get(SERVER_SERVICE_KEYS.Cookies);

  try {
    const data = await request.json();
    const { email, name, avatar, type, captchaToken } =
      requestBodySchema.parse(data);
    const captchaPassed = await captchaValidator.isHuman(captchaToken);

    if (!captchaPassed)
      return NextResponse.json(
        { error: 'Could not verify captcha token.' },
        { status: 401 },
      );

    await auth.signUpWithEmailAndSendOTP(email, name, avatar, type);
    await cookies.setEmailForSignIn(email);

    return NextResponse.json(
      { message: 'Successfully created user.' },
      { status: 201 },
    );
  } catch (e) {
    if (e instanceof ServerError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }

    return NextResponse.json({ error: 'Bad data.' }, { status: 400 });
  }
}
