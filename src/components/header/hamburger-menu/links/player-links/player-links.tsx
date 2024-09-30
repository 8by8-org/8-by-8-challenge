'use client';
import { useState } from 'react';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { AlertsContext } from '@/contexts/alerts-context';
import { HamburgerLink } from '../hamburger-link';
import { SignoutBtn } from '../signout-btn';
import { Button } from '@/components/utils/button';
import { LoadingWheel } from '@/components/utils/loading-wheel';
import styles from './styles.module.scss';

export function PlayerLinks() {
  const { takeTheChallenge } = useContextSafely(UserContext, 'PlayerLinks');
  const { showAlert } = useContextSafely(AlertsContext, 'PlayerLinks');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <li>
        <Button
          size="sm"
          className={styles.take_the_challenge_btn}
          onClick={async () => {
            if (isLoading) return;

            setIsLoading(true);

            try {
              await takeTheChallenge();
            } catch (e) {
              setIsLoading(false);
              showAlert(
                'Oops! Something went wrong. Please try again later.',
                'error',
              );
            }
          }}
        >
          Take The Challenge
        </Button>
      </li>
      <HamburgerLink href="/actions" className={styles.link_lg_top}>
        Take Action
      </HamburgerLink>
      <HamburgerLink href="/why8by8" className={styles.link_lg}>
        Why 8by8
      </HamburgerLink>
      <HamburgerLink href="/rewards" className={styles.link_lg}>
        Rewards
      </HamburgerLink>
      <HamburgerLink href="/faq" className={styles.link_lg}>
        FAQS
      </HamburgerLink>
      <HamburgerLink href="/privacy-policy" className={styles.link_sm_top}>
        Privacy Policy
      </HamburgerLink>
      <HamburgerLink href="/settings" className={styles.link_sm}>
        Settings
      </HamburgerLink>
      <SignoutBtn disabled={isLoading} />
      {isLoading && <LoadingWheel />}
    </>
  );
}
