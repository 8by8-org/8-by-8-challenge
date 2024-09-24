import { ServerError } from '@/errors/server-error';
import { requestBodySchema } from './request-body-schema';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = requestBodySchema.parse(body);
    const validateAddresses = serverContainer.get(
      SERVER_SERVICE_KEYS.validateAddresses,
    );
    const errors = await validateAddresses(parsed);

    return NextResponse.json({ result: { errors } }, { status: 200 });
  } catch (e) {
    if (e instanceof ServerError) {
      return NextResponse.json(
        { message: e.message },
        { status: e.statusCode },
      );
    } else if (e instanceof ZodError) {
      return NextResponse.json({ message: 'Bad data.' }, { status: 400 });
    }

    return NextResponse.json(
      { message: 'Unknown error encountered.' },
      { status: 500 },
    );
  }
}
