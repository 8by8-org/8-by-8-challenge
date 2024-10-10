import { lastContributedToCurrentInviter } from '@/app/actions/utils/last-contributed-to-current-inviter';
import { createId } from '@paralleldrive/cuid2';
import type { ChallengerData } from '@/model/types/challenger-data';

describe('lastContributedToCurrentInviter', () => {
  it(`returns true if the only item in the contributedTo array has the same 
  challengerInviteCode as that of the invitedBy object.`, () => {
    const challenger: ChallengerData = {
      challengerName: 'Challenger',
      challengerAvatar: '0',
      challengerInviteCode: createId(),
    };

    expect(lastContributedToCurrentInviter([challenger], challenger)).toBe(
      true,
    );
  });

  it(`returns false if the only item in the contributedTo array has a different
  challengerInviteCode than that of the invitedBy object.`, () => {
    const challengerA: ChallengerData = {
      challengerName: 'Challenger',
      challengerAvatar: '0',
      challengerInviteCode: createId(),
    };

    const challengerB: ChallengerData = {
      challengerName: 'Challenger',
      challengerAvatar: '0',
      challengerInviteCode: createId(),
    };

    expect(lastContributedToCurrentInviter([challengerA], challengerB)).toBe(
      false,
    );
  });

  it(`returns true if the last of multiple items in the contributedTo array 
  has the same inviteCode as the invitedBy object.`, () => {
    const challengerA: ChallengerData = {
      challengerName: 'Challenger',
      challengerAvatar: '0',
      challengerInviteCode: createId(),
    };

    const challengerB: ChallengerData = {
      challengerName: 'Challenger',
      challengerAvatar: '0',
      challengerInviteCode: createId(),
    };

    const challengerC: ChallengerData = {
      challengerName: 'Challenger',
      challengerAvatar: '0',
      challengerInviteCode: createId(),
    };

    expect(
      lastContributedToCurrentInviter(
        [challengerA, challengerB, challengerC],
        challengerC,
      ),
    ).toBe(true);
  });

  it(`returns false if the last of multiple items in the contributedTo array 
  does not have the same inviteCode as the invitedBy object.`, () => {
    const challengerA: ChallengerData = {
      challengerName: 'Challenger',
      challengerAvatar: '0',
      challengerInviteCode: createId(),
    };

    const challengerB: ChallengerData = {
      challengerName: 'Challenger',
      challengerAvatar: '0',
      challengerInviteCode: createId(),
    };

    const challengerC: ChallengerData = {
      challengerName: 'Challenger',
      challengerAvatar: '0',
      challengerInviteCode: createId(),
    };

    const challengerD: ChallengerData = {
      challengerName: 'Challenger',
      challengerAvatar: '0',
      challengerInviteCode: createId(),
    };

    expect(
      lastContributedToCurrentInviter(
        [challengerA, challengerB, challengerC],
        challengerD,
      ),
    ).toBe(false);
  });

  it('returns false if contributedTo is an empty array.', () => {
    expect(
      lastContributedToCurrentInviter([], {
        challengerName: 'Challenger',
        challengerAvatar: '0',
        challengerInviteCode: createId(),
      }),
    ).toBe(false);
  });

  it('returns false if contributedTo is undefined.', () => {
    expect(
      lastContributedToCurrentInviter(undefined, {
        challengerName: 'Challenger',
        challengerAvatar: '0',
        challengerInviteCode: createId(),
      }),
    ).toBe(false);
  });
});
