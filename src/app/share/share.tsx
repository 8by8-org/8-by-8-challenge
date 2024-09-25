'use client';
import { useRef, useState } from 'react';
import { PageContainer } from '@/components/utils/page-container';
import { UserContext } from '@/contexts/user-context';
import { useContextSafely } from '@/hooks/use-context-safely';
import { isSignedIn } from '@/components/guards/is-signed-in';
import { useRouter } from 'next/navigation';
import styles from './styles.module.scss';
import MDNShare from '../mdnshare/page';
import BackArrowIcon from '../share/backIcon';
import CopyLink from '../share/CopyLink';
import DownloadIcon from '../share/downloadImagesIcon'; 
import CalendarImage from '../share/calendarImage';
import { Modal } from '../../components/utils/modal/modal';


interface ShareProps {
  shareLink: string;
}

export default isSignedIn(function Progress({ shareLink }: ShareProps) {
  const { user, shareChallenge } = useContextSafely(UserContext, 'UserContext');
  const [copied, setCopied] = useState(false);
  const [apiProgress, setApiProgress] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const fullLink = shareLink + (user?.inviteCode ?? '');

  const copyLink = async () => {
    try {
      navigator.clipboard.writeText(fullLink);
      setCopied(true);
      setApiProgress(true);   

      await shareChallenge();
    } catch (error) {
      console.error('Failed to copy link or share challenge:', error);
    }
  };

  const handleSharedLink = async () => {
    try {
      setApiProgress(true);
      await shareChallenge();
    } catch (error) {
      console.error('Failed to share challenge:', error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  }

  const closeModal = () => setIsModalOpen(false);

  return (
    <PageContainer>
      <h2 className={styles.header}>Invite Friends</h2>
      <div onClick={() => router.push('/progress')} className={styles.backArrowIcon}>
        <BackArrowIcon />
      </div>
      <div className={styles.calendar}>
        <CalendarImage />
      </div>
      <p className={styles.paragraph}>
        Invite friends to support your challenge by taking an action: register to vote, get election reminders, or take the 8by8 challenge. If you are curious, preview what they will see.
      </p>
      <div className={styles.ActionBox}> 
        <div onClick={copyLink}>
          <CopyLink />
        </div>
        <MDNShare fullLink={fullLink} onShareSuccess={handleSharedLink} />
        <div onClick={openModal}>
          <DownloadIcon />
        </div>
        <div>
        <Modal
        ariaLabel=""
        theme="light"
        isOpen={isModalOpen}
        closeModal={closeModal}
      />
        </div>
      </div>
    </PageContainer>
  );
});

// page will become the server componenet 
// there is will be a new client component for share 


// download images 
// create image component 
// download will take the uer to the image compaoenent 
// this is where the user can selct the image and downlaod the image 

//tests 
//unit tests 
// mocking 
