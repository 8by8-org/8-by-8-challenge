'use client';
import { useContextSafely } from '../../../../../hooks/use-context-safely';
import { HeaderContext } from '../../../../../components/header/header-context';
import styles from './styles.module.scss';

export function SignoutBtn() {
  const { openSignoutModal } = useContextSafely(HeaderContext, 'SignoutBtn');

  return (
    <li>
      <button className={styles.signout_btn} onClick={openSignoutModal}>
        Sign out
      </button>
    </li>
  );
}
