import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';
import { UserType } from '@/model/enums/user-type';
import { createId } from '@paralleldrive/cuid2';
import { createServerClient } from '@supabase/ssr';
import { NextRequest } from 'next/server';
import { MockNextCookies } from './mock-next-cookies';

export async function getSignedInRequest(
  ...args: ConstructorParameters<typeof NextRequest>
) {
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

  const request = new NextRequest(...args);
  request.cookies.set(authCookie.name, authCookie.value);
  return request;
}
