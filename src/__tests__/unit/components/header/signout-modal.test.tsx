import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {
  HeaderContext,
  type HeaderContextType,
} from '@/components/header/header-context';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { AlertsContextProvider } from '@/contexts/alerts-context';
import { Builder } from 'builder-pattern';
import { SignoutModal } from '@/components/header/signout-modal';
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';
import { PromiseScheduler } from '@/utils/test/promise-scheduler';

describe('SignoutModal', () => {
  mockDialogMethods();

  let headerContextValue: HeaderContextType;
  let userContextValue: UserContextType;
  let user: UserEvent;

  beforeEach(() => {
    headerContextValue = Builder<HeaderContextType>()
      .isSignoutModalShown(true)
      .closeSignoutModal(jest.fn())
      .build();

    userContextValue = Builder<UserContextType>().signOut(jest.fn()).build();

    user = userEvent.setup();
  });

  afterEach(cleanup);

  it(`calls the signOut method of UserContext when the sign out button is
  clicked.`, async () => {
    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <HeaderContext.Provider value={headerContextValue}>
            <SignoutModal />
          </HeaderContext.Provider>
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const signoutBtn = screen.getByText("Yes, but I'll be back");
    await user.click(signoutBtn);

    expect(userContextValue.signOut).toHaveBeenCalled();
  });

  it('closes itself after the signOut button is clicked.', async () => {
    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <HeaderContext.Provider value={headerContextValue}>
            <SignoutModal />
          </HeaderContext.Provider>
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const signoutBtn = screen.getByText("Yes, but I'll be back");
    await user.click(signoutBtn);

    expect(headerContextValue.closeSignoutModal).toHaveBeenCalled();
  });

  it(`displays the text 'Signing out...' while the Promise returned by signOut
  is pending.`, async () => {
    const promiseScheduler = new PromiseScheduler();

    userContextValue.signOut = () =>
      promiseScheduler.createScheduledPromise<void>(undefined);

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <HeaderContext.Provider value={headerContextValue}>
            <SignoutModal />
          </HeaderContext.Provider>
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const signoutBtn = screen.getByText("Yes, but I'll be back");
    await user.click(signoutBtn);
    await waitFor(() =>
      expect(screen.queryByText('Signing out...')).toBeInTheDocument(),
    );

    promiseScheduler.resolveAll();
    await waitFor(() =>
      expect(screen.queryByText('Signing out...')).not.toBeInTheDocument(),
    );
  });

  it('displays an error message is signOut fails.', async () => {
    userContextValue.signOut = () => {
      throw new Error('There was a problem signing out.');
    };

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <HeaderContext.Provider value={headerContextValue}>
            <SignoutModal />
          </HeaderContext.Provider>
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const signoutBtn = screen.getByText("Yes, but I'll be back");
    await user.click(signoutBtn);

    await waitFor(() =>
      expect(screen.queryByRole('alert')).toBeInTheDocument(),
    );

    expect(screen.getByRole('alert').textContent).toBe(
      'There was a problem signing out.',
    );
  });

  it(`closes itself when "No, I think I'll stay" is clicked.`, async () => {
    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <HeaderContext.Provider value={headerContextValue}>
            <SignoutModal />
          </HeaderContext.Provider>
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const cancelBtn = screen.getByText("No, I think I'll stay");
    await user.click(cancelBtn);

    expect(headerContextValue.closeSignoutModal).toHaveBeenCalled();
  });

  it('can be closed if not signing out.', async () => {
    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <HeaderContext.Provider value={headerContextValue}>
            <SignoutModal />
          </HeaderContext.Provider>
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const closeBtn = screen.getByLabelText('close dialog');
    await user.click(closeBtn);

    expect(headerContextValue.closeSignoutModal).toHaveBeenCalled();
  });

  it('cannot be closed while signing out.', async () => {
    const promiseScheduler = new PromiseScheduler();

    userContextValue.signOut = () =>
      promiseScheduler.createScheduledPromise<void>(undefined);

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <HeaderContext.Provider value={headerContextValue}>
            <SignoutModal />
          </HeaderContext.Provider>
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const signoutBtn = screen.getByText("Yes, but I'll be back");
    await user.click(signoutBtn);

    const closeBtn = screen.getByLabelText('close dialog');
    await user.click(closeBtn);

    expect(headerContextValue.closeSignoutModal).not.toHaveBeenCalled();
  });
});
