import type { User } from '@/model/types/user';
import type { Avatar } from '@/model/types/avatar';
import type { Session } from '@/model/types/session';

/**
 * Provides methods for managing authentication from backend code such as
 * API routes and server components.
 */
export interface Auth {
  signUpWithEmailAndSendOTP(
    email: string,
    name: string,
    avatar: Avatar,
  ): Promise<void>;
  sendOTPToEmail(email: string): Promise<void>;
  signInWithEmailAndOTP(email: string, otp: string): Promise<Session>;
  loadSession(): Promise<Session>;
  loadSessionUser(): Promise<User | null>;
  signOut(): Promise<void>;
}
