'use client';
import React from 'react';
import Image from 'next/image';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { AVATARS } from '@/constants/avatars';
import styles from './styles.module.scss';

export function HasCompletedAllActions() {
  const { user } = useContextSafely(UserContext, 'HasCompletedAllActions');

  return (
    <section className={styles.container}>
      <h1 className="mb_lg">
        You are done!
        {!!user?.contributedTo.length && (
          <>
            <br />
            You supported:
          </>
        )}
      </h1>
      <div className={styles.avatars}>
        {!!user?.contributedTo &&
          user.contributedTo.map((challengerData, index) => {
            const blob = index % 8;

            return (
              <div key={index} className={styles.avatar_container}>
                <div
                  className={styles.avatar_inner_container}
                  style={{
                    backgroundImage: `url('/static/images/pages/actions/blob-${blob}.png')`,
                  }}
                >
                  <Image
                    src={AVATARS[challengerData.challengerAvatar].image}
                    alt={AVATARS[challengerData.challengerAvatar].altText}
                    priority
                  />
                  <h3>{challengerData.challengerName}</h3>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}
