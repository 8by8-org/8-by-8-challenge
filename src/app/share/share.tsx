'use client';
import { useState } from 'react';
import { PageContainer } from '@/components/utils/page-container';
import { UserContext } from '@/contexts/user-context';
import { useContextSafely } from '@/hooks/use-context-safely';
import { AlertsContext } from '@/contexts/alerts-context';
import { isSignedIn } from '@/components/guards/is-signed-in';
import { useRouter } from 'next/navigation';
import styles from './styles.module.scss';
import { ShareButton } from './share-button';
import backArrowIcon from '../../../public/static/images/pages/share/back-icon.svg';
import CopyLink from '../../../public/static/images/pages/share/copy-link.svg';
import imagesIcon from '../../../public/static/images/pages/share/images-icon.svg';
import calendarImage from '../../../public/static/images/pages/share/calendar-image.png';
import { Modal } from '../../components/utils/modal/modal';
import Image from 'next/image';
import socialMediaPostImage0 from '../../../public/static/images/pages/share/social-media-post-image-0.png';
import socialMediaPostImage1 from '../../../public/static/images/pages/share/social-media-post-image-1.png';
import socialMediaPostImage2 from '../../../public/static/images/pages/share/social-media-post-image-2.png';

interface ShareProps {
  shareLink: string;
}

export default isSignedIn(function Progress({ shareLink }: ShareProps) {
  const { user, shareChallenge } = useContextSafely(UserContext, 'UserContext');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showAlert } = useContextSafely(AlertsContext, 'Share');
  

  const router = useRouter();
  const fullLink = shareLink + (user?.inviteCode ?? '');

  const copyLink = async () => {
    try {
      navigator.clipboard.writeText(fullLink);
    

      await shareChallenge();
    } catch (error) {
      showAlert('Failed to copy link or share challenge', 'error');
    }
  };


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <PageContainer>
      <div
        onClick={() => router.push('/progress')}
        className={styles.backArrowIcon}
      >
        <Image src={backArrowIcon} alt="back-icon" />
      </div>
      <h2 className={styles.header}>Invite Friends</h2>
      <div className={styles.calendar}>
        <Image src={calendarImage} alt="calendar-image" />
      </div>
      <p className={styles.paragraph}>
        Invite friends to support your challenge by taking an action: register
        to vote, get election reminders, or take the 8by8 challenge. If you are
        curious, preview what they will see.
      </p>
      <div className={styles.actionbox}>
        <button className={styles.copybutton} onClick={copyLink}>
          <Image src={CopyLink} alt="copy-link" />
        </button>
        <ShareButton  fullLink={fullLink}/>
        <button className={styles.imagesbutton} onClick={openModal}>
          <Image src={imagesIcon} alt="images" />
        </button>
        <div>
          <Modal
            ariaLabel=""
            theme="light"
            isOpen={isModalOpen}
            closeModal={closeModal}
          >
            <Image src={socialMediaPostImage0} alt="images-icon" priority />
            <Image src={socialMediaPostImage1} alt="images-icon" priority />
            <Image src={socialMediaPostImage2} alt="images-icon" priority />
          </Modal>
        </div>
      </div>
    </PageContainer>
  );
});

// page will become the server component
// there is will be a new client component for share

// download images
// create image component
// download will take the uer to the image compaoenent
// this is where the user can selct the image and downlaod the image

//tests
//unit tests
// mocking

// 30 px gutters on the side3
//1st and second icon  margin right 40 px
// flex them anf justify content center
//
