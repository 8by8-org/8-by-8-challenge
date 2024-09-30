'use client';
import { useState } from 'react';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { AlertsContext } from '@/contexts/alerts-context';
import { HamburgerLink } from '../hamburger-link';
import { SignoutBtn } from '../signout-btn';
import { Button } from '@/components/utils/button';
import { TakeTheChallengeModal } from '@/components/take-the-challenge-modal';
import styles from './styles.module.scss';

export function PlayerLinks() {
  const [modalToShow, setModalToShow] = useState<
    'none' | 'loading' | 'success'
  >('none');
  const { takeTheChallenge } = useContextSafely(UserContext, 'PlayerLinks');
  const { showAlert } = useContextSafely(AlertsContext, 'PlayerLinks');

  return (
    <>
      <Button
        size="sm"
        className={styles.take_the_challenge_btn}
        onClick={async () => {
          if (modalToShow !== 'none') return;

          setModalToShow('loading');

          try {
            await takeTheChallenge();
            setModalToShow('success');
          } catch (e) {
            setModalToShow('none');
            showAlert(
              'Oops! Something went wrong. Please try again later.',
              'error',
            );
          }
        }}
      >
        Take The Challenge
      </Button>
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
      <SignoutBtn />
      <TakeTheChallengeModal
        isOpen={modalToShow !== 'none'}
        succeeded={modalToShow === 'success'}
        closeModal={
          modalToShow === 'success' ? () => setModalToShow('none') : () => {}
        }
      />
    </>
  );
}
