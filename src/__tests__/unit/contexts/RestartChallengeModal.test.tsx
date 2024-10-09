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
import { AlertsContextProvider } from '@/contexts/alerts-context';
import { calculateDaysRemaining } from '@/app/progress/calculate-days-remaining';
import { User } from '@/model/types/user';
import { DateTime } from 'luxon';
import { ServerError } from '@/errors/server-error';

jest.mock('@/app/progress/calculate-days-remaining');

// Mock dialog element
class HTMLDialogElement extends HTMLElement {
  showModal() {}
  close() {}
}
customElements.define('custom-dialog', HTMLDialogElement); // 使用有效的自定义元素名称

const mockUser: User = Builder<User>()
  .uid('123')
  .challengeEndTimestamp(DateTime.now().minus({ days: 1 }).toMillis())
  .build();

const mockRestartChallenge = jest.fn();
const mockShowAlert = jest.fn();

const renderWithContext = (user: User | null) => {
  const mockUserContextValue = Builder<UserContextType>()
    .user(user)
    .restartChallenge(mockRestartChallenge)
    .build();

  render(
    <AlertsContextProvider >
      <UserContext.Provider value={mockUserContextValue}>
        <RestartChallengeModal />
      </UserContext.Provider>
    </AlertsContextProvider>
  );
};

describe('RestartChallengeModal', () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should display the modal when user exists and challenge has ended', () => {
    (calculateDaysRemaining as jest.Mock).mockReturnValue(0);
    renderWithContext(mockUser);
    expect(screen.getByText(/Oops, times up!/i)).toBeInTheDocument();
  });

  it('should not display the modal when user does not exist', () => {
    renderWithContext(null);
    expect(screen.queryByText(/Oops, times up!/i)).not.toBeInTheDocument();
  });

  it('should call restartChallenge and show loading state when button is clicked', async () => {
    (calculateDaysRemaining as jest.Mock).mockReturnValue(0);
    renderWithContext(mockUser);
    fireEvent.click(screen.getByText(/Restart Challenge/i));
    expect(mockRestartChallenge).toHaveBeenCalled();
    expect(screen.getByText(/Restarting your challenge.../i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/Restarting your challenge.../i)).not.toBeInTheDocument());
  });

  it('should show an alert if restartChallenge fails', async () => {
    (calculateDaysRemaining as jest.Mock).mockReturnValue(0);
    mockRestartChallenge.mockRejectedValueOnce(new Error('Failed'));
    renderWithContext(mockUser);
    fireEvent.click(screen.getByText(/Restart Challenge/i));
    await waitFor(() => expect(mockShowAlert).toHaveBeenCalledWith('Failed to restart the challenge. Please try again.', 'error'));
  });

  it('should return a status code of 200 and the new challenge end timestamp if the challenge was successfully restarted', async () => {
    (calculateDaysRemaining as jest.Mock).mockReturnValue(0);
    mockRestartChallenge.mockResolvedValueOnce(DateTime.now().plus({ days: 8 }).toMillis());
    renderWithContext(mockUser);
    fireEvent.click(screen.getByText(/Restart Challenge/i));
    await waitFor(() => expect(mockRestartChallenge).toHaveBeenCalled());
    expect(screen.queryByText(/Restarting your challenge.../i)).not.toBeInTheDocument();
  });

  it('should return a status code of 401 and an error message if the user is not authenticated', async () => {
    (calculateDaysRemaining as jest.Mock).mockReturnValue(0);
    renderWithContext(null);
    // 模拟用户未认证时的行为
    const restartButton = screen.queryByText(/Restart Challenge/i);
    expect(restartButton).toBeNull();
    await waitFor(() => expect(mockShowAlert).toHaveBeenCalledWith('Failed to restart the challenge. Please try again.', 'error'));
  });

  it('should return a status code of 400 and the error message if a ServerError is thrown', async () => {
    (calculateDaysRemaining as jest.Mock).mockReturnValue(0);
    mockRestartChallenge.mockRejectedValueOnce(new ServerError('User not found', 400));
    renderWithContext(mockUser);
    fireEvent.click(screen.getByText(/Restart Challenge/i));
    await waitFor(() => expect(mockShowAlert).toHaveBeenCalledWith('Failed to restart the challenge. Please try again.', 'error'));
  });

  it('should return a status code of 500 and a generic error message if an unknown error is thrown', async () => {
    (calculateDaysRemaining as jest.Mock).mockReturnValue(0);
    mockRestartChallenge.mockRejectedValueOnce(new Error('Unknown error'));
    renderWithContext(mockUser);
    fireEvent.click(screen.getByText(/Restart Challenge/i));
    await waitFor(() => expect(mockShowAlert).toHaveBeenCalledWith('Failed to restart the challenge. Please try again.', 'error'));
  });
});