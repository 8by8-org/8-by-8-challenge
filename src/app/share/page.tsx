'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { PageContainer } from '@/components/utils/page-container';
import { UserContext } from '@/contexts/user-context';
import { useContextSafely } from '@/hooks/use-context-safely';
import { isSignedIn } from '@/components/guards/is-signed-in';

export default isSignedIn(function Progress() {
  const { user, restartChallenge } = useContextSafely(
    UserContext,
    'UserContext',
  );
  const [openModal, setOpenModal] = useState(false);
  const toggleInvite = useRef(null);

  return (
    <PageContainer>
     <h1>This s a share page</h1>
    </PageContainer>
  );
});
