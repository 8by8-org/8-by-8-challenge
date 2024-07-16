import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ClientSideUserContextProvider } from '@/contexts/user-context/client-side-user-context-provider';
import { UserContext } from '@/contexts/user-context';
import {
  AlertsContext,
  AlertsContextProvider,
} from '@/contexts/alerts-context';
import navigation from 'next/navigation';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserType } from '@/model/enums/user-type';
import { Builder } from 'builder-pattern';
import { DateTime } from 'luxon';
import type {
  SendOTPToEmailParams,
  SignInWithOTPParams,
  SignUpWithEmailParams,
} from '@/contexts/user-context/user-context';
import type { User } from '@/model/types/user';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { NextResponse } from 'next/server';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('ClientSideUserContextProvider', () => {
  let router: AppRouterInstance;
  let user: UserEvent;

  beforeEach(() => {
    router = Builder<AppRouterInstance>().push(jest.fn()).build();
    jest.spyOn(navigation, 'useRouter').mockImplementation(() => router);
    user = userEvent.setup();
  });

  afterEach(cleanup);

  it('provides the User it receives through props to consumers.', () => {
    let user: User | null = null;

    function Consumer() {
      const userContextValue = useContextSafely(UserContext, 'Consumer');

      user = userContextValue.user;

      return null;
    }

    const expectedUser: User = {
      uid: '1',
      email: 'user@example.com',
      name: 'user',
      avatar: '0',
      type: UserType.Challenger,
      completedActions: {
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      },
      challengeEndTimestamp: DateTime.now().plus({ days: 8 }).toUnixInteger(),
      badges: [],
      completedChallenge: false,
      contributedTo: [],
      inviteCode: 'invite-code',
    };

    render(
      <ClientSideUserContextProvider user={expectedUser} emailForSignIn="">
        <Consumer />
      </ClientSideUserContextProvider>,
    );

    expect(user).toEqual(expectedUser);
  });

  it(`makes a request to /api/signup-with-email when signUpWithEmail() is 
  called, and if the response is ok, it sets emailForSignIn and redirects the 
  user to /signin-with-otp.`, async () => {
    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 201 }));

    const signUpParams: SignUpWithEmailParams = {
      email: 'user@example.com',
      name: 'User',
      avatar: '0',
      type: UserType.Challenger,
      captchaToken: 'test-token',
    };

    function SignUp() {
      const { signUpWithEmail } = useContextSafely(UserContext, 'SignUp');

      return (
        <button
          onClick={() => {
            signUpWithEmail(signUpParams);
          }}
        >
          Sign Up
        </button>
      );
    }

    render(
      <ClientSideUserContextProvider user={null} emailForSignIn="">
        <SignUp />
      </ClientSideUserContextProvider>,
    );

    await user.click(screen.getByText('Sign Up'));

    await waitFor(() =>
      expect(fetchSpy).toHaveBeenCalledWith('/api/signup-with-email', {
        method: 'POST',
        body: JSON.stringify(signUpParams),
      }),
    );

    await waitFor(() =>
      expect(router.push).toHaveBeenCalledWith('/signin-with-otp'),
    );

    fetchSpy.mockRestore();
  });

  it(`makes a request to /api/signup-with-email when signUpWithEmail() is
  called and throws an error if the response is not ok.`, async () => {
    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 403 }));

    function SignUp() {
      const { signUpWithEmail } = useContextSafely(UserContext, 'SignUp');
      const { showAlert } = useContextSafely(AlertsContext, 'SignUp');

      return (
        <button
          onClick={async () => {
            try {
              await signUpWithEmail({
                email: 'user@example.com',
                name: 'User',
                avatar: '0',
                type: UserType.Challenger,
                captchaToken: 'test-token',
              });
            } catch (e) {
              showAlert('Error signing up.', 'error');
            }
          }}
        >
          Sign Up
        </button>
      );
    }

    render(
      <AlertsContextProvider>
        <ClientSideUserContextProvider user={null} emailForSignIn="">
          <SignUp />
        </ClientSideUserContextProvider>
      </AlertsContextProvider>,
    );

    await user.click(screen.getByText('Sign Up'));

    await waitFor(() => {
      const alert = screen.queryByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert?.textContent).toBe('Error signing up.');
    });

    fetchSpy.mockRestore();
  });

  it(`makes a request to /api/send-otp-to-email when sendOTPToEmail() is
  called, and if the response is ok, it sets emailForSignIn and redirects the
  user to /signin-with-otp.`, async () => {
    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 200 }));

    const sendOTPToEmailParams: SendOTPToEmailParams = {
      email: 'user@example.com',
      captchaToken: 'test-token',
    };

    function SignInWithEmail() {
      const { sendOTPToEmail } = useContextSafely(
        UserContext,
        'SignInWithEmail',
      );

      return (
        <button
          onClick={() => {
            sendOTPToEmail(sendOTPToEmailParams);
          }}
        >
          Sign in
        </button>
      );
    }

    render(
      <ClientSideUserContextProvider user={null} emailForSignIn="">
        <SignInWithEmail />
      </ClientSideUserContextProvider>,
    );

    await user.click(screen.getByText('Sign in'));

    await waitFor(() =>
      expect(fetchSpy).toHaveBeenCalledWith('/api/send-otp-to-email', {
        method: 'POST',
        body: JSON.stringify(sendOTPToEmailParams),
      }),
    );

    await waitFor(() =>
      expect(router.push).toHaveBeenCalledWith('/signin-with-otp'),
    );

    fetchSpy.mockRestore();
  });

  it(`makes a request to /api/send-otp-to-email when sendOTPToEmail() is
  called and throws an error if the response is not ok.`, async () => {
    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 403 }));

    function SignInWithEmail() {
      const { sendOTPToEmail } = useContextSafely(
        UserContext,
        'SignInWithEmail',
      );
      const { showAlert } = useContextSafely(AlertsContext, 'SignInWithEmail');

      return (
        <button
          onClick={async () => {
            try {
              await sendOTPToEmail({
                email: 'user@example.com',
                captchaToken: 'test-token',
              });
            } catch (e) {
              showAlert('Error signing in.', 'error');
            }
          }}
        >
          Sign in
        </button>
      );
    }

    render(
      <AlertsContextProvider>
        <ClientSideUserContextProvider user={null} emailForSignIn="">
          <SignInWithEmail />
        </ClientSideUserContextProvider>
      </AlertsContextProvider>,
    );

    await user.click(screen.getByText('Sign in'));

    await waitFor(() => {
      const alert = screen.queryByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert?.textContent).toBe('Error signing in.');
    });

    fetchSpy.mockRestore();
  });

  it(`makes a request to /api/resend-otp-to-email when resendOTP() is 
  called.`, async () => {
    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 200 }));

    const email = 'user@example.com';

    function ResendOTP() {
      const { resendOTP } = useContextSafely(UserContext, 'ResendOTP');

      return <button onClick={resendOTP}>Resend OTP</button>;
    }

    render(
      <ClientSideUserContextProvider user={null} emailForSignIn={email}>
        <ResendOTP />
      </ClientSideUserContextProvider>,
    );

    await user.click(screen.getByText('Resend OTP'));

    await waitFor(() =>
      expect(fetchSpy).toHaveBeenCalledWith('/api/resend-otp-to-email', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    );

    fetchSpy.mockRestore();
  });

  it(`makes a request to /api/resend-otp-to-email when resendOTP() is called and
  throws an error if the response is not ok.`, async () => {
    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 429 }));

    function ResendOTP() {
      const { resendOTP } = useContextSafely(UserContext, 'ResendOTP');
      const { showAlert } = useContextSafely(AlertsContext, 'ResendOTP');

      return (
        <button
          onClick={async () => {
            try {
              await resendOTP();
            } catch (e) {
              showAlert('Could not resend OTP.', 'error');
            }
          }}
        >
          Resend OTP
        </button>
      );
    }

    render(
      <AlertsContextProvider>
        <ClientSideUserContextProvider
          user={null}
          emailForSignIn="user@example.com"
        >
          <ResendOTP />
        </ClientSideUserContextProvider>
      </AlertsContextProvider>,
    );

    await user.click(screen.getByText('Resend OTP'));

    await waitFor(() => {
      const alert = screen.queryByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert?.textContent).toBe('Could not resend OTP.');
    });

    fetchSpy.mockRestore();
  });

  it(`makes a request to /api/signin-with-otp when signInWithOTP() is called,
  using the current value of emailForSignIn as the user's email address, and
  sets the user when the response is ok.`, async () => {
    const expectedUser: User = {
      uid: '1',
      email: 'user@example.com',
      name: 'user',
      avatar: '0',
      type: UserType.Challenger,
      completedActions: {
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      },
      challengeEndTimestamp: DateTime.now().plus({ days: 8 }).toUnixInteger(),
      badges: [],
      completedChallenge: false,
      contributedTo: [],
      inviteCode: 'invite-code',
    };

    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(
        NextResponse.json({ user: expectedUser }, { status: 200 }),
      );

    const otp = '123456';

    function SignInWithOTP() {
      const { user, signInWithOTP } = useContextSafely(
        UserContext,
        'SignInWithOTP',
      );

      return !user ?
          <button
            onClick={() => {
              signInWithOTP({ otp });
            }}
          >
            Sign in
          </button>
        : <h1>Welcome, {user.name}</h1>;
    }

    render(
      <ClientSideUserContextProvider
        user={null}
        emailForSignIn={expectedUser.email}
      >
        <SignInWithOTP />
      </ClientSideUserContextProvider>,
    );

    await user.click(screen.getByText('Sign in'));

    await waitFor(() =>
      expect(fetchSpy).toHaveBeenCalledWith('/api/signin-with-otp', {
        method: 'POST',
        body: JSON.stringify({ email: expectedUser.email, otp }),
      }),
    );

    await waitFor(() => {
      expect(
        screen.queryByText('Welcome, ' + expectedUser.name),
      ).toBeInTheDocument();
    });

    fetchSpy.mockRestore();
  });

  it(`makes a request to /api/signin-with-otp when signInWithOTP() is called,
  and throws an error if the response is not ok.`, async () => {
    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 403 }));

    function SignInWithOTP() {
      const { signInWithOTP } = useContextSafely(UserContext, 'SignInWithOTP');
      const { showAlert } = useContextSafely(AlertsContext, 'SignInWithOTP');

      return (
        <button
          onClick={async () => {
            try {
              await signInWithOTP({ otp: '123456' });
            } catch (e) {
              showAlert('Error signing in.', 'error');
            }
          }}
        >
          Sign in
        </button>
      );
    }

    render(
      <AlertsContextProvider>
        <ClientSideUserContextProvider
          user={null}
          emailForSignIn="user@example.com"
        >
          <SignInWithOTP />
        </ClientSideUserContextProvider>
      </AlertsContextProvider>,
    );

    await user.click(screen.getByText('Sign in'));

    await waitFor(() => {
      const alert = screen.queryByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert?.textContent).toBe('Error signing in.');
    });

    fetchSpy.mockRestore();
  });

  it(`makes a request to /api/signout when signOut() is called and sets the
  user to null if the response is ok.`, async () => {
    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 200 }));

    function SignOut() {
      const { user, signOut } = useContextSafely(UserContext, 'SignOut');

      return user ?
          <button onClick={signOut}>Sign out</button>
        : <p>Successfully signed out.</p>;
    }

    render(
      <ClientSideUserContextProvider
        user={{
          uid: '1',
          email: 'user@example.com',
          name: 'user',
          avatar: '0',
          type: UserType.Challenger,
          completedActions: {
            electionReminders: false,
            registerToVote: false,
            sharedChallenge: false,
          },
          challengeEndTimestamp: DateTime.now()
            .plus({ days: 8 })
            .toUnixInteger(),
          badges: [],
          completedChallenge: false,
          contributedTo: [],
          inviteCode: 'invite-code',
        }}
        emailForSignIn=""
      >
        <SignOut />
      </ClientSideUserContextProvider>,
    );

    await user.click(screen.getByText('Sign out'));

    await waitFor(() =>
      expect(fetchSpy).toHaveBeenCalledWith('/api/signout', {
        method: 'DELETE',
      }),
    );

    await waitFor(() => {
      expect(
        screen.queryByText('Successfully signed out.'),
      ).toBeInTheDocument();
    });

    fetchSpy.mockRestore();
  });

  it(`makes a request to /api/signout when signOut() is called and throws an
  error if the response is not ok.`, async () => {
    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 422 }));

    function SignOut() {
      const { signOut } = useContextSafely(UserContext, 'SignOut');
      const { showAlert } = useContextSafely(AlertsContext, 'SignOut');

      return (
        <button
          onClick={async () => {
            try {
              await signOut();
            } catch (e) {
              showAlert('Error signing out.', 'error');
            }
          }}
        >
          Sign out
        </button>
      );
    }

    render(
      <AlertsContextProvider>
        <ClientSideUserContextProvider
          user={null}
          emailForSignIn="user@example.com"
        >
          <SignOut />
        </ClientSideUserContextProvider>
      </AlertsContextProvider>,
    );

    await user.click(screen.getByText('Sign out'));

    await waitFor(() => {
      const alert = screen.queryByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert?.textContent).toBe('Error signing out.');
    });

    fetchSpy.mockRestore();
  });
});
