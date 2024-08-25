import type { ActionBadge } from '@/model/types/action-badge';
import { Actions } from '@/model/enums/actions';
import styles from './styles.module.scss';
import Image from 'next/image';

interface ActionBadgeProps {
  badge: ActionBadge;
  index: number;
}

/**
 * Renders a component to display an action badge.
 *
 * @param badge - Component's badge data.
 *
 * @param index - Index number of badge.
 *
 * @returns A React component that displays either an action badge.
 */
export function ActionBadge({ badge, index }: ActionBadgeProps): JSX.Element {
  let label: string;
  let imagePrefix: string;

  switch (badge.action) {
    case Actions.VoterRegistration:
      label = 'You Registered';
      imagePrefix = 'register-to-vote';
      break;
    case Actions.SharedChallenge:
      label = 'You Shared';
      imagePrefix = 'shared-challenge';
      break;
    case Actions.ElectionReminders:
      label = 'Got Alerts';
      imagePrefix = 'election-reminders';
      break;
  }

  return (
    <div className={styles.badges}>
      <div className={styles.blob}>
        <Image
          alt="action badge background blob"
          className={`${styles.blob_img} ${styles['blob_img_' + index]}`}
          src={require(
            `../../../../public/static/images/pages/progress/badge-${index}-blob.png`,
          )}
        />
      </div>
      <div className={styles.blob_content}>
        <Image
          alt="action badge icon"
          className={styles.icon}
          src={require(
            `../../../../public/static/images/pages/progress/${imagePrefix}-badge-icon.svg`,
          )}
        />
        <h3>{label}</h3>
      </div>
    </div>
  );
}
