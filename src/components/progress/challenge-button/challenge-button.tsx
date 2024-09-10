import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import type { User } from '@/model/types/user';
import styles from './styles.module.scss';
import { useAlertsContext} from '@/contexts/alerts-context';
import { Alert, useAlert } from '@/components/utils/alert';
interface ChallengeButtonProps {
  user: User | null;
  daysLeft: number;
  toggleInvite: React.RefObject<() => null>;
  restartChallenge: () => Promise<void>;
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

  const [button, setButton] = useState<JSX.Element | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  //open a model of challenge restart no close? any page move it user context
  //global uesr context above
  // first progress page
  //regardless page 
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
    } else if (!challengeFinished && daysLeft === 0) {
      setButton(
        <button
          className={styles.gradient}
          onClick={async () => {
            setIsLoading(true);
            try {
              await restartChallenge();
              setOpenModal(false);
            } catch (error) {
              alert('Error restarting challenge');
            } finally {
              setIsLoading(false);
            }
          }}
        >
          <span>{isLoading ? 'Restarting...' : 'Restart Challenge'}</span>
        </button>,
      );
      setOpenModal(true);
    } else {
      setButton(
        <button
          className={styles.gradient}
          onClick={() => toggleInvite.current?.()}
        >
          <span>Invite friends</span>
        </button>,
      );
    }
  }, [user, daysLeft, toggleInvite, restartChallenge, setOpenModal]);

  return button;
}
