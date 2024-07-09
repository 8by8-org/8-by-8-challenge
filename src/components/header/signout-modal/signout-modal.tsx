'use client';
import { useState } from 'react';
import { useContextSafely } from '../../../hooks/use-context-safely';
import { HeaderContext } from '../header-context';
import { Modal } from '../../utils/modal';
import styles from './styles.module.scss';
import { UserContext } from '@/contexts/user-context';

export function SignoutModal() {
  const { isSignoutModalShown, closeSignoutModal } = useContextSafely(
    HeaderContext,
    'SignoutModal',
  );
  const { signOut } = useContextSafely(UserContext, 'SignoutModal');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Modal
      ariaLabel="Are you sure you want to sign out?"
      theme="dark"
      isOpen={isSignoutModalShown}
      closeModal={() => {
        if (!isLoading) {
          closeSignoutModal();
        }
      }}
    >
      {isLoading ?
        <p>Signing out...</p>
      : <>
          <p className="b1">Are you sure you want to sign out?</p>
          <button
            className={styles.btn_top}
            onClick={async () => {
              setIsLoading(true);
              await signOut();
              closeSignoutModal();
              setIsLoading(false);
            }}
            disabled={isLoading}
          >
            <span>Yes, but I&apos;ll be back</span>
          </button>
          <button
            className={styles.btn_bottom}
            onClick={closeSignoutModal}
            disabled={isLoading}
          >
            <span>No, I think I&apos;ll stay</span>
          </button>
        </>
      }
    </Modal>
  );
}
