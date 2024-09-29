import type { NextRequest, NextFetchEvent, NextResponse } from 'next/server';

export interface ChainedMiddleware {
  (
    request: NextRequest,
    event: NextFetchEvent,
    response?: NextResponse,
  ): NextResponse | Promise<NextResponse>;
}
