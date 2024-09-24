import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { PrefetchOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * Prefetches JavaScript for a given route using the Next.js App Router.
 *
 * @param href - The path of the route to prefetch.
 * @param options - {@link PrefetchOptions}.
 *
 * @remarks
 * Use this when a component calls the `push` method of an {@link AppRouterInstance}.
 */
export function usePrefetch(href: string, options?: PrefetchOptions) {
  const router = useRouter();

  useEffect(() => {
    router.prefetch(href, options);
  }, [href, options, router]);
}
