import 'server-only';
import {
  NextResponse,
  type NextRequest,
  type NextFetchEvent,
} from 'next/server';
import type { ChainedMiddleware } from './chained-middleware';

interface MiddlewareFactory {
  (middleware: ChainedMiddleware): ChainedMiddleware;
}

/**
 * Accepts an array of {@link ChainedMiddleware} and returns a middleware
 * function that calls each of the chained middleware until a response is
 * returned. If none of the middleware return a response, or if the array
 * is empty, a default response is returned.
 *
 * @param middlewareFactories
 * @param index
 * @returns
 */
export function chainMiddleware(
  middlewareFactories: MiddlewareFactory[],
  index = 0,
): ChainedMiddleware {
  if (index < middlewareFactories.length) {
    const next = chainMiddleware(middlewareFactories, index + 1);
    const current = middlewareFactories[index];
    return current(next);
  }

  return (
    _request: NextRequest,
    _event: NextFetchEvent,
    response?: NextResponse,
  ) => response || NextResponse.next();
}
