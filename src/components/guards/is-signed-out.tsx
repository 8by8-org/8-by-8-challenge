'use client';
import { useLayoutEffect, FC } from 'react';
import { useRouter } from 'next/navigation';
import { useContextSafely } from '@/hooks/functions/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import Progress from '@/app/progress/page';

export function isSignedOut<P extends object>(Component: FC<P>) {
  return function IsSignedOut(props: P) {
    const { user } = useContextSafely(UserContext, 'IsSignedOut');
    const router = useRouter();

    useLayoutEffect(() => {
      if (user) {
        router.push('/progress');
      }
    }, [user, router]);

    return !user ? <Component {...props} /> : <Progress />;
  };
}
