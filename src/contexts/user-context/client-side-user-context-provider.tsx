'use client';
import { useState, type ReactNode } from 'react';
import {
  SendOTPToEmailParams,
  SignUpWithEmailParams,
  SignInWithOTPParams,
  UserContext,
} from './user-context';
import { useRouter } from 'next/navigation';
import type { User } from '@/model/types/user';

interface ClientSideUserContextProviderProps {
  user: User | null;
  emailForSignIn: string;
  children?: ReactNode;
}

export function ClientSideUserContextProvider(
  props: ClientSideUserContextProviderProps,
) {
  const [user, setUser] = useState<User | null>(props.user);
  const [emailForSignIn, setEmailForSignIn] = useState(props.emailForSignIn);
  const router = useRouter();

  async function signUpWithEmail(params: SignUpWithEmailParams) {
    const response = await fetch('/api/signup-with-email', {
      method: 'POST',
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to create user.');
    }

    setEmailForSignIn(params.email);

    router.push('/signin-with-otp');
  }

  async function sendOTPToEmail(params: SendOTPToEmailParams) {
    const response = await fetch('/api/send-otp-to-email', {
      method: 'POST',
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to send one-time passcode');
    }

    setEmailForSignIn(params.email);

    router.push('/signin-with-otp');
  }

  async function resendOTP() {
    const response = await fetch('/api/resend-otp-to-email', {
      method: 'POST',
      body: JSON.stringify({ email: emailForSignIn }),
    });

    if (!response.ok) {
      throw new Error('Failed to send one-time passcode');
    }
  }

  async function signInWithOTP({ otp }: SignInWithOTPParams) {
    const response = await fetch('/api/signin-with-otp', {
      method: 'POST',
      body: JSON.stringify({ email: emailForSignIn, otp }),
    });

    if (!response.ok) {
      throw new Error('Failed to sign in with OTP.');
    }

    const data = await response.json();
    setUser(data.user as User);
  }

  async function signOut() {
    const response = await fetch('/api/signout', {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('There was a problem signing out.');
    }

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
