'use client';
import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { UserType } from '@/model/enums/user-type';
import { LoadingScreen } from '../utils/loading-screen';

/**
 * A higher-order component that redirects the user to /signin if they are
 * signed out and to /actions if they are a player-type user. Use this in
 * combination with middleware to protect pages that should only be accessible
 * by authenticated users who are of type challenger or hybrid.
 *
 * @param Page - A function component that should be protected by this guard.
 * Must be a client component
 * (see https://nextjs.org/docs/app/building-your-application/rendering/client-components
 * for more information).
 *
 * @returns
 * A function component that can be used as a drop-in replacement for the
 * component it received as an argument.
 */
export function isChallengerOrHybrid<P extends object>(Page: FC<P>) {
  return function ChallengerOrHybridOnlyGuard(props: P) {
    const { user } = useContextSafely(
      UserContext,
      'ChallengerOrHybridOnlyGuard',
    );
    const router = useRouter();
    const shouldRedirect = !user || user.type == UserType.Player;

    if (!user) {
      router.push('/signin');
    } else if (user.type === UserType.Player) {
      router.push('/actions');
    }

    return shouldRedirect ? <LoadingScreen /> : <Page {...props} />;
  };
}
