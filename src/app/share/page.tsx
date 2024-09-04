'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { PageContainer } from '@/components/utils/page-container';
import { UserContext } from '@/contexts/user-context';
import { useContextSafely } from '@/hooks/use-context-safely';
import { isSignedIn } from '@/components/guards/is-signed-in';
import { useRouter } from 'next/navigation';
import styles from './styles.module.scss';

export default isSignedIn(function Progress() {
  const { user, restartChallenge, shareChallenge } = useContextSafely(
    UserContext,
    'UserContext',
  );
  const [openModal, setOpenModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const toggleInvite = useRef(null);
  const router = useRouter();
  const [apiProgress, setApiProgress] = useState(false);

  const copyLink = async () => {
    try {
      navigator.clipboard.writeText(`8by8.us/share/${user?.inviteCode}`);
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
      <div className={styles.copyLink}>
        <p>Copy your unique link:</p>

        <button className={styles.copyButton} onClick={copyLink}>Copy</button>
        <p className={styles.copylink}>8by8.us/share/{user?.inviteCode}</p> 
      </div>
    </PageContainer>
  );
});
