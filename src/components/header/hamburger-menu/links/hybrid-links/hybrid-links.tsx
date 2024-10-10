import { HamburgerLink } from '../hamburger-link';
import { SignoutBtn } from '../signout-btn';
import styles from './styles.module.scss';

export function HybridLinks() {
  return (
    <>
      <HamburgerLink href="/progress" className={styles.link_lg_top}>
        My Challenge
      </HamburgerLink>
      <HamburgerLink href="/actions" className={styles.link_lg}>
        Take Action
      </HamburgerLink>
      <HamburgerLink href="/share" className={styles.link_lg}>
        Share
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
      <SignoutBtn />
    </>
  );
}
