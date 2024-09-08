import { InvitedBy } from '@/model/types/invited-by';

export interface InvitationsRepository {
  getInvitedByFromChallengerInviteCode(
    inviteCode: string,
  ): Promise<InvitedBy | null>;
  getInvitedByFromPlayerId(playerId: string): Promise<InvitedBy | null>;
  insertOrUpdateInvitedBy(
    playerId: string,
    invitedBy: InvitedBy,
  ): Promise<void>;
}
