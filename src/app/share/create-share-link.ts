import { SearchParams } from '@/constants/search-params';
import type { User } from '@/model/types/user';

/**
 * Creates a link that can be sent to friends to invite them to contribute to
 * a user's challenge. Must be called from a client component that is imported
 * dynamically. If not, hydration errors will occur.
 */
export function createShareLink(user: User): string {
  if (!window?.location) return '';

  const host = `${window.location.protocol}//${window.location.host}`;

  if (user.completedChallenge) {
    return host + `/challengerwelcome?${SearchParams.WonTheChallenge}=true`;
  }

  return host + `/playerwelcome?${SearchParams.InviteCode}=${user.inviteCode}`;
}
