import 'server-only';
import { bind } from 'undecorated-di';
import { SERVER_SERVICE_KEYS } from '../keys';
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';
import type { RedirectIfCompletedActionOpts } from './redirect-if-completed-action';
import type { UserRepository } from '../user-repository/user-repository';

/**
 * Reads authentication information from cookies and redirects the user to
 * opts.redirectTo if they have completed the action specified by opts.action.
 */
export const redirectIfSupabaseUserCompletedAction = bind(
  async (
    userRepo: UserRepository,
    request: NextRequest,
    opts: RedirectIfCompletedActionOpts,
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
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser) {
      const user = await userRepo.getUserById(authUser.id);
      if (user?.completedActions[opts.action]) {
        return NextResponse.redirect(
          new URL(opts.redirectTo, request.nextUrl.origin),
        );
      }
    }

    return supabaseResponse;
  },
  [SERVER_SERVICE_KEYS.UserRepository],
);
