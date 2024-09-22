'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
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



interface ShareProps {
  shareLink: string;
}


export default isSignedIn(function Progress({ shareLink }: ShareProps) {
  const { user, restartChallenge, shareChallenge } = useContextSafely(
    UserContext,
    'UserContext',
  );


  const [openModal, setOpenModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const toggleInvite = useRef(null);
  const router = useRouter();
  const [apiProgress, setApiProgress] = useState(false);
    const fullLink = shareLink + (user?.inviteCode ?? '');
 
  const copyLink = async () => {
    try {
    
      navigator.clipboard.writeText(fullLink);
      setCopied(true);
      setApiProgress(true);   
      
      // Trigger shareChallenge API
      await shareChallenge();
      
      // Add any additional logic if needed after sharing the challenge
    } catch (error) {
      console.error('Failed to copy link or share challenge:', error);
    }
  };

  return (
    <PageContainer>
      <h2 className={styles.header}>Invite Friends</h2>
      <div onClick={() => router.push('/progress')} className={styles.backArrowIcon}>
        <BackArrowIcon/>
      </div>
      <div className={styles.calendar}>
        <CalendarImage/>
      </div>
      <p className={styles.paragraph}>
        Invite friends to support your challenge by taking an action: register to vote, get election reminders, or take the 8by8 challenge. If you are curious, preview  what they will see.
      </p>
      <div className={styles.ActionBox}>
      <div>
        <MDNShare fullLink={fullLink} />
      </div>
      <div onClick={copyLink}>
        <CopyLink/>
      </div>
      <div>
        <DownloadIcon />
      </div>
      </div>
    </PageContainer>
  );
});


// page will become the server componenet 
// there is will be a new client component for share 
