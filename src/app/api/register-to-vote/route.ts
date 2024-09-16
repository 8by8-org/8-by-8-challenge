import 'server-only';
import { NextResponse, NextRequest } from 'next/server';
import { ServerError } from '@/errors/server-error';
import {
  registerBodySchema,
  supabaseRegisterBodySchema,
} from './register-body-schema';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';

export async function POST(response: NextRequest) {
  const auth = serverContainer.get(SERVER_SERVICE_KEYS.Auth);
  const user = await auth.loadSessionUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const userRepo = serverContainer.get(SERVER_SERVICE_KEYS.UserRepository);
  const voterRegistrationRepository = serverContainer.get(
    SERVER_SERVICE_KEYS.VoterRepository,
  );

  try {
    const data = await response.json();
    //creates dataForSupabase using underscores instead of camel case
    const dataForSupabase = { ...data };
    dataForSupabase.user_id = user.uid;
    dataForSupabase.us_state = dataForSupabase.state;
    delete dataForSupabase.state;
    dataForSupabase.eighteen_plus = dataForSupabase.eighteenPlus;
    delete dataForSupabase.eighteenPlus;
    dataForSupabase.id_number = dataForSupabase.idNumber;
    delete dataForSupabase.idNumber;

    const registerBody = registerBodySchema.parse(data);
    const supabaseRegisterBody =
      supabaseRegisterBodySchema.parse(dataForSupabase);
    const fetchResponse = await fetch(
      'https://usvotes-6vsnwycl4q-uw.a.run.app/registertovote',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerBody),
      },
    );

    const registerToVoteAPI = await fetchResponse.json();
    if (registerToVoteAPI.status !== 'email sent') {
      return NextResponse.json(
        { error: registerToVoteAPI.error },
        { status: fetchResponse.status },
      );
    }

    voterRegistrationRepository.insertVoterRegistrationInfo(
      user.uid,
      supabaseRegisterBody,
    );
    userRepo.awardAndUpdateVoterRegistrationBadgeAndAction(user);
    const updatedUser = await userRepo.getUserById(user.uid);
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (e) {
    if (e instanceof ServerError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    return NextResponse.json({ error: 'bad data.' }, { status: 400 });
  }
}
