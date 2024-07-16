import { PropsWithChildren, useState } from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import navigation from 'next/navigation';
import { Builder } from 'builder-pattern';
import { DateTime } from 'luxon';
import { isSignedIn } from '@/components/guards/is-signed-in';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { UserType } from '@/model/enums/user-type';
import type { User } from '@/model/types/user';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useContextSafely } from '@/hooks/use-context-safely';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('isSignedIn', () => {
  let router: AppRouterInstance;

  beforeEach(() => {
    router = Builder<AppRouterInstance>().push(jest.fn()).build();
    jest.spyOn(navigation, 'useRouter').mockImplementation(() => router);
  });

  afterEach(cleanup);

  it('returns a component that can be rendered.', () => {
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

    const TestComponent = isSignedIn(function () {
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

    interface TestComponentProps {
      message: string;
    }

    const TestComponent = isSignedIn(function ({
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
    const userContextValue = Builder<UserContextType>().user(null).build();

    const TestComponent = isSignedIn(function () {
      return null;
    });

    render(
      <UserContext.Provider value={userContextValue}>
        <TestComponent />
      </UserContext.Provider>,
    );

    expect(router.push).toHaveBeenCalledWith('/signin');
  });

  it('allows access to a page if the user is signed in.', () => {
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

    const TestComponent = isSignedIn(function () {
      return null;
    });

    render(
      <UserContext.Provider value={userContextValue}>
        <TestComponent />
      </UserContext.Provider>,
    );
    expect(router.push).not.toHaveBeenCalled();
  });

  it('redirects the user upon signout.', async () => {
    function MockUserContextProvider({ children }: PropsWithChildren) {
      const [user, setUser] = useState<User | null>({
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
      });

      const signOut = async () => setUser(null);

      return (
        <UserContext.Provider value={{ user, signOut } as UserContextType}>
          {children}
        </UserContext.Provider>
      );
    }

    const TestComponent = isSignedIn(function () {
      const { signOut } = useContextSafely(UserContext, 'TestComponent');

      return <button onClick={signOut}>Sign out</button>;
    });

    const user = userEvent.setup();
    render(
      <MockUserContextProvider>
        <TestComponent />
      </MockUserContextProvider>,
    );

    expect(router.push).not.toHaveBeenCalled();

    const button = screen.getByText('Sign out');

    await user.click(button);
    await waitFor(() =>
      expect(router.push).toHaveBeenLastCalledWith('/signin'),
    );
  });
});
