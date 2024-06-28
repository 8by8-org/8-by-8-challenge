'use client';
import { useLayoutEffect, FC } from 'react';
import { useRouter } from 'next/navigation';
import { useContextSafely } from '@/hooks/functions/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import SignInWithOTP from '@/app/signin-with-otp/page';

export function didNotSendOTP<P extends object>(Component: FC<P>) {
  return function DidNotSendOTP(props: P) {
    const { emailForSignIn } = useContextSafely(UserContext, 'DidNotSendOTP');
    const router = useRouter();

    useLayoutEffect(() => {
      router.prefetch('/signin-with-otp');
    }, [router]);

    useLayoutEffect(() => {
      if (emailForSignIn) {
        router.push('/signin-with-otp');
      }
    }, [emailForSignIn, router]);

    return !emailForSignIn ? <Component {...props} /> : <SignInWithOTP />;
  };
}
