'use client';
import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';

/**
 * A higher-order component that redirects the user to /challengerwelcome if
 * they have not been invited to take the challenge by another user. Use this
 * in combination with middleware to protect pages that should only be
 * accessible if the user has visited an invitation link.
 *
 * @param Page - A function component that should be protected by this guard.
 * @returns
 * A function component that can be used as a drop-in replacement for the
 * component it received as an argument.
 */
export function hasInvitation<P extends object>(Page: FC<P>) {
  return function HasInvitationGuard(props: P) {
    const { invitedBy } = useContextSafely(UserContext, 'HasInvitationGuard');
    const router = useRouter();

    if (!invitedBy) {
      router.push('/challengerwelcome');
    }

    return <Page {...props} />;
  };
}
