import { SupabaseAuth } from '@/services/server/auth/supabase-auth';
import { Builder } from 'builder-pattern';
import { UserType } from '@/model/enums/user-type';
import { ServerError } from '@/errors/server-error';
import { DateTime } from 'luxon';
import {
  AuthError,
  AuthResponse,
  UserResponse,
  type AuthOtpResponse,
  type GoTrueAdminApi,
  type SupabaseClient,
} from '@supabase/supabase-js';
import type { UserRepository } from '@/services/server/user-repository/user-repository';
import type { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';
import type { User } from '@/model/types/user';

describe('SupabaseAuth', () => {
  let supabaseAuth: InstanceType<typeof SupabaseAuth>;
  let supabaseAuthClient: SupabaseAuthClient;
  let userRepository: UserRepository;

  beforeEach(() => {
    const supabaseAuthAdmin = Builder<GoTrueAdminApi>()
      .createUser(jest.fn())
      .build();

    supabaseAuthClient = Builder<SupabaseAuthClient>()
      .admin(supabaseAuthAdmin)
      .signInWithOtp(jest.fn())
      .verifyOtp(jest.fn())
      .getUser(jest.fn())
      .signOut(jest.fn())
      .build();

    const supabaseClient = Builder<SupabaseClient>()
      .auth(supabaseAuthClient)
      .build();
    const createSupabaseClient = () => supabaseClient;

    userRepository = Builder<UserRepository>().getUserById(jest.fn()).build();

    supabaseAuth = new SupabaseAuth(createSupabaseClient, userRepository);
  });

  it(`calls supabase.auth.admin.createUser when signUpWithEmailandSendOTP is 
  called.`, async () => {
    jest.spyOn(supabaseAuthClient.admin, 'createUser').mockResolvedValueOnce({
      error: null,
    } as UserResponse);

    jest.spyOn(supabaseAuthClient, 'signInWithOtp').mockResolvedValueOnce({
      error: null,
    } as AuthOtpResponse);

    const email = 'user@example.com';
    const name = 'User';
    const avatar = '0';
    const type = UserType.Challenger;

    await supabaseAuth.signUpWithEmailAndSendOTP(email, name, avatar, type);

    expect(supabaseAuthClient.admin.createUser).toHaveBeenCalledWith({
      email,
      email_confirm: true,
      user_metadata: {
        name,
        avatar,
        type,
        invite_code: expect.any(String),
      },
    });
  });

  it(`calls supabase.auth.signInWithOTP when supabase.auth.admin.createUser 
  succeeds.`, async () => {
    jest.spyOn(supabaseAuthClient.admin, 'createUser').mockResolvedValueOnce({
      error: null,
    } as UserResponse);

    jest.spyOn(supabaseAuthClient, 'signInWithOtp').mockResolvedValueOnce({
      error: null,
    } as AuthOtpResponse);

    const email = 'user@example.com';

    await supabaseAuth.signUpWithEmailAndSendOTP(
      email,
      'User',
      '3',
      UserType.Hybrid,
    );

    expect(supabaseAuthClient.signInWithOtp).toHaveBeenCalledWith({
      email,
      options: {
        shouldCreateUser: false,
      },
    });
  });

  it(`throws a ServerError when supabase.auth.admin.createUser returns an 
  error.`, async () => {
    jest.spyOn(supabaseAuthClient.admin, 'createUser').mockResolvedValueOnce({
      data: {
        user: null,
      },
      error: new AuthError('Email exists.', 422, 'email_exists'),
    });

    await expect(
      supabaseAuth.signUpWithEmailAndSendOTP(
        'user@example.com',
        'user',
        '0',
        UserType.Challenger,
      ),
    ).rejects.toThrow(new ServerError('Email exists.', 422));
  });

  it('calls supabase.auth.signInWithOTP when sendOTPToEmail is called.', async () => {
    jest.spyOn(supabaseAuthClient, 'signInWithOtp').mockResolvedValueOnce({
      error: null,
    } as AuthOtpResponse);

    const email = 'user@example.com';

    await supabaseAuth.sendOTPToEmail(email);

    expect(supabaseAuthClient.signInWithOtp).toHaveBeenCalledWith({
      email,
      options: {
        shouldCreateUser: false,
      },
    });
  });

  it(`throws a ServerError when supabase.auth.signInWithOTP returns an 
  error.`, async () => {
    jest.spyOn(supabaseAuthClient, 'signInWithOtp').mockResolvedValueOnce({
      error: new AuthError('Too many requests.', 429),
    } as AuthOtpResponse);

    const email = 'user@example.com';

    await expect(supabaseAuth.sendOTPToEmail(email)).rejects.toThrow(
      new ServerError('Too many requests.', 429),
    );
  });

  it(`returns a user if supabase.auth.verifyOtp and userRepository.getUserById 
  succeed.`, async () => {
    jest.spyOn(supabaseAuthClient, 'verifyOtp').mockResolvedValueOnce({
      data: {
        user: {
          id: '1',
        },
      },
      error: null,
    } as AuthResponse);

    const expectedUser: User = {
      uid: '1',
      email: 'user@example.com',
      name: 'user',
      avatar: '0',
      type: UserType.Challenger,
      challengeEndTimestamp: DateTime.now().plus({ days: 8 }).toUnixInteger(),
      completedActions: {
        electionReminders: false,
        sharedChallenge: false,
        registerToVote: false,
      },
      badges: [],
      completedChallenge: false,
      contributedTo: [],
      inviteCode: '1234',
    };

    jest
      .spyOn(userRepository, 'getUserById')
      .mockResolvedValueOnce(expectedUser);

    const user = await supabaseAuth.signInWithEmailAndOTP(
      'user@example.com',
      '123456',
    );

    expect(user).toEqual(expectedUser);
  });

  it(`throws a ServerError if supabase.auth.verifyOtp returns an error when 
  signInWithEmailAndOTP is called.`, async () => {
    jest.spyOn(supabaseAuthClient, 'verifyOtp').mockResolvedValueOnce({
      data: {
        user: null,
      },
      error: new AuthError('Wrong email or password.', 403),
    } as AuthResponse);

    await expect(
      supabaseAuth.signInWithEmailAndOTP('user@example.com', '1112'),
    ).rejects.toThrow(new ServerError('Wrong email or password.', 403));
  });

  it(`throws a ServerError if supabase.auth.verifyOtp returns an object 
  containing a null user.`, async () => {
    jest.spyOn(supabaseAuthClient, 'verifyOtp').mockResolvedValueOnce({
      data: {
        user: null,
      },
      error: null,
    } as AuthResponse);

    await expect(
      supabaseAuth.signInWithEmailAndOTP('user@example.com', '123456'),
    ).rejects.toThrow(new ServerError('User not found.', 401));
  });

  it(`throws a ServerError when the user exists in the auth.users table but not 
  in the public.users table.`, async () => {
    jest.spyOn(supabaseAuthClient, 'verifyOtp').mockResolvedValueOnce({
      data: {
        user: {
          id: '1',
        },
      },
      error: null,
    } as AuthResponse);

    jest.spyOn(userRepository, 'getUserById').mockResolvedValueOnce(null);

    jest.spyOn(supabaseAuthClient, 'signOut').mockResolvedValueOnce({
      error: null,
    });

    await expect(
      supabaseAuth.signInWithEmailAndOTP('user@example.com', '123456'),
    ).rejects.toThrow(
      new ServerError(
        'User was authenticated, but user data was not found.',
        404,
      ),
    );
  });

  it(`throws a ServerError when the user exists in the auth.users table but not 
  in the public.users table and signing the user out also fails.`, async () => {
    jest.spyOn(supabaseAuthClient, 'verifyOtp').mockResolvedValueOnce({
      data: {
        user: {
          id: '1',
        },
      },
      error: null,
    } as AuthResponse);

    jest.spyOn(userRepository, 'getUserById').mockResolvedValueOnce(null);

    jest.spyOn(supabaseAuthClient, 'signOut').mockResolvedValueOnce({
      error: new AuthError('There was a problem signing out.'),
    });

    await expect(
      supabaseAuth.signInWithEmailAndOTP('user@example.com', '123456'),
    ).rejects.toThrow(
      new ServerError(
        'User was authenticated, but user data was not found. Tried to sign out, but could not.',
        500,
      ),
    );
  });

  it(`returns a user when loadSessionUser succeeds.`, async () => {
    jest.spyOn(supabaseAuthClient, 'getUser').mockResolvedValueOnce({
      data: {
        user: {
          id: '1',
        },
      },
    } as UserResponse);

    const expectedUser: User = {
      uid: '1',
      email: 'user@example.com',
      name: 'user',
      avatar: '0',
      type: UserType.Challenger,
      challengeEndTimestamp: DateTime.now().plus({ days: 8 }).toUnixInteger(),
      completedActions: {
        electionReminders: false,
        sharedChallenge: false,
        registerToVote: false,
      },
      badges: [],
      completedChallenge: false,
      contributedTo: [],
      inviteCode: '1234',
    };

    jest
      .spyOn(userRepository, 'getUserById')
      .mockResolvedValueOnce(expectedUser);

    const user = await supabaseAuth.loadSessionUser();
    expect(user).toEqual(expectedUser);
  });

  it(`returns null when supabase.auth.getUser does not find a user when it is 
  called within loadSessionUser.`, async () => {
    jest.spyOn(supabaseAuthClient, 'getUser').mockResolvedValueOnce({
      data: {
        user: null,
      },
    } as UserResponse);

    const user = await supabaseAuth.loadSessionUser();
    expect(user).toEqual(null);
  });

  it(`returns null when userRepository.getUserById returns null when it is 
  called within loadSessionUser`, async () => {
    jest.spyOn(supabaseAuthClient, 'getUser').mockResolvedValueOnce({
      data: {
        user: {
          id: '1',
        },
      },
    } as UserResponse);

    jest.spyOn(userRepository, 'getUserById').mockResolvedValueOnce(null);

    const user = await supabaseAuth.loadSessionUser();
    expect(user).toEqual(null);
  });

  it(`returns null when userRepostory.getUserById throws an error when it is 
  called within loadSessionUser.`, async () => {
    jest.spyOn(supabaseAuthClient, 'getUser').mockResolvedValueOnce({
      data: {
        user: {
          id: '1',
        },
      },
    } as UserResponse);

    jest.spyOn(userRepository, 'getUserById').mockImplementationOnce(() => {
      throw new ServerError('User not found.', 404);
    });

    jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());

    const user = await supabaseAuth.loadSessionUser();
    expect(user).toEqual(null);
  });

  it(`logs an error when userRepository.getUserById throws an error when it is
  called within loadSessionUser.`, async () => {
    jest.spyOn(supabaseAuthClient, 'getUser').mockResolvedValueOnce({
      data: {
        user: {
          id: '1',
        },
      },
    } as UserResponse);

    jest.spyOn(userRepository, 'getUserById').mockImplementationOnce(() => {
      throw new ServerError('User not found.', 404);
    });

    jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());

    await supabaseAuth.loadSessionUser();
    expect(console.error).toHaveBeenCalledWith(
      new ServerError('User not found.', 404),
    );
  });

  it(`calls supabase.auth.signOut when signOut is called.`, async () => {
    jest.spyOn(supabaseAuthClient, 'signOut').mockResolvedValueOnce({
      error: null,
    });

    await supabaseAuth.signOut();

    expect(supabaseAuthClient.signOut).toHaveBeenCalled();
  });

  it('throws a ServerError when signOut fails.', async () => {
    jest.spyOn(supabaseAuthClient, 'signOut').mockResolvedValueOnce({
      error: new AuthError('User already signed out.', 422),
    });

    await expect(supabaseAuth.signOut()).rejects.toThrow(
      new ServerError('User already signed out.', 422),
    );
  });
});
