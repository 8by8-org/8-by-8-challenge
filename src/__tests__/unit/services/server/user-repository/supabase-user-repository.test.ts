import { SupabaseUserRepository } from '@/services/server/user-repository/supabase-user-repository';
import { createSupabaseServiceRoleClient } from '@/services/server/create-supabase-client/create-supabase-service-role-client';
import { UserRecordParser } from '@/services/server/user-record-parser/user-record-parser';
import { v4 as uuid } from 'uuid';
import { resetAuthAndDatabase } from '@/utils/test/reset-auth-and-database';
import { UserType } from '@/model/enums/user-type';
import { Actions } from '@/model/enums/actions';
import { createId } from '@paralleldrive/cuid2';
import { ServerError } from '@/errors/server-error';
import { SupabaseUserRecordBuilder } from '@/utils/test/supabase-user-record-builder';
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
        name: challengerName,
        avatar: challengerAvatar,
        inviteCode: challengerInviteCode,
      })
      .badges([
        {
          action: Actions.VoterRegistration,
        },
      ])
      .contributedTo([
        {
          name: challengerName,
          inviteCode: challengerInviteCode,
          avatar: challengerAvatar,
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
      invitedBy: undefined,
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
          action: Actions.VoterRegistration,
        },
      ],
      challengeEndTimestamp: expect.any(Number),
      completedChallenge: false,
      contributedTo: [
        {
          name: challengerName,
          avatar: challengerAvatar,
        },
      ],
      inviteCode: expect.any(String),
      invitedBy: {
        inviteCode: challengerInviteCode,
        name: challengerName,
        avatar: challengerAvatar,
      },
    });
  });

  it(`throws a ServerError if supabase.rpc() throws an error when getUserById is 
  called.`, async () => {
    const errorMessage = 'test error message';

    createSupabaseClient = jest.fn().mockImplementation(() => {
      return {
        rpc: () => {
          throw new Error(errorMessage);
        },
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
});
