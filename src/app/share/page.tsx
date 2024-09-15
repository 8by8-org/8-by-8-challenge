import Share from './share';
import { createShareLink } from './create-share'; 
import SocialShare from '../socialshare/page';

export default function Page() {
  const baseShareLink = createShareLink()
  return <>
  <Share shareLink={baseShareLink} />
  </>
}