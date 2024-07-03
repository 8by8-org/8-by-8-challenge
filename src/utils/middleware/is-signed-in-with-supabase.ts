import 'server-only';
import { createServerClient } from '@supabase/ssr';
import {
  NextResponse,
  type NextMiddleware,
  type NextRequest,
} from 'next/server';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';

export const isSignedInWithSupabase: NextMiddleware = async (
  request: NextRequest,
) => {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const {
    NEXT_PUBLIC_SUPABASE_URL: url,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
  } = PUBLIC_ENVIRONMENT_VARIABLES;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/signin', request.nextUrl.origin));
  }

  return supabaseResponse;
};
