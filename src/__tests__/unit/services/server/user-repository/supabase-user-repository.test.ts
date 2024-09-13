import { SupabaseUserRepository } from '@/services/server/user-repository/supabase-user-repository';
import { createSupabaseServiceRoleClient } from '@/services/server/create-supabase-client/create-supabase-service-role-client';
import { UserRecordParser } from '@/services/server/user-record-parser/user-record-parser';
import { v4 as uuid } from 'uuid';
import { resetAuthAndDatabase } from '@/utils/test/reset-auth-and-database';
import { UserType } from '@/model/enums/user-type';
import { Actions } from '@/model/enums/actions';
import { createId } from '@paralleldrive/cuid2';
import { ServerError } from '@/errors/server-error';
import { AuthError } from '@supabase/supabase-js';
import type { CreateSupabaseClient } from '@/services/server/create-supabase-client/create-supabase-client';
import type { IUserRecordParser } from '@/services/server/user-record-parser/i-user-record-parser';

describe('SupabaseUserRepository', () => {
  let userRepository: InstanceType<typeof SupabaseUserRepository>;
  let createSupabaseClient: CreateSupabaseClient;

  beforeEach(() => {
    createSupabaseClient = createSupabaseServiceRoleClient;

    userRepository = new SupabaseUserRepository(
      createSupabaseClient,
      new UserRecordParser(),
    );
  });

  afterEach(() => {
    return resetAuthAndDatabase();
  });

  it('returns null when getUserById is called and no user is found.', async () => {
    await expect(userRepository.getUserById(uuid())).resolves.toBe(null);
  });

  it('returns a user when getUserById is called with an existing user id.', async () => {
    const supabase = createSupabaseClient();

    // Create a challenger and award them an action badge.
    const challengerMetadata = {
      name: 'Challenger',
      avatar: '0',
      type: UserType.Challenger,
      invite_code: createId(),
    };

    const { data: challengerData, error: challengerInsertionError } =
      await supabase.auth.admin.createUser({
        email: 'challenger@example.com',
        email_confirm: true,
        user_metadata: challengerMetadata,
      });

    if (challengerInsertionError) {
      throw new Error(challengerInsertionError.message);
    }

    const authChallenger = challengerData.user!;

    const challengerActionBadge = {
      action: Actions.SharedChallenge,
      challenger_id: authChallenger!.id,
    };

    const { error: challengerActionBadgeInsertionError } = await supabase
      .from('badges')
      .insert(challengerActionBadge);

    if (challengerActionBadgeInsertionError) {
      throw new Error(challengerActionBadgeInsertionError.message);
    }

    const { error: challengerUpdateError } = await supabase
      .from('completed_actions')
      .update({
        shared_challenge: true,
      })
      .eq('user_id', authChallenger.id);

    if (challengerUpdateError) {
      throw new Error(challengerUpdateError.message);
    }

    // Create a player who has been invited by the challenger.
    const playerMetadata = {
      name: 'Player',
      avatar: '1',
      type: UserType.Player,
      invite_code: createId(),
    };

    const { data: playerData, error: playerInsertionError } =
      await supabase.auth.admin.createUser({
        email: 'player@example.com',
        email_confirm: true,
        user_metadata: playerMetadata,
      });

    if (playerInsertionError) {
      throw new Error(playerInsertionError.message);
    }

    const authPlayer = playerData.user!;

    // Complete an action on behalf of the challenger.
    const playerActionBadge = {
      action: Actions.VoterRegistration,
      challenger_id: authPlayer!.id,
    };

    const { error: playerActionBadgeInsertionError } = await supabase
      .from('badges')
      .insert(playerActionBadge);

    if (playerActionBadgeInsertionError)
      throw new Error(playerActionBadgeInsertionError.message);

    const playerContributedTo = {
      player_id: authPlayer.id,
      challenger_name: challengerMetadata.name,
      challenger_avatar: challengerMetadata.avatar,
    };

    const { error: contributedToInsertionError } = await supabase
      .from('contributed_to')
      .insert(playerContributedTo);

    if (contributedToInsertionError) {
      throw new Error(contributedToInsertionError.message);
    }

    const { error: playerUpdateError } = await supabase
      .from('completed_actions')
      .update({
        register_to_vote: true,
      })
      .eq('user_id', authPlayer.id);

    if (playerUpdateError) {
      throw new Error(playerUpdateError.message);
    }

    const playerAwardedBadge = {
      player_name: playerMetadata.name,
      player_avatar: playerMetadata.avatar,
      challenger_id: authChallenger.id,
    };

    const { error: playerAwardedBadgeInsertionError } = await supabase
      .from('badges')
      .insert(playerAwardedBadge);

    if (playerAwardedBadgeInsertionError) {
      throw new Error(playerAwardedBadgeInsertionError.message);
    }

    // Evaluate whether the challenger is returned as expected.
    const challenger = await userRepository.getUserById(authChallenger.id);

    expect(challenger).toEqual({
      uid: authChallenger.id,
      email: authChallenger.email,
      name: challengerMetadata.name,
      avatar: challengerMetadata.avatar,
      type: challengerMetadata.type,
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
          playerName: playerMetadata.name,
          playerAvatar: playerMetadata.avatar,
        },
      ],
      challengeEndTimestamp: expect.any(Number),
      completedChallenge: false,
      contributedTo: [],
      inviteCode: challengerMetadata.invite_code,
    });

    // Evaluate whether the player is returned as expected.
    const player = await userRepository.getUserById(authPlayer.id);

    expect(player).toEqual({
      uid: authPlayer.id,
      email: authPlayer.email,
      name: playerMetadata.name,
      avatar: playerMetadata.avatar,
      type: playerMetadata.type,
      completedActions: {
        sharedChallenge: false,
        electionReminders: false,
        registerToVote: true,
      },
      badges: [
        {
          action: Actions.VoterRegistration,
        },
      ],
      challengeEndTimestamp: expect.any(Number),
      completedChallenge: false,
      contributedTo: [
        {
          name: challengerMetadata.name,
          avatar: challengerMetadata.avatar,
        },
      ],
      inviteCode: playerMetadata.invite_code,
    });
  });

  it('throws a ServerError if supabase.from().select() throws an error.', async () => {
    const errorMessage = 'test error message';

    createSupabaseClient = jest.fn().mockImplementation(() => {
      return {
        from: () => ({
          select: () => ({
            eq: () => ({
              limit: () => ({
                maybeSingle: () => {
                  return Promise.resolve({
                    data: null,
                    error: new AuthError(errorMessage, 500),
                  });
                },
              }),
            }),
          }),
        }),
      };
    });

    userRepository = new SupabaseUserRepository(
      createSupabaseClient,
      new UserRecordParser(),
    );

    await expect(userRepository.getUserById('')).rejects.toThrow(
      new ServerError(errorMessage, 500),
    );
  });

  it('throws a ServerError if UserRecordParser.parseUserRecord throws an error.', async () => {
    createSupabaseClient = jest.fn().mockImplementation(() => {
      return {
        from: () => ({
          select: () => ({
            eq: () => ({
              limit: () => ({
                maybeSingle: () => {
                  return Promise.resolve({
                    data: {},
                    error: null,
                  });
                },
              }),
            }),
          }),
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

  it(`throws a ServerError when the update operation initiated by 
  makeHybrid fails.`, () => {
    createSupabaseClient = jest.fn().mockImplementation(() => {
      return {
        from: () => ({
          update: () => ({
            eq: () => ({
              select: () => ({
                order: () => ({
                  limit: () => ({
                    maybeSingle: () => {
                      return Promise.resolve({
                        data: null,
                        error: new Error('Failed to update user.'),
                        status: 422,
                      });
                    },
                  }),
                }),
              }),
            }),
          }),
        }),
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
        from: () => ({
          update: () => ({
            eq: () => ({
              select: () => ({
                order: () => ({
                  limit: () => ({
                    maybeSingle: () => {
                      return Promise.resolve({
                        data: null,
                        error: null,
                      });
                    },
                  }),
                }),
              }),
            }),
          }),
        }),
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
        from: () => ({
          update: () => ({
            eq: () => ({
              select: () => ({
                order: () => ({
                  limit: () => ({
                    maybeSingle: () => {
                      return Promise.resolve({
                        data: {},
                        error: null,
                      });
                    },
                  }),
                }),
              }),
            }),
          }),
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

    await expect(userRepository.makeHybrid(uuid())).rejects.toThrow(
      new ServerError('Failed to parse user data.', 400),
    );
  });
});
