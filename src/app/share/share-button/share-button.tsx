'use client'
import { useState, useEffect } from 'react';
import socialShareIcon from '../../../../public/static/images/pages/share/share-icon.svg';
import Image from 'next/image';
import styles from './styles.module.scss';
import { UserContext } from '@/contexts/user-context';
import { useContextSafely } from '@/hooks/use-context-safely';
import { AlertsContext } from '@/contexts/alerts-context';

interface ShareProps {
  fullLink: string;
}

export const ShareButton: React.FC<ShareProps> = ({
  fullLink,
}) => {
  const [isNavigatorShareAvailable, setIsNavigatorShareAvailable] =
    useState(false);
  const { user, shareChallenge } = useContextSafely(UserContext, 'UserContext');
  const { showAlert } = useContextSafely(AlertsContext, 'Share');
  
  useEffect(() => {
    // eslint-disable-next-line
    if (typeof window !== 'undefined' && navigator.share) {  
      if (navigator.canShare && navigator.canShare({ url: fullLink })) {
        setIsNavigatorShareAvailable(true);
      }
    }
  }, [fullLink]);

  const handleShare = async () => {
    try {
 
      await shareChallenge();
    } catch (error) {
      showAlert('Failed to share challenge', 'error');
    }
  
    try {
      await navigator.share({ url: fullLink });


    } catch (err) {
      (`Error: ${err}`);
    }
  };


  if (!navigator.canShare) {
    return null; 
  }

  return (
  
      isNavigatorShareAvailable &&
        <button data-testid="share-button" className={styles.button} onClick={handleShare}>
          <Image src={socialShareIcon} alt="social-share-icon" />
        </button>
      
  );
};


