import CompletedRemindersPage from '@/app/reminders/completed/page';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { AlertsContextProvider } from '@/contexts/alerts-context';
import { Builder } from 'builder-pattern';
import navigation from 'next/navigation';
import { UserType } from '@/model/enums/user-type';
import type { User } from '@/model/types/user';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('CompletedRemindersPage', () => {
  let router: AppRouterInstance;

  beforeEach(() => {
    router = Builder<AppRouterInstance>().push(jest.fn()).build();
    jest.spyOn(navigation, 'useRouter').mockImplementation(() => router);
  });

  afterEach(cleanup);

  it('renders.', () => {
    const user = Builder<User>()
      .completedActions({
        electionReminders: true,
        registerToVote: false,
        sharedChallenge: false,
      })
      .build();

    const userContextValue = Builder<UserContextType>()
      .user(user)
      .gotElectionReminders(() => Promise.resolve())
      .build();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <CompletedRemindersPage searchParams={{}} />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );
  });

  it('displays an alert if its searchParams include hasError=true.', () => {
    const user = Builder<User>()
      .completedActions({
        electionReminders: true,
        registerToVote: false,
        sharedChallenge: false,
      })
      .build();

    const userContextValue = Builder<UserContextType>()
      .user(user)
      .gotElectionReminders(() => Promise.resolve())
      .build();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <CompletedRemindersPage searchParams={{ hasError: 'true' }} />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const alert = screen.getByRole('alert');
    expect(alert.classList).not.toContain('hidden');
    expect(alert.textContent).toBe(
      "Oops! We couldn't award you a badge. Please try again later.",
    );
  });

  it(`does not display an alert if its searchParams do not include 
  hasError=true.`, () => {
    const user = Builder<User>()
      .completedActions({
        electionReminders: true,
        registerToVote: false,
        sharedChallenge: false,
      })
      .build();

    const userContextValue = Builder<UserContextType>()
      .user(user)
      .gotElectionReminders(() => Promise.resolve())
      .build();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <CompletedRemindersPage searchParams={{}} />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const alert = screen.getByRole('alert');
    expect(alert.classList).toContain('hidden');
  });

  it(`redirects the user to /progress if they click 'Continue' and are a 
  challenger.`, async () => {
    const userContextValue = Builder<UserContextType>()
      .user(
        Builder<User>()
          .type(UserType.Challenger)
          .completedActions({
            electionReminders: true,
            registerToVote: false,
            sharedChallenge: false,
          })
          .build(),
      )
      .gotElectionReminders(() => Promise.resolve())
      .build();

    const user = userEvent.setup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <CompletedRemindersPage searchParams={{}} />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    await user.click(screen.getByText(/continue/i));
    expect(router.push).toHaveBeenCalledWith('/progress');
  });

  it(`redirects the user to /actions if they click 'Continue' and are not a
  challenger.`, async () => {
    const userContextValue = Builder<UserContextType>()
      .user(
        Builder<User>()
          .type(UserType.Player)
          .completedActions({
            electionReminders: true,
            registerToVote: false,
            sharedChallenge: false,
          })
          .build(),
      )
      .gotElectionReminders(() => Promise.resolve())
      .build();

    const user = userEvent.setup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <CompletedRemindersPage searchParams={{}} />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    await user.click(screen.getByText(/continue/i));
    expect(router.push).toHaveBeenCalledWith('/actions');
  });
});
