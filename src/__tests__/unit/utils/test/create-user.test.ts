import { Builder } from 'builder-pattern';
import { createUser } from '@/utils/test/create-user';
import { AuthError } from '@supabase/supabase-js';
import type { GoTrueAdminApi, SupabaseClient } from '@supabase/supabase-js';
import type { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';

describe('createUser', () => {
  it('handles a challengerInsertionError when creating a new user.', () => {
    const errorMessage = 'test';

    const supabaseAuthAdmin = Builder<GoTrueAdminApi>()
      .createUser(
        jest.fn().mockImplementation(() => {
          return { error: { message: errorMessage } };
        }),
      )
      .build();

    const supabaseAuthClient: SupabaseAuthClient = Builder<SupabaseAuthClient>()
      .admin(supabaseAuthAdmin)
      .signInWithOtp(jest.fn())
      .verifyOtp(jest.fn())
      .getUser(jest.fn())
      .signOut(jest.fn())
      .build();

    const supabaseClient = Builder<SupabaseClient>()
      .auth(supabaseAuthClient)
      .build();

    const createSupabaseClient = () => supabaseClient;

    expect(createUser(createSupabaseClient())).rejects.toThrow(
      new Error(errorMessage),
    );
  });
});
