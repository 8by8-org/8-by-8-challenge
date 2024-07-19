import type { NextFetchEvent, NextRequest } from 'next/server';
import type { NextMiddlewareResult } from 'next/dist/server/web/types';

/**
 * Provides a method for processing requests before they reach the server.
 * Can be used to facilitate rate-limiting, server-side authentication, and
 * more.
 */
export interface IMiddleware {
  processRequest(
    request: NextRequest,
    event: NextFetchEvent,
  ): Promise<NextMiddlewareResult>;
}
