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
import SignUpPage from '@/app/signup/page';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { AlertsContextProvider } from '@/contexts/alerts-context';
import { CLOUDFLARE_TURNSTILE_DUMMY_SITE_KEYS } from '@/constants/cloudflare-turnstile-dummy-site-keys';
import { AVATARS } from '@/constants/avatars';
import { UserType } from '@/model/enums/user-type';
import { PromiseScheduler } from '@/utils/test/promise-scheduler';

jest.mock('next/navigation', () => require('next-router-mock'));
jest.mock('react-turnstile', () => MockReactTurnstile);

describe('SignUpPage', () => {
  const siteKeyEnvVariable = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const scrollTo = window.scrollTo;
  let userContextValue: UserContextType;

  beforeEach(() => {
    userContextValue = Builder<UserContextType>()
      .user(null)
      .signUpWithEmail(jest.fn())
      .build();
    window.scrollTo = jest.fn();
  });

  afterEach(cleanup);

  afterAll(() => {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = siteKeyEnvVariable;
    window.scrollTo = scrollTo;
    jest.restoreAllMocks();
  });

  it(`renders an HTML form with input elements for name, email, confirm email 
  and avatar.`, () => {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY =
      CLOUDFLARE_TURNSTILE_DUMMY_SITE_KEYS.ALWAYS_PASSES;

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <SignUpPage />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    expect(screen.queryByRole('form')).toBeInTheDocument();
    expect(screen.queryByLabelText('Name*')).toBeInTheDocument();
    expect(screen.queryByLabelText('Email address*')).toBeInTheDocument();
    expect(
      screen.queryByLabelText('Re-enter email address*'),
    ).toBeInTheDocument();
    for (const avatar of AVATARS) {
      expect(screen.queryByAltText(avatar.altText)).toBeInTheDocument();
    }
  });

  it(`calls signUpWithEmail if all fields are valid and the form is 
  submitted.`, async () => {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY =
      CLOUDFLARE_TURNSTILE_DUMMY_SITE_KEYS.ALWAYS_PASSES;

    const user = userEvent.setup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <SignUpPage />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const name = screen.getByLabelText('Name*');
    await user.type(name, 'user');

    const email = screen.getByLabelText('Email address*');
    await user.type(email, 'user@example.com');

    const confirmEmail = screen.getByLabelText('Re-enter email address*');
    await user.type(confirmEmail, 'user@example.com');

    const avatar = screen.getByAltText(AVATARS[1].altText);
    await user.click(avatar);

    const submitButton = screen.getAllByText('Sign Up')[1];
    await user.click(submitButton);

    await waitFor(() =>
      expect(userContextValue.signUpWithEmail).toHaveBeenCalledWith({
        email: 'user@example.com',
        name: 'user',
        avatar: '1',
        type: UserType.Challenger,
        captchaToken: expect.any(String),
      }),
    );
  });

  it(`calls signUpWithEmail when the form is submitted via keyboard 
  input.`, async () => {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY =
      CLOUDFLARE_TURNSTILE_DUMMY_SITE_KEYS.ALWAYS_PASSES;

    const user = userEvent.setup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <SignUpPage />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const name = screen.getByLabelText('Name*');
    await user.type(name, 'user');

    const email = screen.getByLabelText('Email address*');
    await user.type(email, 'user@example.com');

    const confirmEmail = screen.getByLabelText('Re-enter email address*');
    await user.type(confirmEmail, 'user@example.com');

    const avatar = screen.getByAltText(AVATARS[1].altText);
    await user.click(avatar);

    await user.type(avatar, '{enter}');

    await waitFor(() =>
      expect(userContextValue.signUpWithEmail).toHaveBeenCalledWith({
        email: 'user@example.com',
        name: 'user',
        avatar: '1',
        type: UserType.Challenger,
        captchaToken: expect.any(String),
      }),
    );
  });

  it('does not call sendOTPToEmail() if isLoading is true.', async () => {
    const promiseScheduler = new PromiseScheduler();
    userContextValue = Builder<UserContextType>()
      .signUpWithEmail(
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
          <SignUpPage />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const name = screen.getByLabelText('Name*');
    await user.type(name, 'user');

    const email = screen.getByLabelText('Email address*');
    await user.type(email, 'user@example.com');

    const confirmEmail = screen.getByLabelText('Re-enter email address*');
    await user.type(confirmEmail, 'user@example.com');

    const avatar = screen.getByAltText(AVATARS[1].altText);
    await user.click(avatar);

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() =>
      expect(userContextValue.signUpWithEmail).toHaveBeenCalled(),
    );

    fireEvent.submit(form);
    fireEvent.submit(form);
    fireEvent.submit(form);

    expect(userContextValue.signUpWithEmail).toHaveBeenCalledTimes(1);
  });

  it(`focuses on the first non-valid input if the submit button is clicked while 
  the form is invalid.`, async () => {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY =
      CLOUDFLARE_TURNSTILE_DUMMY_SITE_KEYS.ALWAYS_PASSES;

    const user = userEvent.setup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <SignUpPage />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const name = screen.getByLabelText('Name*');
    const submitButton = screen.getAllByText('Sign Up')[1];
    await user.click(submitButton);
    await waitFor(() => {
      expect(document.activeElement).toBe(name);
    });
  });

  it(`scrolls to the Turnstile component if that is the only invalid 
  field.`, async () => {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY =
      CLOUDFLARE_TURNSTILE_DUMMY_SITE_KEYS.ALWAYS_BLOCKS;

    const user = userEvent.setup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <SignUpPage />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const name = screen.getByLabelText('Name*');
    await user.type(name, 'user');

    const email = screen.getByLabelText('Email address*');
    await user.type(email, 'user@example.com');

    const confirmEmail = screen.getByLabelText('Re-enter email address*');
    await user.type(confirmEmail, 'user@example.com');

    const submitButton = screen.getAllByText('Sign Up')[1];
    await user.click(submitButton);

    const turnstile = document.getElementById('turnstile-widget');

    await waitFor(() => {
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: turnstile?.offsetTop,
      });
    });
  });

  it('displays an error message if signUpWithEmail throws an error.', async () => {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY =
      CLOUDFLARE_TURNSTILE_DUMMY_SITE_KEYS.ALWAYS_PASSES;

    userContextValue = Builder<UserContextType>()
      .signUpWithEmail(() => {
        throw new Error();
      })
      .build();

    const user = userEvent.setup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <SignUpPage />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const name = screen.getByLabelText('Name*');
    await user.type(name, 'user');

    const email = screen.getByLabelText('Email address*');
    await user.type(email, 'user@example.com');

    const confirmEmail = screen.getByLabelText('Re-enter email address*');
    await user.type(confirmEmail, 'user@example.com');

    const submitButton = screen.getAllByText('Sign Up')[1];
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toBe(
        'Something went wrong. Please try again.',
      );
    });
  });
});
