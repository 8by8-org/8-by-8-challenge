import { inject } from 'undecorated-di';
import { SERVER_SERVICE_KEYS } from '../keys';
import type { UserRepository } from './user-repository';
import type { User } from '@/model/types/user';
import type { CreateSupabaseClient } from '../create-supabase-client/create-supabase-client';
import type { DBUserAdapter } from '../db-user-adapter/db-user-adapter';

export const SupabaseUserRepository = inject(
  class SupabaseUserRepository implements UserRepository {
    constructor(
      private createSupabaseClient: CreateSupabaseClient,
      private dbUserAdapter: DBUserAdapter,
    ) {}

    async getUserById(userId: string): Promise<User | null> {
      const supabase = this.createSupabaseClient();

      const { data: dbUser } = await supabase
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
        .single();

      if (!dbUser) return null;

      return this.dbUserAdapter.adaptDBUser(dbUser);
    }
  },
  [SERVER_SERVICE_KEYS.createSupabaseClient, SERVER_SERVICE_KEYS.DbUserAdapter],
);
