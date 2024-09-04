import 'server-only';
import { bind } from 'undecorated-di';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';
import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';

export const createSupabaseServiceRoleClient = bind(
  function createSupabaseServiceRoleClient() {
    const supabase = createClient(
      PUBLIC_ENVIRONMENT_VARIABLES.NEXT_PUBLIC_SUPABASE_URL,
      PRIVATE_ENVIRONMENT_VARIABLES.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      },
    );

    return supabase;
  },
  [],
);
