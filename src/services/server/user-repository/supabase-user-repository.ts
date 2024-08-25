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
    //  return the user
    // double check row names aganist the schema
    // handling all errors
    // use the server error class
    // chek if  the user has already completed the action
    // check how many badges the user has
    // if the user has 8 badge then don't then don't award a badge 
    // write tests for the api endpoints 
    async awardSharedBadge(userId: string): Promise<User> {
      const supabase = this.createSupabaseClient();
      const { error: completedActionsError } = await supabase
        .from('completed_actions')
        .update({ 'share_challenge': true })
        .eq('user_id', userId)
      // return the user 
      // if userId matches the user in the other db then the user has already completed the challenge 
      
  // throw error 
      if (completedActionsError) {
        throw new Error(`Error updating completed actions: ${completedActionsError.message}`);
      }
  // add badges 
      const { error: badgeError } = await supabase
      .from('badges')
        .insert({ challenger_id: userId, action: Actions.SharedChallenge });
      // check the number of badges the user already has ? 
      
  // insertion not successfull so throw error 
    if (badgeError) {
      throw new Error(`Error adding badge: ${badgeError.message}`);
    }
  // get user 
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error(`User not found: ${userId}`)
      }
    return user; 
    }
  },
  [
    SERVER_SERVICE_KEYS.createSupabaseClient,
    SERVER_SERVICE_KEYS.UserRecordParser,
  ],
);

// when we are talking about user where which db are we retreving user from ? 
// 