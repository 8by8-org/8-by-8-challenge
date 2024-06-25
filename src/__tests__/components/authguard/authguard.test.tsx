import '@testing-library/jest-dom';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import navigation from 'next/navigation';
import { AuthGuard } from '@/components/utils/authguard';
import { User } from '@/model/types/user';
import { UserContext, UserContextType } from '@/contexts/user-context';
import { Builder } from 'builder-pattern';
import { UserType } from '@/model/enums/user-type';
import { useState } from 'react';
import { DateTime } from 'luxon';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Authguard', () => {
  let router: AppRouterInstance;

  beforeEach(() => {
    router = Builder<AppRouterInstance>().push(jest.fn()).build();
    jest.spyOn(navigation, 'useRouter').mockImplementation(() => router);
  });

  afterEach(cleanup);

  it('renders a child component', () => {
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
    render(
      <UserContext.Provider value={userContextValue}>
        <AuthGuard>
          <div data-testid="test"></div>
        </AuthGuard>
      </UserContext.Provider>,
    );
    expect(screen.queryByTestId('test')).toBeInTheDocument();
  });

  it('calls signin page', () => {
    const userContextValue = Builder<UserContextType>().user(null).build();

    render(
      <UserContext.Provider value={userContextValue}>
        <AuthGuard />
      </UserContext.Provider>,
    );

    expect(router.push).toHaveBeenCalledWith('/signin');
  });

  it('does not call signin page', () => {
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
    render(
      <UserContext.Provider value={userContextValue}>
        <AuthGuard />
      </UserContext.Provider>,
    );
    expect(router.push).not.toHaveBeenCalled();
  });

  it('redirects the user', async () => {
    function TestComponent() {
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

      const signout = () => setUser(null);

      const UserContextValue = Builder<UserContextType>().user(user).build();

      return (
        <UserContext.Provider value={UserContextValue}>
          <AuthGuard>
            <button onClick={signout}>Sign out</button>
          </AuthGuard>
        </UserContext.Provider>
      );
    }

    const user = userEvent.setup();
    render(<TestComponent />);

    expect(router.push).not.toHaveBeenCalled();

    const button = screen.getByText('Sign out');

    await user.click(button);
    await waitFor(() =>
      expect(router.push).toHaveBeenLastCalledWith('/signin'),
    );
  });
});
