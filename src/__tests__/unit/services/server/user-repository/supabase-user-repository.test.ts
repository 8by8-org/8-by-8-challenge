import { SupabaseUserRepository } from '@/services/server/user-repository/supabase-user-repository';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';
import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';
import { UserRecordParser } from '@/services/server/user-record-parser/user-record-parser';
import { v4 as uuid } from 'uuid';

describe('SupabaseUserRepository', () => {
  let userRepository: InstanceType<typeof SupabaseUserRepository>;

  beforeAll(() => {
    function createServerClient() {
      return createClient(
        PUBLIC_ENVIRONMENT_VARIABLES.NEXT_PUBLIC_SUPABASE_URL,
        PRIVATE_ENVIRONMENT_VARIABLES.SUPABASE_SERVICE_ROLE_KEY,
      );
    }

    userRepository = new SupabaseUserRepository(
      createServerClient,
      new UserRecordParser(),
    );
  });

  it('returns null when getUserById is called and no user is found.', async () => {
    await expect(userRepository.getUserById(uuid())).resolves.toBe(null);
  });
});
