import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
import { requestBodySchema } from './request-body-schema';
import { createSupabaseServerClient } from '@/utils/supabase/create-supabase-server-client';
import { deleteEmailForSignInCookie } from '@/utils/server/email-for-signin-cookie/delete-email-for-signin-cookie';
import { loadUserFromSupabase } from '@/utils/supabase/load-user-from-supabase';

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { email, otp } = requestBodySchema.parse(requestBody);

    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: error ? error.message : 'Could not find user.' },
        { status: error ? error.status ?? 500 : 404 },
      );
    }

    try {
      const user = await loadUserFromSupabase(data.user.id, supabase);
      deleteEmailForSignInCookie();
      return NextResponse.json({ user }, { status: 200 });
    } catch (e) {
      return NextResponse.json(
        { error: 'Could not load user data.' },
        { status: 404 },
      );
    }
  } catch (e) {
    return NextResponse.json({ error: 'Bad data.' }, { status: 400 });
  }
}
