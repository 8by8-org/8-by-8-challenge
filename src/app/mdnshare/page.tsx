import { useState, useEffect } from 'react';
import SocialShareIcon from '../share/socialShareIcon';

interface ShareProps {
  fullLink: string;
}

const MDNShare: React.FC<ShareProps> = ({ fullLink }) => {
  const [isNavigatorShareAvailable, setIsNavigatorShareAvailable] = useState(false);
  const [shareResult, setShareResult] = useState("");

  useEffect(() => {
      if (typeof window !== "undefined" && navigator.share) {
        const Link = { url: fullLink };
        if (navigator.canShare && navigator.canShare(Link)) {
          setIsNavigatorShareAvailable(true); 
        }
      }
  }, []);

  const handleShare = async () => {
    const shareData = {
      url: fullLink, 
    };

    try {
      await navigator.share(shareData);
      setShareResult("Link shared successfully");
    } catch (err) {
      setShareResult(`Error: ${err}`);
    }
  };

  return (
    <div>
      {isNavigatorShareAvailable ? (
        <div onClick={handleShare}><SocialShareIcon/></div>
      ) : (
        <p>Web Share API is not supported in your browser.</p>
      )}
      <p className="result">{shareResult}</p>
    </div>
  );
};

export default MDNShare;

// check if navigator.sahre is defined and canShare 
// if navigatorr.shae is true and canshare is true 