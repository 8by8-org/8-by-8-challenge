'use client';
import { useLayoutEffect, FC } from 'react';
import { useRouter } from 'next/navigation';
import { useContextSafely } from '@/hooks/functions/use-context-safely';
import { UserContext } from '@/contexts/user-context';

export function sentOTP<P extends object>(Component: FC<P>) {
  return function SentOTP(props: P) {
    const { sentOTP } = useContextSafely(UserContext, 'SentOTP');
    const router = useRouter();

    useLayoutEffect(() => {
      router.prefetch('/signin');
    }, [router]);

    useLayoutEffect(() => {
      if (!sentOTP) {
        router.push('/signin');
      }
    }, [sentOTP, router]);

    return <Component {...props} />;
  };
}
