import { SupabaseInvitationsRepository } from '@/services/server/invitations-repository/supabase-invitations-repository';
import { createSupabaseServiceRoleClient } from '@/services/server/create-supabase-client/create-supabase-service-role-client';
import { resetAuthAndDatabase } from '@/utils/test/reset-auth-and-database';
import { UserType } from '@/model/enums/user-type';
import { createId } from '@paralleldrive/cuid2';
import { v4 as uuid } from 'uuid';
import type { InvitationsRepository } from '@/services/server/invitations-repository/invitations-repository';
import type { CreateSupabaseClient } from '@/services/server/create-supabase-client/create-supabase-client';
import type { InvitedBy } from '@/model/types/invited-by';

describe('SupabaseInvitationsRepository', () => {
  let invitationsRepository: InvitationsRepository;
  let createSupabaseClient: CreateSupabaseClient;

  beforeEach(() => {
    createSupabaseClient = createSupabaseServiceRoleClient;
    invitationsRepository = new SupabaseInvitationsRepository(
      createSupabaseClient,
    );
  });

  afterEach(() => {
    return resetAuthAndDatabase();
  });

  it(`returns an object with information about the inviting challenger if the 
  inviteCode corresponds to a user when getInvitedByFromChallengerInviteCode is 
  called.`, async () => {
    const supabase = createSupabaseClient();

    const userMetadata = {
      name: 'User',
      avatar: '0',
      type: UserType.Challenger,
      invite_code: createId(),
    };

    const { error } = await supabase.auth.admin.createUser({
      email: 'user@example.com',
      email_confirm: true,
      user_metadata: userMetadata,
    });

    if (error) {
      throw new Error(error.message);
    }

    const invitedBy =
      await invitationsRepository.getInvitedByFromChallengerInviteCode(
        userMetadata.invite_code,
      );
    expect(invitedBy).toStrictEqual({
      challengerName: userMetadata.name,
      challengerInviteCode: userMetadata.invite_code,
      challengerAvatar: userMetadata.avatar,
    });
  });

  it(`returns null if no user with the provided inviteCode is found when
  getInvitedByFromChallengerInviteCode is called.`, async () => {
    const invitedBy =
      await invitationsRepository.getInvitedByFromChallengerInviteCode(
        createId(),
      );
    expect(invitedBy).toBeNull();
  });

  it(`returns an object with information about the inviting challenger if it
  can be found in the database when getInvitedByFromPlayerId is called.`, async () => {
    const supabase = createSupabaseClient();

    const playerMetadata = {
      name: 'Player',
      avatar: '1',
      type: UserType.Player,
      invite_code: createId(),
    };

    const { data, error: playerInsertionError } =
      await supabase.auth.admin.createUser({
        email: 'player@example.com',
        email_confirm: true,
        user_metadata: playerMetadata,
      });

    if (playerInsertionError) {
      throw new Error(playerInsertionError.message);
    }

    const expectedInvitedBy = {
      challengerName: 'Challenger',
      challengerAvatar: '2',
      challengerInviteCode: createId(),
    };

    const { error: invitedByInsertionError } = await supabase
      .from('invited_by')
      .insert({
        player_id: data.user.id,
        challenger_name: expectedInvitedBy.challengerName,
        challenger_invite_code: expectedInvitedBy.challengerInviteCode,
        challenger_avatar: expectedInvitedBy.challengerAvatar,
      });

    if (invitedByInsertionError) {
      throw new Error(invitedByInsertionError.message);
    }

    const actualInvitedBy =
      await invitationsRepository.getInvitedByFromPlayerId(data.user.id);
    expect(actualInvitedBy).toStrictEqual(expectedInvitedBy);
  });

  it(`returns null if no record is found when getInvitedByFromPlayerId is
  called.`, async () => {
    const invitedBy =
      await invitationsRepository.getInvitedByFromPlayerId(uuid());
    expect(invitedBy).toBeNull();
  });

  it(`inserts a new record into the invited_by table if none exists when
  insertOrUpdateInvitedBy is called.`, async () => {
    const supabase = createSupabaseClient();

    const playerMetadata = {
      name: 'Player',
      avatar: '1',
      type: UserType.Player,
      invite_code: createId(),
    };

    const { data, error: playerInsertionError } =
      await supabase.auth.admin.createUser({
        email: 'player@example.com',
        email_confirm: true,
        user_metadata: playerMetadata,
      });

    if (playerInsertionError) {
      throw new Error(playerInsertionError.message);
    }

    let actualInvitedBy = await invitationsRepository.getInvitedByFromPlayerId(
      data.user.id,
    );
    expect(actualInvitedBy).toBeNull();

    const expectedInvitedBy: InvitedBy = {
      challengerName: 'Challenger',
      challengerAvatar: '2',
      challengerInviteCode: createId(),
    };

    await invitationsRepository.insertOrUpdateInvitedBy(
      data.user.id,
      expectedInvitedBy,
    );

    actualInvitedBy = await invitationsRepository.getInvitedByFromPlayerId(
      data.user.id,
    );
    expect(actualInvitedBy).toStrictEqual(expectedInvitedBy);
  });

  it(`updates an existing record in the invited_by table when
  insertOrUpdateInvitedBy is called and a record already exists for the
  current user.`, async () => {
    const supabase = createSupabaseClient();

    const playerMetadata = {
      name: 'Player',
      avatar: '1',
      type: UserType.Player,
      invite_code: createId(),
    };

    const { data, error: playerInsertionError } =
      await supabase.auth.admin.createUser({
        email: 'player@example.com',
        email_confirm: true,
        user_metadata: playerMetadata,
      });

    if (playerInsertionError) {
      throw new Error(playerInsertionError.message);
    }

    const initialInvitedBy: InvitedBy = {
      challengerName: 'Challenger',
      challengerAvatar: '2',
      challengerInviteCode: createId(),
    };

    await invitationsRepository.insertOrUpdateInvitedBy(
      data.user.id,
      initialInvitedBy,
    );

    let actualInvitedBy = await invitationsRepository.getInvitedByFromPlayerId(
      data.user.id,
    );

    expect(actualInvitedBy).toStrictEqual(initialInvitedBy);

    const updatedInvitedBy: InvitedBy = {
      challengerName: 'Another Challenger',
      challengerAvatar: '3',
      challengerInviteCode: createId(),
    };

    await invitationsRepository.insertOrUpdateInvitedBy(
      data.user.id,
      updatedInvitedBy,
    );
    actualInvitedBy = await invitationsRepository.getInvitedByFromPlayerId(
      data.user.id,
    );
    expect(actualInvitedBy).toStrictEqual(updatedInvitedBy);
  });

  it('throws an error if it fails to upsert data into the invited_by table.', async () => {
    // attempt to create a record for a nonexistent user
    await expect(
      invitationsRepository.insertOrUpdateInvitedBy(uuid(), {
        challengerName: 'Challenger',
        challengerAvatar: '2',
        challengerInviteCode: createId(),
      }),
    ).rejects.toThrow();
  });
});
