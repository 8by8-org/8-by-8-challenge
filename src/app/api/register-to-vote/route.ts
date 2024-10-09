import 'server-only';
import { NextResponse, NextRequest } from 'next/server';
import { requestBodySchema } from './request-body-schema';
import { createRTVRequestBodyFromFormData } from './create-rtv-request-body-from-form-data';
import { RTVResponseBodySchema } from './rtv-response-body-schema';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { ServerError } from '@/errors/server-error';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  const auth = serverContainer.get(SERVER_SERVICE_KEYS.Auth);
  let user = await auth.loadSessionUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const parsed = requestBodySchema.parse(data);
    const RTVRequestBody = createRTVRequestBodyFromFormData(parsed);

    const RTVResponse = await fetch(
      'https://register.rockthevote.com/api/v4/registrations',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(RTVRequestBody),
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
    const { pdfurl: pdfUrl } = RTVResponseBodySchema.parse(
      registrationResponseData,
    );

    const voterRegistrationDataRepository = serverContainer.get(
      SERVER_SERVICE_KEYS.VoterRegistrationDataRepository,
    );

    await voterRegistrationDataRepository.savePDFUrl(user.uid, pdfUrl);

    const userRepo = serverContainer.get(SERVER_SERVICE_KEYS.UserRepository);
    user = await userRepo.awardRegisterToVoteBadge(user.uid);

    return NextResponse.json({ user }, { status: 200 });
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
