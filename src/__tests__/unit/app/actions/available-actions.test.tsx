import { AvailableActions } from '@/app/actions/available-actions';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { AlertsContextProvider } from '@/contexts/alerts-context';
import { UserType } from '@/model/enums/user-type';
import { Builder } from 'builder-pattern';
import navigation from 'next/navigation';
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';
import { PromiseScheduler } from '@/utils/test/promise-scheduler';
import type { User } from '@/model/types/user';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('AvailableActions', () => {
  let router: AppRouterInstance;
  let user: UserEvent;

  beforeEach(() => {
    mockDialogMethods();

    router = Builder<AppRouterInstance>()
      .push(jest.fn())
      .prefetch(jest.fn())
      .build();
    jest.spyOn(navigation, 'useRouter').mockImplementation(() => router);

    user = userEvent.setup();
  });

  afterEach(cleanup);

  it(`renders a button that links to the /reminders page if the user has not 
  completed the election reminders action.`, async () => {
    render(
      <AlertsContextProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(
              Builder<User>()
                .completedActions({
                  electionReminders: false,
                  registerToVote: false,
                  sharedChallenge: false,
                })
                .type(UserType.Player)
                .build(),
            )
            .invitedBy(null)
            .takeTheChallenge(jest.fn())
            .build()}
        >
          <AvailableActions />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    await user.click(screen.getByText(/get election reminders/i));
    expect(router.push).toHaveBeenCalledWith('/reminders');
  });

  it(`renders a button that links to the /register page if the user has not 
  completed the register to vote action.`, async () => {
    render(
      <AlertsContextProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(
              Builder<User>()
                .completedActions({
                  electionReminders: false,
                  registerToVote: false,
                  sharedChallenge: false,
                })
                .type(UserType.Player)
                .build(),
            )
            .takeTheChallenge(jest.fn())
            .invitedBy(null)
            .build()}
        >
          <AvailableActions />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    await user.click(screen.getByText(/register to vote/i));
    expect(router.push).toHaveBeenCalledWith('/register');
  });

  it(`renders a button that calls the takeTheChallenge() method of the 
  UserContext when clicked, if the user is of type UserType.Player.`, async () => {
    const takeTheChallenge = jest.fn();

    render(
      <AlertsContextProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(
              Builder<User>()
                .completedActions({
                  electionReminders: false,
                  registerToVote: false,
                  sharedChallenge: false,
                })
                .type(UserType.Player)
                .build(),
            )
            .invitedBy(null)
            .takeTheChallenge(takeTheChallenge)
            .build()}
        >
          <AvailableActions />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    await user.click(screen.getByText(/take the challenge/i));
    expect(takeTheChallenge).toHaveBeenCalled();
  });

  it(`displays a modal with the text "Starting your challenge..." while
  takeTheChallenge() is executing.`, async () => {
    const promiseScheduler = new PromiseScheduler();
    const takeTheChallenge = jest.fn().mockImplementation(() => {
      return promiseScheduler.createScheduledPromise<void>(undefined);
    });

    render(
      <AlertsContextProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(
              Builder<User>()
                .completedActions({
                  electionReminders: false,
                  registerToVote: false,
                  sharedChallenge: false,
                })
                .type(UserType.Player)
                .build(),
            )
            .invitedBy(null)
            .takeTheChallenge(takeTheChallenge)
            .build()}
        >
          <AvailableActions />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();

    await user.click(screen.getByText(/take the challenge/i));

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    expect(
      screen.queryByText(/starting your challenge.../i),
    ).toBeInTheDocument();
  });

  it(`displays a modal with the text "Success!" when takeTheChallenge()
  succeeds.`, async () => {
    const promiseScheduler = new PromiseScheduler();
    const takeTheChallenge = jest.fn().mockImplementation(() => {
      return promiseScheduler.createScheduledPromise<void>(undefined);
    });

    render(
      <AlertsContextProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(
              Builder<User>()
                .completedActions({
                  electionReminders: false,
                  registerToVote: false,
                  sharedChallenge: false,
                })
                .type(UserType.Player)
                .build(),
            )
            .invitedBy(null)
            .takeTheChallenge(takeTheChallenge)
            .build()}
        >
          <AvailableActions />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    await user.click(screen.getByText(/take the challenge/i));
    expect(screen.queryByText(/success/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/starting your challenge.../i),
    ).toBeInTheDocument();

    promiseScheduler.resolveAll();
    await screen.findByText(/success/i);
    expect(
      screen.queryByText(/starting your challenge.../i),
    ).not.toBeInTheDocument();
  });

  it('displays an alert when takeTheChallenge() fails.', async () => {
    const takeTheChallenge = jest.fn().mockImplementation(() => {
      return Promise.reject(new Error());
    });

    render(
      <AlertsContextProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(
              Builder<User>()
                .completedActions({
                  electionReminders: false,
                  registerToVote: false,
                  sharedChallenge: false,
                })
                .type(UserType.Player)
                .build(),
            )
            .invitedBy(null)
            .takeTheChallenge(takeTheChallenge)
            .build()}
        >
          <AvailableActions />
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
            .user(
              Builder<User>()
                .completedActions({
                  electionReminders: false,
                  registerToVote: false,
                  sharedChallenge: false,
                })
                .type(UserType.Player)
                .build(),
            )
            .invitedBy(null)
            .takeTheChallenge(takeTheChallenge)
            .build()}
        >
          <AvailableActions />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    for (let i = 0; i < 5; i++) {
      await user.click(screen.getByText(/take the challenge/i));
    }

    expect(takeTheChallenge).toHaveBeenCalledTimes(1);
  });

  test('The modal cannot be closed while takeTheChallenge() is executing.', async () => {
    const promiseScheduler = new PromiseScheduler();
    const takeTheChallenge = jest.fn().mockImplementation(() => {
      return promiseScheduler.createScheduledPromise<void>(undefined);
    });

    render(
      <AlertsContextProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(
              Builder<User>()
                .completedActions({
                  electionReminders: false,
                  registerToVote: false,
                  sharedChallenge: false,
                })
                .type(UserType.Player)
                .build(),
            )
            .invitedBy(null)
            .takeTheChallenge(takeTheChallenge)
            .build()}
        >
          <AvailableActions />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText(/take the challenge/i));
    await user.click(document.getElementsByClassName('close_btn')[0]);
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalledTimes(1);
  });

  test('The modal can be closed once takeTheChallenge() succeeds.', async () => {
    const takeTheChallenge = jest.fn().mockImplementation(() => {
      return Promise.resolve();
    });

    render(
      <AlertsContextProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(
              Builder<User>()
                .completedActions({
                  electionReminders: false,
                  registerToVote: false,
                  sharedChallenge: false,
                })
                .type(UserType.Player)
                .build(),
            )
            .invitedBy(null)
            .takeTheChallenge(takeTheChallenge)
            .build()}
        >
          <AvailableActions />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText(/take the challenge/i));
    await user.click(document.getElementsByClassName('close_btn')[0]);
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalledTimes(2);
  });

  test(`The modal is closed when the user clicks 'Ok, got it.'`, async () => {
    const takeTheChallenge = jest.fn().mockImplementation(() => {
      return Promise.resolve();
    });

    render(
      <AlertsContextProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(
              Builder<User>()
                .completedActions({
                  electionReminders: false,
                  registerToVote: false,
                  sharedChallenge: false,
                })
                .type(UserType.Player)
                .build(),
            )
            .invitedBy(null)
            .takeTheChallenge(takeTheChallenge)
            .build()}
        >
          <AvailableActions />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText(/take the challenge/i));
    await user.click(screen.getByText(/ok, got it/i));
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalledTimes(2);
  });

  it(`renders a button that links to the /progress page when the user has
  completed all actions that would award their inviter a badge.`, async () => {
    render(
      <AlertsContextProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(
              Builder<User>()
                .completedActions({
                  electionReminders: true,
                  registerToVote: true,
                  sharedChallenge: false,
                })
                .type(UserType.Hybrid)
                .build(),
            )
            .invitedBy(null)
            .takeTheChallenge(jest.fn())
            .build()}
        >
          <AvailableActions />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    await user.click(screen.getByText(/see your challenge/i));
    expect(router.push).toHaveBeenCalledWith('/progress');
  });

  it(`renders a button that links to /share when the user has completed all
  actions that would award their inviter a badge.`, async () => {
    render(
      <AlertsContextProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(
              Builder<User>()
                .completedActions({
                  electionReminders: true,
                  registerToVote: true,
                  sharedChallenge: false,
                })
                .type(UserType.Hybrid)
                .build(),
            )
            .invitedBy(null)
            .takeTheChallenge(jest.fn())
            .build()}
        >
          <AvailableActions />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    await user.click(screen.getByText(/share about your actions/i));
    expect(router.push).toHaveBeenCalledWith('/share');
  });

  test(`the topmost button is always rendered as a gradient-variant button 
  while the bottom 1-2 buttons are inverted variants.`, () => {
    render(
      <AlertsContextProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(
              Builder<User>()
                .completedActions({
                  registerToVote: false,
                  electionReminders: false,
                  sharedChallenge: false,
                })
                .type(UserType.Player)
                .build(),
            )
            .invitedBy(null)
            .takeTheChallenge(jest.fn())
            .build()}
        >
          <AvailableActions />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    let buttons = screen.getAllByRole('button');

    expect(buttons).toHaveLength(3);
    expect(buttons[0]).toHaveClass('gradient');
    expect(buttons[1]).toHaveClass('inverted');
    expect(buttons[2]).toHaveClass('inverted');

    cleanup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(
              Builder<User>()
                .completedActions({
                  registerToVote: true,
                  electionReminders: false,
                  sharedChallenge: false,
                })
                .type(UserType.Player)
                .build(),
            )
            .invitedBy(null)
            .takeTheChallenge(jest.fn())
            .build()}
        >
          <AvailableActions />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveClass('gradient');
    expect(buttons[1]).toHaveClass('inverted');

    cleanup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(
              Builder<User>()
                .completedActions({
                  registerToVote: true,
                  electionReminders: true,
                  sharedChallenge: false,
                })
                .type(UserType.Player)
                .build(),
            )
            .invitedBy(null)
            .takeTheChallenge(jest.fn())
            .build()}
        >
          <AvailableActions />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveClass('gradient');
  });
});
