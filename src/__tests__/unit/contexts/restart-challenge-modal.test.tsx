import {
  render,
  screen,
  cleanup,
  waitFor,
  fireEvent,
  act,
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
import { calculateDaysRemaining } from '@/app/progress/calculate-days-remaining';
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

  it('should display the modal when user exists and challenge has ended', () => {
    renderWithContext(mockUser);
    expect(screen.getByText(/Oops, times up!/i)).toBeInTheDocument();
  });

  it('should not display the modal when user does not exist', () => {
    renderWithContext(null);
    expect(screen.queryByText(/Oops, times up!/i)).not.toBeInTheDocument();
  });

  it('should call restartChallenge and show loading state when button is clicked', async () => {
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

  it('should show an alert if restartChallenge fails', async () => {
    mockRestartChallenge.mockRejectedValueOnce(new Error('Failed'));
    renderWithContext(mockUser);
    fireEvent.click(screen.getByText(/Restart Challenge/i));
    await waitFor(() => expect(mockShowAlert).toHaveBeenCalled());
  });

  it('should return a status code of 200 and the new challenge end timestamp if the challenge was successfully restarted', async () => {
    mockRestartChallenge.mockResolvedValueOnce(
      DateTime.now().plus({ days: 8 }).toMillis(),
    );
    renderWithContext(mockUser);
    fireEvent.click(screen.getByText(/Restart Challenge/i));
    await waitFor(() => expect(mockRestartChallenge).toHaveBeenCalled());
    expect(
      screen.queryByText(/Restarting your challenge.../i),
    ).not.toBeInTheDocument();
  });

  it('should return a status code of 400 and the error message if a ServerError is thrown', async () => {
    mockRestartChallenge.mockRejectedValueOnce(
      new ServerError('User not found', 400),
    );
    renderWithContext(mockUser);
    fireEvent.click(screen.getByText(/Restart Challenge/i));
    await waitFor(() =>
      expect(mockShowAlert).toHaveBeenCalledWith(
        'Failed to restart the challenge. Please try again.',
        'error',
      ),
    );
  });

  it('should return a status code of 500 and a generic error message if an unknown error is thrown', async () => {
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
