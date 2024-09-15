import 'server-only';
import { inject } from 'undecorated-di';
import { SERVER_SERVICE_KEYS } from '../keys';
import { ServerError } from '@/errors/server-error';
import type { UserRepository } from './user-repository';
import type { User } from '@/model/types/user';
import type { CreateSupabaseClient } from '../create-supabase-client/create-supabase-client';
import type { IUserRecordParser } from '../user-record-parser/i-user-record-parser';
import { Actions } from '@/model/enums/actions';

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
      private canAwardBadge = (user: User): Boolean => {
        if (
          user.badges.length >= 8 ||
          user.completedChallenge ||
          user.completedActions.registerToVote
        ) {
          return false;
        }
        return true;
      },
      private updateRegisterToVoteAction = async (
        userId: string,
      ): Promise<void> => {
        const supabase = this.createSupabaseClient();

        const {
          status: status,
          statusText: statusText,
          error: challengerUpdateError,
        } = await supabase
          .from('completed_actions')
          .update({
            register_to_vote: true,
          })
          .eq('user_id', userId);

        if (challengerUpdateError) {
          throw new ServerError(statusText, status);
        }
      },
      private awardVoterRegistrationActionBadge = async (
        userId: string,
      ): Promise<void> => {
        const supabase = this.createSupabaseClient();

        const challengerActionBadge = {
          action: Actions.VoterRegistration,
          challenger_id: userId,
        };

        const {
          status: status,
          statusText: statusText,
          error: challengerActionBadgeInsertionError,
        } = await supabase
          .from('badges')
          .insert(challengerActionBadge)
          .eq('user_id', userId);

        if (challengerActionBadgeInsertionError) {
          throw new ServerError(statusText, status);
        }
      },
    ) {}
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

    /**
     * @awardUserBadge
     * @param user - A user to access their information
     */
    async awardAndUpdateVoterRegistrationBadgeAndAction(
      user: User,
    ): Promise<void> {
      if (!this.canAwardBadge(user)) {
        return;
      }

      await this.awardVoterRegistrationActionBadge(user.uid);
      await this.updateRegisterToVoteAction(user.uid);
    }
  },
  [
    SERVER_SERVICE_KEYS.createSupabaseServiceRoleClient,
    SERVER_SERVICE_KEYS.UserRecordParser,
  ],
);
