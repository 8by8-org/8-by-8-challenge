import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MockReactTurnstile } from '@/testing-utils/mock-react-turnstile';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { Builder } from 'builder-pattern';
import SignInPage from '@/app/signin/page';
import { DummySiteKeys } from '@/constants/dummy-site-keys';

jest.mock('react-turnstile', () => MockReactTurnstile);

describe('SignInPage', () => {
  const siteKeyEnvVariable = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const scrollTo = window.scrollTo;
  let userContextValue: UserContextType;

  beforeEach(() => {
    userContextValue = Builder<UserContextType>()
      .signInWithEmail(jest.fn())
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
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = DummySiteKeys.ALWAYS_PASSES;

    render(
      <UserContext.Provider value={userContextValue}>
        <SignInPage />
      </UserContext.Provider>,
    );

    expect(screen.queryByRole('form')).toBeInTheDocument();
    expect(screen.queryByLabelText('Email address*')).toBeInTheDocument();
  });

  it('calls signInWithEmail if the form is valid.', async () => {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = DummySiteKeys.ALWAYS_PASSES;
    const user = userEvent.setup();
    render(
      <UserContext.Provider value={userContextValue}>
        <SignInPage />
      </UserContext.Provider>,
    );

    const email = screen.getByLabelText('Email address*');
    await user.type(email, 'user@example.com');

    const signInBtn = screen.getByText('Sign in');
    await user.click(signInBtn);

    await waitFor(() => {
      expect(userContextValue.signInWithEmail).toHaveBeenCalledWith({
        email: 'user@example.com',
        captchaToken: expect.any(String),
      });
    });
  });

  it('focuses on the email input if it is invalid when the form is submitted.', async () => {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = DummySiteKeys.ALWAYS_PASSES;
    const user = userEvent.setup();
    render(
      <UserContext.Provider value={userContextValue}>
        <SignInPage />
      </UserContext.Provider>,
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
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = DummySiteKeys.ALWAYS_BLOCKS;
    const user = userEvent.setup();
    render(
      <UserContext.Provider value={userContextValue}>
        <SignInPage />
      </UserContext.Provider>,
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

  it('displays an error message if signInWithEmail throws an error.', async () => {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = DummySiteKeys.ALWAYS_PASSES;
    userContextValue = Builder<UserContextType>()
      .signInWithEmail(() => {
        throw new Error();
      })
      .build();

    const user = userEvent.setup();
    render(
      <UserContext.Provider value={userContextValue}>
        <SignInPage />
      </UserContext.Provider>,
    );

    const email = screen.getByLabelText('Email address*');
    await user.type(email, 'user@example.com');

    const signInBtn = screen.getByText('Sign in');
    await user.click(signInBtn);

    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeInTheDocument();
    });
    expect(screen.getByRole('alert').textContent).toBe(
      'Something went wrong. Please try again.',
    );
  });
});
