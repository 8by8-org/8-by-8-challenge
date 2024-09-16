import 'server-only';
import { inject } from 'undecorated-di';
import { SERVER_SERVICE_KEYS } from '../keys';
import { ServerError } from '@/errors/server-error';
import { Actions } from '@/model/enums/actions';
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
    };

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
          action_type: Actions.VoterRegistration,
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
// todos - 
    // return the user
    // double check row names aganist the schema
    // handling all errors
    // use the server error class
    // check if  the user has already completed the action
    // check how many badges the user has
    // if the user has 8 badges then don't then don't award a badge
    // write tests for the api endpoints 
    
    async awardSharedBadge(userId: string): Promise<User> {
      const supabase = this.createSupabaseClient();
      const { error: completedActionsError } = await supabase
        .from('completed_actions')
        .update({ 'shared_challenge': true })
        .eq('user_id', userId)
      
// throw error 
      if (completedActionsError) {
        throw new ServerError(`Error updating completed actions: ${completedActionsError.message}`);
      }

// add badges 
      const { error: badgeError } = await supabase
      .from('badges')
        .insert({ challenger_id: userId, action: Actions.SharedChallenge })
        .select()

// badgeError
      if (badgeError) {
        throw new ServerError(`Error adding badge: ${badgeError.message}`);
      }

// count badges 
      const { count, error } = await supabase
      .from('badges')
      .select('challenger_id', { count: 'exact' })
      .eq('challenger_id', userId);
  
    if (error) {
      throw new ServerError(`Error counting badges: ${error.message}`);
    }
      const maxBadges = 8
      let user = await this.getUserById(userId);
      console.log(user)
      if (!user) {
        throw new ServerError(`User not found: ${userId}`)
      }
      
 // Check if the count exceeds the maxBadges threshold
      if (count && count >= maxBadges) {
      return user;
    }
      
// still add badges if count !== maxBadges
      if (count && count < maxBadges) {
        const { error: badgeInsertError } = await supabase
        .from('badges')
          .insert({ challenger_id: userId, action: Actions.SharedChallenge })
          .select()
        if (badgeInsertError) {
          throw new ServerError(`Error adding badge: ${badgeInsertError.message}`);
        }
        
      }
// If awarding the badge causes the user to gain 8 badges, set user.completed_challenge to true.
      if (count && count + 1 === maxBadges) {
        // update `user.completed_challenge` to true
        const { error: userUpdateError } = await supabase
          .from('users')
          .update({ 'completed_challenge': true })
          .eq('id', userId);
  
        if (userUpdateError) {
          throw new ServerError(`Error updating user completed challenge: ${userUpdateError.message}`);
        }
      }
// return user 
  user = await this.getUserById(userId);
  if (!user) {
    throw new ServerError(`User not found: ${userId}`);
  }

  return user;
    
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


