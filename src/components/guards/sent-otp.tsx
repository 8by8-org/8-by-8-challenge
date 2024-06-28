'use client';
import { useLayoutEffect, FC } from 'react';
import { useRouter } from 'next/navigation';
import { useContextSafely } from '@/hooks/functions/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import SignIn from '@/app/signin/page';

export function sentOTP<P extends object>(Component: FC<P>) {
  return function SentOTP(props: P) {
    const { emailForSignIn } = useContextSafely(UserContext, 'SentOTP');
    const router = useRouter();

    useLayoutEffect(() => {
      router.prefetch('/signin');
    }, [router]);

    useLayoutEffect(() => {
      if (!sentOTP) {
        router.push('/signin');
      }
    }, [emailForSignIn, router]);

    return emailForSignIn ? <Component {...props} /> : <SignIn />;
  };
}
