import { HasIncompleteActions } from '@/app/actions/hero/has-incomplete-actions';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { Builder } from 'builder-pattern';
import { createId } from '@paralleldrive/cuid2';
import { UserType } from '@/model/enums/user-type';
import type { User } from '@/model/types/user';
import type { ChallengerData } from '@/model/types/challenger-data';

describe('HasIncompleteActions', () => {
  afterEach(cleanup);

  it(`renders the text 'You took action!' if the last challenger that the user 
  contributed to is also the challenger that most recently invited the user.`, () => {
    const challenger: ChallengerData = {
      challengerInviteCode: createId(),
      challengerName: 'Steve',
      challengerAvatar: '3',
    };

    const user = Builder<User>()
      .completedActions({
        registerToVote: true,
        electionReminders: false,
        sharedChallenge: false,
      })
      .type(UserType.Player)
      .contributedTo([challenger])
      .build();

    render(
      <UserContext.Provider
        value={Builder<UserContextType>()
          .user(user)
          .invitedBy(challenger)
          .build()}
      >
        <HasIncompleteActions />
      </UserContext.Provider>,
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toMatch(/you\s{0,1}took\s{0,1}action!/i);
  });

  it(`renders the text 'Take action for:' if the user was invited by a
  challenger but hasn't contributed to anyone's challenge yet.`, () => {
    const challenger: ChallengerData = {
      challengerInviteCode: createId(),
      challengerName: 'Steve',
      challengerAvatar: '3',
    };

    const user = Builder<User>()
      .completedActions({
        registerToVote: false,
        electionReminders: false,
        sharedChallenge: false,
      })
      .type(UserType.Player)
      .contributedTo([])
      .build();

    render(
      <UserContext.Provider
        value={Builder<UserContextType>()
          .user(user)
          .invitedBy(challenger)
          .build()}
      >
        <HasIncompleteActions />
      </UserContext.Provider>,
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toMatch(/take\s{0,1}action\s{0,1}for:/i);
  });

  it(`renders the text 'Take action for:' if the user was invited by a
  challenger other than the challenger they last contributed to.`, () => {
    const challenger1: ChallengerData = {
      challengerInviteCode: createId(),
      challengerName: 'Steve',
      challengerAvatar: '3',
    };

    const challenger2: ChallengerData = {
      challengerInviteCode: createId(),
      challengerName: 'Bill',
      challengerAvatar: '1',
    };

    const user = Builder<User>()
      .completedActions({
        registerToVote: true,
        electionReminders: false,
        sharedChallenge: false,
      })
      .type(UserType.Player)
      .contributedTo([challenger1])
      .build();

    render(
      <UserContext.Provider
        value={Builder<UserContextType>()
          .user(user)
          .invitedBy(challenger2)
          .build()}
      >
        <HasIncompleteActions />
      </UserContext.Provider>,
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toMatch(/take\s{0,1}action\s{0,1}for:/i);
  });

  it(`renders the text 'Take action!' if the user was not invited by another 
  user.`, () => {
    const user = Builder<User>()
      .completedActions({
        registerToVote: false,
        electionReminders: false,
        sharedChallenge: false,
      })
      .type(UserType.Player)
      .contributedTo([])
      .build();

    render(
      <UserContext.Provider
        value={Builder<UserContextType>().user(user).invitedBy(null).build()}
      >
        <HasIncompleteActions />
      </UserContext.Provider>,
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toMatch(/take\s{0,1}action!/i);
  });
});
