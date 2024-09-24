import { createSupabaseServiceRoleClient } from '@/services/server/create-supabase-client/create-supabase-service-role-client';
import { SupabaseClient } from '@supabase/supabase-js';

describe('test createSupabaseServiceRoleClient', () => {
  it('creates a SupabaseClient.', () => {
    const test = createSupabaseServiceRoleClient();
    expect(test).toBeInstanceOf(SupabaseClient);
  });
});
