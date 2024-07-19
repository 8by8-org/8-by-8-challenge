import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useCountdown } from '@/hooks/use-countdown';

describe('useCountdown', () => {
  let clearIntervalSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    clearIntervalSpy = jest.spyOn(global, 'clearInterval');
  });

  afterEach(() => {
    /*
      cleanup() must be called before restoring real timers so that 
      clearInterval is still defined in the clean up function returned by 
      the useEffect call within useCountdown().
    */
    cleanup();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it(`returns a counter that counts down, stopping at 0.`, async () => {
    function TestComponent() {
      const { countdown } = useCountdown(2);

      return (
        <>
          <p>{countdown}</p>
        </>
      );
    }

    render(<TestComponent />);
    await waitFor(() => expect(screen.queryByText(2)).toBeInTheDocument());

    act(() => jest.advanceTimersByTime(1000));
    await waitFor(() => expect(screen.queryByText(1)).toBeInTheDocument());

    act(() => jest.advanceTimersByTime(1000));
    await waitFor(() => expect(screen.queryByText(0)).toBeInTheDocument());

    act(() => jest.advanceTimersByTime(2000));
    await waitFor(() => {
      expect(screen.queryByText(0)).toBeInTheDocument();
    });
  });

  it(`returns a function that clears the current interval and restarts the 
  countdown.`, async () => {
    function TestComponent() {
      const { countdown, restartCountdown } = useCountdown(2);

      return (
        <>
          <p>{countdown}</p>
          <button onClick={restartCountdown}>Restart countdown</button>
        </>
      );
    }

    const user = userEvent.setup({ delay: null });
    render(<TestComponent />);
    act(() => jest.advanceTimersByTime(1000));
    await waitFor(() => expect(screen.queryByText(1)).toBeInTheDocument());

    user.click(screen.getByText('Restart countdown'));
    await waitFor(() => expect(screen.queryByText(2)).toBeInTheDocument());
    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(1000));
    await waitFor(() => expect(screen.queryByText(1)).toBeInTheDocument());

    act(() => jest.advanceTimersByTime(1000));
    await waitFor(() => expect(screen.queryByText(0)).toBeInTheDocument());
  });
});
