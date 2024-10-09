'use client';
import { createNamedContext } from '../../hooks/create-named-context';
import { VoterRegistrationForm } from '@/app/register/voter-registration-form';
import type { User } from '../../model/types/user';
import type { Avatar } from '@/model/types/avatar';
import type { ValueOf } from 'fully-formed';
import type { ChallengerData } from '@/model/types/challenger-data';

interface SignUpWithEmailParams {
  email: string;
  name: string;
  avatar: Avatar;
  captchaToken: string;
}

interface SendOTPToEmailParams {
  email: string;
  captchaToken: string;
}

interface SignInWithOTPParams {
  otp: string;
}

interface UserContextType {
  user: User | null;
  emailForSignIn: string;
  invitedBy: ChallengerData | null;
  signUpWithEmail(params: SignUpWithEmailParams): Promise<void>;
  sendOTPToEmail(params: SendOTPToEmailParams): Promise<void>;
  resendOTP(): Promise<void>;
  signInWithOTP(params: SignInWithOTPParams): Promise<void>;
  signOut(): Promise<void>;
  restartChallenge(): Promise<void>;
  registerToVote(
    formData: ValueOf<InstanceType<typeof VoterRegistrationForm>>,
  ): Promise<void>;
  gotElectionReminders(): Promise<void>;
  takeTheChallenge(): Promise<void>;
}

const UserContext = createNamedContext<UserContextType>('UserContext');

export {
  UserContext,
  type UserContextType,
  type SignUpWithEmailParams,
  type SendOTPToEmailParams,
  type SignInWithOTPParams,
};
