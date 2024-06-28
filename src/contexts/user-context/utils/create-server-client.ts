import 'server-only';
import { createServerClient as _createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { readSupabaseUrlAndAnonKey } from '../../../utils/read-supabase-url-and-anon-key';

export function createServerClient() {
  const cookieStore = cookies();
  const [url, anonKey] = readSupabaseUrlAndAnonKey();

  return _createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options),
        );
      },
    },
  });
}
