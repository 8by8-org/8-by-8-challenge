import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { ServerError } from '@/errors/server-error';

export async function PUT(request: NextRequest) {
  const auth = serverContainer.get(SERVER_SERVICE_KEYS.Auth);

  try {
    const data = await request.json();

    await auth.loadSessionUser();

    return NextResponse.json(
      { message: 'user message has been returned.' },
      { status: 200 },
    );
  } catch (e) {
    if (e instanceof ServerError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }

    return NextResponse.json({ error: 'Bad data.' }, { status: 400 });
  }
}

