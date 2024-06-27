'use client';
import { useLayoutEffect, FC } from 'react';
import { useRouter } from 'next/navigation';
import { useContextSafely } from '@/hooks/functions/use-context-safely';
import { UserContext } from '@/contexts/user-context';

// we need something more sophisticated here
export function isSignedIn<P extends object>(Component: FC<P>) {
  return function IsSignedIn(props: P) {
    const { user } = useContextSafely(UserContext, 'IsSignedIn');
    const router = useRouter();

    useLayoutEffect(() => {
      router.prefetch('/signin');
    }, [router]);

    useLayoutEffect(() => {
      if (!user) {
        router.push('/signin');
      }
    }, [user, router]);

    return <Component {...props} />;
  };
}
