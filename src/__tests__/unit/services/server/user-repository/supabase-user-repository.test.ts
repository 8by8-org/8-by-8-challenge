import { SupabaseUserRepository } from '@/services/server/user-repository/supabase-user-repository';
import { UserRecordParser } from '@/services/server/user-record-parser/user-record-parser';
import { v4 as uuid } from 'uuid';
import { resetAuthAndDatabase } from '@/utils/test/reset-auth-and-database';
import { UserType } from '@/model/enums/user-type';
import { Actions } from '@/model/enums/actions';
import { ServerError } from '@/errors/server-error';
import { SupabaseUserRecordBuilder } from '@/utils/test/supabase-user-record-builder';
import { createId } from '@paralleldrive/cuid2';
import { createSupabaseServiceRoleClient } from '@/services/server/create-supabase-client/create-supabase-service-role-client';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import type { CreateSupabaseClient } from '@/services/server/create-supabase-client/create-supabase-client';
import type { IUserRecordParser } from '@/services/server/user-record-parser/i-user-record-parser';
import type { Badge } from '@/model/types/badges/badge';

describe('SupabaseUserRepository', () => {
  let userRepository: InstanceType<typeof SupabaseUserRepository>;
  let createSupabaseClient: CreateSupabaseClient;

  beforeEach(() => {
    createSupabaseClient = createSupabaseServiceRoleClient
    userRepository = new SupabaseUserRepository(createSupabaseClient, new UserRecordParser())
  });

  afterEach(() => {
    return resetAuthAndDatabase();
  });

  it('returns null when getUserById is called and no user is found.', async () => {
    await expect(userRepository.getUserById(uuid())).resolves.toBe(null);
  });

  it('returns a user when getUserById is called with an existing user id.', async () => {
    const challengerEmail = 'challenger@example.com';
    const challengerName = 'Challenger';
    const challengerAvatar = '0';
    const challengerInviteCode = 'test-invite-code';

    const playerEmail = 'player@example.com';
    const playerName = 'Player';
    const playerAvatar = '1';

    const { uid: challengerId } = await new SupabaseUserRecordBuilder(
      challengerEmail,
    )
      .name(challengerName)
      .avatar(challengerAvatar)
      .completedActions({ sharedChallenge: true })
      .badges([
        {
          action: Actions.SharedChallenge,
        },
        {
          playerName,
          playerAvatar,
        },
      ])
      .inviteCode(challengerInviteCode)
      .build();

    // Create a player who has been invited by the challenger.
    const { uid: playerId } = await new SupabaseUserRecordBuilder(playerEmail)
      .name(playerName)
      .type(UserType.Player)
      .avatar('1')
      .completedActions({ registerToVote: true })
      .invitedBy({
        challengerName,
        challengerAvatar,
        challengerInviteCode,
      })
      .badges([
        {
          action: Actions.RegisterToVote,
        },
      ])
      .contributedTo([
        {
          challengerName,
          challengerInviteCode,
          challengerAvatar,
        },
      ])
      .build();

    // Evaluate whether the challenger is returned as expected.
    const challenger = await userRepository.getUserById(challengerId);
    expect(challenger).toEqual({
      uid: challengerId,
      email: challengerEmail,
      name: challengerName,
      avatar: challengerAvatar,
      type: UserType.Challenger,
      completedActions: {
        sharedChallenge: true,
        electionReminders: false,
        registerToVote: false,
      },
      badges: [
        {
          action: Actions.SharedChallenge,
        },
        {
          playerName,
          playerAvatar,
        },
      ],
      challengeEndTimestamp: expect.any(Number),
      completedChallenge: false,
      contributedTo: [],
      inviteCode: challengerInviteCode,
    });

    // Evaluate whether the player is returned as expected.
    const player = await userRepository.getUserById(playerId);

    expect(player).toEqual({
      uid: playerId,
      email: playerEmail,
      name: playerName,
      avatar: playerAvatar,
      type: UserType.Player,
      completedActions: {
        sharedChallenge: false,
        electionReminders: false,
        registerToVote: true,
      },
      badges: [
        {
          action: Actions.RegisterToVote,
        },
      ],
      challengeEndTimestamp: expect.any(Number),
      completedChallenge: false,
      contributedTo: [
        {
          challengerInviteCode,
          challengerName,
          challengerAvatar,
        },
      ],
      inviteCode: expect.any(String),
    });
  });

  it(`throws a ServerError if supabase.rpc() returns an error when getUserById
  is called.`, async () => {
    const errorMessage = 'test error message';

    createSupabaseClient = jest.fn().mockImplementation(() => {
      return {
        rpc: () => {
          return {
            data: null,
            error: new Error(errorMessage),
            status: 429,
          };
        },
      };
    });

    userRepository = new SupabaseUserRepository(
      createSupabaseClient,
      new UserRecordParser(),
    );

    await expect(userRepository.getUserById('')).rejects.toThrow(
      new ServerError(errorMessage, 429),
    );
  });

  it(`throws a ServerError if UserRecordParser.parseUserRecord throws an error
  when getUserById is called.`, async () => {
    createSupabaseClient = jest.fn().mockImplementation(() => {
      return {
        rpc: () =>
          Promise.resolve({
            data: {},
            error: null,
          }),
      };
    });

    const userRecordParser: IUserRecordParser = {
      parseUserRecord: () => {
        throw new Error('Error parsing user.');
      },
    };

    userRepository = new SupabaseUserRepository(
      createSupabaseClient,
      userRecordParser,
    );

    await expect(userRepository.getUserById('')).rejects.toThrow(
      new ServerError('Failed to parse user data.', 400),
    );
  });

  it(`updates the user to a hybrid type user and returns the updated user when
  makeHybrid() is called.`, async () => {
    const supabase = createSupabaseClient();

    const userMetadata = {
      name: 'Challenger',
      avatar: '0',
      type: UserType.Challenger,
      invite_code: createId(),
    };

    const { data: userData, error: userInsertionError } =
      await supabase.auth.admin.createUser({
        email: 'user@example.com',
        email_confirm: true,
        user_metadata: userMetadata,
      });

    if (userInsertionError) {
      throw new Error(userInsertionError.message);
    }

    const user = await userRepository.getUserById(userData.user.id);
    expect(user?.type).toBe(UserType.Challenger);

    const updatedUser = await userRepository.makeHybrid(userData.user.id);
    expect(updatedUser).toStrictEqual({
      ...user,
      type: UserType.Hybrid,
    });
  });

  it(`awards a challenger a badge if the user is a player who has been invited
  by the challenger, the challenger has fewer than 8 badges, and
  makeHybrid is called.`, async () => {
    const challenger = await new SupabaseUserRecordBuilder(
      'challenger@example.com',
    ).build();

    const player = await new SupabaseUserRecordBuilder('player@example.com')
      .type(UserType.Player)
      .invitedBy({
        challengerInviteCode: challenger.inviteCode,
        challengerName: challenger.name,
        challengerAvatar: challenger.avatar,
      })
      .name('Player')
      .avatar('3')
      .build();

    await userRepository.makeHybrid(player.uid);

    const updatedChallenger = await userRepository.getUserById(challenger.uid);
    expect(updatedChallenger).not.toBeNull();
    expect(updatedChallenger?.badges).toStrictEqual([
      {
        playerName: player.name,
        playerAvatar: player.avatar,
      },
    ]);
  });

  it(`inserts a new record into the player's contributedTo when
  makeHybrid is called and the player has not yet contributed
  to the inviting challenger.`, async () => {
    const challenger = await new SupabaseUserRecordBuilder(
      'challenger@example.com',
    ).build();

    let player = await new SupabaseUserRecordBuilder('player@example.com')
      .type(UserType.Player)
      .invitedBy({
        challengerInviteCode: challenger.inviteCode,
        challengerName: challenger.name,
        challengerAvatar: challenger.avatar,
      })
      .build();

    player = await userRepository.makeHybrid(player.uid);
    expect(player.contributedTo).toStrictEqual([
      {
        challengerInviteCode: challenger.inviteCode,
        challengerName: challenger.name,
        challengerAvatar: challenger.avatar,
      },
    ]);
  });

  it(`throws a ServerError when the update operation initiated by
  makeHybrid fails.`, () => {
    createSupabaseClient = jest.fn().mockImplementation(() => {
      return {
        rpc: () => {
          return Promise.resolve({
            data: null,
            error: new Error('Failed to update user.'),
            status: 422,
          });
        },
      };
    });

    userRepository = new SupabaseUserRepository(
      createSupabaseClient,
      new UserRecordParser(),
    );

    expect(userRepository.makeHybrid(uuid())).rejects.toThrow(
      new ServerError('Failed to update user.', 422),
    );
  });

  it(`throws a ServerError if the user returned after the update operation
  initiated by makeHybrid is null.`, () => {
    createSupabaseClient = jest.fn().mockImplementation(() => {
      return {
        rpc: () => {
          return Promise.resolve({
            data: null,
            error: null,
          });
        },
      };
    });

    userRepository = new SupabaseUserRepository(
      createSupabaseClient,
      new UserRecordParser(),
    );

    expect(userRepository.makeHybrid(uuid())).rejects.toThrow(
      new ServerError('Update operation returned null user.', 500),
    );
  });

  it(`throws a ServerError if the user record returned after the update
  operation initiated by makeHybrid cannot be parsed.`, async () => {
    createSupabaseClient = jest.fn().mockImplementation(() => {
      return {
        rpc: () => {
          return Promise.resolve({
            data: {},
            error: null,
          });
        },
      };
    });

    const userRecordParser: IUserRecordParser = {
      parseUserRecord: () => {
        throw new Error('Error parsing user.');
      },
    };

    userRepository = new SupabaseUserRepository(
      createSupabaseClient,
      userRecordParser,
    );

    await expect(userRepository.makeHybrid(uuid())).rejects.toThrow(
      new ServerError('Failed to parse user data.', 400),
    );
  });

  it(`sets completedActions.electionReminders to true when
  awardElectionRemindersBadge is called.`, async () => {
    let user = await new SupabaseUserRecordBuilder('user@example.com').build();
    expect(user.completedActions.electionReminders).toBe(false);

    user = await userRepository.awardElectionRemindersBadge(user.uid);
    expect(user.completedActions.electionReminders).toBe(true);
  });

  it(`awards the user a badge when awardElectionRemindersBadge is called and the
  user has not completed this action and has fewer than 8 badges.`, async () => {
    let user = await new SupabaseUserRecordBuilder('user@example.com').build();
    expect(user.badges).toStrictEqual([]);

    user = await userRepository.awardElectionRemindersBadge(user.uid);
    expect(user.badges).toStrictEqual([
      {
        action: Actions.ElectionReminders,
      },
    ]);
  });

  it(`sets completedChallenge to true if the user has 8 badges after
  awardElectionRemindersBadge is called.`, async () => {
    let user = await new SupabaseUserRecordBuilder('user@example.com')
      .badges(
        new Array<Badge>(7).fill({
          playerName: 'Player',
          playerAvatar: '0',
        }),
      )
      .build();
    expect(user.completedChallenge).toBe(false);

    user = await userRepository.awardElectionRemindersBadge(user.uid);
    expect(user.completedChallenge).toBe(true);
  });

  it(`does not award the user a badge when awardElectionRemindersBadge is
  called and the user has already completed this action.`, async () => {
    let user = await new SupabaseUserRecordBuilder('user@example.com')
      .completedActions({
        electionReminders: true,
      })
      .badges([
        {
          action: Actions.ElectionReminders,
        },
      ])
      .build();
    expect(user.badges).toHaveLength(1);

    user = await userRepository.awardElectionRemindersBadge(user.uid);
    expect(user.badges).toHaveLength(1);
  });

  it(`does not award a badge when awardElectionRemindersBadge is called and the user
  already has 8 badges.`, async () => {
    let user = await new SupabaseUserRecordBuilder('user@example.com')
      .badges(
        new Array<Badge>(8).fill({
          playerName: 'Player',
          playerAvatar: '0',
        }),
      )
      .build();
    expect(user.completedActions.electionReminders).toBe(false);
    expect(user.badges).toHaveLength(8);

    user = await userRepository.awardElectionRemindersBadge(user.uid);
    expect(user.completedActions.electionReminders).toBe(true);
    expect(user.badges).toHaveLength(8);
  });

  it(`awards a challenger a badge if the user is a player who has been invited
  by the challenger, the challenger has fewer than 8 badges, and
  awardElectionRemindersBadge is called.`, async () => {
    const challenger = await new SupabaseUserRecordBuilder(
      'challenger@example.com',
    ).build();

    const player = await new SupabaseUserRecordBuilder('player@example.com')
      .type(UserType.Player)
      .invitedBy({
        challengerInviteCode: challenger.inviteCode,
        challengerName: challenger.name,
        challengerAvatar: challenger.avatar,
      })
      .name('Player')
      .avatar('3')
      .build();

    await userRepository.awardElectionRemindersBadge(player.uid);

    const updatedChallenger = await userRepository.getUserById(challenger.uid);
    expect(updatedChallenger).not.toBeNull();
    expect(updatedChallenger?.badges).toStrictEqual([
      {
        playerName: player.name,
        playerAvatar: player.avatar,
      },
    ]);
  });

  it(`inserts a new record into the player's contributedTo when
  awardElectionRemindersBadge is called and the player has not yet contributed
  to the inviting challenger.`, async () => {
    const challenger = await new SupabaseUserRecordBuilder(
      'challenger@example.com',
    ).build();

    let player = await new SupabaseUserRecordBuilder('player@example.com')
      .type(UserType.Player)
      .invitedBy({
        challengerInviteCode: challenger.inviteCode,
        challengerName: challenger.name,
        challengerAvatar: challenger.avatar,
      })
      .build();

    player = await userRepository.awardElectionRemindersBadge(player.uid);
    expect(player.contributedTo).toStrictEqual([
      {
        challengerInviteCode: challenger.inviteCode,
        challengerName: challenger.name,
        challengerAvatar: challenger.avatar,
      },
    ]);
  });

  it(`does not insert a new record into the player's contributedTo when
  awardElectionRemindersBadge is called, but the player has already contributed
  to the inviting challenger's challenge.`, async () => {
    const playerName = 'Player';
    const playerAvatar = '3';

    const challenger = await new SupabaseUserRecordBuilder(
      'challenger@example.com',
    )
      .badges([
        {
          playerName,
          playerAvatar,
        },
      ])
      .build();

    let player = await new SupabaseUserRecordBuilder('player@example.com')
      .type(UserType.Player)
      .invitedBy({
        challengerInviteCode: challenger.inviteCode,
        challengerName: challenger.name,
        challengerAvatar: challenger.avatar,
      })
      .completedActions({ registerToVote: true })
      .badges([
        {
          action: Actions.RegisterToVote,
        },
      ])
      .contributedTo([
        {
          challengerInviteCode: challenger.inviteCode,
          challengerName: challenger.name,
          challengerAvatar: challenger.avatar,
        },
      ])
      .build();

    expect(player.contributedTo).toStrictEqual([
      {
        challengerInviteCode: challenger.inviteCode,
        challengerName: challenger.name,
        challengerAvatar: challenger.avatar,
      },
    ]);

    player = await userRepository.awardElectionRemindersBadge(player.uid);

    expect(player.contributedTo).toStrictEqual([
      {
        challengerInviteCode: challenger.inviteCode,
        challengerName: challenger.name,
        challengerAvatar: challenger.avatar,
      },
    ]);
  });

  it(`does not award a challenger a badge when awardElectionRemindersBadge is
  called for a player who has already completed that action.`, async () => {
    const playerName = 'Player';
    const playerAvatar = '2';

    const challenger = await new SupabaseUserRecordBuilder(
      'challenger@example.com',
    )
      .badges([
        {
          playerName,
          playerAvatar,
        },
      ])
      .build();

    const { uid: playerId } = await new SupabaseUserRecordBuilder(
      'player@example.com',
    )
      .type(UserType.Player)
      .invitedBy({
        challengerInviteCode: challenger.inviteCode,
        challengerName: challenger.name,
        challengerAvatar: challenger.avatar,
      })
      .completedActions({ electionReminders: true })
      .badges([
        {
          action: Actions.ElectionReminders,
        },
      ])
      .build();

    expect(challenger.badges).toHaveLength(1);

    await userRepository.awardElectionRemindersBadge(playerId);

    const updatedChallenger = await userRepository.getUserById(challenger.uid);
    expect(updatedChallenger).not.toBeNull();
    expect(updatedChallenger?.badges).toHaveLength(1);
  });

  it(`does not award a challenger a badge if the challenger has 8 or more badges
  when awardElectionRemindersBadge is called for a player.`, async () => {
    const challenger = await new SupabaseUserRecordBuilder(
      'challenger@example.com',
    )
      .badges(
        new Array(8).fill({
          playerName: 'Player',
          playerAvatar: '0',
        }),
      )
      .completedChallenge(true)
      .build();

    const { uid: playerId } = await new SupabaseUserRecordBuilder(
      'player@example.com',
    )
      .type(UserType.Player)
      .invitedBy({
        challengerInviteCode: challenger.inviteCode,
        challengerName: challenger.name,
        challengerAvatar: challenger.avatar,
      })
      .build();

    expect(challenger.badges).toHaveLength(8);

    await userRepository.awardElectionRemindersBadge(playerId);

    const updatedChallenger = await userRepository.getUserById(challenger.uid);
    expect(updatedChallenger).not.toBeNull();
    expect(updatedChallenger?.badges).toHaveLength(8);
  });

  it(`throws a ServerError if supabase.rpc() returns an error when
  awardElectionRemindersBadge is called.`, async () => {
    const errorMessage = 'test error message';

    createSupabaseClient = jest.fn().mockImplementation(() => {
      return {
        rpc: () => {
          return {
            data: null,
            error: new Error(errorMessage),
            status: 429,
          };
        },
      };
    });

    userRepository = new SupabaseUserRepository(
      createSupabaseClient,
      new UserRecordParser(),
    );

    await expect(
      userRepository.awardElectionRemindersBadge(''),
    ).rejects.toThrow(new ServerError(errorMessage, 429));
  });

  it(`throws an error if the user returned by supabase.rpc() is null when
  awardElectionRemindersBadge is called.`, async () => {
    createSupabaseClient = jest.fn().mockImplementation(() => {
      return {
        rpc: () => {
          return {
            data: null,
            error: null,
          };
        },
      };
    });

    userRepository = new SupabaseUserRepository(
      createSupabaseClient,
      new UserRecordParser(),
    );

    await expect(
      userRepository.awardElectionRemindersBadge(''),
    ).rejects.toThrow(new ServerError('User was null after update.', 500));
  });

  it(`throws an error if the user returned by supabase.rpc() is cannot be parsed
  awardElectionRemindersBadge is called.`, async () => {
    createSupabaseClient = jest.fn().mockImplementation(() => {
      return {
        rpc: () => {
          return {
            data: {},
            error: null,
          };
        },
      };
    });

    userRepository = new SupabaseUserRepository(
      createSupabaseClient,
      new UserRecordParser(),
    );

    await expect(
      userRepository.awardElectionRemindersBadge(''),
    ).rejects.toThrow(new ServerError('Failed to parse user data.', 400));
  });

  it(`sets completedActions.registerToVote to true when
  awardRegisterToVoteBadge is called.`, async () => {
    let user = await new SupabaseUserRecordBuilder('user@example.com').build();
    expect(user.completedActions.registerToVote).toBe(false);

    user = await userRepository.awardRegisterToVoteBadge(user.uid);
    expect(user.completedActions.registerToVote).toBe(true);
  });

  it(`awards the user a badge when awardRegisterToVoteBadge is called and the
  user has not completed this action and has fewer than 8 badges.`, async () => {
    let user = await new SupabaseUserRecordBuilder('user@example.com').build();
    expect(user.badges).toStrictEqual([]);

    user = await userRepository.awardRegisterToVoteBadge(user.uid);
    expect(user.badges).toStrictEqual([
      {
        action: Actions.RegisterToVote,
      },
    ]);
  });

  it(`sets completedChallenge to true if the user has 8 badges after
  awardRegisterToVoteBadge is called.`, async () => {
    let user = await new SupabaseUserRecordBuilder('user@example.com')
      .badges(
        new Array<Badge>(7).fill({
          playerName: 'Player',
          playerAvatar: '0',
        }),
      )
      .build();
    expect(user.completedChallenge).toBe(false);

    user = await userRepository.awardRegisterToVoteBadge(user.uid);
    expect(user.completedChallenge).toBe(true);
  });

  it(`does not award the user a badge when awardRegisterToVoteBadge is
  called and the user has already completed this action.`, async () => {
    let user = await new SupabaseUserRecordBuilder('user@example.com')
      .completedActions({
        registerToVote: true,
      })
      .badges([
        {
          action: Actions.RegisterToVote,
        },
      ])
      .build();
    expect(user.badges).toHaveLength(1);

    user = await userRepository.awardRegisterToVoteBadge(user.uid);
    expect(user.badges).toHaveLength(1);
  });

  it(`does not award a badge when awardRegisterToVoteBadge is called and the
  user already has 8 badges.`, async () => {
    let user = await new SupabaseUserRecordBuilder('user@example.com')
      .badges(
        new Array<Badge>(8).fill({
          playerName: 'Player',
          playerAvatar: '0',
        }),
      )
      .build();
    expect(user.completedActions.registerToVote).toBe(false);
    expect(user.badges).toHaveLength(8);

    user = await userRepository.awardRegisterToVoteBadge(user.uid);
    expect(user.completedActions.registerToVote).toBe(true);
    expect(user.badges).toHaveLength(8);
  });

  it(`awards a challenger a badge if the user is a player who has been invited
  by the challenger, the challenger has fewer than 8 badges, and
  awardRegisterToVoteBadge is called.`, async () => {
    const challenger = await new SupabaseUserRecordBuilder(
      'challenger@example.com',
    ).build();

    const player = await new SupabaseUserRecordBuilder('player@example.com')
      .type(UserType.Player)
      .invitedBy({
        challengerInviteCode: challenger.inviteCode,
        challengerName: challenger.name,
        challengerAvatar: challenger.avatar,
      })
      .name('Player')
      .avatar('3')
      .build();

    await userRepository.awardRegisterToVoteBadge(player.uid);

    const updatedChallenger = await userRepository.getUserById(challenger.uid);
    expect(updatedChallenger).not.toBeNull();
    expect(updatedChallenger?.badges).toStrictEqual([
      {
        playerName: player.name,
        playerAvatar: player.avatar,
      },
    ]);
  });

  it(`inserts a new record into the player's contributedTo when
  awardRegisterToVoteBadge is called and the player has not yet contributed to
  the inviting challenger.`, async () => {
    const challenger = await new SupabaseUserRecordBuilder(
      'challenger@example.com',
    ).build();

    let player = await new SupabaseUserRecordBuilder('player@example.com')
      .type(UserType.Player)
      .invitedBy({
        challengerInviteCode: challenger.inviteCode,
        challengerName: challenger.name,
        challengerAvatar: challenger.avatar,
      })
      .build();

    player = await userRepository.awardRegisterToVoteBadge(player.uid);
    expect(player.contributedTo).toStrictEqual([
      {
        challengerInviteCode: challenger.inviteCode,
        challengerName: challenger.name,
        challengerAvatar: challenger.avatar,
      },
    ]);
  });

  it(`does not insert a new record into the player's contributedTo when
  awardRegisterToVoteBadge is called, but the player has already contributed
  to the inviting challenger's challenge.`, async () => {
    const playerName = 'Player';
    const playerAvatar = '3';

    const challenger = await new SupabaseUserRecordBuilder(
      'challenger@example.com',
    )
      .badges([
        {
          playerName,
          playerAvatar,
        },
      ])
      .build();

    let player = await new SupabaseUserRecordBuilder('player@example.com')
      .type(UserType.Player)
      .invitedBy({
        challengerInviteCode: challenger.inviteCode,
        challengerName: challenger.name,
        challengerAvatar: challenger.avatar,
      })
      .completedActions({ electionReminders: true })
      .badges([
        {
          action: Actions.ElectionReminders,
        },
      ])
      .contributedTo([
        {
          challengerInviteCode: challenger.inviteCode,
          challengerName: challenger.name,
          challengerAvatar: challenger.avatar,
        },
      ])
      .build();

    expect(player.contributedTo).toStrictEqual([
      {
        challengerInviteCode: challenger.inviteCode,
        challengerName: challenger.name,
        challengerAvatar: challenger.avatar,
      },
    ]);

    player = await userRepository.awardRegisterToVoteBadge(player.uid);

    expect(player.contributedTo).toStrictEqual([
      {
        challengerInviteCode: challenger.inviteCode,
        challengerName: challenger.name,
        challengerAvatar: challenger.avatar,
      },
    ]);
  });

  it(`does not award a challenger a badge when awardRegisterToVoteBadge is
  called for a player who has already completed that action.`, async () => {
    const playerName = 'Player';
    const playerAvatar = '2';

    const challenger = await new SupabaseUserRecordBuilder(
      'challenger@example.com',
    )
      .badges([
        {
          playerName,
          playerAvatar,
        },
      ])
      .build();

    const { uid: playerId } = await new SupabaseUserRecordBuilder(
      'player@example.com',
    )
      .type(UserType.Player)
      .invitedBy({
        challengerInviteCode: challenger.inviteCode,
        challengerName: challenger.name,
        challengerAvatar: challenger.avatar,
      })
      .completedActions({ registerToVote: true })
      .badges([
        {
          action: Actions.RegisterToVote,
        },
      ])
      .build();

    expect(challenger.badges).toHaveLength(1);

    await userRepository.awardRegisterToVoteBadge(playerId);

    const updatedChallenger = await userRepository.getUserById(challenger.uid);
    expect(updatedChallenger).not.toBeNull();
    expect(updatedChallenger?.badges).toHaveLength(1);
  });

  it(`does not award a challenger a badge if the challenger has 8 or more badges
  when awardRegisterToVoteBadge is called for a player.`, async () => {
    const challenger = await new SupabaseUserRecordBuilder(
      'challenger@example.com',
    )
      .badges(
        new Array(8).fill({
          playerName: 'Player',
          playerAvatar: '0',
        }),
      )
      .completedChallenge(true)
      .build();

    const { uid: playerId } = await new SupabaseUserRecordBuilder(
      'player@example.com',
    )
      .type(UserType.Player)
      .invitedBy({
        challengerInviteCode: challenger.inviteCode,
        challengerName: challenger.name,
        challengerAvatar: challenger.avatar,
      })
      .build();

    expect(challenger.badges).toHaveLength(8);

    await userRepository.awardRegisterToVoteBadge(playerId);

    const updatedChallenger = await userRepository.getUserById(challenger.uid);
    expect(updatedChallenger).not.toBeNull();
    expect(updatedChallenger?.badges).toHaveLength(8);
  });

  it(`throws a ServerError if supabase.rpc() returns an error when
  awardRegisterToVoteBadge is called.`, async () => {
    const errorMessage = 'test error message';

    createSupabaseClient = jest.fn().mockImplementation(() => {
      return {
        rpc: () => {
          return {
            data: null,
            error: new Error(errorMessage),
            status: 429,
          };
        },
      };
    });

    userRepository = new SupabaseUserRepository(
      createSupabaseClient,
      new UserRecordParser(),
    );

    await expect(userRepository.awardRegisterToVoteBadge('')).rejects.toThrow(
      new ServerError(errorMessage, 429),
    );
  });

  it(`throws an error if the user returned by supabase.rpc() is null when
  awardRegisterToVoteBadge is called.`, async () => {
    createSupabaseClient = jest.fn().mockImplementation(() => {
      return {
        rpc: () => {
          return {
            data: null,
            error: null,
          };
        },
      };
    });

    userRepository = new SupabaseUserRepository(
      createSupabaseClient,
      new UserRecordParser(),
    );

    await expect(userRepository.awardRegisterToVoteBadge('')).rejects.toThrow(
      new ServerError('User was null after update.', 500),
    );
  });

  it(`throws an error if the user returned by supabase.rpc() is cannot be parsed
  awardRegisterToVoteBadge is called.`, async () => {
    createSupabaseClient = jest.fn().mockImplementation(() => {
      return {
        rpc: () => {
          return {
            data: {},
            error: null,
          };
        },
      };
    });

    userRepository = new SupabaseUserRepository(
      createSupabaseClient,
      new UserRecordParser(),
    );

    await expect(userRepository.awardRegisterToVoteBadge('')).rejects.toThrow(
      new ServerError('Failed to parse user data.', 400),
    );
  });

  it(`sorts contributedTo by the time at which the player last contributed to 
  that challenger, with the most recently contributed to challenger sorted 
  to the end of the array.`, async () => {
    const challengerA = await new SupabaseUserRecordBuilder(
      'challenger.a@example.com',
    )
      .name('Challenger A')
      .build();
    const challengerB = await new SupabaseUserRecordBuilder(
      'challenger.b@example.com',
    )
      .name('Challenger B')
      .build();

    const player = await new SupabaseUserRecordBuilder('player@example.com')
      .type(UserType.Player)
      .invitedBy({
        challengerInviteCode: challengerA.inviteCode,
        challengerName: challengerA.name,
        challengerAvatar: challengerA.avatar,
      })
      .name('Player')
      .build();

    await userRepository.awardElectionRemindersBadge(player.uid);

    let { contributedTo } = (await userRepository.getUserById(player.uid))!;
    expect(contributedTo).toEqual([
      {
        challengerInviteCode: challengerA.inviteCode,
        challengerName: challengerA.name,
        challengerAvatar: challengerA.avatar,
      },
    ]);

    const invitationsRepo = serverContainer.get(
      SERVER_SERVICE_KEYS.InvitationsRepository,
    );

    await invitationsRepo.insertOrUpdateInvitedBy(player.uid, {
      challengerInviteCode: challengerB.inviteCode,
      challengerName: challengerB.name,
      challengerAvatar: challengerB.avatar,
    });

    await userRepository.awardRegisterToVoteBadge(player.uid);
    contributedTo = (await userRepository.getUserById(player.uid))!
      .contributedTo;
    expect(contributedTo).toEqual([
      {
        challengerInviteCode: challengerA.inviteCode,
        challengerName: challengerA.name,
        challengerAvatar: challengerA.avatar,
      },
      {
        challengerInviteCode: challengerB.inviteCode,
        challengerName: challengerB.name,
        challengerAvatar: challengerB.avatar,
      },
    ]);

    await invitationsRepo.insertOrUpdateInvitedBy(player.uid, {
      challengerInviteCode: challengerA.inviteCode,
      challengerName: challengerA.name,
      challengerAvatar: challengerA.avatar,
    });

    await userRepository.makeHybrid(player.uid);
    contributedTo = (await userRepository.getUserById(player.uid))!
      .contributedTo;
    expect(contributedTo).toEqual([
      {
        challengerInviteCode: challengerB.inviteCode,
        challengerName: challengerB.name,
        challengerAvatar: challengerB.avatar,
      },
      {
        challengerInviteCode: challengerA.inviteCode,
        challengerName: challengerA.name,
        challengerAvatar: challengerA.avatar,
      },
    ]);
  });
});
