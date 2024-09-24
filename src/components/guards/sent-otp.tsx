'use client';
import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';

/**
 * A higher-order component that redirects the user to /signin if they have not
 * been sent a one-time passcode. Use this in combination with middleware to
 * protect pages that can only be accessed if the user has been emailed a
 * one-time passcode.
 *
 * @param Page - A function component that should be protected by this guard.
 * @returns
 * A function component that can be used as a drop-in replacement for the
 * component it received as an argument.
 */
export function sentOTP<P extends object>(Component: FC<P>) {
  return function SentOTPGuard(props: P) {
    const { emailForSignIn } = useContextSafely(UserContext, 'SentOTPGuard');
    const router = useRouter();
    const shouldRedirect = !emailForSignIn;

    if (shouldRedirect) {
      router.push('/signin');
    }

    return shouldRedirect ? null : <Component {...props} />;
  };
}
