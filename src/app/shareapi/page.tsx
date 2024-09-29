import { useState, useEffect } from 'react';
import socialShareIcon from '../../../public/static/images/pages/share/share-icon.svg';
import Image from 'next/image'; 
import styles from './styles.module.scss'; 

interface ShareProps {
  fullLink: string;
  onShareSuccess: () => void; 
}

const ShareAPI: React.FC<ShareProps> = ({ fullLink, onShareSuccess }) => {
  const [isNavigatorShareAvailable, setIsNavigatorShareAvailable] = useState(false);
  const [shareResult, setShareResult] = useState("");


  useEffect(() => {
    if (typeof window !== "undefined" && navigator.share) {
      const Link = { url: fullLink };
      if (navigator.canShare && navigator.canShare(Link)) {
        setIsNavigatorShareAvailable(true); 
      }
    }
  }, [fullLink]);  

  const handleShare = async () => {
    const shareData = {
      url: fullLink,
    };

    try {
      await navigator.share(shareData);
      setShareResult("Link shared successfully");


      if (onShareSuccess) {
        onShareSuccess();
      }
    } catch (err) {
      setShareResult(`Error: ${err}`);
    }
  };

  if (!isNavigatorShareAvailable) {
    return null
  }

  return (
    <div>
      {isNavigatorShareAvailable ? (
        <button className={styles.button} onClick={handleShare}>
          <Image src={socialShareIcon} alt="social-share-icon" />
        </button>
      ) : (
        <p>Web Share API is not supported in your browser.</p>
      )}
      <p className="result">{shareResult}</p>
    </div>
  );
};

export default ShareAPI;


