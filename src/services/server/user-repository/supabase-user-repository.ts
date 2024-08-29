import { inject } from 'undecorated-di';
import { SERVER_SERVICE_KEYS } from '../keys';
import { ServerError } from '@/errors/server-error';
import type { UserRepository } from './user-repository';
import type { User } from '@/model/types/user';
import type { CreateSupabaseClient } from '../create-supabase-client/create-supabase-client';
import type { IUserRecordParser } from '../user-record-parser/i-user-record-parser';
import { DateTime } from 'luxon';
/**
 * An implementation of {@link UserRepository} that interacts with
 * a [Supabase](https://supabase.com/) database and parses rows returned from
 * that database into {@link User}s.
 */
export const SupabaseUserRepository = inject(
  class SupabaseUserRepository implements UserRepository {
    constructor(
      private createSupabaseClient: CreateSupabaseClient,
      private userRecordParser: IUserRecordParser,
    ) {}
    //public method
    async restartChallenge(userId: string): Promise<number> {
      const newTimestamp = DateTime.now().plus({ days: 8 }).toUnixInteger();
      // Assuming there is a method to update the user's challengeEndTimestamp in the database
      await this.updateUserChallengeEndTimestamp(userId, newTimestamp);
      return newTimestamp;
      //follow the style of getUserById AND  supabase->throw an error
    }


    async getUserById(userId: string): Promise<User | null> {
      const supabase = this.createSupabaseClient();

      const { data: dbUser, error } = await supabase
        .from('users')
        .select(
          `*,
          completed_actions (election_reminders, register_to_vote, shared_challenge),
          badges (action, player_name, player_avatar),
          invited_by (challenger_invite_code, challenger_name, challenger_avatar),
          contributed_to (challenger_name, challenger_avatar)`,
        )
        .eq('id', userId)
        .limit(1)
        .maybeSingle();

      if (error) {
        throw new ServerError(error.message, 500);
      }

      if (!dbUser) return null;

      try {
        const user = this.userRecordParser.parseUserRecord(dbUser);
        return user;
      } catch (e) {
        throw new ServerError('Failed to parse user data.', 400);
      }
    }
    
    private async updateUserChallengeEndTimestamp(userId: string, timestamp: number) {
      // Update the user's challengeEndTimestamp in the database
      // Implementation depends on your database setup
    }
  },
  [
    SERVER_SERVICE_KEYS.createSupabaseClient,
    SERVER_SERVICE_KEYS.UserRecordParser,
  ],
);
