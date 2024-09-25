import { useState, useEffect } from 'react';
import SocialShareIcon from '../share/socialShareIcon';

interface ShareProps {
  fullLink: string;
  onShareSuccess: () => void; 
}

const MDNShare: React.FC<ShareProps> = ({ fullLink, onShareSuccess }) => {
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
        <div onClick={handleShare}>
          <SocialShareIcon />
        </div>
      ) : (
        <p>Web Share API is not supported in your browser.</p>
      )}
      <p className="result">{shareResult}</p>
    </div>
  );
};

export default MDNShare;


