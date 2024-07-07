import 'server-only';
import { SupabaseClientUserContextProvider } from './supabase-client-user-context-provider';
import { createSupabaseServerClient } from '../../utils/supabase/create-supabase-server-client';
import { loadUserFromSupabase } from '../../utils/supabase/load-user-from-supabase';
import { getEmailForSignInFromCookie } from '@/utils/server/email-for-signin-cookie/get-email-for-signin-from-cookie';
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

  const emailForSignIn = getEmailForSignInFromCookie();

  return (
    <SupabaseClientUserContextProvider
      user={user}
      emailForSignIn={emailForSignIn}
    >
      {children}
    </SupabaseClientUserContextProvider>
  );
}
