'use client';
import { UserContext } from '@/contexts/user-context';
import { useContextSafely } from '@/hooks/functions/use-context-safely';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

interface UnAuthGuardProps {
    children?: ReactNode;
}

/**
 * Ensures the user does not access child components if they are not signed in.
 * 
 * @param props - {@link UnAuthGuardProps}
 * @returns child components
 */
export function UnAuthGuard({ children }: UnAuthGuardProps) {
    const { user } = useContextSafely(UserContext, 'UnAuthGuard');
    const router = useRouter();

    if (user) {
        router.push('/progress');
    }

    return <>{children}</>;
}