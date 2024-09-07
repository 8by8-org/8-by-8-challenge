// components/SocialShare.tsx
import dynamic from 'next/dynamic';
import { FC } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share';
import { FaInstagram } from 'react-icons/fa'; 


// Use dynamic import without SSR for react-share library
const SocialShare: FC = () => {
  const shareUrl = 'https://your-website.com'; // Change this to the URL you want to share
  const title = 'Check out this awesome website!';

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <FacebookShareButton url={shareUrl}>
        <FacebookIcon size={40} round />
      </FacebookShareButton>

      <TwitterShareButton url={shareUrl} title={title}>
        <TwitterIcon size={40} round />
          </TwitterShareButton>
    

      <LinkedinShareButton url={shareUrl} title={title}>
        <LinkedinIcon size={40} round />
      </LinkedinShareButton>

      <WhatsappShareButton url={shareUrl} title={title}>
        <WhatsappIcon size={40} round />
          </WhatsappShareButton>
          
      <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
        <FaInstagram size={40} style={{ color: '#E1306C' }} />
      </a>
    </div>
  );
};

export default dynamic(() => Promise.resolve(SocialShare), { ssr: false });
