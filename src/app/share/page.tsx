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
import { useContext } from "react";
import { InviteCodeContext } from "../../../src/contexts/invite-code-user";

/* 
  This component can import React hooks, etc. It can receive the 
  link created within a server component through props and then 
  add the actual invite code it reads from context. You do not 
  need to create a context (it already exists--the UserContext),
  your component can just read the invite code from the User 
  as you have been already doing.
*/

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
  const inviteCode = useContext(InviteCodeContext);
  const fullLink = shareLink + inviteCode;
  console.log(fullLink)
 
  const copyLink = async () => {
    try {
      const link = `8by8.us/share/${user?.inviteCode}`
      navigator.clipboard.writeText(link);
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
      <SocialShare/> 
      </div>
      <div className={styles.copyLink}>
        <p>Copy your unique link:</p>

        <button className={styles.copyButton} onClick={copyLink}>Copy</button>
        <p className={styles.copylink}>8by8.us/share/{user?.inviteCode}</p> 
      </div>
    </PageContainer>
  );
});
