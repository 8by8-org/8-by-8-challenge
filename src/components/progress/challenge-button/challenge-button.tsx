import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import type { User } from '@/model/types/user';
import styles from './styles.module.scss';
import { useRouter } from 'next/navigation';

interface ChallengeButtonProps {
  user: User | null;
  daysLeft: number;
  toggleInvite: React.RefObject<() => null>;
  restartChallenge: () => void;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

/**
 * Renders a component for different buttons
 *
 * @param user - The current user
 *
 * @param daysLeft - Number of days left for the challenge
 *
 * @param toggleInvite - Reference to toggle invite function
 *
 * @param restartChallenge - Function to restart the challenge
 *
 * @param setOpenModal - Function to set the state of modal
 *
 * @returns A React button component for challenge actions
 *
 * @remarks
 * This component renders different buttons based on the challenge status and days left.
 *
 * If the challenge is completed, it renders a "Share" button
 * If the challenge is not completed and there are no days left, it renders a "Restart Challenge" button.
 * If the challenge is not completed and there are days left, it renders an "Invite friends" button.
 */
export function ChallengeButton({
  user,
  daysLeft,
  toggleInvite,
  restartChallenge,
  setOpenModal,
}: ChallengeButtonProps) {
  const [button, setButton] = useState<JSX.Element | null>(
    <button
      className={styles.gradient}
      onClick={() => toggleInvite.current?.()}
    >
      <span>Invite friends</span>
    </button>,
  );

  const router = useRouter();

  useEffect(() => {
    let challengeFinished = user?.completedChallenge;
    if (challengeFinished) {
      setButton(
        <button
          className={styles.inverted}
          onClick={() => toggleInvite.current?.()}
        >
          <span>Share</span>
        </button>,
      );
    } else if (!challengeFinished && daysLeft > 0) {
      setButton(
        <button
          className={styles.gradient}
          onClick={() => router.push('/share')}
        >
          <span>Invite friends</span>
        </button>,
      );
    } else if (!challengeFinished && daysLeft == 0) {
      setButton(
        <button
          className={styles.gradient}
          onClick={() => {
            restartChallenge();
          }}
        >
          <span>Restart Challenge</span>
        </button>,
      );
      setOpenModal(true);
    }
  }, [user, daysLeft, toggleInvite, restartChallenge, setOpenModal, router]);

  return button;
}
