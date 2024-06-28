import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { readSupabaseUrlAndAnonKey } from '@/utils/read-supabase-url-and-anon-key';
import type { SignOut } from './signout';

export const signOutFromSupabase: SignOut = async () => {
  const cookieStore = cookies();
  const [url, anonKey] = readSupabaseUrlAndAnonKey();

  const supabase = createServerClient(url, anonKey, {
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

  await supabase.auth.signOut();
};
