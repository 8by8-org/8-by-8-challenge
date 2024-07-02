import 'server-only';
import { bind } from 'undecorated-di';
import { createServerClient } from '@supabase/ssr';
import {
  NextResponse,
  type NextMiddleware,
  type NextRequest,
} from 'next/server';
import { readSupabaseUrlAndAnonKey } from '@/utils/read-supabase-url-and-anon-key';

const isSignedOutFromSupabase: NextMiddleware = async (
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

  console.log('In isSignedOut');
  console.log(user);
  console.log();

  if (user) {
    return NextResponse.redirect(new URL('/progress', request.nextUrl.origin));
  }

  return supabaseResponse;
};

export default bind(isSignedOutFromSupabase, []);
