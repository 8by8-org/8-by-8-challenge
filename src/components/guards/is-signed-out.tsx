'use client';
import { useLayoutEffect, FC } from 'react';
import { useRouter } from 'next/navigation';
import { useContextSafely } from '@/hooks/functions/use-context-safely';
import { UserContext } from '@/contexts/user-context';

export function isSignedOut<P extends object>(Component: FC<P>) {
  return function IsSignedOut(props: P) {
    const { user } = useContextSafely(UserContext, 'IsSignedOut');
    const router = useRouter();

    useLayoutEffect(() => {
      router.prefetch('/progress');
    }, [router]);

    useLayoutEffect(() => {
      if (user) {
        router.push('/progress');
      }
    }, [user, router]);

    return <Component {...props} />;
  };
}
