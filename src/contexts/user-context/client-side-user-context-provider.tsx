'use client';
import { useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/utils/modal';
import {
  SendOTPToEmailParams,
  SignUpWithEmailParams,
  SignInWithOTPParams,
  UserContext,
} from './user-context';
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
  const [challengeExpired, setChallengeExpired] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Logic to check if the challenge has expired
    if (user && user.challengeEndTimestamp < Date.now()) {
      setChallengeExpired(true);
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
    const response = await fetch('/api/restart-challenge', {
      method: 'PUT',
      body: JSON.stringify({ userId: user?.uid }),
    });

    if (!response.ok) {
      throw new Error('Failed to restart challenge.');
    }

    const data = await response.json();
    setUser(data.user as User);
    setChallengeExpired(false);
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
      {user && challengeExpired && (
        <Modal
          ariaLabel="Challenge Expired"
          theme="dark"
          isOpen={true}
          closeModal={() => {} /* Disable close functionality */}
        >
          <div>
            <h2>Challenge Expired</h2>
            <p>Your challenge has expired. Please restart the challenge.</p>
            <button onClick={restartChallenge}>Restart Challenge</button>
          </div>
        </Modal>
      )}
    </UserContext.Provider>
  );
}