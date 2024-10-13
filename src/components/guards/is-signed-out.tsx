'use client';
import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { UserType } from '@/model/enums/user-type';
import { LoadingScreen } from '../utils/loading-screen';

/**
 * A higher-order component that redirects the user to either /progress or
 * /actions if they are signed in as a challenger/hybrid-type user, or a
 * player-type user, respectively. Use this in combination with middleware to
 * protect pages that should only be accessible if the user is signed out.
 *
 * @param Page - A function component that should be protected by this guard.
 * @returns
 * A function component that can be used as a drop-in replacement for the
 * component it received as an argument.
 */
export function isSignedOut<P extends object>(Page: FC<P>) {
  return function UnAuthGuard(props: P) {
    const { user } = useContextSafely(UserContext, 'UnAuthGuard');
    const router = useRouter();
    const shouldRedirect = !!user;

    if (shouldRedirect) {
      router.push(user.type === UserType.Player ? '/actions' : '/progress');
    }

    return shouldRedirect ? <LoadingScreen /> : <Page {...props} />;
  };
}
