import type { NextFetchEvent, NextRequest } from 'next/server';
import type { NextMiddlewareResult } from 'next/dist/server/web/types';

export interface IMiddleware {
  processRequest(
    request: NextRequest,
    event: NextFetchEvent,
  ): Promise<NextMiddlewareResult>;
}
