import { SupabaseAuth } from '@/services/server/auth/supabase-auth';
import { Builder } from 'builder-pattern';
import { UserType } from '@/model/enums/user-type';
import { ServerError } from '@/errors/server-error';
import { DateTime } from 'luxon';
import { createId } from '@paralleldrive/cuid2';
import { v4 as uuid } from 'uuid';
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
import type { InvitationsRepository } from '@/services/server/invitations-repository/invitations-repository';
import type { ICookies } from '@/services/server/cookies/i-cookies';
import type { ChallengerData } from '@/model/types/challenger-data';

describe('SupabaseAuth', () => {
  let supabaseAuth: InstanceType<typeof SupabaseAuth>;
  let supabaseAuthClient: SupabaseAuthClient;
  let userRepository: UserRepository;
  let invitationsRepository: InvitationsRepository;
  let cookies: ICookies;

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

    userRepository = Builder<UserRepository>()
      .getUserById(jest.fn())
      .makeHybrid(jest.fn())
      .build();

    invitationsRepository = Builder<InvitationsRepository>()
      .insertOrUpdateInvitedBy(jest.fn())
      .getInvitedByFromPlayerId(jest.fn())
      .getInvitedByFromChallengerInviteCode(jest.fn())
      .build();

    cookies = Builder<ICookies>().getInviteCode(jest.fn()).build();

    supabaseAuth = new SupabaseAuth(
      createSupabaseClient,
      userRepository,
      invitationsRepository,
      cookies,
    );
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

    await supabaseAuth.signUpWithEmailAndSendOTP(email, name, avatar);

    expect(supabaseAuthClient.admin.createUser).toHaveBeenCalledWith({
      email,
      email_confirm: true,
      user_metadata: {
        name,
        avatar,
        type: UserType.Challenger,
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

    await supabaseAuth.signUpWithEmailAndSendOTP(email, 'User', '3');

    expect(supabaseAuthClient.signInWithOtp).toHaveBeenCalledWith({
      email,
      options: {
        shouldCreateUser: false,
      },
    });
  });

  it(`signs the user up as a player and creates a record in invited_by when 
  an invite code is detected in cookies and signUpWithEmailAndSendOTP is 
  called.`, async () => {
    const inviteCode = createId();
    const invitedBy: ChallengerData = {
      challengerName: 'Challenger',
      challengerInviteCode: inviteCode,
      challengerAvatar: '0',
    };
    const playerId = uuid();

    jest.spyOn(cookies, 'getInviteCode').mockReturnValueOnce(inviteCode);

    jest
      .spyOn(invitationsRepository, 'getInvitedByFromChallengerInviteCode')
      .mockResolvedValueOnce(invitedBy);

    jest.spyOn(supabaseAuthClient.admin, 'createUser').mockResolvedValueOnce({
      data: {
        user: {
          id: playerId,
        },
      },
      error: null,
    } as UserResponse);

    jest.spyOn(supabaseAuthClient, 'signInWithOtp').mockResolvedValueOnce({
      error: null,
    } as AuthOtpResponse);

    const email = 'player@example.com';
    const name = 'PlayerUser';
    const avatar = '1';

    await supabaseAuth.signUpWithEmailAndSendOTP(email, name, avatar);

    expect(supabaseAuthClient.admin.createUser).toHaveBeenCalledWith({
      email,
      email_confirm: true,
      user_metadata: {
        name,
        avatar,
        type: UserType.Player,
        invite_code: expect.any(String),
      },
    });

    expect(invitationsRepository.insertOrUpdateInvitedBy).toHaveBeenCalledWith(
      playerId,
      invitedBy,
    );
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
      supabaseAuth.signUpWithEmailAndSendOTP('user@example.com', 'user', '0'),
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

    const { user } = await supabaseAuth.signInWithEmailAndOTP(
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

  it(`loads user data when loadSession is called if the user is signed in.`, async () => {
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

    const { user } = await supabaseAuth.loadSession();
    expect(user).toEqual(expectedUser);
  });

  it(`makes the user a hybrid type user if the user is a player and
  loadSession is called with an invite code cookie set.`, async () => {
    jest.spyOn(supabaseAuthClient, 'getUser').mockResolvedValueOnce({
      data: {
        user: {
          id: '1',
        },
      },
    } as UserResponse);

    const user: User = {
      uid: '1',
      email: 'user@example.com',
      name: 'User',
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
      inviteCode: createId(),
    };

    jest.spyOn(userRepository, 'getUserById').mockResolvedValueOnce(user);

    jest.spyOn(userRepository, 'makeHybrid').mockResolvedValueOnce({
      ...user,
      type: UserType.Hybrid,
    });

    const otherUserInviteCode = createId();

    jest
      .spyOn(cookies, 'getInviteCode')
      .mockReturnValueOnce(otherUserInviteCode);

    jest
      .spyOn(invitationsRepository, 'getInvitedByFromChallengerInviteCode')
      .mockResolvedValueOnce({
        challengerName: 'Challenger',
        challengerInviteCode: otherUserInviteCode,
        challengerAvatar: '1',
      });

    await supabaseAuth.loadSession();
    expect(userRepository.makeHybrid).toHaveBeenCalled();
  });

  it(`updates the user's record in the invited_by table when loadSession is
  called while the user is signed in and an invite cookie is set.`, async () => {
    jest.spyOn(supabaseAuthClient, 'getUser').mockResolvedValueOnce({
      data: {
        user: {
          id: '1',
        },
      },
    } as UserResponse);

    const user: User = {
      uid: '1',
      email: 'user@example.com',
      name: 'User',
      avatar: '0',
      type: UserType.Player,
      challengeEndTimestamp: DateTime.now().plus({ days: 8 }).toUnixInteger(),
      completedActions: {
        electionReminders: false,
        sharedChallenge: false,
        registerToVote: false,
      },
      badges: [],
      completedChallenge: false,
      contributedTo: [],
      inviteCode: createId(),
    };

    jest.spyOn(userRepository, 'getUserById').mockResolvedValueOnce(user);

    const otherUserInviteCode = createId();

    jest
      .spyOn(cookies, 'getInviteCode')
      .mockReturnValueOnce(otherUserInviteCode);

    const invitedBy: ChallengerData = {
      challengerName: 'Challenger',
      challengerInviteCode: otherUserInviteCode,
      challengerAvatar: '1',
    };

    jest
      .spyOn(invitationsRepository, 'getInvitedByFromChallengerInviteCode')
      .mockResolvedValueOnce(invitedBy);

    await supabaseAuth.loadSession();
    expect(invitationsRepository.insertOrUpdateInvitedBy).toHaveBeenCalledWith(
      user.uid,
      invitedBy,
    );
  });

  it(`does not update the user's type or their invited by record when the
  value of the invite code cookie is the user's own invite code.`, async () => {
    jest.spyOn(supabaseAuthClient, 'getUser').mockResolvedValueOnce({
      data: {
        user: {
          id: '1',
        },
      },
    } as UserResponse);

    const user: User = {
      uid: '1',
      email: 'user@example.com',
      name: 'User',
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
      inviteCode: createId(),
    };

    jest.spyOn(userRepository, 'getUserById').mockResolvedValueOnce(user);

    jest.spyOn(userRepository, 'makeHybrid').mockResolvedValueOnce({
      ...user,
      type: UserType.Hybrid,
    });

    jest.spyOn(cookies, 'getInviteCode').mockReturnValueOnce(user.inviteCode);

    jest
      .spyOn(invitationsRepository, 'getInvitedByFromChallengerInviteCode')
      .mockResolvedValueOnce({
        challengerName: user.name,
        challengerInviteCode: user.inviteCode,
        challengerAvatar: user.avatar,
      });

    await supabaseAuth.loadSession();
    expect(userRepository.makeHybrid).not.toHaveBeenCalled();
    expect(
      invitationsRepository.insertOrUpdateInvitedBy,
    ).not.toHaveBeenCalled();
  });

  it(`loads the user's record from the invited_by table when loadSession is
  called and the user is signed in but there is no invite code cookie set.`, async () => {
    jest.spyOn(supabaseAuthClient, 'getUser').mockResolvedValueOnce({
      data: {
        user: {
          id: '1',
        },
      },
    } as UserResponse);

    const user: User = {
      uid: '1',
      email: 'user@example.com',
      name: 'User',
      avatar: '0',
      type: UserType.Player,
      challengeEndTimestamp: DateTime.now().plus({ days: 8 }).toUnixInteger(),
      completedActions: {
        electionReminders: false,
        sharedChallenge: false,
        registerToVote: false,
      },
      badges: [],
      completedChallenge: false,
      contributedTo: [],
      inviteCode: createId(),
    };

    jest.spyOn(userRepository, 'getUserById').mockResolvedValueOnce(user);

    const expectedInvitedBy: ChallengerData = {
      challengerName: 'Challenger',
      challengerInviteCode: createId(),
      challengerAvatar: '1',
    };

    jest
      .spyOn(invitationsRepository, 'getInvitedByFromPlayerId')
      .mockResolvedValueOnce(expectedInvitedBy);

    const { invitedBy: actualInvitedBy } = await supabaseAuth.loadSession();
    expect(actualInvitedBy).toStrictEqual(expectedInvitedBy);
  });

  it(`loads invited by data from cookies when the user is signed out.`, async () => {
    jest.spyOn(supabaseAuthClient, 'getUser').mockResolvedValueOnce({
      data: {
        user: null,
      },
    } as UserResponse);

    const otherUserInviteCode = createId();

    jest
      .spyOn(cookies, 'getInviteCode')
      .mockReturnValueOnce(otherUserInviteCode);

    const expectedInvitedBy: ChallengerData = {
      challengerName: 'Challenger',
      challengerInviteCode: otherUserInviteCode,
      challengerAvatar: '1',
    };

    jest
      .spyOn(invitationsRepository, 'getInvitedByFromChallengerInviteCode')
      .mockResolvedValueOnce(expectedInvitedBy);

    const { invitedBy: actualInvitedBy } = await supabaseAuth.loadSession();
    expect(actualInvitedBy).toStrictEqual(expectedInvitedBy);
  });

  it(`logs an error when userRepository.getUserById throws an error when it is
  called within loadSession.`, async () => {
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

    await supabaseAuth.loadSession();
    expect(console.error).toHaveBeenCalledWith(
      new ServerError('User not found.', 404),
    );
  });
});
