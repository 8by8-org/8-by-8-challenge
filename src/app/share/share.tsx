'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { PageContainer } from '@/components/utils/page-container';
import { UserContext } from '@/contexts/user-context';
import { useContextSafely } from '@/hooks/use-context-safely';
import { isSignedIn } from '@/components/guards/is-signed-in';
import { useRouter } from 'next/navigation';
import styles from './styles.module.scss';
import SocialShare from '../socialshare/page';


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
      <button onClick={() => router.push('/progress')}>Back</button>
      <p className={styles.paragraph}>
        Invite friends to support your challenge by taking an action: register to vote, get election reminders, or take the 8by8 challenge. If you are curious, preview what they will see.
      </p>
          <div>
              <SocialShare fullLink={fullLink}/>
      </div>
      <div className={styles.copyLink}>
        <p>Copy your unique link:</p>

        <button className={styles.copyButton} onClick={copyLink}>Copy</button>
              <p className={styles.copylink}>{fullLink}</p> 
      </div>
    </PageContainer>
  );
});

// page will become the server componenet 
// there is will be a new client component for share 
