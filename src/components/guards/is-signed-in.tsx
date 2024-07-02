'use client';
import { useLayoutEffect, FC } from 'react';
import { useRouter } from 'next/navigation';
import { useContextSafely } from '@/hooks/functions/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import SignIn from '@/app/signin/page';

export function isSignedIn<P extends object>(Component: FC<P>) {
  return function IsSignedIn(props: P) {
    const { user } = useContextSafely(UserContext, 'IsSignedIn');
    const router = useRouter();

    if (!user) {
      router.push('/signin');
    }

    return <Component {...props} />;
  };
}
