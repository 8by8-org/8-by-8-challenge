import 'server-only';
import { inject } from 'undecorated-di';
import { init } from '@paralleldrive/cuid2';
import { SERVER_SERVICE_KEYS } from '../keys';
import { UserType } from '@/model/enums/user-type';
import { ServerError } from '@/errors/server-error';
import type { Auth } from './auth';
import type { User } from '@/model/types/user';
import type { CreateSupabaseClient } from '../create-supabase-client/create-supabase-client';
import type { UserRepository } from '../user-repository/user-repository';
import type { Avatar } from '@/model/types/avatar';
import type { InvitationsRepository } from '../invitations-repository/invitations-repository';
import type { InvitedBy } from '@/model/types/invited-by';
import type { ICookies } from '../cookies/i-cookies';
import type { Session } from '@/model/types/session';

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
      private invitationsRepository: InvitationsRepository,
      private cookies: ICookies,
    ) {}

    async signUpWithEmailAndSendOTP(
      email: string,
      name: string,
      avatar: Avatar,
    ): Promise<void> {
      const supabase = this.createSupabaseClient();
      const invitedBy = await this.loadInvitedByFromCookies();

      const { data, error } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: {
          name,
          avatar,
          type: invitedBy ? UserType.Player : UserType.Challenger,
          invite_code: this.createInviteCode(),
        },
      });

      if (error) {
        throw new ServerError(error.message, error.status);
      }

      if (invitedBy) {
        await this.invitationsRepository.insertOrUpdateInvitedBy(
          data.user.id,
          invitedBy,
        );
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

    async signInWithEmailAndOTP(email: string, otp: string): Promise<Session> {
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

      let user = await this.userRepository.getUserById(data.user.id);

      if (!user) {
        await this.signOut();

        throw new ServerError(
          'User was authenticated, but user data was not found.',
          404,
        );
      }

      let invitedBy = await this.loadInvitedByFromCookies();

      if (invitedBy) {
        await this.invitationsRepository.insertOrUpdateInvitedBy(
          data.user.id,
          invitedBy,
        );

        if (user.type === UserType.Challenger) {
          user = await this.userRepository.makeHybrid(user.uid);
        }
      } else if (user.type !== UserType.Challenger) {
        invitedBy = await this.invitationsRepository.getInvitedByFromPlayerId(
          user.uid,
        );
      }

      return { user, invitedBy };
    }

    async loadSession(): Promise<Session> {
      const supabase = this.createSupabaseClient();
      let invitedBy = await this.loadInvitedByFromCookies();
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        try {
          let user = await this.userRepository.getUserById(data.user.id);

          if (user) {
            if (invitedBy) {
              await this.invitationsRepository.insertOrUpdateInvitedBy(
                data.user.id,
                invitedBy,
              );

              if (user.type === UserType.Challenger) {
                user = await this.userRepository.makeHybrid(user.uid);
              }
            } else if (user.type !== UserType.Challenger) {
              invitedBy =
                await this.invitationsRepository.getInvitedByFromPlayerId(
                  user.uid,
                );
            }
          }

          return {
            user,
            invitedBy,
          };
        } catch (e) {
          console.error(e);
        }
      }

      return { user: null, invitedBy };
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

    private async loadInvitedByFromCookies(): Promise<InvitedBy | null> {
      const inviteCode = this.cookies.getInviteCode();

      if (inviteCode) {
        const invitedBy =
          await this.invitationsRepository.getInvitedByFromChallengerInviteCode(
            inviteCode,
          );

        return invitedBy;
      }

      return null;
    }
  },
  [
    SERVER_SERVICE_KEYS.createSupabaseSSRClient,
    SERVER_SERVICE_KEYS.UserRepository,
    SERVER_SERVICE_KEYS.InvitationsRepository,
    SERVER_SERVICE_KEYS.Cookies,
  ],
);
