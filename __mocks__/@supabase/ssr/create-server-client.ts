import type { CookieMethodsServer } from '@supabase/ssr';
import type { SupabaseClientOptions } from '@supabase/supabase-js';

type CreateServerClientOptions = SupabaseClientOptions<'public'> & {
  cookieOptions?: any;
  cookies: CookieMethodsServer;
  cookieEncoding?: 'raw' | 'base64url';
};

export function createServerClient(
  supabaseUrl: string,
  supabaseKey: string,
  options: CreateServerClientOptions,
) {}
