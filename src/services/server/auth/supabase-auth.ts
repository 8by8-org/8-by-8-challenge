import { inject } from 'undecorated-di';
import { init } from '@paralleldrive/cuid2';
import { SERVER_SERVICE_KEYS } from '../keys';
import { ServerError } from '@/errors/server-error';
import type { Auth } from './auth';
import type { User } from '@/model/types/user';
import type { CreateSupabaseClient } from '../create-supabase-client/create-supabase-client';
import type { UserRepository } from '../user-repository/user-repository';
import type { Avatar } from '@/model/types/avatar';
import type { UserType } from '@/model/enums/user-type';

/**
 * An implementation of {@link Auth} that calls leverages Supabase to provide
 * methods for managing authentication from backend code.
 *
 * @remarks
 * By wrapping the class with the `inject` function from
 * [undecorated-di](https://www.npmjs.com/package/undecorated-di), the class
 * can be registered to (and then later obtained from) an inversion of control
 * container.
 */
export const SupabaseAuth = inject(
  class SupabaseAuth implements Auth {
    private createInviteCode = init({ length: 10 });

    constructor(
      private createSupabaseClient: CreateSupabaseClient,
      private userRepository: UserRepository,
    ) {}

    async signUpWithEmailAndSendOTP(
      email: string,
      name: string,
      avatar: Avatar,
      type: UserType,
    ): Promise<void> {
      const supabase = this.createSupabaseClient();

      const { error } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: {
          name,
          avatar,
          type,
          invite_code: this.createInviteCode(),
        },
      });

      if (error) {
        throw new ServerError(error.message, error.status);
      }

      await this.sendOTPToEmail(email);
    }

    async sendOTPToEmail(email: string): Promise<void> {
      const supabase = this.createSupabaseClient();

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) {
        throw new ServerError(error.message, error.status);
      }
    }

    async signInWithEmailAndOTP(email: string, otp: string): Promise<User> {
      const supabase = this.createSupabaseClient();

      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      if (error) {
        throw new ServerError(error.message, error.status);
      }

      if (!data.user) {
        throw new ServerError('User not found.', 401);
      }

      const user = await this.userRepository.getUserById(data.user.id);

      if (!user) {
        const { error } = await supabase.auth.signOut();

        if (error) {
          throw new ServerError(
            'User was authenticated, but user data was not found. Tried to sign out, but could not.',
            500,
          );
        } else {
          throw new ServerError(
            'User was authenticated, but user data was not found.',
            404,
          );
        }
      }

      return user;
    }

    async loadSessionUser(): Promise<User | null> {
      const supabase = this.createSupabaseClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) return null;

      try {
        const user = await this.userRepository.getUserById(data.user.id);
        return user;
      } catch (e) {
        console.error(e);
      }

      return null;
    }

    async signOut(): Promise<void> {
      const supabase = this.createSupabaseClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new ServerError(error.message, error.status);
      }
    }
  },
  [
    SERVER_SERVICE_KEYS.createSupabaseClient,
    SERVER_SERVICE_KEYS.UserRepository,
  ],
);
