'use client';
import { useContextSafely } from '../../../../../hooks/use-context-safely';
import { HeaderContext } from '../../../../../components/header/header-context';
import styles from './styles.module.scss';

interface SignoutBtnProps {
  disabled?: boolean;
}

export function SignoutBtn({ disabled }: SignoutBtnProps) {
  const { openSignoutModal } = useContextSafely(HeaderContext, 'SignoutBtn');

  return (
    <li>
      <button
        className={styles.signout_btn}
        onClick={openSignoutModal}
        disabled={disabled}
      >
        Sign out
      </button>
    </li>
  );
}
