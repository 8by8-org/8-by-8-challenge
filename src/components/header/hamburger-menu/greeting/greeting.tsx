'use client';
import Image from 'next/image';
import { useContextSafely } from '../../../../hooks/use-context-safely';
import { UserContext } from '../../../../contexts/user-context/user-context';
import styles from './styles.module.scss';

export function Greeting() {
  const { user } = useContextSafely(UserContext, 'Greeting');

  return user ?
      <div className={styles.avatar_greeting}>
        <div className={styles.blob}>
          <Image
            alt="user avatar"
            className={styles.avatar}
            src={`/static/images/shared/avatars/avatar-${user.avatar}.svg`}
            width={40}
            height={40}
          />
        </div>
        <h2>Hi {user.name}!</h2>
      </div>
    : <h2 className={styles.standalone_greeting}>Hi there!</h2>;
}
