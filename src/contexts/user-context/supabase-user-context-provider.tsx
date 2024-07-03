import 'server-only';
import { SupabaseClientUserContextProvider } from './supabase-client-user-context-provider';
import { createSupabaseServerClient } from './create-supabase-server-client';
import { loadUserFromSupabase } from './load-user-from-supabase';
import type { User } from '@/model/types/user';
import type { PropsWithChildren } from 'react';

export async function SupabaseUserContextProvider({
  children,
}: PropsWithChildren) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  let user: User | null = null;

  if (data.user) {
    try {
      user = await loadUserFromSupabase(data.user.id, supabase);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <SupabaseClientUserContextProvider user={user}>
      {children}
    </SupabaseClientUserContextProvider>
  );
}
