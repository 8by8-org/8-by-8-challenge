'use client';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { PageContainer } from '@/components/utils/page-container';
import { ConfettiAnimation } from '@/components/utils/confetti-animation';
import { Hero } from './hero/hero';
import { AvailableActions } from './available-actions';
import { hasCompletedAllActions } from './utils/has-completed-all-actions';
import styles from './styles.module.scss';

export default function ActionsPage() {
  const { user } = useContextSafely(UserContext, 'ActionsPage');

  return (
    <PageContainer theme="dark">
      {hasCompletedAllActions(user) && <ConfettiAnimation time={8000} />}
      <Hero />
      <div className={styles.white_curve}></div>
      <AvailableActions />
    </PageContainer>
  );
}
