'use client';
import { useState, useEffect, type ReactNode } from 'react';
import { createSupabaseBrowserClient } from './create-supabase-browser-client';
import { User } from '@/model/types/user';
import {
  SendOTPToEmailParams,
  SignUpWithEmailParams,
  SignInWithOTPParams,
  UserContext,
} from './user-context';
import { z } from 'zod';
import { Duration } from 'luxon';
import { setSessionStorageItemWithExpiry } from './set-session-storage-item-with-expiry';
import { getSessionStorageItemWithExpiry } from './get-session-storage-item-with-expiry';
import { loadUserFromSupabase } from './load-user-from-supabase';

interface SupabaseClientUserContextProviderProps {
  user: User | null;
  children?: ReactNode;
}

const supabase = createSupabaseBrowserClient();

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

  /*
    Clear emailForSignIn from state and session storage when the user 
    successfully signs in.
  */
  useEffect(() => {
    if (user) {
      clearEmailForSignIn();
    }
  }, [user]);

  async function signUpWithEmail(params: SignUpWithEmailParams) {
    const response = await fetch('/api/signup-with-email', {
      method: 'POST',
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to create user.');
    }

    storeEmailForSignIn(params.email);
  }

  async function sendOTPToEmail(params: SendOTPToEmailParams) {
    const response = await fetch('/api/send-otp-to-email', {
      method: 'POST',
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to send one-time passcode');
    }

    storeEmailForSignIn(params.email);
  }

  async function resendOTP() {
    const response = await fetch('/api/resend-otp-to-email', {
      method: 'POST',
      body: JSON.stringify({ email: emailForSignIn }),
    });

    if (!response.ok) {
      throw new Error('Failed to send one-time passcode');
    }

    storeEmailForSignIn(emailForSignIn);
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

    const appUser = await loadUserFromSupabase(data.user.id, supabase);
    setUser(appUser);
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
        resendOTP,
        signInWithOTP,
        signOut,
        restartChallenge,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
