import 'server-only';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { NextResponse } from 'next/server';
import { UserType } from '@/model/enums/user-type';
import { ServerError } from '@/errors/server-error';

/**
 * An API route that can be called to upgrade a user from UserType.Player to
 * UserType.Hybrid. Will fail if the user is of type UserType.Challenger or
 * UserType.Hybrid.
 */
export async function PUT() {
  try {
    const auth = serverContainer.get(SERVER_SERVICE_KEYS.Auth);
    const user = await auth.loadSessionUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    if (user.type === UserType.Challenger || user.type === UserType.Hybrid) {
      return NextResponse.json(
        { error: 'User has already started the challenge.' },
        { status: 422 },
      );
    }

    const userRepo = serverContainer.get(SERVER_SERVICE_KEYS.UserRepository);
    const updatedUser = await userRepo.makeHybrid(user.uid);
    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (e) {
    if (e instanceof ServerError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }

    return NextResponse.json(
      { error: 'An unknown error occurred.' },
      { status: 500 },
    );
  }
}
