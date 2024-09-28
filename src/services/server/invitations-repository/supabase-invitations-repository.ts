import { inject } from 'undecorated-di';
import { SERVER_SERVICE_KEYS } from '../keys';
import { ServerError } from '@/errors/server-error';
import type { InvitationsRepository } from './invitations-repository';
import type { CreateSupabaseClient } from '../create-supabase-client/create-supabase-client';
import type { ChallengerData } from '@/model/types/challenger-data';

export const SupabaseInvitationsRepository = inject(
  class SupabaseInvitationsRepository implements InvitationsRepository {
    constructor(private createSupabaseClient: CreateSupabaseClient) {}

    async getInvitedByFromChallengerInviteCode(
      inviteCode: string,
    ): Promise<ChallengerData | null> {
      const supabase = this.createSupabaseClient();

      const { data } = await supabase
        .from('users')
        .select('user_name, avatar')
        .eq('invite_code', inviteCode)
        .limit(1)
        .maybeSingle();

      if (data) {
        return {
          challengerName: data.user_name,
          challengerAvatar: data.avatar,
          challengerInviteCode: inviteCode,
        };
      }

      return null;
    }

    async getInvitedByFromPlayerId(
      playerId: string,
    ): Promise<ChallengerData | null> {
      const supabase = this.createSupabaseClient();

      const { data } = await supabase
        .from('invited_by')
        .select('challenger_invite_code, challenger_name, challenger_avatar')
        .eq('player_id', playerId)
        .limit(1)
        .maybeSingle();

      if (data) {
        return {
          challengerName: data.challenger_name,
          challengerAvatar: data.challenger_avatar,
          challengerInviteCode: data.challenger_invite_code,
        };
      }

      return null;
    }

    async insertOrUpdateInvitedBy(
      playerId: string,
      invitedBy: ChallengerData,
    ): Promise<void> {
      const supabase = this.createSupabaseClient();

      const { error } = await supabase.from('invited_by').upsert(
        {
          player_id: playerId,
          challenger_name: invitedBy.challengerName,
          challenger_avatar: invitedBy.challengerAvatar,
          challenger_invite_code: invitedBy.challengerInviteCode,
        },
        { onConflict: 'player_id' },
      );

      if (error) throw new ServerError(error.message);
    }
  },
  [SERVER_SERVICE_KEYS.createSupabaseServiceRoleClient],
);
