import { sentOTP } from '@/components/guards/sent-otp';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import navigation from 'next/navigation';
import { Builder } from 'builder-pattern';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('sentOTP', () => {
  let router: AppRouterInstance;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    router = Builder<AppRouterInstance>().push(jest.fn()).build();
    spy = jest.spyOn(navigation, 'useRouter').mockImplementation(() => router);
  });

  afterEach(() => {
    cleanup();
    spy.mockRestore();
  });

  it('returns a component that can be rendered.', () => {
    const userContextValue = Builder<UserContextType>()
      .emailForSignIn('user@example.com')
      .build();

    const TestComponent = sentOTP(function () {
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
    const userContextValue = Builder<UserContextType>()
      .emailForSignIn('user@example.com')
      .build();

    interface TestComponentProps {
      message: string;
    }

    const TestComponent = sentOTP(function ({ message }: TestComponentProps) {
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

  it('blocks an inaccessible page if the user has not been sent an OTP.', () => {
    const userContextValue = Builder<UserContextType>()
      .emailForSignIn('')
      .build();

    const TestComponent = sentOTP(function () {
      return null;
    });

    render(
      <UserContext.Provider value={userContextValue}>
        <TestComponent />
      </UserContext.Provider>,
    );

    expect(router.push).toHaveBeenCalledWith('/signin');
  });

  it('allows access to a page if the user has been sent an OTP.', () => {
    const userContextValue = Builder<UserContextType>()
      .emailForSignIn('user@example.com')
      .build();

    const TestComponent = sentOTP(function () {
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
