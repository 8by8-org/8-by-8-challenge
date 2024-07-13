import { Cookies } from '@/services/server/cookies/cookies';
import { Builder } from 'builder-pattern';
import type {
  RequestCookie,
  ResponseCookie,
} from 'next/dist/compiled/@edge-runtime/cookies';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

const mockCookieStore = new Map<string, RequestCookie>();

function mockNextCookies(): ReadonlyRequestCookies {
  return Builder<ReadonlyRequestCookies>()
    .get((name: string) => {
      return mockCookieStore.get(name);
    })
    .set((name: string, value: string, cookie?: Partial<ResponseCookie>) => {
      mockCookieStore.set(name, {
        name,
        value,
        ...cookie,
      });

      return mockNextCookies();
    })
    .delete((name: string) => {
      mockCookieStore.delete(name);

      return mockNextCookies();
    })
    .build();
}

jest.mock('next/headers', () => ({
  cookies: () => mockNextCookies(),
}));

describe('Cookies', () => {
  afterEach(() => {
    mockCookieStore.clear();
  });

  afterAll(jest.restoreAllMocks);

  it('sets, retrieves, and deletes cookies.', async () => {
    const cookies = new Cookies();
    const emailForSignIn = 'user@example.com';
    await cookies.setEmailForSignIn(emailForSignIn);
    await expect(cookies.loadEmailForSignIn()).resolves.toBe(emailForSignIn);

    cookies.clearEmailForSignIn();
    await expect(cookies.loadEmailForSignIn()).resolves.toBe('');
  });
});
