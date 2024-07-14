import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';
import { UserType } from '@/model/enums/user-type';
import { clearTable } from '@/utils/test/clear-table';
import { resetAuthAndDatabase } from '@/utils/test/reset-auth-and-database';
import { createId } from '@paralleldrive/cuid2';
import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import { Builder } from 'builder-pattern';

describe('clearTable', () => {
  afterEach(() => {
    return resetAuthAndDatabase();
  });

  it('clears all rows from a given table.', async () => {
    const supabase = createBrowserClient(
      PUBLIC_ENVIRONMENT_VARIABLES.NEXT_PUBLIC_SUPABASE_URL,
      PRIVATE_ENVIRONMENT_VARIABLES.SUPABASE_SERVICE_ROLE_KEY,
    );

    for (let i = 0; i < 10; i++) {
      const { error } = await supabase.auth.admin.createUser({
        email: `user${i}@example.com`,
        email_confirm: true,
        user_metadata: {
          name: `User ${i}`,
          avatar: '0',
          type: UserType.Challenger,
          invite_code: createId(),
        },
      });

      if (error) throw new Error(error.message);
    }

    const beforeClearTable = await supabase.from('users').select();
    expect(beforeClearTable.data.length).toBe(10);

    await clearTable('users', supabase);
    const afterClearTable = await supabase.from('users').select();
    expect(afterClearTable.data.length).toBe(0);
  });

  it('throws an error if supabase.from().select() returns an error.', async () => {
    const error = new Error('Failed to load records.');

    const supabase = Builder<SupabaseClient>()
      .from(() => ({
        select: () => ({
          data: [],
          error,
        }),
      }))
      .build();

    await expect(clearTable('users', supabase)).rejects.toThrow(error);
  });

  it('throws an error if supabase.from().delete().eq() returns an error.', async () => {
    const error = new Error('Failed to delete records.');

    const supabase = Builder<SupabaseClient>()
      .from(() => ({
        select: () => ({
          data: [
            {
              id: '0',
              name: 'California',
              abbreviation: 'CA',
            },
          ],
          error: null,
        }),
        delete: () => ({
          eq: () => ({
            error,
          }),
        }),
      }))
      .build();

    await expect(clearTable('states', supabase)).rejects.toThrow(error);
  });
});
