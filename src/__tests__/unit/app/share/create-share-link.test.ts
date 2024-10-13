import { createShareLink } from '@/app/share/create-share-link';
import { SearchParams } from '@/constants/search-params';
import { createId } from '@paralleldrive/cuid2';
import { Builder } from 'builder-pattern';
import { UserType } from '@/model/enums/user-type';
import type { User } from '@/model/types/user';
import type { ChallengerData } from '@/model/types/challenger-data';

describe('createShareLink', () => {
  it(`returns a link in the format 
  <location.protocol>//<location.host>/challengerWelcome?${SearchParams.WonTheChallenge}=true
  when the user has won the challenge.`, () => {
    const currentURL = 'https://challenge.8by8.us/share';
    window.location.assign(currentURL);

    const user = Builder<User>().completedChallenge(true).build();

    const shareLink = createShareLink(user, null);
    expect(shareLink).toBe(
      `${currentURL.slice(0, currentURL.indexOf('/share'))}/challengerwelcome?${SearchParams.WonTheChallenge}=true`,
    );
  });

  it(`returns a link in the format 
  <location.protocol>//<location.host>/playerwelcome?${SearchParams.InviteCode}=<inviteCode>
  where <inviteCode> is the inviting challenger's invite code when the user is a 
  player who has not won the challenge and invitedBy is not null.`, () => {
    const currentURL = 'https://challenge.8by8.us/share';
    window.location.assign(currentURL);

    const user = Builder<User>().type(UserType.Player).build();

    const invitedBy = Builder<ChallengerData>()
      .challengerInviteCode(createId())
      .build();

    const shareLink = createShareLink(user, invitedBy);
    expect(shareLink).toBe(
      `${currentURL.slice(0, currentURL.indexOf('/share'))}/playerwelcome?${SearchParams.InviteCode}=${invitedBy.challengerInviteCode}`,
    );
  });

  it(`returns a link in the format 
  <location.protocol>//<location.host>/playerwelcome?${SearchParams.InviteCode}=<inviteCode>
  where <inviteCode> is the user's own invite code when the user is a 
  challenger who has not won the challenge.`, () => {
    const currentURL = 'https://challenge.8by8.us/share';
    window.location.assign(currentURL);

    const user = Builder<User>()
      .type(UserType.Challenger)
      .inviteCode(createId())
      .build();

    const shareLink = createShareLink(user, null);
    expect(shareLink).toBe(
      `${currentURL.slice(0, currentURL.indexOf('/share'))}/playerwelcome?${SearchParams.InviteCode}=${user.inviteCode}`,
    );
  });

  it(`preserves the port when called with http://localhost:3000.`, () => {
    const currentURL = 'http://localhost:3000/share';
    window.location.assign(currentURL);

    const user = Builder<User>()
      .type(UserType.Challenger)
      .inviteCode(createId())
      .build();

    const shareLink = createShareLink(user, null);
    expect(shareLink).toBe(
      `${currentURL.slice(0, currentURL.indexOf('/share'))}/playerwelcome?${SearchParams.InviteCode}=${user.inviteCode}`,
    );
  });
});
