'use client';
import { useState, useEffect, type PropsWithChildren, useRef } from 'react';
import { readEnvAndCreateSupabaseClient } from './utils/read-env-and-create-supabase-client';
import { User } from '@/model/types/user';
import { DBUserAdapter } from './utils/db-user-adapter';
import {
  SendOTPToEmailParams,
  SignUpWithEmailParams,
  SignInWithOTPParams,
  UserContext,
} from './user-context';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';
import { Duration } from 'luxon';
import { setSessionStorageItemWithExpiry } from '@/utils/set-session-storage-item-with-expiry';
import { getSessionStorageItemWithExpiry } from '@/utils/get-session-storage-item-with-expiry';

const supabase = readEnvAndCreateSupabaseClient();

export function SupabaseUserContextProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [sentOTP, setSentOTP] = useState(false);
  const emailForSignIn = useRef<string>('');
  const emailForSignInKey = '8by8EmailForSignIn';
  const otpTtl = Duration.fromObject({ hours: 1 }).toMillis();

  const setEmailForSignIn = (email: string) => {
    setSessionStorageItemWithExpiry(emailForSignInKey, email, otpTtl);
    emailForSignIn.current = email;
    setSentOTP(true);
  };

  const loadEmailForSignIn = () => {
    emailForSignIn.current =
      getSessionStorageItemWithExpiry(emailForSignInKey, z.string()) ?? '';
    if (emailForSignIn.current) {
      setSentOTP(true);
    }
  };

  const clearEmailForSignIn = () => {
    sessionStorage.removeItem(emailForSignInKey);
    emailForSignIn.current = '';
    setSentOTP(false);
  };

  useEffect(() => {
    loadEmailForSignIn();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      clearEmailForSignIn();

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

  const signUpWithEmail = async ({
    email,
    name,
    avatar,
    type,
    captchaToken,
  }: SignUpWithEmailParams) => {
    const verifyTokenResult = await fetch('/api/verify-captcha-token', {
      method: 'POST',
      body: JSON.stringify({ captchaToken }),
    });

    if (!verifyTokenResult.ok) {
      throw new Error('Failed to verify captcha token.');
    }

    await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        data: {
          name,
          avatar,
          type,
          invite_code: createId(),
        },
      },
    });

    setEmailForSignIn(email);
  };

  const sendOTPToEmail = async ({
    email,
    captchaToken,
  }: SendOTPToEmailParams) => {
    const verifyTokenResult = await fetch('/api/verify-captcha-token', {
      method: 'POST',
      body: JSON.stringify({ captchaToken }),
    });

    if (!verifyTokenResult.ok) {
      throw new Error('Failed to verify captcha token.');
    }

    await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });

    setEmailForSignIn(email);
  };

  const signInWithOTP = async ({ otp, captchaToken }: SignInWithOTPParams) => {
    const verifyTokenResult = await fetch('/api/verify-captcha-token', {
      method: 'POST',
      body: JSON.stringify({ captchaToken }),
    });

    if (!verifyTokenResult.ok) {
      throw new Error('Failed to verify captcha token.');
    }

    await supabase.auth.verifyOtp({
      email: emailForSignIn.current,
      token: otp,
      type: 'email',
    });
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  const restartChallenge = () => {
    throw new Error('not implemented.');
  };

  return (
    <UserContext.Provider
      value={{
        user,
        sentOTP,
        signUpWithEmail,
        sendOTPToEmail,
        signInWithOTP,
        signOut,
        restartChallenge,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
