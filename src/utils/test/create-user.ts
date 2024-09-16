import { UserType } from '@/model/enums/user-type';
import type { CreateSupabaseClient } from '@/services/server/create-supabase-client/create-supabase-client';
import { createBrowserClient } from '@supabase/ssr';
import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';
import { SupabaseUserRepository } from '@/services/server/user-repository/supabase-user-repository';
import { UserRecordParser } from '@/services/server/user-record-parser/user-record-parser';
import { createId } from '@paralleldrive/cuid2';
import { SupabaseClient } from '@supabase/supabase-js';

export function createSupabseClientFunction(): CreateSupabaseClient {
  const createSupabaseClient = () => {
    return createBrowserClient(
      PUBLIC_ENVIRONMENT_VARIABLES.NEXT_PUBLIC_SUPABASE_URL,
      PRIVATE_ENVIRONMENT_VARIABLES.SUPABASE_SERVICE_ROLE_KEY,
    );
  };
  return createSupabaseClient;
}

export function createUserRepository(
  createSupabaseClient: CreateSupabaseClient,
) {
  const userRepository = new SupabaseUserRepository(
    createSupabaseClient,
    new UserRecordParser(),
  );
  return userRepository;
}

export async function createUser(supabase: SupabaseClient<any, 'public', any>) {
  const challengerMetadata = {
    name: 'Challenger',
    avatar: '0',
    type: UserType.Challenger,
    invite_code: createId(),
  };

  const { data: challengerData, error: challengerInsertionError } =
    await supabase.auth.admin.createUser({
      email: 'jondoe@me.com',
      email_confirm: true,
      user_metadata: challengerMetadata,
    });
  if (challengerInsertionError) {
    throw new Error(challengerInsertionError.message);
  }

  const authChallenger = challengerData.user!;
  return authChallenger;
}
