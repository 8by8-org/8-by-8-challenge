'use client';
import { createNamedContext } from '../../hooks/create-named-context';
import type { User } from '../../model/types/user';
import type { Avatar } from '@/model/types/avatar';
import type { UserType } from '@/model/enums/user-type';

interface SignUpWithEmailParams {
  email: string;
  name: string;
  avatar: Avatar;
  type: UserType;
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
  signUpWithEmail(params: SignUpWithEmailParams): Promise<void>;
  sendOTPToEmail(params: SendOTPToEmailParams): Promise<void>;
  resendOTP(): Promise<void>;
  signInWithOTP(params: SignInWithOTPParams): Promise<void>;
  signOut(): Promise<void>;
  restartChallenge(): Promise<void>;
}

const UserContext = createNamedContext<UserContextType>('UserContext');

export {
  UserContext,
  type UserContextType,
  type SignUpWithEmailParams,
  type SendOTPToEmailParams,
  type SignInWithOTPParams,
};
