import { Cookies } from '@/services/server/cookies/cookies';
import { MockNextCookies } from '@/utils/test/mock-next-cookies';
import { CookieNames } from '@/constants/cookie-names';
import { createId } from '@paralleldrive/cuid2';

const mockCookies = new MockNextCookies();

jest.mock('next/headers', () => ({
  cookies: () => mockCookies.cookies(),
}));

describe('Cookies', () => {
  afterEach(() => {
    mockCookies.cookies().clear();
  });

  afterAll(() => jest.unmock('next/headers'));

  it('sets, retrieves, and deletes the email for sign in cookie.', async () => {
    const cookies = new Cookies();
    const emailForSignIn = 'user@example.com';
    await cookies.setEmailForSignIn(emailForSignIn);
    await expect(cookies.loadEmailForSignIn()).resolves.toBe(emailForSignIn);
    cookies.clearEmailForSignIn();
    await expect(cookies.loadEmailForSignIn()).resolves.toBe('');
  });

  it('retrieves and deletes the inviteCode cookie.', () => {
    const cookies = new Cookies();
    const inviteCode = createId();
    mockCookies.cookies().set(CookieNames.InviteCode, inviteCode);

    let retrievedValue = cookies.getInviteCode();
    expect(retrievedValue).toBe(inviteCode);

    cookies.clearInviteCode();
    retrievedValue = cookies.getInviteCode();
    expect(retrievedValue).toBeUndefined();
  });
});
