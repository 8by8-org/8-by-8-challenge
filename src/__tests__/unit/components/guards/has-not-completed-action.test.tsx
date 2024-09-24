import { hasNotCompletedAction } from '@/components/guards/has-not-completed-action';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import navigation from 'next/navigation';
import { Builder } from 'builder-pattern';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { Actions } from '@/model/enums/actions';
import type { User } from '@/model/types/user';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('hasNotCompletedAction', () => {
  let router: AppRouterInstance;

  beforeEach(() => {
    router = Builder<AppRouterInstance>().push(jest.fn()).build();
    jest.spyOn(navigation, 'useRouter').mockImplementation(() => router);
  });

  afterEach(cleanup);

  it('returns a component that can be rendered.', () => {
    const user = Builder<User>()
      .completedActions({
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      })
      .build();

    const userContextValue = Builder<UserContextType>().user(user).build();

    const TestComponent = hasNotCompletedAction(
      function () {
        return <div data-testid="test"></div>;
      },
      { action: Actions.ElectionReminders, redirectTo: '/' },
    );

    render(
      <UserContext.Provider value={userContextValue}>
        <TestComponent />
      </UserContext.Provider>,
    );
    expect(screen.queryByTestId('test')).toBeInTheDocument();
  });

  it('returns a component that can accept props.', () => {
    const user = Builder<User>()
      .completedActions({
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      })
      .build();

    const userContextValue = Builder<UserContextType>().user(user).build();

    interface TestComponentProps {
      message: string;
    }

    const TestComponent = hasNotCompletedAction(
      function ({ message }: TestComponentProps) {
        return <div>{message}</div>;
      },
      { action: Actions.ElectionReminders, redirectTo: '/' },
    );

    const message = 'test';

    render(
      <UserContext.Provider value={userContextValue}>
        <TestComponent message={message} />
      </UserContext.Provider>,
    );
    expect(screen.queryByText(message)).toBeInTheDocument();
  });

  it('blocks access to a page if the user has completed the provided action.', () => {
    const user = Builder<User>()
      .completedActions({
        electionReminders: true,
        registerToVote: false,
        sharedChallenge: false,
      })
      .build();

    const userContextValue = Builder<UserContextType>().user(user).build();

    const redirectTo = '/';

    const TestComponent = hasNotCompletedAction(
      function () {
        return null;
      },
      { action: Actions.ElectionReminders, redirectTo },
    );

    render(
      <UserContext.Provider value={userContextValue}>
        <TestComponent />
      </UserContext.Provider>,
    );

    expect(router.push).toHaveBeenCalledWith(redirectTo);
  });

  it('allows access to a page if the user has not completed the provided action.', () => {
    const user = Builder<User>()
      .completedActions({
        electionReminders: true,
        registerToVote: true,
        sharedChallenge: false,
      })
      .build();

    const userContextValue = Builder<UserContextType>().user(user).build();

    const TestComponent = hasNotCompletedAction(
      function () {
        return null;
      },
      { action: Actions.SharedChallenge, redirectTo: '/' },
    );

    render(
      <UserContext.Provider value={userContextValue}>
        <TestComponent />
      </UserContext.Provider>,
    );
    expect(router.push).not.toHaveBeenCalled();
  });
});
