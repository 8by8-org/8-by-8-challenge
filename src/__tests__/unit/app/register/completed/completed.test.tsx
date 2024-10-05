import { RegistrationCompleted } from '@/app/register/completed/completed';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { AlertsContextProvider } from '@/contexts/alerts-context';
import { Builder } from 'builder-pattern';
import { UserType } from '@/model/enums/user-type';
import type { User } from '@/model/types/user';

describe('RegistrationCompleted', () => {
  afterEach(cleanup);

  it('renders a link to /actions if the user is a player-type user.', () => {
    render(
      <AlertsContextProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(Builder<User>().type(UserType.Player).build())
            .build()}
        >
          <RegistrationCompleted pdfUrl="" />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const link = screen.getByText('Go to actions');
    expect(link.getAttribute('href')).toBe('/actions');
  });

  it('renders a link to /progress if the user is a challenger.', () => {
    render(
      <AlertsContextProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(Builder<User>().type(UserType.Challenger).build())
            .build()}
        >
          <RegistrationCompleted pdfUrl="" />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const link = screen.getByText('Go to 8by8 challenge');
    expect(link.getAttribute('href')).toBe('/progress');
  });

  it('renders a link to /progress if the user is a hybrid-type user.', () => {
    render(
      <AlertsContextProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(Builder<User>().type(UserType.Hybrid).build())
            .build()}
        >
          <RegistrationCompleted pdfUrl="" />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const link = screen.getByText('Go to 8by8 challenge');
    expect(link.getAttribute('href')).toBe('/progress');
  });

  it(`opens the pdfUrl in a new tab if pdfUrl is not an empty string and the 
  View PDF button is clicked.`, async () => {
    const windowSpy = jest.spyOn(window, 'open').mockImplementation(jest.fn());
    const user = userEvent.setup();
    const pdfUrl = 'test';

    render(
      <AlertsContextProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(Builder<User>().type(UserType.Challenger).build())
            .build()}
        >
          <RegistrationCompleted pdfUrl={pdfUrl} />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    await user.click(screen.getByText(/view pdf/i));
    expect(windowSpy).toHaveBeenCalledWith(pdfUrl, '_blank');
    windowSpy.mockRestore();
  });

  it(`displays an alert when the PDF URL could not be loaded.`, async () => {
    render(
      <AlertsContextProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(Builder<User>().type(UserType.Challenger).build())
            .build()}
        >
          <RegistrationCompleted pdfUrl="" />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    await screen.findByText(
      "Oops! We couldn't retrieve your PDF. Please try again later.",
    );
  });

  it('renders a disabled View PDF button when the PDF URL could not be loaded.', () => {
    render(
      <AlertsContextProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(Builder<User>().type(UserType.Challenger).build())
            .build()}
        >
          <RegistrationCompleted pdfUrl="" />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    const viewPDF = screen.getByRole('button') as HTMLButtonElement;
    expect(viewPDF.disabled).toBe(true);
  });
});
