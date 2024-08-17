'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { PageContainer } from '@/components/utils/page-container';
import { UserContext } from '@/contexts/user-context';
import { useContextSafely } from '@/hooks/use-context-safely';
import { isSignedIn } from '@/components/guards/is-signed-in';
import { useRouter } from 'next/navigation';

export default isSignedIn(function Progress() {
  const { user, restartChallenge } = useContextSafely(
    UserContext,
    'UserContext',
  );
  const [openModal, setOpenModal] = useState(false);
  const toggleInvite = useRef(null);
  const router = useRouter()
  return (
    <PageContainer>
      <h2>Invite Friends</h2>
      <button onClick={() => router.push('/progress')}>Back</button>
      <div>Copy Link: { 'Link will be displayed here'}</div>
    </PageContainer>
  );
});
