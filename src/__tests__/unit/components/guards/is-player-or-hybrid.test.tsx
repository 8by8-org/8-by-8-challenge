import { isPlayerOrHybrid } from '@/components/guards/is-player-or-hybrid';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import navigation from 'next/navigation';
import { useState, type PropsWithChildren } from 'react';
import { Builder } from 'builder-pattern';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { UserType } from '@/model/enums/user-type';
import { useContextSafely } from '@/hooks/use-context-safely';
import type { User } from '@/model/types/user';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('isPlayerOrHybrid', () => {
  let router: AppRouterInstance;

  beforeEach(() => {
    router = Builder<AppRouterInstance>().push(jest.fn()).build();
    jest.spyOn(navigation, 'useRouter').mockImplementation(() => router);
  });

  afterEach(cleanup);

  it('returns a component that can be rendered.', () => {
    const user = Builder<User>().type(UserType.Player).build();
    const userContextValue = Builder<UserContextType>().user(user).build();

    const TestComponent = isPlayerOrHybrid(function () {
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
    const user = Builder<User>().type(UserType.Player).build();
    const userContextValue = Builder<UserContextType>().user(user).build();

    interface TestComponentProps {
      message: string;
    }

    const TestComponent = isPlayerOrHybrid(function ({
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

  it('redirects the user to /signin if they are signed out.', () => {
    const userContextValue = Builder<UserContextType>().user(null).build();

    const TestComponent = isPlayerOrHybrid(function () {
      return null;
    });

    render(
      <UserContext.Provider value={userContextValue}>
        <TestComponent />
      </UserContext.Provider>,
    );

    expect(router.push).toHaveBeenCalledWith('/signin');
  });

  it('redirects the user to /progress if they are a challenger-type user.', () => {
    const user = Builder<User>().type(UserType.Challenger).build();
    const userContextValue = Builder<UserContextType>().user(user).build();

    const TestComponent = isPlayerOrHybrid(function () {
      return null;
    });

    render(
      <UserContext.Provider value={userContextValue}>
        <TestComponent />
      </UserContext.Provider>,
    );

    expect(router.push).toHaveBeenCalledWith('/progress');
  });

  it('allows access to a page if the user is signed in as a player-type user.', () => {
    const user = Builder<User>().type(UserType.Player).build();
    const userContextValue = Builder<UserContextType>().user(user).build();

    const TestComponent = isPlayerOrHybrid(function () {
      return null;
    });

    render(
      <UserContext.Provider value={userContextValue}>
        <TestComponent />
      </UserContext.Provider>,
    );
    expect(router.push).not.toHaveBeenCalled();
  });

  it('allows access to a page if the user is signed in as a hybrid-type user.', () => {
    const user = Builder<User>().type(UserType.Hybrid).build();
    const userContextValue = Builder<UserContextType>().user(user).build();

    const TestComponent = isPlayerOrHybrid(function () {
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
      const [user, setUser] = useState<User | null>(
        Builder<User>().type(UserType.Player).build(),
      );

      const signOut = async () => setUser(null);

      return (
        <UserContext.Provider value={{ user, signOut } as UserContextType}>
          {children}
        </UserContext.Provider>
      );
    }

    const TestComponent = isPlayerOrHybrid(function () {
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
