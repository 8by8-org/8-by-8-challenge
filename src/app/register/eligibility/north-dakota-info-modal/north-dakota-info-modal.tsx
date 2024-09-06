'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Modal } from '@/components/utils/modal';
import { Button } from '@/components/utils/button';
import { VoterRegistrationPathnames } from '../../constants/voter-registration-pathnames';
import type { Dispatch, SetStateAction } from 'react';
import styles from './styles.module.scss';

interface NorthDakotaInfoModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

/**
 * A modal that displays information voting in North Dakota, as it is the only
 * state in the US that does not require its residents to register in order to
 * vote.
 *
 * @param props - {@link NorthDakotaInfoModalProps}
 */
export function NorthDakotaInfoModal({
  showModal,
  setShowModal,
}: NorthDakotaInfoModalProps) {
  const router = useRouter();
  const votingInNorthDakota =
    'https://www.sos.nd.gov/elections/voter/voting-north-dakota';
  const closeModal = () => setShowModal(false);

  return (
    <Modal
      ariaLabel={`Voting in North Dakota`}
      theme="light"
      isOpen={showModal}
      closeModal={closeModal}
    >
      <h3 className={styles.title}>
        Hey there! Looks like you&apos;re from North Dakota.
      </h3>
      <p>
        North Dakota does not require voter registration. For more information
        on voting in North Dakota, please see{' '}
        <Link
          target="_blank"
          rel="noreferrer"
          href={votingInNorthDakota}
          className="link"
        >
          Voting in North Dakota
        </Link>
        .
      </p>
      <div className={styles.buttons_container}>
        <Button
          type="button"
          onClick={() => {
            router.push(VoterRegistrationPathnames.NAMES);
          }}
          className={styles.button}
          variant="inverted"
          size="sm"
        >
          Keep Going
        </Button>
        <Button
          type="button"
          onClick={closeModal}
          className={styles.button}
          variant="inverted"
          size="sm"
        >
          Nevermind
        </Button>
      </div>
    </Modal>
  );
}
