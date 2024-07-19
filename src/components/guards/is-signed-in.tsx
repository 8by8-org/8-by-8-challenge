'use client';
import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';

export function isSignedIn<P extends object>(Component: FC<P>) {
  return function AuthGuard(props: P) {
    const { user } = useContextSafely(UserContext, 'AuthGuard');
    const router = useRouter();

    if (!user) {
      router.push('/signin');
    }

    return <Component {...props} />;
  };
}
