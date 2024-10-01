import { HasCompletedAllActions } from '@/app/actions/hero/has-completed-all-actions';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { Builder } from 'builder-pattern';
import { createId } from '@paralleldrive/cuid2';
import { UserType } from '@/model/enums/user-type';
import { AVATARS } from '@/constants/avatars';
import type { User } from '@/model/types/user';

describe('HasCompletedAllActions', () => {
  afterEach(cleanup);

  it(`renders.`, () => {
    const user = Builder<User>().contributedTo([]).build();

    render(
      <UserContext.Provider
        value={Builder<UserContextType>().user(user).build()}
      >
        <HasCompletedAllActions />
      </UserContext.Provider>,
    );

    expect(screen.queryByText(/you are done!/i)).toBeInTheDocument();
  });

  it(`does not render the text 'You supported:' if the user has not contributed 
  to any challenger's challenges.`, () => {
    const user = Builder<User>().contributedTo([]).build();

    render(
      <UserContext.Provider
        value={Builder<UserContextType>().user(user).build()}
      >
        <HasCompletedAllActions />
      </UserContext.Provider>,
    );

    expect(screen.queryByText(/you supported:/i)).not.toBeInTheDocument();
  });

  it(`renders the text 'You supported:' if the user has contributed to at least 
  one challenger's challenge.`, () => {
    const user = Builder<User>()
      .contributedTo([
        {
          challengerName: '',
          challengerInviteCode: '',
          challengerAvatar: '0',
        },
      ])
      .build();

    render(
      <UserContext.Provider
        value={Builder<UserContextType>().user(user).build()}
      >
        <HasCompletedAllActions />
      </UserContext.Provider>,
    );

    expect(screen.queryByText(/you supported:/i)).toBeInTheDocument();
  });

  it(`renders the avatars and names of all challengers that the user has 
  contributed to.`, () => {
    const user = Builder<User>()
      .contributedTo([
        {
          challengerInviteCode: createId(),
          challengerAvatar: '0',
          challengerName: 'Barbara',
        },
        {
          challengerInviteCode: createId(),
          challengerAvatar: '1',
          challengerName: 'Martin',
        },
        {
          challengerInviteCode: createId(),
          challengerAvatar: '3',
          challengerName: 'Bob',
        },
      ])
      .build();

    render(
      <UserContext.Provider
        value={Builder<UserContextType>().user(user).build()}
      >
        <HasCompletedAllActions />
      </UserContext.Provider>,
    );

    for (const challenger of user.contributedTo) {
      expect(
        screen.queryByAltText(AVATARS[challenger.challengerAvatar].altText),
      ).toBeInTheDocument();
      expect(screen.queryByText(challenger.challengerName)).toBeInTheDocument();
    }
  });
});
