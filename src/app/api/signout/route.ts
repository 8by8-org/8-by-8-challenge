import { NextResponse } from 'next/server';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { ServerError } from '@/errors/server-error';

export async function DELETE() {
  const auth = serverContainer.get(SERVER_SERVICE_KEYS.Auth);

  try {
    await auth.signOut();
    return NextResponse.json(
      { message: 'Successfully signed out.' },
      { status: 200 },
    );
  } catch (e) {
    if (e instanceof ServerError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }

    return NextResponse.json(
      { error: 'There was a problem signing out.' },
      { status: 500 },
    );
  }
}
