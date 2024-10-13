'use client';
import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { LoadingScreen } from '../utils/loading-screen';

/**
 * A higher-order component that redirects the user to /playerwelcome if they
 * have been invited to take the challenge by another user.
 *
 * @param Page - A function component that should be protected by this guard.
 * @returns
 * A function component that can be used as a drop-in replacement for the
 * component it received as an argument.
 */
export function wasNotInvited<P extends object>(Page: FC<P>) {
  return function WasNotInvitedGuard(props: P) {
    const { invitedBy } = useContextSafely(UserContext, 'NoInvitationGuard');
    const router = useRouter();
    const shouldRedirect = !!invitedBy;

    if (shouldRedirect) {
      router.push('/playerwelcome');
    }

    return shouldRedirect ? <LoadingScreen /> : <Page {...props} />;
  };
}
