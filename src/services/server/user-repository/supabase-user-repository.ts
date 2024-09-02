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
    constructor(
      private createSupabaseClient: CreateSupabaseClient,
      private userRecordParser: IUserRecordParser,
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
        .update({ 'share_challenge': true })
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
      const user = await this.getUserById(userId);
      if (!user) {
        throw new ServerError(`User not found: ${userId}`)
      }
      
    // Check if the count exceeds the maxBadges threshold
      if (count && count > maxBadges) {
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
  if (!user) {
    throw new ServerError(`User not found: ${userId}`);
  }

  return user;
    
  }
  
  },
  [
    SERVER_SERVICE_KEYS.createSupabaseClient,
    SERVER_SERVICE_KEYS.UserRecordParser,
  ],
);


