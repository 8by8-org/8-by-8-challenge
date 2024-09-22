import Share from './share';
import { createShareLink } from './create-share'; 


export default function Page() {
  const baseShareLink = createShareLink()
  return <>
  <Share shareLink={baseShareLink} />
  </>
}