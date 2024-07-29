'use client';
import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';

export function sentOTP<P extends object>(Component: FC<P>) {
  return function SentOTP(props: P) {
    const { emailForSignIn } = useContextSafely(UserContext, 'SentOTP');
    const router = useRouter();

    if (!emailForSignIn) {
      router.push('/signin');
    }

    return <Component {...props} />;
  };
}
