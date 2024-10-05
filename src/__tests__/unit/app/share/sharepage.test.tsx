import '@testing-library/jest-dom';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import SharePage from '@/app/share/share';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { Builder } from 'builder-pattern';
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';
import type { User } from '@/model/types/user';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { SearchParams } from '@/constants/search-params';
import { createId } from '@paralleldrive/cuid2';
import { AlertsContextProvider } from '@/contexts/alerts-context';

jest.mock('next/navigation', () => require('next-router-mock'));

describe('SharePage', () => {
  beforeAll(() => {
    mockDialogMethods();

    Object.defineProperty(navigator, 'share', {
      value: jest.fn(),
      writable: true,
    });
    Object.defineProperty(navigator, 'canShare', {
      value: jest.fn(),
      writable: true,
    });
  });
  afterEach(cleanup);

  it('renders a heading', () => {
    const user = Builder<User>().inviteCode('').build();
    const userContextValue = Builder<UserContextType>()
      .user(user)
      .shareChallenge(jest.fn())
      .build();
    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          {' '}
          <SharePage shareLink="test" />{' '}
        </UserContext.Provider>
        ,
      </AlertsContextProvider>,
    );
    expect(screen.getAllByText(/invite friends/i).length).toBeGreaterThan(0);
  });

  it('should copy the link if the user clicks on the copylink button', async () => {
    const sharelink = `https://challenge.8by8.us/share?${SearchParams.InviteCode}=`;
    const inviteCode = createId();
    const user = userEvent.setup();
    const userContextValue = Builder<UserContextType>()
      .user(Builder<User>().inviteCode(inviteCode).build())
      .shareChallenge(jest.fn())
      .build();
    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          {' '}
          <SharePage shareLink={sharelink} />{' '}
        </UserContext.Provider>
        ,
      </AlertsContextProvider>,
    );
    const copyLinkbutton = screen.getByAltText('copy-link');
    await user.click(copyLinkbutton);
    const copiedLink = await navigator.clipboard.readText();
    console.log(copiedLink);
    expect(copiedLink).toBe(sharelink + inviteCode);
  });

  it('displays an error when the shareChallenge function is not called', async () => {
    const sharelink = `https://challenge.8by8.us/share?${SearchParams.InviteCode}=`;
    const inviteCode = createId();
    const user = userEvent.setup();
    const userContextValue = Builder<UserContextType>()
      .user(Builder<User>().inviteCode(inviteCode).build())
      .shareChallenge(() => {
        throw new Error();
      })
      .build();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          {' '}
          <SharePage shareLink={sharelink} />{' '}
        </UserContext.Provider>
      </AlertsContextProvider>,
    );
    const copyLinkbutton = screen.getByAltText('copy-link');
    await user.click(copyLinkbutton);
    waitFor(() => {
      expect(screen.getByRole('alert').textContent).toBe(
        'Failed to copy link or share challenge',
      );
    });
  });

  // should check if the handleShare button is rendered
  it('should render the share button if the Share API is available in the browser', async () => {
    jest.spyOn(navigator, 'share').mockImplementation(jest.fn());
    jest.spyOn(navigator, 'canShare').mockImplementation(() => true);

    const sharelink = `https://challenge.8by8.us/share?${SearchParams.InviteCode}=`;
    const inviteCode = createId();

    const userContextValue = Builder<UserContextType>()
      .user(Builder<User>().inviteCode(inviteCode).build())
      .shareChallenge(jest.fn())
      .build();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <SharePage shareLink={sharelink} />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    // Check if the share button is rendered automatically
    const shareButton = await screen.findByTestId('share-button');
    expect(shareButton).toBeInTheDocument();
  });
});
