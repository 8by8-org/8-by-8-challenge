import { Cookies } from '@/services/server/cookies/cookies';
import { MockNextCookies } from '@/utils/test/mock-next-cookies';

const mockCookies = new MockNextCookies();

jest.mock('next/headers', () => ({
  cookies: () => mockCookies.cookies(),
}));

describe('Cookies', () => {
  afterEach(() => {
    mockCookies.cookies().clear();
  });

  afterAll(() => jest.unmock('next/headers'));

  it('sets, retrieves, and deletes cookies.', async () => {
    const cookies = new Cookies();
    const emailForSignIn = 'user@example.com';
    await cookies.setEmailForSignIn(emailForSignIn);
    await expect(cookies.loadEmailForSignIn()).resolves.toBe(emailForSignIn);
    cookies.clearEmailForSignIn();
    await expect(cookies.loadEmailForSignIn()).resolves.toBe('');
  });
});
