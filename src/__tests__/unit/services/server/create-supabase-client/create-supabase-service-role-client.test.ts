import { createSupabaseServiceRoleClient } from '@/services/server/create-supabase-client/create-supabase-service-role-client';
import { SupabaseClient } from '@supabase/supabase-js';

describe('test createSupabaseServiceRoleClient', () => {
  it('calls the createSupabaseServiceRoleClient and expects a supabase client to return', () => {
    const test = createSupabaseServiceRoleClient();
    expect(test).toBeInstanceOf(SupabaseClient<any, 'public', any>);
  });
});
