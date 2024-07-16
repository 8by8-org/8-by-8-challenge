import 'server-only';
import { bind } from 'undecorated-di';
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';

/**
 * Reads authentication information from cookies and redirects the user to
 * /progress if they are signed in.
 */
export const redirectIfSignedInWithSupabase = bind(
  async (request: NextRequest) => {
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
        /* istanbul ignore next */
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

    if (user) {
      return NextResponse.redirect(
        new URL('/progress', request.nextUrl.origin),
      );
    }

    return supabaseResponse;
  },
  [],
);
