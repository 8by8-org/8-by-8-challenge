import { wasInvited } from '@/components/guards/was-invited';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import navigation from 'next/navigation';
import { Builder } from 'builder-pattern';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import type { InvitedBy } from '@/model/types/invited-by';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('wasInvited', () => {
  let router: AppRouterInstance;

  beforeEach(() => {
    router = Builder<AppRouterInstance>().push(jest.fn()).build();
    jest.spyOn(navigation, 'useRouter').mockImplementation(() => router);
  });

  afterEach(cleanup);

  it('returns a component that can be rendered.', () => {
    const invitedBy = Builder<InvitedBy>().build();
    const userContextValue = Builder<UserContextType>()
      .invitedBy(invitedBy)
      .build();

    const TestComponent = wasInvited(function () {
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
    const invitedBy = Builder<InvitedBy>().build();
    const userContextValue = Builder<UserContextType>()
      .invitedBy(invitedBy)
      .build();

    interface TestComponentProps {
      message: string;
    }

    const TestComponent = wasInvited(function ({
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

  it('redirects the user to /challengerwelcome if the invitedBy is null.', () => {
    const userContextValue = Builder<UserContextType>().invitedBy(null).build();

    const TestComponent = wasInvited(function () {
      return null;
    });

    render(
      <UserContext.Provider value={userContextValue}>
        <TestComponent />
      </UserContext.Provider>,
    );

    expect(router.push).toHaveBeenCalledWith('/challengerwelcome');
  });

  it('allows access to a page if invitedBy is not null.', () => {
    const invitedBy = Builder<InvitedBy>().build();
    const userContextValue = Builder<UserContextType>()
      .invitedBy(invitedBy)
      .build();

    const TestComponent = wasInvited(function () {
      return null;
    });

    render(
      <UserContext.Provider value={userContextValue}>
        <TestComponent />
      </UserContext.Provider>,
    );
    expect(router.push).not.toHaveBeenCalled();
  });
});
