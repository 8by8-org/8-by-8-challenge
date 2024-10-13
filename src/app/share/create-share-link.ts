import { SearchParams } from '@/constants/search-params';
import { UserType } from '@/model/enums/user-type';
import type { User } from '@/model/types/user';
import type { ChallengerData } from '@/model/types/challenger-data';

/**
 * Creates a link that can be sent to friends to invite them to contribute to
 * a user's challenge. Must be called from a client component that is imported
 * dynamically. If not, hydration errors will occur.
 */
export function createShareLink(
  user: User,
  invitedBy: ChallengerData | null,
): string {
  if (user.completedChallenge) return createWinnerLink();
  else if (user.type === UserType.Player && invitedBy) {
    return createPlayerLink(invitedBy);
  }

  return createChallengerLink(user);
}

function createWinnerLink() {
  return `${window.location.protocol}//${window.location.host}/challengerwelcome?${SearchParams.WonTheChallenge}=true`;
}

function createPlayerLink(invitedBy: ChallengerData) {
  return `${window.location.protocol}//${window.location.host}/playerwelcome?${SearchParams.InviteCode}=${invitedBy.challengerInviteCode}`;
}

function createChallengerLink(user: User) {
  return `${window.location.protocol}//${window.location.host}/playerwelcome?${SearchParams.InviteCode}=${user.inviteCode}`;
}
