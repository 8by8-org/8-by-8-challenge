import { Modal } from '../../../components/utils/modal';
import Link from 'next/link';
import { Button } from '../../../components/utils/button';
import styles from './styles.module.scss';

interface TakeTheChallengeModalProps {
  isOpen: boolean;
  succeeded: boolean;
  closeModal: () => void;
}

export function TakeTheChallengeModal({
  isOpen,
  succeeded,
  closeModal,
}: TakeTheChallengeModalProps) {
  return (
    <Modal
      ariaLabel={succeeded ? 'Challenge started' : 'Starting your challenge'}
      theme="dark"
      isOpen={isOpen}
      closeModal={closeModal}
    >
      {succeeded ?
        <>
          <h3 className={styles.modal_title}>Success!</h3>
          <p>You&apos;ve become an 8by8 Challenger!</p>
          <br />
          <p>
            See your{' '}
            <Link href="/progress" className="link--teal">
              progress
            </Link>
          </p>
          <Button
            size="sm"
            type="button"
            className="mt_md"
            onClick={closeModal}
          >
            Ok, got it!
          </Button>
        </>
      : <p>Starting your challenge...</p>}
    </Modal>
  );
}
