'use client';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { HamburgerLink } from '../hamburger-link';
import styles from './styles.module.scss';

export function SignedOutLinks() {
  const { invitedBy } = useContextSafely(UserContext, 'SignedOutLinks');

  return (
    <>
      <HamburgerLink
        href={invitedBy ? '/playerwelcome' : '/challengerwelcome'}
        className={styles.take_the_challenge_btn}
      >
        {invitedBy ? 'Take Action' : 'Take The Challenge'}
      </HamburgerLink>
      <HamburgerLink href="/why8by8" className={styles.link_lg}>
        Why 8by8
      </HamburgerLink>
      <HamburgerLink href="/tos" className={styles.link_sm_top}>
        Terms of Service
      </HamburgerLink>
      <HamburgerLink href="/privacy" className={styles.link_sm}>
        Privacy Policy
      </HamburgerLink>
      <HamburgerLink href="/signup" className={styles.link_sm}>
        Sign up
      </HamburgerLink>
      <HamburgerLink href="/signin" className={styles.link_sm}>
        Sign in
      </HamburgerLink>
    </>
  );
}
