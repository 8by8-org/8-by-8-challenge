import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
import { restartChallengeSchema } from './restart-challenge-schema';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { ServerError } from '@/errors/server-error';

export async function PUT(request: NextRequest) {
  const auth = serverContainer.get(SERVER_SERVICE_KEYS.Auth);
  const userRepository = serverContainer.get(SERVER_SERVICE_KEYS.UserRepository);

  try {
    const data = await request.json();
    const { userId } = restartChallengeSchema.parse(data);

    const user = await auth.loadSessionUser();
    // impossible that frontend and cookie issue.
    if (!user || user.uid !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }
    //sign in so no issue in the user id . please improve it!!!!!!
    const newTimestamp = await userRepository.restartChallenge(userId);

    return NextResponse.json(
      { challengeEndTimestamp: newTimestamp },
      { status: 200 },
    );
  } catch (e) {
    if (e instanceof ServerError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }

    return NextResponse.json({ error: 'Bad data.' }, { status: 400 });
  }
}