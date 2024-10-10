import '@testing-library/jest-dom';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { Share } from '@/app/share/share';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { Builder } from 'builder-pattern';
import navigation from 'next/navigation';
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';
import type { User } from '@/model/types/user';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { SearchParams } from '@/constants/search-params';
import { createId } from '@paralleldrive/cuid2';
import { AlertsContextProvider } from '@/contexts/alerts-context';
import { PromiseScheduler } from '@/utils/test/promise-scheduler';
import { mockShareAPI } from '@/utils/test/mock-share-api';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Share', () => {
  let router: AppRouterInstance;
  mockShareAPI();

  beforeEach(() => {
    router = Builder<AppRouterInstance>().back(jest.fn()).build();
    jest.spyOn(navigation, 'useRouter').mockImplementation(() => router);
    mockDialogMethods();
  });

  afterEach(cleanup);

  it('renders', () => {
    const user = Builder<User>().inviteCode('').build();
    const userContextValue = Builder<UserContextType>()
      .user(user)
      .shareChallenge(jest.fn())
      .build();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          {' '}
          <Share shareLink="test" />{' '}
        </UserContext.Provider>
      </AlertsContextProvider>,
    );
  });
  it("should call shareChallenge and copy the user's invitation link when the user clicks the copylink button. ", async () => {
    const shareLink = `https://challenge.8by8.us/share?${SearchParams.InviteCode}=`;
    const inviteCode = createId();
    const appUser = Builder<User>()
      .inviteCode(inviteCode)
      .completedActions({
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      })
      .build();
    const userContextValue = Builder<UserContextType>()
      .user(appUser)
      .shareChallenge(jest.fn())
      .build();
    const user = userEvent.setup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <Share shareLink={shareLink} />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );
    await user.click(screen.getByText(/copy link/i));
    expect(userContextValue.shareChallenge).toHaveBeenCalled();
    const copiedLink = await navigator.clipboard.readText();
    expect(copiedLink).toBe(shareLink + inviteCode);
  });
  it('should not award the user if the user clicks the copyLink button but it should copy the url link', async () => {
    const shareLink = `https://challenge.8by8.us/share?${SearchParams.InviteCode}=`;
    const inviteCode = createId();
    const appUser = Builder<User>()
      .inviteCode(inviteCode)
      .completedActions({
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: true,
      })
      .build();
    const userContextValue = Builder<UserContextType>()
      .user(appUser)
      .shareChallenge(jest.fn())
      .build();
    const user = userEvent.setup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <Share shareLink={shareLink} />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );
    await user.click(screen.getByText(/copy link/i));
    expect(userContextValue.shareChallenge).not.toHaveBeenCalled();
    const copiedLink = await navigator.clipboard.readText();
    expect(copiedLink).toBe(shareLink + inviteCode);
  });

  it('should display an alert if shareChallege throws an error', async () => {
    const shareLink = `https://challenge.8by8.us/share?${SearchParams.InviteCode}=`;
    const inviteCode = createId();
    const appUser = Builder<User>()
      .inviteCode(inviteCode)
      .completedActions({
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      })
      .build();
    const userContextValue = Builder<UserContextType>()
      .user(appUser)
      .shareChallenge(() => Promise.reject())
      .build();
    const user = userEvent.setup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <Share shareLink={shareLink} />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );
    expect(
      screen.queryByText(
        'Sorry there was an error awarding the badge, please try again later.',
      ),
    ).not.toBeInTheDocument();
    await user.click(screen.getByText(/copy link/i));
    expect(
      screen.queryByText(
        'Sorry there was an error awarding the badge, please try again later.',
      ),
    ).toBeInTheDocument();
  });

  it('should not call shareChallenge if the loading state is true', async () => {
    const shareLink = `https://challenge.8by8.us/share?${SearchParams.InviteCode}=`;
    const inviteCode = createId();
    const appUser = Builder<User>()
      .inviteCode(inviteCode)
      .completedActions({
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      })
      .build();
    const promiseScheduler = new PromiseScheduler();
    const userContextValue = Builder<UserContextType>()
      .user(appUser)
      .shareChallenge(
        jest
          .fn()
          .mockImplementation(() =>
            promiseScheduler.createScheduledPromise(undefined),
          ),
      )
      .build();
    const user = userEvent.setup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <Share shareLink={shareLink} />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );
    for (let i = 0; i < 6; i++) {
      await user.click(screen.getByText(/copy link/i));
    }
    expect(userContextValue.shareChallenge).toHaveBeenCalledTimes(1);
  });

  it('should render the button if the shareAPi is available in the browser', async () => {
    const canShareSpy = jest
      .spyOn(navigator, 'canShare')
      .mockImplementation(() => true);
    const shareLink = `https://challenge.8by8.us/share?${SearchParams.InviteCode}=`;
    const inviteCode = createId();
    const appUser = Builder<User>()
      .inviteCode(inviteCode)
      .completedActions({
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      })
      .build();
    const promiseScheduler = new PromiseScheduler();
    const userContextValue = Builder<UserContextType>()
      .user(appUser)
      .shareChallenge(
        jest
          .fn()
          .mockImplementation(() =>
            promiseScheduler.createScheduledPromise(undefined),
          ),
      )
      .build();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <Share shareLink={shareLink} />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );
    expect(screen.queryByText('Share via')).toBeInTheDocument();
    canShareSpy.mockRestore();
  });
  it('should not render the button if the shareAPI is not available in the browser', async () => {
    const canShareSpy = jest
      .spyOn(navigator, 'canShare')
      .mockImplementation(() => false);
    const shareLink = `https://challenge.8by8.us/share?${SearchParams.InviteCode}=`;
    const inviteCode = createId();
    const appUser = Builder<User>()
      .inviteCode(inviteCode)
      .completedActions({
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      })
      .build();
    const promiseScheduler = new PromiseScheduler();
    const userContextValue = Builder<UserContextType>()
      .user(appUser)
      .shareChallenge(
        jest
          .fn()
          .mockImplementation(() =>
            promiseScheduler.createScheduledPromise(undefined),
          ),
      )
      .build();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <Share shareLink={shareLink} />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );
    expect(screen.queryByText('Share via')).not.toBeInTheDocument();
    canShareSpy.mockRestore();
  });

  it('should call the share function if the user clicks on the share button', async () => {
    const canShareSpy = jest
      .spyOn(navigator, 'canShare')
      .mockImplementation(() => true);
    const shareLink = `https://challenge.8by8.us/share?${SearchParams.InviteCode}=`;
    const inviteCode = createId();
    const appUser = Builder<User>()
      .inviteCode(inviteCode)
      .completedActions({
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      })
      .build();
    const userContextValue = Builder<UserContextType>()
      .user(appUser)
      .shareChallenge(jest.fn())
      .build();
    const user = userEvent.setup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <Share shareLink={shareLink} />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );
    await user.click(screen.getByText(/Share via/i));
    expect(userContextValue.shareChallenge).toHaveBeenCalled();
    canShareSpy.mockRestore();
  });

  it('should not call the shareChallenge function if the loading state is true', async () => {
    const canShareSpy = jest
      .spyOn(navigator, 'canShare')
      .mockImplementation(() => true);
    const shareLink = `https://challenge.8by8.us/share?${SearchParams.InviteCode}=`;
    const inviteCode = createId();
    const appUser = Builder<User>()
      .inviteCode(inviteCode)
      .completedActions({
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      })
      .build();
    const promiseScheduler = new PromiseScheduler();
    const userContextValue = Builder<UserContextType>()
      .user(appUser)
      .shareChallenge(
        jest
          .fn()
          .mockImplementation(() =>
            promiseScheduler.createScheduledPromise(undefined),
          ),
      )
      .build();
    const user = userEvent.setup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <Share shareLink={shareLink} />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );
    for (let i = 0; i < 6; i++) {
      await user.click(screen.getByText(/Share via/i));
    }
    expect(userContextValue.shareChallenge).toHaveBeenCalledTimes(1);
    canShareSpy.mockRestore();
  });

  it('should render the alerts if the shareChallenge fails', async () => {
    const canShareSpy = jest
      .spyOn(navigator, 'canShare')
      .mockImplementation(() => true);
    const shareLink = `https://challenge.8by8.us/share?${SearchParams.InviteCode}=`;
    const inviteCode = createId();
    const appUser = Builder<User>()
      .inviteCode(inviteCode)
      .completedActions({
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      })
      .build();
    const userContextValue = Builder<UserContextType>()
      .user(appUser)
      .shareChallenge(jest.fn().mockImplementation(() => Promise.reject()))
      .build();
    const user = userEvent.setup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <Share shareLink={shareLink} />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );
    expect(
      screen.queryByText(
        'Sorry there was an error awarding the badge, please try again later.',
      ),
    ).not.toBeInTheDocument();
    await user.click(screen.getByText(/Share via/i));
    expect(
      screen.queryByText(
        'Sorry there was an error awarding the badge, please try again later.',
      ),
    ).toBeInTheDocument();
    canShareSpy.mockRestore();
  });

  it('should console.error if the navigator.share fails ', async () => {
    const canShareSpy = jest
      .spyOn(navigator, 'canShare')
      .mockImplementation(() => true);
    const shareSpy = jest
      .spyOn(navigator, 'share')
      .mockImplementation(() => Promise.reject());
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(jest.fn());
    const shareLink = `https://challenge.8by8.us/share?${SearchParams.InviteCode}=`;
    const inviteCode = createId();
    const appUser = Builder<User>()
      .inviteCode(inviteCode)
      .completedActions({
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: true,
      })
      .build();
    const userContextValue = Builder<UserContextType>()
      .user(appUser)
      .shareChallenge(() => Promise.resolve())
      .build();
    const user = userEvent.setup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <Share shareLink={shareLink} />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );
    expect(consoleSpy).not.toHaveBeenCalled();
    await user.click(screen.getByText(/Share via/i));
    expect(consoleSpy).toHaveBeenCalled();
    canShareSpy.mockRestore();
    shareSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  it('should call router.back function when the user clicks the back button', async () => {
    const shareLink = `https://challenge.8by8.us/share?${SearchParams.InviteCode}=`;
    const inviteCode = createId();
    const appUser = Builder<User>()
      .inviteCode(inviteCode)
      .completedActions({
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      })
      .build();
    const userContextValue = Builder<UserContextType>()
      .user(appUser)
      .shareChallenge(jest.fn())
      .build();
    const user = userEvent.setup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <Share shareLink={shareLink} />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );
    await user.click(screen.getByText(/Back/i));
    expect(router.back).toHaveBeenCalled();
  });

  it('should display the Modal if the user clicks the image button', async () => {
    const shareLink = `https://challenge.8by8.us/share?${SearchParams.InviteCode}=`;
    const inviteCode = createId();
    const appUser = Builder<User>()
      .inviteCode(inviteCode)
      .completedActions({
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      })
      .build();
    const userContextValue = Builder<UserContextType>()
      .user(appUser)
      .shareChallenge(jest.fn())
      .build();
    const user = userEvent.setup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <Share shareLink={shareLink} />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );
    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
    await user.click(screen.getByText(/Images for posts/i));
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  it('should close the Modal when the user clicks on the close button', async () => {
    const shareLink = `https://challenge.8by8.us/share?${SearchParams.InviteCode}=`;
    const inviteCode = createId();
    const appUser = Builder<User>()
      .inviteCode(inviteCode)
      .completedActions({
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      })
      .build();
    const userContextValue = Builder<UserContextType>()
      .user(appUser)
      .shareChallenge(jest.fn())
      .build();
    const user = userEvent.setup();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <Share shareLink={shareLink} />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );
    await user.click(screen.getByLabelText('close dialog'));
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });
});
