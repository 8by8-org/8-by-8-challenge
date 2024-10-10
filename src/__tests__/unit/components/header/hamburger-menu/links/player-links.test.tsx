import { PlayerLinks } from '@/components/header/hamburger-menu/links/player-links';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { AlertsContextProvider } from '@/contexts/alerts-context';
import {
  HeaderContext,
  type HeaderContextType,
} from '@/components/header/header-context';
import { UserType } from '@/model/enums/user-type';
import { Builder } from 'builder-pattern';
import { PromiseScheduler } from '@/utils/test/promise-scheduler';
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';
import type { User } from '@/model/types/user';

describe('PlayerLinks', () => {
  let user: UserEvent;

  beforeEach(() => {
    mockDialogMethods();
    user = userEvent.setup();
  });

  afterEach(cleanup);

  it('calls takeTheChallenge() the Take the Challenge button is clicked.', async () => {
    const takeTheChallenge = jest.fn().mockImplementation(() => {
      return Promise.resolve();
    });

    render(
      <AlertsContextProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(Builder<User>().type(UserType.Player).build())
            .invitedBy(null)
            .takeTheChallenge(takeTheChallenge)
            .build()}
        >
          <HeaderContext.Provider value={Builder<HeaderContextType>().build()}>
            <PlayerLinks />
          </HeaderContext.Provider>
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    await user.click(screen.getByText(/take the challenge/i));
    expect(takeTheChallenge).toHaveBeenCalled();
  });

  it('displays an alert when takeTheChallenge() fails.', async () => {
    const takeTheChallenge = jest.fn().mockImplementation(() => {
      return Promise.reject(new Error());
    });

    render(
      <AlertsContextProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(Builder<User>().type(UserType.Player).build())
            .invitedBy(null)
            .takeTheChallenge(takeTheChallenge)
            .build()}
        >
          <HeaderContext.Provider value={Builder<HeaderContextType>().build()}>
            <PlayerLinks />
          </HeaderContext.Provider>
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    expect(
      screen.queryByText('Oops! Something went wrong. Please try again later.'),
    ).not.toBeInTheDocument();

    await user.click(screen.getByText(/take the challenge/i));

    await screen.findByText(
      'Oops! Something went wrong. Please try again later.',
    );
  });

  it(`does not call takeTheChallenge() if the Take the Challenge button is
  clicked while takeTheChallenge() is already executing.`, async () => {
    const promiseScheduler = new PromiseScheduler();
    const takeTheChallenge = jest.fn().mockImplementation(() => {
      return promiseScheduler.createScheduledPromise<void>(undefined);
    });

    render(
      <AlertsContextProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(Builder<User>().type(UserType.Player).build())
            .invitedBy(null)
            .takeTheChallenge(takeTheChallenge)
            .build()}
        >
          <HeaderContext.Provider value={Builder<HeaderContextType>().build()}>
            <PlayerLinks />
          </HeaderContext.Provider>
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    for (let i = 0; i < 5; i++) {
      await user.click(screen.getByText(/take the challenge/i));
    }

    expect(takeTheChallenge).toHaveBeenCalledTimes(1);
  });
});
