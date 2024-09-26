import type { ChallengerData } from '@/model/types/challenger-data';

export function lastContributedToCurrentInviter(
  contributedTo: ChallengerData[] = [],
  invitedBy: ChallengerData,
): boolean {
  return (
    !!contributedTo.length &&
    contributedTo.at(-1)?.challengerInviteCode ===
      invitedBy.challengerInviteCode
  );
}
