import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requestBodySchema } from './request-body-schema';
import { isHuman } from '@/utils/server/is-human';
import { createInviteCode } from './create-invite-code';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, name, avatar, type, captchaToken } =
      requestBodySchema.parse(data);
    const captchaPassed = await isHuman(captchaToken);

    if (!captchaPassed)
      return NextResponse.json(
        { error: 'Could not verify captcha token.' },
        { status: 401 },
      );

    const supabase = createClient(
      PUBLIC_ENVIRONMENT_VARIABLES.NEXT_PUBLIC_SUPABASE_URL,
      PUBLIC_ENVIRONMENT_VARIABLES.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        data: {
          name,
          avatar,
          type,
          invite_code: createInviteCode(),
        },
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status ?? 500 },
      );
    }

    return NextResponse.json(
      { message: 'Successfully created user.' },
      { status: 201 },
    );
  } catch (e) {
    return NextResponse.json({ error: 'Bad data.' }, { status: 400 });
  }
}
