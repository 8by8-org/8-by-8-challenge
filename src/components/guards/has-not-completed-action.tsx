'use client';
import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { LoadingScreen } from '../utils/loading-screen';
import type { Actions } from '@/model/enums/actions';

interface HasNotCompletedActionOpts {
  action: Actions;
  redirectTo: string;
}

/**
 * A higher-order component that redirects the user a given route if they are
 * signed in and have completed the given action. Use this in combination with
 * middleware to protect pages that should only be accessible before the user
 * has completed the given action.
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
export function hasNotCompletedAction<P extends object>(
  Component: FC<P>,
  opts: HasNotCompletedActionOpts,
) {
  return function HasNotCompletedActionGuard(props: P) {
    const { user } = useContextSafely(
      UserContext,
      'HasNotCompletedActionGuard',
    );
    const router = useRouter();
    const shouldRedirect = !!user?.completedActions[opts.action];

    if (shouldRedirect) {
      router.push(opts.redirectTo);
    }

    return shouldRedirect ? <LoadingScreen /> : <Component {...props} />;
  };
}
