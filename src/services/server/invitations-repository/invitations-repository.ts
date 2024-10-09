import { ChallengerData } from '@/model/types/challenger-data';

export interface InvitationsRepository {
  getInvitedByFromChallengerInviteCode(
    inviteCode: string,
  ): Promise<ChallengerData | null>;
  getInvitedByFromPlayerId(playerId: string): Promise<ChallengerData | null>;
  insertOrUpdateInvitedBy(
    playerId: string,
    invitedBy: ChallengerData,
  ): Promise<void>;
}
