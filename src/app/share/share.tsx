'use client';
import { isSignedIn } from '@/components/guards/is-signed-in';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { AlertsContext } from '@/contexts/alerts-context';
import Image from 'next/image';
import { PageContainer } from '@/components/utils/page-container';
import { LoadingWheel } from '@/components/utils/loading-wheel';
import { Modal } from '../../components/utils/modal/modal';
import copyLinkIcon from '../../../public/static/images/pages/share/copy-link.svg';
import imagesIcon from '../../../public/static/images/pages/share/images-icon.svg';
import backArrow from '../../../public/static/images/pages/share/back-icon.svg';
import calendarImage from '../../../public/static/images/pages/share/calendar-image.png';
import socialShareIcon from '../../../public/static/images/pages/share/share-icon.svg';
import socialMediaPostImage0 from '../../../public/static/images/pages/share/social-media-post-image-0.png';
import socialMediaPostImage1 from '../../../public/static/images/pages/share/social-media-post-image-1.png';
import socialMediaPostImage2 from '../../../public/static/images/pages/share/social-media-post-image-2.png';
import styles from './styles.module.scss';

interface ShareProps {
  shareLink: string;
  hideShareButton?: boolean;
}

export const Share = isSignedIn(function Share({
  shareLink,
  hideShareButton,
}: ShareProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, shareChallenge } = useContextSafely(UserContext, 'Share');
  const { showAlert } = useContextSafely(AlertsContext, 'Share');
  const fullLink = shareLink + user!.inviteCode;
  const shareData = { url: fullLink };
  const router = useRouter();

  const copyLink = async () => {
    if (isLoading) {
      return;
    }

    if (!user?.completedActions.sharedChallenge) {
      setIsLoading(true);
      try {
        await shareChallenge();
      } catch (err) {
        showAlert(
          'Sorry there was an error awarding the badge, please try again later.',
          'error',
        );
      } finally {
        setIsLoading(false);
      }
    }

    navigator.clipboard.writeText(fullLink);
  };

  const canShare =
    !!window &&
    !!window.navigator.share &&
    !!window.navigator.canShare &&
    window.navigator.canShare(shareData);

  const showShareButton = !hideShareButton && canShare;

  const share = async () => {
    if (isLoading || !canShare) {
      return;
    }

    if (!user?.completedActions.sharedChallenge) {
      setIsLoading(true);
      try {
        await shareChallenge();
      } catch (err) {
        showAlert(
          'Sorry there was an error awarding the badge, please try again later.',
          'error',
        );
      } finally {
        setIsLoading(false);
      }
    }

    try {
      if (canShare) {
        await navigator.share(shareData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  return (
    <PageContainer>
      <div className={styles.main_content}>
        <button className={styles.back_icon} onClick={() => router.back()}>
          <Image src={backArrow} alt="backicon" />
          Back
        </button>
        <h1 className={styles.header}>Invite friends</h1>
        <Image
          className={styles.calendar_image}
          src={calendarImage}
          alt="calendar"
        />
        <p className={styles.paragraph}>
          Invite friends to support your challenge by taking an action: register
          to vote, get election reminders, or take the 8by8 challenge.
        </p>
      </div>
      <div className={styles.button_container}>
        <button className={styles.button} onClick={copyLink}>
          <Image src={copyLinkIcon} alt="copylink" />
          Copy link
        </button>
        {showShareButton && (
          <button onClick={share} className={styles.button}>
            <Image src={socialShareIcon} alt="socialshareicon" />
            Share via
          </button>
        )}
        <button className={styles.button} onClick={openModal}>
          <Image src={imagesIcon} alt="imagesicon" />
          Images for posts
        </button>
        <Modal
          ariaLabel="Images for posts"
          theme="light"
          isOpen={isModalOpen}
          closeModal={closeModal}
        >
          <Image src={socialMediaPostImage0} alt="images0-icon" priority />
          <Image src={socialMediaPostImage1} alt="images1-icon" priority />
          <Image src={socialMediaPostImage2} alt="images2-icon" priority />
        </Modal>
      </div>
      {isLoading && <LoadingWheel />}
    </PageContainer>
  );
});
