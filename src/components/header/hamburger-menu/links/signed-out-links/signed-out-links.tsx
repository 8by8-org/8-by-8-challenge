import { HamburgerLink } from '../hamburger-link';
import styles from './styles.module.scss';

export function SignedOutLinks() {
  return (
    <>
      <HamburgerLink
        href="/challengerwelcome"
        className={styles.take_the_challenge_btn}
      >
        Take The Challenge
      </HamburgerLink>
      <HamburgerLink href="/actions" className={styles.link_lg_top}>
        Take Action
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
