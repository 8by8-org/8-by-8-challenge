'use client';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { PageContainer } from '@/components/utils/page-container';
import { ConfettiAnimation } from '@/components/utils/confetti-animation';
import { Hero } from './hero/hero';
import { AvailableActions } from './available-actions';
import { hasCompletedAllActions } from './utils/has-completed-all-actions';
import styles from './styles.module.scss';
import { lastContributedToCurrentInviter } from './utils/last-contributed-to-current-inviter';

export default function ActionsPage() {
  const { user, invitedBy } = useContextSafely(UserContext, 'ActionsPage');

  const showBadgeAwardedMessage =
    user &&
    invitedBy &&
    lastContributedToCurrentInviter(user.contributedTo, invitedBy) &&
    !hasCompletedAllActions(user);

  return (
    <PageContainer theme="dark">
      {hasCompletedAllActions(user) && <ConfettiAnimation time={8000} />}
      <Hero />
      <div className={styles.white_curve}></div>
      <section className={styles.actions_section}>
        {showBadgeAwardedMessage && (
          <h3 className={styles.badge_awarded_message}>
            {user!.contributedTo.at(-1)!.challengerName} got a badge!
            <br />
            Here are other actions to help the AAPI community.
          </h3>
        )}
        <AvailableActions />
      </section>
    </PageContainer>
  );
}
