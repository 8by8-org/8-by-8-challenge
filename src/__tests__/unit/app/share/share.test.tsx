import { Share } from '@/app/share/share';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { Builder } from 'builder-pattern';
import navigation from 'next/navigation';
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';
import { SearchParams } from '@/constants/search-params';
import { createId } from '@paralleldrive/cuid2';
import { AlertsContextProvider } from '@/contexts/alerts-context';
import { PromiseScheduler } from '@/utils/test/promise-scheduler';
import { mockShareAPI } from '@/utils/test/mock-share-api';
import { mockAnimate } from '@/utils/test/mock-animate';
import { UserType } from '@/model/enums/user-type';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { User } from '@/model/types/user';
import type { ChallengerData } from '@/model/types/challenger-data';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Share', () => {
  let router: AppRouterInstance;
  const host = 'https://challenge.8by8.us';
  const invitationLink = host + `/playerwelcome?${SearchParams.InviteCode}=`;

  beforeAll(() => {
    mockShareAPI();
    mockAnimate();
  });

  beforeEach(() => {
    router = Builder<AppRouterInstance>().back(jest.fn()).build();
    jest.spyOn(navigation, 'useRouter').mockImplementation(() => router);
    window.location.assign(host + '/share');
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
          <Share />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );
  });

  it(`should call shareChallenge and copy the user's invitation link when the 
  user clicks the copylink button.`, async () => {
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
          <Share />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    await user.click(screen.getByText(/copy link/i));
    expect(userContextValue.shareChallenge).toHaveBeenCalled();

    const copiedLink = await navigator.clipboard.readText();
    expect(copiedLink).toBe(invitationLink + inviteCode);
  });

  it(`should not call shareChallenge() if the user has already completed that 
  action when the copy link button is clicked, but it should still copy the 
  link.`, async () => {
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
          <Share />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    await user.click(screen.getByText(/copy link/i));
    expect(userContextValue.shareChallenge).not.toHaveBeenCalled();

    const copiedLink = await navigator.clipboard.readText();
    expect(copiedLink).toBe(invitationLink + inviteCode);
  });

  it('should display an alert if shareChallege() throws an error.', async () => {
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
          <Share />
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

  it('should not call shareChallenge() if the loading state is true.', async () => {
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
          <Share />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    for (let i = 0; i < 6; i++) {
      await user.click(screen.getByText(/copy link/i));
    }

    expect(userContextValue.shareChallenge).toHaveBeenCalledTimes(1);
  });

  it('should render the share button if the Share API is available in the browser.', async () => {
    const canShareSpy = jest
      .spyOn(navigator, 'canShare')
      .mockImplementation(() => true);

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
          <Share />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    expect(screen.queryByText('Share')).toBeInTheDocument();
    canShareSpy.mockRestore();
  });

  it(`should not render the button if the Share API is not available in the 
  browser.`, async () => {
    const canShareSpy = jest
      .spyOn(navigator, 'canShare')
      .mockImplementation(() => false);

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
          <Share />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    expect(screen.queryByText('Share')).not.toBeInTheDocument();
    canShareSpy.mockRestore();
  });

  it('should call the share function if the user clicks on the share button.', async () => {
    const canShareSpy = jest
      .spyOn(navigator, 'canShare')
      .mockImplementation(() => true);

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
          <Share />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    await user.click(screen.getByText(/Share/i));
    expect(userContextValue.shareChallenge).toHaveBeenCalled();
    canShareSpy.mockRestore();
  });

  it(`should not call the shareChallenge function if the loading state is true 
  when the share button is clicked.`, async () => {
    const canShareSpy = jest
      .spyOn(navigator, 'canShare')
      .mockImplementation(() => true);

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
          <Share />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    for (let i = 0; i < 6; i++) {
      await user.click(screen.getByText(/Share/i));
    }

    expect(userContextValue.shareChallenge).toHaveBeenCalledTimes(1);
    canShareSpy.mockRestore();
  });

  it('should display an alert if shareChallenge() fails.', async () => {
    const canShareSpy = jest
      .spyOn(navigator, 'canShare')
      .mockImplementation(() => true);

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
          <Share />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    expect(
      screen.queryByText(
        'Sorry there was an error awarding the badge, please try again later.',
      ),
    ).not.toBeInTheDocument();

    await user.click(screen.getByText(/Share/i));

    expect(
      screen.queryByText(
        'Sorry there was an error awarding the badge, please try again later.',
      ),
    ).toBeInTheDocument();

    canShareSpy.mockRestore();
  });

  it('should log an error to the console if share() fais.', async () => {
    const canShareSpy = jest
      .spyOn(navigator, 'canShare')
      .mockImplementation(() => true);

    const shareSpy = jest
      .spyOn(navigator, 'share')
      .mockImplementation(() => Promise.reject());

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(jest.fn());

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
          <Share />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    expect(consoleSpy).not.toHaveBeenCalled();
    await user.click(screen.getByText(/Share/i));
    expect(consoleSpy).toHaveBeenCalled();

    canShareSpy.mockRestore();
    shareSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  it('should call router.back() when the user clicks the back button.', async () => {
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
          <Share />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    await user.click(screen.getByText(/Back/i));
    expect(router.back).toHaveBeenCalled();
  });

  it('should display the Modal if the user clicks the image button.', async () => {
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
          <Share />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
    await user.click(screen.getByText(/Images for posts/i));
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  it('should close the Modal when the user clicks on the close button.', async () => {
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
          <Share />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    await user.click(screen.getByLabelText('close dialog'));
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });

  test(`The paragraph text it renders changes if the user has completed the 
  challenge.`, () => {
    const appUser = Builder<User>()
      .inviteCode(createId())
      .completedChallenge(true)
      .build();

    const userContextValue = Builder<UserContextType>()
      .user(appUser)
      .shareChallenge(jest.fn())
      .build();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <Share />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    expect(
      screen.queryByText('Invite friends to take the 8by8 Challenge!'),
    ).toBeInTheDocument();
  });

  test(`The paragraph text it renders changes if the user is player-type user 
  and invitedBy is not null.`, () => {
    const appUser = Builder<User>().type(UserType.Player).build();

    const invitedBy: ChallengerData = {
      challengerName: 'John Doe',
      challengerInviteCode: createId(),
      challengerAvatar: '0',
    };

    const userContextValue = Builder<UserContextType>()
      .user(appUser)
      .invitedBy(invitedBy)
      .shareChallenge(jest.fn())
      .build();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <Share />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    expect(
      screen.queryByText(
        `Invite friends to support ${invitedBy.challengerName}'s challenge by taking an action: register to vote, get election reminders, or take the 8by8 challenge.`,
      ),
    ).toBeInTheDocument();
  });
});
