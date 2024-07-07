import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requestBodySchema } from './request-body-schema';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email } = requestBodySchema.parse(data);

    const supabase = createClient(
      PUBLIC_ENVIRONMENT_VARIABLES.NEXT_PUBLIC_SUPABASE_URL,
      PUBLIC_ENVIRONMENT_VARIABLES.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status ?? 500 },
      );
    }

    return NextResponse.json(
      { message: 'OTP has been resent.' },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json({ error: 'Bad data.' }, { status: 400 });
  }
}
