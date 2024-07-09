import 'server-only';
import type { User } from '@/model/types/user';
import type { Avatar } from '@/model/types/avatar';
import type { UserType } from '@/model/enums/user-type';

export interface Auth {
  signUpWithEmailAndSendOTP(
    email: string,
    name: string,
    avatar: Avatar,
    type: UserType,
  ): Promise<void>;
  sendOTPToEmail(email: string): Promise<void>;
  signInWithEmailAndOTP(email: string, otp: string): Promise<User>;
  loadSessionUser(): Promise<User | null>;
  signOut(): Promise<void>;
}
