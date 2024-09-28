import { BadgeAwardedMessage } from '@/app/actions/badge-awarded-message';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { Builder } from 'builder-pattern';
import { UserType } from '@/model/enums/user-type';
import { createId } from '@paralleldrive/cuid2';
import type { User } from '@/model/types/user';
import type { ChallengerData } from '@/model/types/challenger-data';

describe('BadgeAwardedMessage', () => {
  afterEach(cleanup);

  it(`displays a message when the user is signed in, the challenger they last 
  contributed to is the same challenger that currently invited them, and the 
  user has not completed all actions.`, () => {
    const challengerData: ChallengerData = {
      challengerName: 'Challenger',
      challengerInviteCode: createId(),
      challengerAvatar: '0',
    };

    const user = Builder<User>()
      .type(UserType.Player)
      .contributedTo([challengerData])
      .completedActions({
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      })
      .build();

    render(
      <UserContext.Provider
        value={Builder<UserContextType>()
          .user(user)
          .invitedBy(challengerData)
          .build()}
      >
        <BadgeAwardedMessage />
      </UserContext.Provider>,
    );

    expect(
      screen.queryByText(
        new RegExp(`${challengerData.challengerName} got a badge!`, 'i'),
      ),
    ).toBeInTheDocument();
  });
});
