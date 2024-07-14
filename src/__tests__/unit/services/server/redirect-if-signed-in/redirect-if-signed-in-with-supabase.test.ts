import { redirectIfSignedInWithSupabase } from '@/services/server/redirect-if-signed-in/redirect-if-signed-in-with-supabase';
import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';
import { UserType } from '@/model/enums/user-type';
import { wasRedirected } from '@/utils/shared/was-redirected';
import { MockNextCookies } from '@/utils/test/mock-next-cookies';
import { resetSupabase } from '@/utils/test/reset-supabase';
import { createId } from '@paralleldrive/cuid2';
import { createServerClient } from '@supabase/ssr';
import { NextRequest } from 'next/server';

describe('redirectIfSignedInWithSupabase', () => {
  afterEach(() => {
    return resetSupabase();
  });

  it('returns a response that redirects the user if they are signed in.', async () => {
    /*
      Create a supabase client and capture the cookies it creates when a user 
      signs in.
    */
    const mockCookies = new MockNextCookies();

    const supabase = createServerClient(
      PUBLIC_ENVIRONMENT_VARIABLES.NEXT_PUBLIC_SUPABASE_URL,
      PRIVATE_ENVIRONMENT_VARIABLES.SUPABASE_SERVICE_ROLE_KEY,
      {
        cookies: {
          getAll() {
            return mockCookies.cookies().getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              mockCookies.cookies().set(name, value, options),
            );
          },
        },
      },
    );

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

    const { error: verifyOtpError } = await supabase.auth.verifyOtp({
      email,
      type: 'email',
      token: data.properties.email_otp,
    });

    if (verifyOtpError) throw new Error(verifyOtpError.message);

    const authCookie = mockCookies.cookies().getAll()[0];

    /*
      Create a request, set the captured cookie on the request, and verify that 
      the response redirects the user.
    */
    const request = new NextRequest('https://challenge.8by8.us/signin', {
      method: 'GET',
    });

    request.cookies.set(authCookie.name, authCookie.value);
    request.cookies.set('test-cookie', 'test-value');

    const response = await redirectIfSignedInWithSupabase(request);
    expect(wasRedirected(response)).toBe(true);
  });

  it('returns a response that does not redirect the user if they are signed out.', async () => {
    const request = new NextRequest('https://challenge.8by8.us/signin', {
      method: 'GET',
    });

    const response = await redirectIfSignedInWithSupabase(request);
    expect(wasRedirected(response)).toBe(false);
  });
});
