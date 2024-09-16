import { SupabaseUserRecordBuilder } from '@/utils/test/supabase-user-record-builder';
import { resetAuthAndDatabase } from '@/utils/test/reset-auth-and-database';
import { createId } from '@paralleldrive/cuid2';
import { DateTime } from 'luxon';
import { UserType } from '@/model/enums/user-type';
import { Actions } from '@/model/enums/actions';
import type { Avatar } from '@/model/types/avatar';
import type { Badge } from '@/model/types/badge';

describe('SupabaseUserRecordBuilder', () => {
  afterEach(() => {
    return resetAuthAndDatabase();
  });

  it('creates a user with the provided email.', async () => {
    const email = 'testuser@example.com';
    const user = await new SupabaseUserRecordBuilder(email).build();
    expect(user.email).toBe(email);
  });

  it('creates a user with the provided name.', async () => {
    const name = 'Tom';
    const user = await new SupabaseUserRecordBuilder('user@example.com')
      .name(name)
      .build();
    expect(user.name).toBe(name);
  });

  it('creates a user with the provided avatar.', async () => {
    for (let i = 0; i < 4; i++) {
      const avatar = `${i}` as Avatar;
      const user = await new SupabaseUserRecordBuilder(`user${i}@example.com`)
        .avatar(avatar)
        .build();
      expect(user.avatar).toBe(avatar);
    }
  });

  it('creates a user with the provided type.', async () => {
    const challenger = await new SupabaseUserRecordBuilder(
      'challenger@example.com',
    )
      .type(UserType.Challenger)
      .build();
    expect(challenger.type).toBe(UserType.Challenger);

    const player = await new SupabaseUserRecordBuilder('player@example.com')
      .type(UserType.Player)
      .build();
    expect(player.type).toBe(UserType.Player);

    const hybrid = await new SupabaseUserRecordBuilder('hybrid@example.com')
      .type(UserType.Hybrid)
      .build();
    expect(hybrid.type).toBe(UserType.Hybrid);
  });

  it('creates a user with the provided inviteCode.', async () => {
    const inviteCode = createId();
    const user = await new SupabaseUserRecordBuilder('user@example.com')
      .inviteCode(inviteCode)
      .build();
    expect(user.inviteCode).toBe(inviteCode);
  });

  it('creates a user with the provided challengeEndTimestamp.', async () => {
    const timestamp = DateTime.fromFormat(
      '1972-05-24',
      'yyyy-MM-dd',
    ).toUnixInteger();
    const user = await new SupabaseUserRecordBuilder('user@example.com')
      .challengeEndTimestamp(timestamp)
      .build();
    expect(user.challengeEndTimestamp).toBe(timestamp);
  });

  it('creates a user with the provided completedChallenge.', async () => {
    const complete = await new SupabaseUserRecordBuilder('complete@example.com')
      .completedChallenge(true)
      .build();
    expect(complete.completedChallenge).toBe(true);

    const incomplete = await new SupabaseUserRecordBuilder(
      'incomplete@example.com',
    )
      .completedChallenge(false)
      .build();
    expect(incomplete.completedChallenge).toBe(false);
  });

  it('creates a user with the provided completedActions.', async () => {
    const allIncomplete = await new SupabaseUserRecordBuilder(
      'incomplete@example.com',
    )
      .completedActions({
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      })
      .build();

    expect(allIncomplete.completedActions).toStrictEqual({
      electionReminders: false,
      registerToVote: false,
      sharedChallenge: false,
    });

    const allComplete = await new SupabaseUserRecordBuilder(
      'complete@example.com',
    )
      .completedActions({
        electionReminders: true,
        registerToVote: true,
        sharedChallenge: true,
      })
      .build();

    expect(allComplete.completedActions).toStrictEqual({
      electionReminders: true,
      registerToVote: true,
      sharedChallenge: true,
    });
  });

  it('creates a user with the provided badges.', async () => {
    const badges: Badge[] = [
      {
        action: Actions.ElectionReminders,
      },
      {
        action: Actions.VoterRegistration,
      },
      {
        action: Actions.SharedChallenge,
      },
      {
        playerName: 'Player',
        playerAvatar: '2',
      },
    ];

    const user = await new SupabaseUserRecordBuilder('user@example.com')
      .badges(badges)
      .build();
    expect(user.badges).toStrictEqual(badges);
  });

  it('creates a user with the provided invitedBy.', async () => {
    const challengerInviteCode = createId();
    const challengerName = 'Challenger';
    const challengerAvatar = '1';

    const player = await new SupabaseUserRecordBuilder('player@example.com')
      .type(UserType.Player)
      .invitedBy({
        inviteCode: challengerInviteCode,
        name: challengerName,
        avatar: challengerAvatar,
      })
      .build();

    expect(player.invitedBy).toStrictEqual({
      inviteCode: challengerInviteCode,
      name: challengerName,
      avatar: challengerAvatar,
    });
  });

  it('creates a user with the provided contributedTo.', async () => {
    const challengerInviteCode = createId();
    const challengerName = 'Challenger';
    const challengerAvatar = '1';

    const player = await new SupabaseUserRecordBuilder('player@example.com')
      .type(UserType.Player)
      .contributedTo([
        {
          inviteCode: challengerInviteCode,
          name: challengerName,
          avatar: challengerAvatar,
        },
      ])
      .build();

    expect(player.contributedTo).toStrictEqual([
      {
        name: challengerName,
        avatar: challengerAvatar,
      },
    ]);
  });
});
