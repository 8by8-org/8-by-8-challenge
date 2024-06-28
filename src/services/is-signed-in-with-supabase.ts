import 'server-only';
import { createServerClient } from '@supabase/ssr';
import {
  NextResponse,
  type NextMiddleware,
  type NextRequest,
} from 'next/server';
import { readSupabaseUrlAndAnonKey } from '@/utils/read-supabase-url-and-anon-key';

export const isSignedInWithSupabase: NextMiddleware = async (
  request: NextRequest,
) => {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(...readSupabaseUrlAndAnonKey(), {
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
