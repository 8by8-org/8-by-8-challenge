'use client';
import { useState, useEffect, type PropsWithChildren } from 'react';
import { readEnvAndCreateSupabaseClient } from './utils/read-env-and-create-supabase-client';
import { User } from '@/model/types/user';
import { DBUserAdapter } from './utils/db-user-adapter';
import {
  SignInWithEmailParams,
  SignUpWithEmailParams,
  UserContext,
} from './user-context';
import { createId } from '@paralleldrive/cuid2';

const supabase = readEnvAndCreateSupabaseClient();

export function SupabaseUserContextProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const { data: dbUser } = await supabase
          .from('users')
          .select(
            `*,
          completed_actions (election_reminders, register_to_vote, shared_challenge),
          badges (action, player_name, player_avatar),
          invited_by (challenger_invite_code, challenger_name, challenger_avatar),
          contributed_to (challenger_name, challenger_avatar)`,
          )
          .eq('id', session.user.id)
          .limit(1)
          .single();

        const appUser = DBUserAdapter.adaptDBUser(dbUser);

        setUser(appUser);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUpWithEmail = async (params: SignUpWithEmailParams) => {
    const verifyTokenResult = await fetch('/api/verify-captcha-token', {
      method: 'POST',
      body: JSON.stringify({ captchaToken: params.captchaToken }),
    });

    if (!verifyTokenResult.ok) {
      throw new Error('Failed to verify captcha token.');
    }

    await supabase.auth.signUp({
      email: params.email,
      password: 'dummy-password',
      options: {
        data: {
          name: params.name,
          avatar: params.avatar,
          type: params.type,
          invite_code: createId(),
        },
      },
    });
  };

  const signInWithEmail = async (params: SignInWithEmailParams) => {
    const verifyTokenResult = await fetch('/api/verify-captcha-token', {
      method: 'POST',
      body: JSON.stringify({ captchaToken: params.captchaToken }),
    });

    if (!verifyTokenResult.ok) {
      throw new Error('Failed to verify captcha token.');
    }

    await supabase.auth.signInWithPassword({
      email: params.email,
      password: 'dummy-password',
    });
  };

  const signOut = () => {
    supabase.auth.signOut();
  };

  const restartChallenge = () => {
    throw new Error('not implemented.');
  };

  return (
    <UserContext.Provider
      value={{
        user,
        signUpWithEmail,
        signInWithEmail,
        signOut,
        restartChallenge,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
