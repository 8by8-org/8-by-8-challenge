'use client';
import { useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  SendOTPToEmailParams,
  SignUpWithEmailParams,
  SignInWithOTPParams,
  UserContext,
} from './user-context';
import { clearInviteCode } from './clear-invite-code-cookie';
import { clearAllPersistentFormElements, ValueOf } from 'fully-formed';
import { VoterRegistrationForm } from '@/app/register/voter-registration-form';
import type { User } from '@/model/types/user';
import type { InvitedBy } from '@/model/types/invited-by';

/**
 * Props that can be passed from a server component into a
 * {@link ClientSideUserContextProvider} in order to pre-render child components
 * with the user's information pre-populated.
 */
interface ClientSideUserContextProviderProps {
  user: User | null;
  emailForSignIn: string;
  invitedBy: InvitedBy | null;
  children?: ReactNode;
}

/**
 * Receives a {@link User} and an email address to use for signing in from a
 * server component and provides these as React state variables to child
 * components. Provides methods for signing in, signing out, and more.
 *
 * @param props - {@link ClientSideUserContextProviderProps}
 * @returns A {@link UserContext} provider.
 */
export function ClientSideUserContextProvider(
  props: ClientSideUserContextProviderProps,
) {
  const [user, setUser] = useState<User | null>(props.user);
  const [emailForSignIn, setEmailForSignIn] = useState(props.emailForSignIn);
  const [invitedBy, setInvitedBy] = useState<InvitedBy | null>(props.invitedBy);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      clearInviteCode();
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
    setInvitedBy(data.invitedBy as InvitedBy);
  }

  async function gotElectionReminders() {
    if (!user || user.completedActions.electionReminders) return;

    const response = await fetch('/api/award-election-reminders-badge', {
      method: 'PUT',
    });

    if (!response.ok) {
      throw new Error('Failed to award election reminders badge.');
    }

    const data = await response.json();

    if (user) {
      setUser(data.user as User);
    }
  }

  async function signOut() {
    const response = await fetch('/api/signout', {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('There was a problem signing out.');
    }

    setUser(null);
    setInvitedBy(null);
    clearAllPersistentFormElements();
  }

  /* istanbul ignore next */
  async function restartChallenge() {
    throw new Error('not implemented.');
  }

  /* istanbul ignore next */
  async function registerToVote(
    formData: ValueOf<InstanceType<typeof VoterRegistrationForm>>,
  ): Promise<void> {
    return new Promise<void>((_resolve, reject) => {
      setTimeout(() => {
        reject(new Error('not implemented.'));
      }, 3000);
    });
  }

  return (
    <UserContext.Provider
      value={{
        user,
        emailForSignIn,
        invitedBy,
        signUpWithEmail,
        sendOTPToEmail,
        resendOTP,
        signInWithOTP,
        gotElectionReminders,
        signOut,
        restartChallenge,
        registerToVote,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
