import 'server-only';
import { bind } from 'undecorated-di';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';
import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';

export const createSupabaseServerClient = bind(
  function createSupabaseServerClient() {
    const cookieStore = cookies();
    const { NEXT_PUBLIC_SUPABASE_URL: url } = PUBLIC_ENVIRONMENT_VARIABLES;

    const { SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey } =
      PRIVATE_ENVIRONMENT_VARIABLES;

    return createServerClient(url, serviceRoleKey, {
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
