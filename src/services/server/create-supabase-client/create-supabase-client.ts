import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * A function that returns a {@link SupabaseClient}.
 */
export interface CreateSupabaseClient {
  (): SupabaseClient;
}
