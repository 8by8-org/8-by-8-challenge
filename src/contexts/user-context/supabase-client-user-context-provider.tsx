'use client';
import { useState, useEffect, useRef, type ReactNode } from 'react';
import { createBrowserClient } from './utils/create-browser-client';
import { User } from '@/model/types/user';
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
import { loadUser } from './utils/load-user';

interface SupabaseClientUserContextProviderProps {
  user: User | null;
  children?: ReactNode;
}

const supabase = createBrowserClient();

export function SupabaseClientUserContextProvider(
  props: SupabaseClientUserContextProviderProps,
) {
  const [user, setUser] = useState<User | null>(props.user);
  const [emailForSignIn, setEmailForSignIn] = useState('');
  const emailForSignInKey = '8by8EmailForSignIn';
  const otpTtl = Duration.fromObject({ hours: 1 }).toMillis();

  function storeEmailForSignIn(email: string) {
    setSessionStorageItemWithExpiry(emailForSignInKey, email, otpTtl);
    setEmailForSignIn(email);
  }

  function loadEmailForSignIn() {
    setEmailForSignIn(
      getSessionStorageItemWithExpiry(emailForSignInKey, z.string()) ?? '',
    );
  }

  function clearEmailForSignIn() {
    sessionStorage.removeItem(emailForSignInKey);
    setEmailForSignIn('');
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

    storeEmailForSignIn(email);
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

    storeEmailForSignIn(email);
  }

  async function signInWithOTP({ otp }: SignInWithOTPParams) {
    const { data, error: authError } = await supabase.auth.verifyOtp({
      email: emailForSignIn,
      token: otp,
      type: 'email',
    });

    if (!data.user || authError) {
      throw new Error('Failed to sign in with OTP.');
    }

    const appUser = await loadUser(data.user.id, supabase);

    setUser(appUser);
    clearEmailForSignIn();
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
        emailForSignIn,
        signUpWithEmail,
        sendOTPToEmail,
        signInWithOTP,
        signOut,
        restartChallenge,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
