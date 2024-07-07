import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { isHuman } from '../../../utils/server/captcha/is-human';

const requestBodySchema = z.object({
  captchaToken: z.string().min(1, 'Must provide a token.'),
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { captchaToken } = requestBodySchema.parse(data);
    const captchaPassed = await isHuman(captchaToken);

    if (captchaPassed) {
      return NextResponse.json({ message: 'Token verified.' }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: 'Token verification failed.' },
        { status: 401 },
      );
    }
  } catch (e) {
    return NextResponse.json(
      { error: 'There was a problem verifying the token.' },
      { status: 400 },
    );
  }
}
