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
import { RestartChallengeModal } from '@/contexts/user-context/restart-challenge-modal';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import {
  AlertsContext,
  type AlertsContextType,
} from '@/contexts/alerts-context';
import { User } from '@/model/types/user';
import { DateTime } from 'luxon';
import { ServerError } from '@/errors/server-error';
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';

jest.mock('@/app/progress/calculate-days-remaining');

const mockUser: User = Builder<User>()
  .uid('123')
  .challengeEndTimestamp(0)
  .build();

const mockRestartChallenge = jest.fn();
const mockShowAlert = jest.fn();

const renderWithContext = (user: User | null) => {
  const mockUserContextValue = Builder<UserContextType>()
    .user(user)
    .restartChallenge(mockRestartChallenge)
    .build();

  const mockAlertsContextValue = Builder<AlertsContextType>()
    .showAlert(mockShowAlert)
    .build();

  render(
    <AlertsContext.Provider value={mockAlertsContextValue}>
      <UserContext.Provider value={mockUserContextValue}>
        <RestartChallengeModal />
      </UserContext.Provider>
    </AlertsContext.Provider>,
  );
};

describe('RestartChallengeModal', () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
    mockDialogMethods();
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('should display the modal when user exists and challenge has ended.', () => {
    renderWithContext(mockUser);
    expect(screen.getByText(/Oops, times up!/i)).toBeInTheDocument();
  });

  it('should not display the modal when user does not exist.', () => {
    renderWithContext(null);
    expect(screen.queryByText(/Oops, times up!/i)).not.toBeInTheDocument();
  });

  it(`should call restartChallenge and show loading state when button is 
  clicked.`, async () => {
    renderWithContext(mockUser);

    fireEvent.click(screen.getByText(/Restart Challenge/i));
    expect(mockRestartChallenge).toHaveBeenCalled();

    expect(
      screen.getByText(/Restarting your challenge.../i),
    ).toBeInTheDocument();

    await waitFor(() =>
      expect(
        screen.queryByText(/Restarting your challenge.../i),
      ).not.toBeInTheDocument(),
    );
  });

  it('should show an alert if restartChallenge fails.', async () => {
    mockRestartChallenge.mockRejectedValueOnce(new Error('Failed'));
    renderWithContext(mockUser);
    fireEvent.click(screen.getByText(/Restart Challenge/i));
    await waitFor(() => expect(mockShowAlert).toHaveBeenCalled());
  });

  it(`stop loading and hide the modal when the challenge has been successfully 
  restarted.`, async () => {
    mockRestartChallenge.mockResolvedValueOnce(
      DateTime.now().plus({ days: 8 }).toMillis(),
    );

    renderWithContext(mockUser);

    fireEvent.click(screen.getByText(/Restart Challenge/i));
    await waitFor(() => expect(mockRestartChallenge).toHaveBeenCalled());

    expect(
      screen.queryByText(/Restarting your challenge.../i),
    ).not.toBeInTheDocument();
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });

  it('should show an alert when restarting the challenge fails.', async () => {
    mockRestartChallenge.mockRejectedValueOnce(new Error('Unknown error'));
    renderWithContext(mockUser);

    fireEvent.click(screen.getByText(/Restart Challenge/i));
    await waitFor(() =>
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Failed to restart the challenge. Please try again.',
        'error',
      ),
    );
  });
});
