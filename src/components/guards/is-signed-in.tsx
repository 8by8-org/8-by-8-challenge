'use client';
import { useLayoutEffect, type FC } from 'react';
import { useRouter } from 'next/navigation';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { LoadingScreen } from '../utils/loading-screen';

/**
 * A higher-order component that redirects the user to /signin if they are
 * signed out. Use this in combination with middleware to protect pages that
 * should only be accessible by authenticated users.
 *
 * If access to the page also depends on the user's type, use the corresponding
 * type-specific guard instead.
 *
 * @param Page - A function component that should be protected by this guard.
 * @returns
 * A function component that can be used as a drop-in replacement for the
 * component it received as an argument.
 */
export function isSignedIn<P extends object>(Page: FC<P>) {
  return function AuthGuard(props: P) {
    const { user } = useContextSafely(UserContext, 'AuthGuard');
    const router = useRouter();
    const shouldRedirect = !user;

    useLayoutEffect(() => {
      if (shouldRedirect) {
        router.push('/signin');
      }
    }, [shouldRedirect, router]);

    return shouldRedirect ? <LoadingScreen /> : <Page {...props} />;
  };
}
