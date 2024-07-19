'use client';
import { useState } from 'react';
import { useContextSafely } from '../../../hooks/use-context-safely';
import { HeaderContext } from '../header-context';
import { UserContext } from '@/contexts/user-context';
import { AlertsContext } from '@/contexts/alerts-context';
import { Modal } from '../../utils/modal';
import styles from './styles.module.scss';

export function SignoutModal() {
  const { isSignoutModalShown, closeSignoutModal } = useContextSafely(
    HeaderContext,
    'SignoutModal',
  );
  const { signOut } = useContextSafely(UserContext, 'SignoutModal');
  const { showAlert } = useContextSafely(AlertsContext, 'SignoutModal');
  const [isSigningOut, setIsSigningOut] = useState(false);

  return (
    <Modal
      ariaLabel="Are you sure you want to sign out?"
      theme="dark"
      isOpen={isSignoutModalShown}
      closeModal={() => {
        if (!isSigningOut) {
          closeSignoutModal();
        }
      }}
    >
      {isSigningOut ?
        <p className="b2">Signing out...</p>
      : <>
          <p className="b1">Are you sure you want to sign out?</p>
          <button
            className={styles.btn_top}
            onClick={async () => {
              setIsSigningOut(true);

              try {
                await signOut();
              } catch (e) {
                showAlert('There was a problem signing out.', 'error');
              }

              closeSignoutModal();
              setIsSigningOut(false);
            }}
          >
            <span>Yes, but I&apos;ll be back</span>
          </button>
          <button className={styles.btn_bottom} onClick={closeSignoutModal}>
            <span>No, I think I&apos;ll stay</span>
          </button>
        </>
      }
    </Modal>
  );
}
