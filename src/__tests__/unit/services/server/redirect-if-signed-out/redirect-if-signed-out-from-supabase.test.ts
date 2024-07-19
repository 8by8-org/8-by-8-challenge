import { redirectIfSignedOutFromSupabase } from '@/services/server/redirect-if-signed-out/redirect-if-signed-out-from-supabase';
import { willBeRedirected } from '@/utils/shared/will-be-redirected';
import { resetAuthAndDatabase } from '@/utils/test/reset-auth-and-database';
import { NextRequest } from 'next/server';
import { getSignedInRequest } from '@/utils/test/get-signed-in-request';

describe('redirectIfSignedOutFromSupabase', () => {
  afterEach(() => {
    return resetAuthAndDatabase();
  });

  it('returns a response that redirects the user if they are signed out.', async () => {
    const request = new NextRequest('https://challenge.8by8.us/progress', {
      method: 'GET',
    });

    const response = await redirectIfSignedOutFromSupabase(request);
    expect(willBeRedirected(response)).toBe(true);
  });

  it('returns a response that does not redirect the user if they are signed in.', async () => {
    const request = await getSignedInRequest(
      'https://challenge.8by8.us/progress',
      {
        method: 'GET',
      },
    );
    const response = await redirectIfSignedOutFromSupabase(request);
    expect(willBeRedirected(response)).toBe(false);
  });
});
