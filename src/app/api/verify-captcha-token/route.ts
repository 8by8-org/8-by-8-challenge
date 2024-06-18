import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { serverContainer } from '@/services/server/server-container';
import { SERVER_SERVICE_KEYS } from '@/services/server/server-service-keys';
import type { AbstractCAPTCHATokenValidator } from '@/services/server/abstract-captcha-token-validator';

const requestBodySchema = z.object({
  captchaToken: z.string().min(1, 'Must provide a token.'),
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const parsed = requestBodySchema.parse(data);

    const tokenValidator = serverContainer.get<AbstractCAPTCHATokenValidator>(
      SERVER_SERVICE_KEYS.CAPTCHATokenValidator,
    );
    const isHuman = await tokenValidator.isHuman(parsed);

    if (isHuman) {
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
