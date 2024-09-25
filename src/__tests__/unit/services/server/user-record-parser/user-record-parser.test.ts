import { Actions } from '@/model/enums/actions';
import { UserType } from '@/model/enums/user-type';
import { UserRecordParser } from '@/services/server/user-record-parser/user-record-parser';
import { createId } from '@paralleldrive/cuid2';
import { DateTime } from 'luxon';

describe('UserRecordParser', () => {
  const parser = new UserRecordParser();
  const validUser = {
    id: '1',
    email: 'user@example.com',
    user_name: 'user',
    avatar: '0',
    user_type: UserType.Hybrid,
    challenge_end_timestamp: DateTime.now().plus({ days: 8 }).toUnixInteger(),
    completed_challenge: false,
    invite_code: 'test-invite-code',
    completed_actions: {
      election_reminders: true,
      register_to_vote: true,
      shared_challenge: true,
    },
    badges: [
      {
        action_type: Actions.SharedChallenge,
        player_name: null,
        player_avatar: null,
      },
      {
        action_type: Actions.RegisterToVote,
        player_name: null,
        player_avatar: null,
      },
      {
        action_type: Actions.ElectionReminders,
        player_name: null,
        player_avatar: null,
      },
      {
        player_name: 'user 2',
        player_avatar: '1',
        action_type: null,
      },
    ],
    contributed_to: [
      {
        challenger_invite_code: createId(),
        challenger_name: 'user 3',
        challenger_avatar: '2',
      },
    ],
  };

  it('returns a User when it receives a valid db user.', () => {
    expect(parser.parseUserRecord(validUser)).toEqual({
      uid: '1',
      email: 'user@example.com',
      name: 'user',
      avatar: '0',
      type: UserType.Hybrid,
      challengeEndTimestamp: DateTime.now().plus({ days: 8 }).toUnixInteger(),
      completedChallenge: false,
      inviteCode: 'test-invite-code',
      completedActions: {
        electionReminders: true,
        registerToVote: true,
        sharedChallenge: true,
      },
      badges: [
        {
          action: Actions.SharedChallenge,
        },
        {
          action: Actions.RegisterToVote,
        },
        {
          action: Actions.ElectionReminders,
        },
        {
          playerName: 'user 2',
          playerAvatar: '1',
        },
      ],
      contributedTo: [
        {
          challengerInviteCode:
            validUser.contributed_to[0].challenger_invite_code,
          challengerName: 'user 3',
          challengerAvatar: '2',
        },
      ],
    });
  });

  it(`throws an error if the object it receives is missing required 
  properties.`, () => {
    for (const key of Object.keys(validUser)) {
      const invalidUser = { ...validUser };
      delete invalidUser[key as keyof typeof invalidUser];
      expect(() => parser.parseUserRecord(invalidUser)).toThrow();
    }
  });

  it('throws an error when completed_actions is improperly formatted.', () => {
    const invalidUser = { ...validUser } as Record<string, any>;

    invalidUser.completed_actions = {
      ...validUser.completed_actions,
    };

    // completed_actions.election_reminders must be a boolean
    invalidUser.completed_actions.election_reminders = 'completed';
    expect(() => parser.parseUserRecord(invalidUser)).toThrow();

    // completed_actions.election_reminders is required
    delete invalidUser.completed_actions.election_reminders;
    expect(() => parser.parseUserRecord(invalidUser)).toThrow();

    // reset invalidUser.completed_actions
    invalidUser.completed_actions = {
      ...validUser.completed_actions,
    };

    // completed_actions.shared_challenge must be a boolean
    invalidUser.completed_actions.shared_challenge = 'completed';
    expect(() => parser.parseUserRecord(invalidUser)).toThrow();

    // completed_actions.shared_challenge is required
    delete invalidUser.completed_actions.shared_challenge;
    expect(() => parser.parseUserRecord(invalidUser)).toThrow();

    // reset invalidUser.completed_actions
    invalidUser.completed_actions = {
      ...validUser.completed_actions,
    };

    // completed_actions.register_to_vote must be a boolean
    invalidUser.completed_actions.register_to_vote = 'completed';
    expect(() => parser.parseUserRecord(invalidUser)).toThrow();

    // completed_actions.register_to_vote is required
    delete invalidUser.completed_actions.register_to_vote;
    expect(() => parser.parseUserRecord(invalidUser)).toThrow();
  });

  it('throws an error when badges contains improperly formatted badges.', () => {
    const invalidBadges = [
      {},
      {
        action_type: 'some invalid action',
      },
      {
        player_name: 'player name without player avatar',
      },
      {
        player_avatar: '0',
      },
      {
        player_name: 'valid name with invalid avatar',
        avatar: '4',
      },
      {
        action_type: Actions.SharedChallenge,
        player_name: 'too many properties',
        player_avatar: '0',
      },
    ];

    const invalidUser = { ...validUser } as Record<string, any>;

    for (const badge of invalidBadges) {
      invalidUser.badges = [badge];

      expect(() => parser.parseUserRecord(invalidUser)).toThrow();
    }
  });

  it('throws an error when contributed_to contains improperly formatted items.', () => {
    const invalidContributedToEntries = [
      {},
      {
        challenger_name: '',
        challenger_avatar: '',
      },
      {
        challenger_invite_code: '',
        challenger_avatar: '0',
      },
      {
        challenger_invite_code: '',
        challenger_name: '',
      },
      {
        challenger_invite_code: 1,
        challenger_name: '',
        challenger_avatar: '0',
      },
      {
        challenger_invite_code: '',
        challenger_name: 1,
        challenger_avatar: '0',
      },
      {
        challenger_invite_code: '',
        challenger_name: '',
        challenger_avatar: '4',
      },
    ];

    const invalidUser = { ...validUser } as Record<string, any>;

    for (const contributedToEntry of invalidContributedToEntries) {
      invalidUser.contributed_to = [contributedToEntry];

      expect(() => parser.parseUserRecord(invalidUser)).toThrow();
    }
  });
});
