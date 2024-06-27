'use client';
import { useState, useEffect, useRef, type PropsWithChildren } from 'react';
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

// will need to accept a user prop
export function SupabaseUserContextProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [sentOTP, setSentOTP] = useState(false);
  const emailForSignIn = useRef<string>('');
  const emailForSignInKey = '8by8EmailForSignIn';
  const otpTtl = Duration.fromObject({ hours: 1 }).toMillis();

  function setEmailForSignIn(email: string) {
    setSessionStorageItemWithExpiry(emailForSignInKey, email, otpTtl);
    emailForSignIn.current = email;
    setSentOTP(true);
  }

  function loadEmailForSignIn() {
    emailForSignIn.current =
      getSessionStorageItemWithExpiry(emailForSignInKey, z.string()) ?? '';
    if (emailForSignIn.current) {
      setSentOTP(true);
    }
  }

  function clearEmailForSignIn() {
    sessionStorage.removeItem(emailForSignInKey);
    emailForSignIn.current = '';
    setSentOTP(false);
  }

  useEffect(() => {
    loadEmailForSignIn();
  }, []);

  async function signUpWithEmail({
    email,
    name,
    avatar,
    type,
    captchaToken,
  }: SignUpWithEmailParams) {
    const verifyTokenResult = await fetch('/api/verify-captcha-token', {
      method: 'POST',
      body: JSON.stringify({ captchaToken }),
    });

    if (!verifyTokenResult.ok) {
      throw new Error('Failed to verify captcha token.');
    }

    const { error } = await supabase.auth.signInWithOtp({
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

    if (error) throw error;

    setEmailForSignIn(email);
  }

  async function sendOTPToEmail({ email, captchaToken }: SendOTPToEmailParams) {
    const verifyTokenResult = await fetch('/api/verify-captcha-token', {
      method: 'POST',
      body: JSON.stringify({ captchaToken }),
    });

    if (!verifyTokenResult.ok) {
      throw new Error('Failed to verify captcha token.');
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });

    if (error) throw error;

    setEmailForSignIn(email);
  }

  async function signInWithOTP({ otp, captchaToken }: SignInWithOTPParams) {
    const verifyTokenResult = await fetch('/api/verify-captcha-token', {
      method: 'POST',
      body: JSON.stringify({ captchaToken }),
    });

    if (!verifyTokenResult.ok) {
      throw new Error('Failed to verify captcha token.');
    }

    const { data, error: authError } = await supabase.auth.verifyOtp({
      email: emailForSignIn.current,
      token: otp,
      type: 'email',
    });

    if (!data.user || authError) {
      throw new Error('Failed to sign in with OTP.');
    }

    const appUser = await loadUserData(data.user.id);
    setUser(appUser);
    clearEmailForSignIn();
  }

  async function loadUserData(userId: string) {
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .select(
        `*,
        completed_actions (election_reminders, register_to_vote, shared_challenge),
        badges (action, player_name, player_avatar),
        invited_by (challenger_invite_code, challenger_name, challenger_avatar),
        contributed_to (challenger_name, challenger_avatar)`,
      )
      .eq('id', userId)
      .limit(1)
      .single();

    if (!dbUser || dbError) {
      await supabase.auth.signOut();
      throw new Error('Could not find user in the database.');
    }

    return DBUserAdapter.adaptDBUser(dbUser);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  async function restartChallenge() {
    throw new Error('not implemented.');
  }

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
