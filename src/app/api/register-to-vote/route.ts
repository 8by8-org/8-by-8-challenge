import 'server-only';
import { NextResponse, NextRequest } from 'next/server';
import { ServerError } from '@/errors/server-error';
import { requestBodySchema } from './request-body-schema';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { createRegistrationDataFromRequestBody } from './create-registration-data-from-request-body';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  const auth = serverContainer.get(SERVER_SERVICE_KEYS.Auth);
  let user = await auth.loadSessionUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const userRepo = serverContainer.get(SERVER_SERVICE_KEYS.UserRepository);
  const voterRegistrationDataRepository = serverContainer.get(
    SERVER_SERVICE_KEYS.VoterRegistrationDataRepository,
  );

  try {
    const data = await request.json();
    const requestBody = requestBodySchema.parse(data);
    const fetchResponse = await fetch(
      'https://usvotes-6vsnwycl4q-uw.a.run.app/registertovote',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      },
    );

    const registerToVoteAPI = await fetchResponse.json();
    if (registerToVoteAPI.status !== 'email sent') {
      return NextResponse.json(
        { error: registerToVoteAPI.error },
        { status: fetchResponse.status },
      );
    }

    const registrationData = createRegistrationDataFromRequestBody(requestBody);

    await voterRegistrationDataRepository.insertVoterRegistrationData(
      user.uid,
      registrationData,
    );

    user = await userRepo.awardRegisterToVoteBadge(user.uid);
    return NextResponse.json(user, { status: 200 });
  } catch (e) {
    if (e instanceof ServerError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    } else if (e instanceof ZodError) {
      return NextResponse.json({ error: 'bad data.' }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'An unknown error occurred.' },
      { status: 500 },
    );
  }
}
