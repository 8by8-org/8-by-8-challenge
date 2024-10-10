import { Hero } from '@/app/actions/hero';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { Builder } from 'builder-pattern';
import { UserType } from '@/model/enums/user-type';
import type { User } from '@/model/types/user';
import type { ChallengerData } from '@/model/types/challenger-data';

describe('Hero', () => {
  afterEach(cleanup);

  it(`renders HasIncompleteActions when the user can still take actions for the
  inviting challenger.`, () => {
    const challenger: ChallengerData = {
      challengerName: 'Challenger',
      challengerAvatar: '0',
      challengerInviteCode: '',
    };

    const user = Builder<User>()
      .name('Player')
      .type(UserType.Player)
      .completedActions({
        registerToVote: false,
        electionReminders: false,
        sharedChallenge: false,
      })
      .contributedTo([])
      .build();

    render(
      <UserContext.Provider
        value={Builder<UserContextType>()
          .user(user)
          .invitedBy(challenger)
          .build()}
      >
        <Hero />
      </UserContext.Provider>,
    );

    const heading = screen.getAllByRole('heading', { level: 1 });
    expect(heading[0].textContent).toMatch(/take\s{0,1}action\s{0,1}for:/i);
    expect(screen.queryByText(/you are done!/i)).not.toBeInTheDocument();
  });

  it(`renders HasCompletedAllActions when the user has completed all actions
  that would award the challenger a badge.`, () => {
    const challenger: ChallengerData = {
      challengerName: 'Challenger',
      challengerAvatar: '0',
      challengerInviteCode: '',
    };

    const user = Builder<User>()
      .name('Player')
      .type(UserType.Hybrid)
      .completedActions({
        registerToVote: true,
        electionReminders: true,
        sharedChallenge: false,
      })
      .contributedTo([challenger])
      .build();

    render(
      <UserContext.Provider
        value={Builder<UserContextType>()
          .user(user)
          .invitedBy(challenger)
          .build()}
      >
        <Hero />
      </UserContext.Provider>,
    );

    expect(screen.queryByText(/you are done!/i)).toBeInTheDocument();
  });
});
