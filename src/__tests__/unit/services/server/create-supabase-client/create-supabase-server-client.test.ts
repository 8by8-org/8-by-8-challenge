import { createSupabaseServerClient } from '@/services/server/create-supabase-client/create-supabase-server-client';
import { SupabaseClient } from '@supabase/supabase-js';
import { MockNextCookies } from '@/utils/test/mock-next-cookies';
import { resetAuthAndDatabase } from '@/utils/test/reset-auth-and-database';
import { UserType } from '@/model/enums/user-type';
import { createId } from '@paralleldrive/cuid2';

const mockCookies = new MockNextCookies();

jest.mock('next/headers', () => ({
  cookies: () => mockCookies.cookies(),
}));

describe('createSupabaseServerClient', () => {
  const supabase = createSupabaseServerClient();

  afterEach(() => {
    mockCookies.cookies().clear();
    return resetAuthAndDatabase();
  });

  afterAll(() => jest.unmock('next/headers'));

  it('returns an instance of SupabaseClient.', () => {
    expect(supabase).toBeInstanceOf(SupabaseClient);
  });

  it('sets cookies when a user is authenticated.', async () => {
    const email = 'user@example.com';

    const { error: createUserError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        name: 'User',
        avatar: '0',
        type: UserType.Challenger,
        invite_code: createId(),
      },
    });

    if (createUserError) throw new Error(createUserError.message);

    const { data, error: generateLinkError } =
      await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email,
      });

    if (generateLinkError) throw new Error(generateLinkError.message);

    await supabase.auth.verifyOtp({
      email,
      type: 'email',
      token: data.properties.email_otp,
    });

    const authCookieNamePattern = /sb-[^-]+-auth-token/;

    expect(
      mockCookies
        .cookies()
        .getAll()
        .find(cookie => authCookieNamePattern.test(cookie.name)),
    ).toBeDefined();
  });
});
