import { chainMiddleware } from '@/middlewares';
import { Builder } from 'builder-pattern';
import { NextRequest, NextResponse, type NextFetchEvent } from 'next/server';

describe('chainMiddleware', () => {
  it(`returns a middleware function that returns a response even if it receives 
  an empty array.`, () => {
    const middleware = chainMiddleware([]);
    expect(
      middleware(
        new NextRequest('https://challenge.8by8.us/', { method: 'GET' }),
        Builder<NextFetchEvent>().build(),
      ),
    ).toBeInstanceOf(NextResponse);
  });
});
