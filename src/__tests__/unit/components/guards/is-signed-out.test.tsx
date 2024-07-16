import { useState } from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import navigation from 'next/navigation';
import { Builder } from 'builder-pattern';
import { DateTime } from 'luxon';
import { isSignedOut } from '@/components/guards/is-signed-out';
import { UserType } from '@/model/enums/user-type';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import type { User } from '@/model/types/user';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('isSignedOut', () => {
  let router: AppRouterInstance;

  beforeEach(() => {
    router = Builder<AppRouterInstance>().push(jest.fn()).build();
    jest.spyOn(navigation, 'useRouter').mockImplementation(() => router);
  });

  afterEach(cleanup);

  it('returns a component that can be rendered.', () => {
    const userContextValue = Builder<UserContextType>().user(null).build();

    const TestComponent = isSignedOut(function () {
      return <div data-testid="test"></div>;
    });

    render(
      <UserContext.Provider value={userContextValue}>
        <TestComponent />
      </UserContext.Provider>,
    );
    expect(screen.queryByTestId('test')).toBeInTheDocument();
  });

  it('returns a component that can accept props.', () => {
    const userContextValue = Builder<UserContextType>().user(null).build();

    interface TestComponentProps {
      message: string;
    }

    const TestComponent = isSignedOut(function ({
      message,
    }: TestComponentProps) {
      return <div>{message}</div>;
    });

    const message = 'test';

    render(
      <UserContext.Provider value={userContextValue}>
        <TestComponent message={message} />
      </UserContext.Provider>,
    );
    expect(screen.queryByText('test')).toBeInTheDocument();
  });

  it('blocks an inaccessible page if the user is signed in.', () => {
    const user: User = {
      uid: '',
      email: '',
      name: '',
      avatar: '2',
      type: UserType.Challenger,
      completedActions: {
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      },
      badges: [],
      challengeEndTimestamp: DateTime.now().plus({ days: 8 }).toUnixInteger(),
      completedChallenge: false,
      contributedTo: [],
      inviteCode: '',
    };
    const userContextValue = Builder<UserContextType>().user(user).build();

    const TestComponent = isSignedOut(function () {
      return null;
    });

    render(
      <UserContext.Provider value={userContextValue}>
        <TestComponent />
      </UserContext.Provider>,
    );
    expect(router.push).toHaveBeenCalled();
  });

  it('allows access to a page if the user is signed out.', () => {
    const userContextValue = Builder<UserContextType>().user(null).build();

    const TestComponent = isSignedOut(function () {
      return null;
    });

    render(
      <UserContext.Provider value={userContextValue}>
        <TestComponent />
      </UserContext.Provider>,
    );
    expect(router.push).not.toHaveBeenCalled();
  });

  it('redirects the user upon sign in.', async () => {
    interface ProtectedComponentProps {
      signIn(): void;
    }

    const ProtectedComponent = isSignedOut(function ({
      signIn,
    }: ProtectedComponentProps) {
      return <button onClick={signIn}>Sign in</button>;
    });

    function TestComponent() {
      const [user, setUser] = useState<User | null>(null);

      const signIn = () => {
        setUser({
          uid: '',
          email: '',
          name: '',
          avatar: '2',
          type: UserType.Challenger,
          completedActions: {
            electionReminders: false,
            registerToVote: false,
            sharedChallenge: false,
          },
          badges: [],
          challengeEndTimestamp: DateTime.now()
            .plus({ days: 8 })
            .toUnixInteger(),
          completedChallenge: false,
          contributedTo: [],
          inviteCode: '',
        });
      };

      return (
        <UserContext.Provider value={{ user } as UserContextType}>
          <ProtectedComponent signIn={signIn} />
        </UserContext.Provider>
      );
    }

    const user = userEvent.setup();
    render(<TestComponent />);

    expect(router.push).not.toHaveBeenCalled();

    const button = screen.getByText('Sign in');

    await user.click(button);
    await waitFor(() =>
      expect(router.push).toHaveBeenLastCalledWith('/progress'),
    );
  });
});
