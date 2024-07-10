import 'server-only';
import { bind } from 'undecorated-di';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';

export const refreshSupabaseSession = bind(async (request: NextRequest) => {
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

  // By calling auth.getUser(), we refresh the user's session.
  await supabase.auth.getUser();

  return supabaseResponse;
}, []);