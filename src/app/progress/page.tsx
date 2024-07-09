'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { PageContainer } from '@/components/utils/page-container';
import { UserContext } from '@/contexts/user-context';
import { calculateDaysRemaining } from './calculate-days-remaining';
import { useContextSafely } from '@/hooks/use-context-safely';
import { ChallengeButton } from '@/components/progress/challenge-button/challenge-button';
import claimReward from '@/../public/static/images/pages/progress/claiming-a-reward.svg';
import daysRemainingBlob from '@/../public/static/images/pages/progress/days-remaining-blob.svg';
import { ConfettiAnimation } from '@/components/utils/confetti-animation';
import blackCurve from '@/../public/static/images/pages/progress/black-curve.svg';
import { Badges } from '@/components/progress/badges';
import { Modal } from '@/components/utils/modal';
import styles from './styles.module.scss';
import { isSignedIn } from '@/components/guards/is-signed-in';

export default isSignedIn(function Progress() {
  const { user, restartChallenge } = useContextSafely(
    UserContext,
    'UserContext',
  );
  const daysLeft = calculateDaysRemaining(user);
  const [openModal, setOpenModal] = useState(false);
  const toggleInvite = useRef(null);

  return (
    <PageContainer>
      <article className={styles.progress_page}>
        {user?.completedChallenge ?
          <ConfettiAnimation time={8000} />
        : null}
        <section className={styles.section_1}>
          <h1>
            {user?.completedChallenge ?
              <>
                You&apos;ve Won! <br /> The <br />
                Challenge
              </>
            : <>
                Your <br /> challenge <br /> badges
              </>
            }
          </h1>
          <div className={styles.days_blob_container}>
            <Image
              className={styles.blob}
              src={user?.completedChallenge ? claimReward : daysRemainingBlob}
              alt="days remaining blob"
              priority={true}
            />
            {!user?.completedChallenge && (
              <div className={styles.days_label}>
                <p className={styles.number_shadow}>{daysLeft}</p>
                <h3 className={styles.days_left}>
                  {daysLeft === 1 ? 'Day' : 'Days'} left
                </h3>
              </div>
            )}
          </div>

          {/* TODO - couponData

            {alreadyRedeemed && couponData && (
              <div className="couponContainer">
                {
                  <div>
                    <div className="img-bg">
                      <img src={couponData.logo} alt="Partner Logo" />
                    </div>
                    <p>
                      {couponData.rewardDescription}{' '}
                      {couponData.redemptionDescription}
                    </p>
                    <p>Availability and terms subject to change.</p>
                  </div>
                }
              </div>
            )}
            */}
        </section>
        <Image
          className={styles.curve}
          src={blackCurve}
          alt="black curve"
          priority={true}
        />

        <section className={styles.section_2}>
          <h3>
            You completed{' '}
            {user?.badges.filter(badge => badge !== null).length === 8 ?
              ' all '
            : ' '}
            <span className={styles.underline}>
              {user?.badges.filter(badge => badge !== null).length}
            </span>{' '}
            badges
          </h3>
          {/* TODO - Partners Exist
          {user?.completedChallenge && !user.redeemedAward && partnersExist && (
            <button
              className={styles.gradient}
              onClick={() => {
                document.location.href = '/choosereward?ref=challenger';
              }}
            >
              <span>Choose A Reward</span>
            </button>
          )}
          */}
          <ChallengeButton
            user={user}
            daysLeft={daysLeft}
            toggleInvite={toggleInvite}
            restartChallenge={restartChallenge}
            setOpenModal={setOpenModal}
          />
          {!user?.completedActions.registerToVote && (
            <div>
              <p className={styles.register}>
                Not registered to vote yet?
                <br />
                <a href="/voterreg">Register now</a> and earn a badge!
              </p>
            </div>
          )}
        </section>
        <Badges badges={user?.badges ?? []} />

        <section className={styles.section_4}>
          <ChallengeButton
            user={user}
            daysLeft={daysLeft}
            toggleInvite={toggleInvite}
            restartChallenge={restartChallenge}
            setOpenModal={setOpenModal}
          />
          {!user?.completedActions.registerToVote && (
            <div>
              <p className={styles.register}>
                Not registered to vote yet?
                <br />
                <a href="/voterreg">Register now</a> and earn a badge!
              </p>
            </div>
          )}
        </section>

        <Modal
          ariaLabel="restart challenge modal"
          isOpen={openModal}
          theme="dark"
          closeModal={() => setOpenModal(false)}
        >
          <>
            <div className={styles.restart_modal}>
              Oops, times up! But no worries, restart your challenge to
              continue!
            </div>
            <div className={styles.modal_btn}>
              <ChallengeButton
                user={user}
                daysLeft={daysLeft}
                toggleInvite={toggleInvite}
                restartChallenge={restartChallenge}
                setOpenModal={setOpenModal}
              />
            </div>
          </>
        </Modal>

        {/* TODO - Invite
              <Invite
                    toggleInvite={toggleInvite}
                    isShare={false}
                    challengeWon={challengeFinished}
                />
            </article>
            ) : (
                <LoadingWheel overlay={false} />
            );*/}
      </article>
    </PageContainer>
  );
});
