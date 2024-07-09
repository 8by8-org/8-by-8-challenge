import type { SupabaseClient } from '@supabase/supabase-js';

export interface CreateSupabaseClient {
  (): SupabaseClient;
}
