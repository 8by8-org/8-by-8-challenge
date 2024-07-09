import 'server-only';
import { bind } from 'undecorated-di';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';

export const createSupabaseServerClient = bind(
  function createSupabaseServerClient() {
    const cookieStore = cookies();
    const {
      NEXT_PUBLIC_SUPABASE_URL: url,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
    } = PUBLIC_ENVIRONMENT_VARIABLES;

    return createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    });
  },
  [],
);
