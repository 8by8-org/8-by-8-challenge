import { getSignedInRequest } from '@/utils/test/get-signed-in-request';
import { resetAuthAndDatabase } from '@/utils/test/reset-auth-and-database';
import * as supabaseSSR from '@supabase/ssr';
import { AuthError } from '@supabase/supabase-js';

jest.mock('@supabase/ssr', () => ({
  __esModule: true,
  ...jest.requireActual('@supabase/ssr'),
}));

describe('getSignedInRequest', () => {
  afterEach(() => {
    return resetAuthAndDatabase();
  });

  afterAll(() => {
    jest.unmock('@supabase/ssr');
  });

  it('returns a request with an authentication cookie.', async () => {
    const request = await getSignedInRequest(
      'https://challenge.8by8.org/progress',
      {
        method: 'GET',
      },
    );

    const authCookieNamePattern = /sb-[^-]+-auth-token/;

    expect(
      request.cookies
        .getAll()
        .find(cookie => authCookieNamePattern.test(cookie.name)),
    ).toBeDefined();
  });

  it('throws an error if supabase.auth.admin.createUser() returns an error.', async () => {
    const supabaseSpy = jest
      .spyOn(supabaseSSR, 'createServerClient')
      .mockImplementationOnce(() => ({
        auth: {
          admin: {
            createUser: () => {
              return Promise.resolve({
                error: new AuthError('User already exists.', 422),
              });
            },
          },
        },
      }));

    await expect(
      getSignedInRequest('https://challenge.8by8.org/progress', {
        method: 'GET',
      }),
    ).rejects.toThrow(new Error('User already exists.'));

    supabaseSpy.mockRestore();
  });

  it('throws an error if supabase.auth.admin.generateLink() returns an error.', async () => {
    const supabaseSpy = jest
      .spyOn(supabaseSSR, 'createServerClient')
      .mockImplementationOnce(() => ({
        auth: {
          admin: {
            createUser: () => {
              return Promise.resolve({
                error: null,
              });
            },
            generateLink: () => {
              return Promise.resolve({
                data: null,
                error: new AuthError('Magic link not supported.', 502),
              });
            },
          },
        },
      }));

    await expect(
      getSignedInRequest('https://challenge.8by8.org/progress', {
        method: 'GET',
      }),
    ).rejects.toThrow(new Error('Magic link not supported.'));

    supabaseSpy.mockRestore();
  });

  it('throws an error if supabase.auth.verifyOtp throws an error.', async () => {
    const supabaseSpy = jest
      .spyOn(supabaseSSR, 'createServerClient')
      .mockImplementationOnce(() => ({
        auth: {
          admin: {
            createUser: () => {
              return Promise.resolve({
                error: null,
              });
            },
            generateLink: () => {
              return Promise.resolve({
                data: {
                  properties: {
                    email_otp: '123456',
                  },
                },
                error: null,
              });
            },
          },
          verifyOtp: () => {
            return Promise.resolve({
              error: new AuthError('Failed to verify otp.'),
            });
          },
        },
      }));

    await expect(
      getSignedInRequest('https://challenge.8by8.org/progress', {
        method: 'GET',
      }),
    ).rejects.toThrow(new Error('Failed to verify otp.'));

    supabaseSpy.mockRestore();
  });
});
