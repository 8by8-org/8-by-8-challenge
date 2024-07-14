import { NextMiddlewareResult } from 'next/dist/server/web/types';

export function wasRedirected(response: NextMiddlewareResult) {
  return response?.status === 307;
}
