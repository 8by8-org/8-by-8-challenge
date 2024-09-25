import 'server-only';
import { inject } from 'undecorated-di';
import { SERVER_SERVICE_KEYS } from '../keys';
import { ServerError } from '@/errors/server-error';
import { UserType } from '@/model/enums/user-type';
import type { UserRepository } from './user-repository';
import type { User } from '@/model/types/user';
import type { CreateSupabaseClient } from '../create-supabase-client/create-supabase-client';
import type { IUserRecordParser } from '../user-record-parser/i-user-record-parser';

/**
 * An implementation of {@link UserRepository} that interacts with
 * a [Supabase](https://supabase.com/) database and parses rows returned from
 * that database into {@link User}s.
 */
export const SupabaseUserRepository = inject(
  class SupabaseUserRepository implements UserRepository {
    private readonly REMOTE_PROCEDURES = {
      GET_USER_BY_ID: 'get_user_by_id',
      AWARD_ELECTION_REMINDERS_BADGE: 'award_election_reminders_badge',
      AWARD_REGISTER_TO_VOTE_BADGE: 'award_register_to_vote_badge',
      MAKE_HYBRID: 'make_hybrid',
    };

    constructor(
      private createSupabaseClient: CreateSupabaseClient,
      private userRecordParser: IUserRecordParser,
    ) {}

    async getUserById(userId: string): Promise<User | null> {
      const supabase = this.createSupabaseClient();

      const {
        data: dbUser,
        error,
        status,
      } = await supabase.rpc(this.REMOTE_PROCEDURES.GET_USER_BY_ID, {
        user_id: userId,
      });

      if (error) {
        throw new ServerError(error.message, status);
      }

      if (!dbUser) return null;

      try {
        const user = this.userRecordParser.parseUserRecord(dbUser);
        return user;
      } catch (e) {
        throw new ServerError('Failed to parse user data.', 400);
      }
    }

    async makeHybrid(userId: string): Promise<User> {
      const supabase = this.createSupabaseClient();

      const {
        data: dbUser,
        error,
        status,
      } = await supabase.rpc(this.REMOTE_PROCEDURES.MAKE_HYBRID, {
        user_id: userId,
      });

      if (error) {
        throw new ServerError(error.message, status);
      }

      if (!dbUser) {
        throw new ServerError('Update operation returned null user.', 500);
      }

      try {
        const user = this.userRecordParser.parseUserRecord(dbUser);
        return user;
      } catch (e) {
        throw new ServerError('Failed to parse user data.', 400);
      }
    }

    async awardRegisterToVoteBadge(userId: string): Promise<User> {
      const supabase = this.createSupabaseClient();

      const {
        data: dbUser,
        error,
        status,
      } = await supabase.rpc(
        this.REMOTE_PROCEDURES.AWARD_REGISTER_TO_VOTE_BADGE,
        {
          user_id: userId,
        },
      );

      if (error) {
        throw new ServerError(error.message, status);
      }

      if (!dbUser) {
        throw new ServerError('User was null after update.', 500);
      }

      try {
        const user = this.userRecordParser.parseUserRecord(dbUser);
        return user;
      } catch (e) {
        throw new ServerError('Failed to parse user data.', 400);
      }
    }

    async awardElectionRemindersBadge(userId: string): Promise<User> {
      const supabase = this.createSupabaseClient();

      const {
        data: dbUser,
        error,
        status,
      } = await supabase.rpc(
        this.REMOTE_PROCEDURES.AWARD_ELECTION_REMINDERS_BADGE,
        {
          user_id: userId,
        },
      );

      if (error) {
        throw new ServerError(error.message, status);
      }

      if (!dbUser) {
        throw new ServerError('User was null after update.', 500);
      }

      try {
        const user = this.userRecordParser.parseUserRecord(dbUser);
        return user;
      } catch (e) {
        throw new ServerError('Failed to parse user data.', 400);
      }
    }
  },
  [
    SERVER_SERVICE_KEYS.createSupabaseServiceRoleClient,
    SERVER_SERVICE_KEYS.UserRecordParser,
  ],
);
