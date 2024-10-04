import 'server-only';
import { NextResponse, NextRequest } from 'next/server';
import { ServerError } from '@/errors/server-error';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  const auth = serverContainer.get(SERVER_SERVICE_KEYS.Auth);
  let user = await auth.loadSessionUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const data = await request.json();

    // frontend sends form data
    // need to verify that, then transform it for RTV

    const RTVResponse = await fetch(
      'https://register.rockthevote.com/api/v4/registrations',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );

    if (!RTVResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to create voter registration paperwork.' },
        {
          status: RTVResponse.status,
        },
      );
    }

    const registrationResponseData = await RTVResponse.json();
    const { pdfurl } = registrationResponseData;

    const voterRegistrationDataRepository = serverContainer.get(
      SERVER_SERVICE_KEYS.VoterRegistrationDataRepository,
    );

    await voterRegistrationDataRepository.savePDFUrl(user.uid, pdfurl);

    const userRepo = serverContainer.get(SERVER_SERVICE_KEYS.UserRepository);
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
