'use client';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { lastContributedToCurrentInviter } from '../utils/last-contributed-to-current-inviter';
import { hasCompletedAllActions } from '../utils/has-completed-all-actions';
import styles from './styles.module.scss';

export function BadgeAwardedMessage() {
  const { user, invitedBy } = useContextSafely(
    UserContext,
    'BadgeAwardedMessage',
  );

  const showBadgeAwardedMessage =
    user &&
    invitedBy &&
    lastContributedToCurrentInviter(user.contributedTo, invitedBy) &&
    !hasCompletedAllActions(user);

  if (!showBadgeAwardedMessage) return null;

  return (
    <h3 className={styles.badge_awarded_message}>
      {user!.contributedTo.at(-1)!.challengerName} got a badge!
      <br />
      Here are other actions to help the AAPI community.
    </h3>
  );
}
