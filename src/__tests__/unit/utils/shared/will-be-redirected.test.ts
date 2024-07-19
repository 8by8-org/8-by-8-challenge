import { NextResponse } from 'next/server';
import { willBeRedirected } from '@/utils/shared/will-be-redirected';

describe('willBeRedirected', () => {
  it(`returns true if the status code of the middleware result it receives 
  is used by Next.js to indicate redirection.`, () => {
    const statusCodes = [307, 308];

    for (const statusCode of statusCodes) {
      const response = NextResponse.json({}, { status: statusCode });
      expect(willBeRedirected(response)).toBe(true);
    }
  });

  it(`returns false if the status code of the middleware result it receives 
  is not used by Next.js to indicate redirection.`, () => {
    const statusCodes = [
      200, 201, 202, 300, 301, 302, 400, 401, 404, 403, 405, 429, 500, 501, 502,
      418,
    ];

    for (const statusCode of statusCodes) {
      const response = NextResponse.json({}, { status: statusCode });
      expect(willBeRedirected(response)).toBe(false);
    }
  });

  it('returns false if the middleware result it receives is undefined.', () => {
    expect(willBeRedirected()).toBe(false);
  });

  it('returns false if the middleware result it receives is null.', () => {
    expect(willBeRedirected(null)).toBe(false);
  });
});
