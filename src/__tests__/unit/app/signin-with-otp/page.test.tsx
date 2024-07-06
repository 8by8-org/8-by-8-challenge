import SignInWithOTPPage from '@/app/signin-with-otp/page';
import {
  render,
  screen,
  cleanup,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Builder } from 'builder-pattern';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { AlertsContextProvider } from '@/contexts/alerts-context';
import { PromiseScheduler } from '@/utils/test/promise-scheduler';

jest.mock('next/navigation', () => require('next-router-mock'));

describe('SignInWithOTPPage', () => {
  let userContextValue: UserContextType;
  let user: UserEvent;

  beforeEach(() => {
    userContextValue = Builder<UserContextType>()
      .user(null)
      .emailForSignIn('user@example.com')
      .signInWithOTP(jest.fn())
      .resendOTP(jest.fn())
      .build();

    jest.useFakeTimers();

    // set delay to null so that fake timers can be used
    user = userEvent.setup({ delay: null });
  });

  afterEach(() => {
    /*
      cleanup() must be called before restoring real timers so that 
      clearInterval is still defined in the clean up function returned by 
      the useEffect call within useCountdown().
    */
    cleanup();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it(`renders a form with an input element for one-time passcode.`, () => {
    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <SignInWithOTPPage />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    expect(screen.queryByRole('form')).toBeInTheDocument();
    expect(screen.queryByLabelText('One time passcode*')).toBeInstanceOf(
      HTMLInputElement,
    );
  });

  it('calls signInWithOTP if the form is valid when submitted.', async () => {
    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <SignInWithOTPPage />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const otp = screen.getByLabelText('One time passcode*');
    await user.type(otp, '123456');

    const signInBtn = screen.getByText('Sign in');
    await user.click(signInBtn);

    await waitFor(() => {
      expect(userContextValue.signInWithOTP).toHaveBeenCalledWith({
        otp: '123456',
      });
    });
  });

  it(`calls signInWithOTP when the form is submitted via keyboard 
  input.`, async () => {
    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <SignInWithOTPPage />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const otp = screen.getByLabelText('One time passcode*');
    await user.type(otp, '123456{enter}');

    await waitFor(() => {
      expect(userContextValue.signInWithOTP).toHaveBeenCalledWith({
        otp: '123456',
      });
    });
  });

  it('does not call signInWithOTP() if isLoading is true.', async () => {
    const promiseScheduler = new PromiseScheduler();
    userContextValue.signInWithOTP = jest.fn().mockImplementation(() => {
      return promiseScheduler.createScheduledPromise<void>(undefined);
    });

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <SignInWithOTPPage />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const otp = screen.getByLabelText('One time passcode*');
    await user.type(otp, '123456');

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() =>
      expect(userContextValue.signInWithOTP).toHaveBeenCalled(),
    );

    fireEvent.submit(form);
    fireEvent.submit(form);
    fireEvent.submit(form);

    expect(userContextValue.signInWithOTP).toHaveBeenCalledTimes(1);
  });

  it('focuses on the otp input if it is invalid when the form is submitted.', async () => {
    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <SignInWithOTPPage />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const otp = screen.getByLabelText('One time passcode*');
    const signInBtn = screen.getByText('Sign in');
    await user.click(signInBtn);

    await waitFor(() => {
      expect(document.activeElement).toBe(otp);
    });
  });

  it('displays an error message if signInWithOTP throws an error.', async () => {
    userContextValue.signInWithOTP = () => {
      throw new Error();
    };

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <SignInWithOTPPage />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const otp = screen.getByLabelText('One time passcode*');
    await user.type(otp, '123456');

    const signInBtn = screen.getByText('Sign in');
    await user.click(signInBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toBe(
        'There was a problem signing in. Please try again.',
      );
    });
  });
});
