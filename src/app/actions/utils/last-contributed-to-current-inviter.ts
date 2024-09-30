import type { ChallengerData } from '@/model/types/challenger-data';

export function lastContributedToCurrentInviter(
  contributedTo: ChallengerData[] | undefined,
  invitedBy: ChallengerData,
): boolean {
  return (
    !!contributedTo &&
    !!contributedTo.length &&
    contributedTo.at(-1)?.challengerInviteCode ===
      invitedBy.challengerInviteCode
  );
}
