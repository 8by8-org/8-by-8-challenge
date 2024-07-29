'use client';
import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';

export function isSignedOut<P extends object>(Component: FC<P>) {
  return function UnAuthGuard(props: P) {
    const { user } = useContextSafely(UserContext, 'UnAuthGuard');
    const router = useRouter();

    if (user) {
      router.push('/progress');
    }

    return <Component {...props} />;
  };
}
