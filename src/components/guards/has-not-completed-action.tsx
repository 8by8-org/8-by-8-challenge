'use client';
import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import type { Actions } from '@/model/enums/actions';

interface HasNotCompletedActionOpts {
  action: Actions;
  redirectTo: string;
}

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

    if (user?.completedActions[opts.action]) {
      router.push(opts.redirectTo);
    }

    return <Component {...props} />;
  };
}
