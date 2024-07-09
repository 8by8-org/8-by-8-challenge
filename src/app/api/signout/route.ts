import { NextResponse } from 'next/server';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';

export async function DELETE() {
  const auth = serverContainer.get(SERVER_SERVICE_KEYS.Auth);

  try {
    await auth.signOut();
    return NextResponse.json(
      { message: 'Successfully signed out.' },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json(
      { message: 'There was a problem signing out.' },
      { status: 500 },
    );
  }
}
