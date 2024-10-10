import { SearchParams } from '@/constants/search-params';
import dynamic from 'next/dynamic';

const Share = dynamic(() => import('./share').then(module => module.Share), {
  ssr: false,
});

export default function Page() {
  return (
    <Share
      shareLink={`http://localhost:3000/playerwelcome?${SearchParams.InviteCode}=`}
    />
  );
}
