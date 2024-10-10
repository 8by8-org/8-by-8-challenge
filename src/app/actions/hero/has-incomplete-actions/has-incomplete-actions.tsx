'use client';
import React from 'react';
import Image from 'next/image';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { lastContributedToCurrentInviter } from '../../utils/last-contributed-to-current-inviter';
import { AVATARS } from '@/constants/avatars';
import styles from './styles.module.scss';

export function HasIncompleteActions() {
  const { user, invitedBy } = useContextSafely(
    UserContext,
    'HasIncompleteActions',
  );

  let heading: React.JSX.Element;

  if (
    invitedBy &&
    lastContributedToCurrentInviter(user?.contributedTo, invitedBy)
  ) {
    heading = (
      <>
        You
        <br />
        took
        <br />
        action!
      </>
    );
  } else if (invitedBy) {
    heading = (
      <>
        Take
        <br />
        action
        <br />
        for:
      </>
    );
  } else {
    heading = (
      <>
        Take
        <br />
        action!
      </>
    );
  }

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{heading}</h1>
      {!!invitedBy && (
        <div className={styles.avatar_container}>
          <Image
            src={AVATARS[invitedBy.challengerAvatar].image}
            alt={AVATARS[invitedBy.challengerAvatar].altText}
            className={styles.avatar}
          />
          <h3 className={styles.challenger_name}>{invitedBy.challengerName}</h3>
        </div>
      )}
    </section>
  );
}
