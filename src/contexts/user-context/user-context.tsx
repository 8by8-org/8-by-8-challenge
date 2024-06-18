'use client';
import { createNamedContext } from '../../hooks/functions/create-named-context';
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

interface SignInWithEmailParams {
  email: string;
  captchaToken: string;
}

interface UserContextType {
  user: User | null;
  signUpWithEmail(params: SignUpWithEmailParams): Promise<void>;
  signInWithEmail(params: SignInWithEmailParams): Promise<void>;
  signOut(): void;
  restartChallenge(): void;
}

const UserContext = createNamedContext<UserContextType>('UserContext');

export {
  UserContext,
  type UserContextType,
  type SignUpWithEmailParams,
  type SignInWithEmailParams,
};
