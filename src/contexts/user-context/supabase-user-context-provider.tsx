import 'server-only';
import { SupabaseClientUserContextProvider } from './supabase-client-user-context-provider';
import { createServerClient } from './utils/create-server-client';
import { loadUser } from './utils/load-user';
import type { User } from '@/model/types/user';
import type { PropsWithChildren } from 'react';

export async function SupabaseUserContextProvider({
  children,
}: PropsWithChildren) {
  const supabase = createServerClient();
  const { data } = await supabase.auth.getUser();
  let user: User | null = null;

  if (data.user) {
    try {
      user = await loadUser(data.user.id, supabase);
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
