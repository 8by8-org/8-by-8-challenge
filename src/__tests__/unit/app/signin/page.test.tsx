import {
  render,
  screen,
  cleanup,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Builder } from 'builder-pattern';
import { MockReactTurnstile } from '@/utils/test/mock-react-turnstile';
import SignInPage from '@/app/signin/page';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { AlertsContextProvider } from '@/contexts/alerts-context';
import { CLOUDFLARE_TURNSTILE_DUMMY_SITE_KEYS } from '@/constants/cloudflare-turnstile-dummy-site-keys';
import { PromiseScheduler } from '@/utils/test/promise-scheduler';

jest.mock('next/navigation', () => require('next-router-mock'));
jest.mock('react-turnstile', () => MockReactTurnstile);

describe('SignInPage', () => {
  const siteKeyEnvVariable = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const scrollTo = window.scrollTo;
  let userContextValue: UserContextType;

  beforeEach(() => {
    userContextValue = Builder<UserContextType>()
      .user(null)
      .sendOTPToEmail(jest.fn())
      .build();
    window.scrollTo = jest.fn();
  });

  afterEach(cleanup);

  afterAll(() => {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = siteKeyEnvVariable;
    window.scrollTo = scrollTo;
    jest.restoreAllMocks();
  });

  it(`renders a form with an input element for the user's email address.`, () => {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY =
      CLOUDFLARE_TURNSTILE_DUMMY_SITE_KEYS.ALWAYS_PASSES;

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <SignInPage />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    expect(screen.queryByRole('form')).toBeInTheDocument();
    expect(screen.queryByLabelText('Email address*')).toBeInTheDocument();
  });

  it('calls sendOTPToEmail if the form is valid.', async () => {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY =
      CLOUDFLARE_TURNSTILE_DUMMY_SITE_KEYS.ALWAYS_PASSES;

    const user = userEvent.setup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <SignInPage />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const email = screen.getByLabelText('Email address*');
    await user.type(email, 'user@example.com');

    const signInBtn = screen.getByText('Sign in');
    await user.click(signInBtn);

    await waitFor(() => {
      expect(userContextValue.sendOTPToEmail).toHaveBeenCalledWith({
        email: 'user@example.com',
        captchaToken: expect.any(String),
      });
    });
  });

  it(`calls sendOTPToEmail when the form is submitted via keyboard 
  input.`, async () => {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY =
      CLOUDFLARE_TURNSTILE_DUMMY_SITE_KEYS.ALWAYS_PASSES;

    const user = userEvent.setup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <SignInPage />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const email = screen.getByLabelText('Email address*');
    await user.type(email, 'user@example.com{enter}');

    await waitFor(() => {
      expect(userContextValue.sendOTPToEmail).toHaveBeenCalledWith({
        email: 'user@example.com',
        captchaToken: expect.any(String),
      });
    });
  });

  it('does not call sendOTPToEmail() if isLoading is true.', async () => {
    const promiseScheduler = new PromiseScheduler();
    userContextValue = Builder<UserContextType>()
      .sendOTPToEmail(
        jest.fn().mockImplementation(() => {
          return promiseScheduler.createScheduledPromise<void>(undefined);
        }),
      )
      .build();

    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY =
      CLOUDFLARE_TURNSTILE_DUMMY_SITE_KEYS.ALWAYS_PASSES;

    const user = userEvent.setup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <SignInPage />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const email = screen.getByLabelText('Email address*');
    await user.type(email, 'user@example.com');

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() =>
      expect(userContextValue.sendOTPToEmail).toHaveBeenCalled(),
    );

    fireEvent.submit(form);
    fireEvent.submit(form);
    fireEvent.submit(form);

    expect(userContextValue.sendOTPToEmail).toHaveBeenCalledTimes(1);
  });

  it('focuses on the email input if it is invalid when the form is submitted.', async () => {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY =
      CLOUDFLARE_TURNSTILE_DUMMY_SITE_KEYS.ALWAYS_PASSES;

    const user = userEvent.setup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <SignInPage />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const email = screen.getByLabelText('Email address*');
    const signInBtn = screen.getByText('Sign in');
    await user.click(signInBtn);

    await waitFor(() => {
      expect(document.activeElement).toBe(email);
    });
  });

  it(`scrolls to the Turnstile component if email is valid and Turnstile is not 
  when the form is submitted.`, async () => {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY =
      CLOUDFLARE_TURNSTILE_DUMMY_SITE_KEYS.ALWAYS_BLOCKS;

    const user = userEvent.setup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <SignInPage />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const email = screen.getByLabelText('Email address*');
    await user.type(email, 'user@example.com');

    const signInBtn = screen.getByText('Sign in');
    await user.click(signInBtn);

    const turnstile = document.getElementById('turnstile-widget');
    await waitFor(() => {
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: turnstile?.offsetTop,
      });
    });
  });

  it('displays an error message if sendOTPToEmail throws an error.', async () => {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY =
      CLOUDFLARE_TURNSTILE_DUMMY_SITE_KEYS.ALWAYS_PASSES;

    userContextValue = Builder<UserContextType>()
      .sendOTPToEmail(() => {
        throw new Error();
      })
      .build();

    const user = userEvent.setup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <SignInPage />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const email = screen.getByLabelText('Email address*');
    await user.type(email, 'user@example.com');

    const signInBtn = screen.getByText('Sign in');
    await user.click(signInBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toBe(
        'Something went wrong. Please try again.',
      );
    });
  });
});
