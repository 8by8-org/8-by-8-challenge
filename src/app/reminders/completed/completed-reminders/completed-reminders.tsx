'use client';
import { isSignedIn } from '@/components/guards/is-signed-in';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useContextSafely } from '@/hooks/use-context-safely';
import { AlertsContext } from '@/contexts/alerts-context';
import { UserContext } from '@/contexts/user-context';
import { PageContainer } from '@/components/utils/page-container';
import { Button } from '@/components/utils/button';
import { UserType } from '@/model/enums/user-type';
import styles from './styles.module.scss';

interface CompletedRemindersProps {
  hasError: boolean;
}

export const CompletedReminders = isSignedIn(function CompletedReminders({
  hasError,
}: CompletedRemindersProps) {
  const { showAlert } = useContextSafely(AlertsContext, 'CompletedReminders');
  const { user } = useContextSafely(UserContext, 'CompletedReminders');
  const router = useRouter();

  useEffect(() => {
    if (hasError) {
      showAlert(
        "Oops! We couldn't award you a badge. Please try again later.",
        'error',
      );
    }
  }, [hasError, showAlert]);

  const onClick = () => {
    if (user?.type === UserType.Challenger) {
      router.push('/progress');
    } else {
      router.push('/actions');
    }
  };

  return (
    <PageContainer>
      <section className={styles.page}>
        <h1 className="mt_md mb_md">
          <span className="underline">Get Elec</span>tion
          <br />
          Alerts
        </h1>
        <h3 className="mb_md">Thank you for joining us!</h3>
        <p className="mb_md">
          Encourage your friends and family to do the same.
        </p>
        <Button size="lg" wide className="mb_lg" onClick={onClick}>
          Continue
        </Button>
      </section>
    </PageContainer>
  );
});
