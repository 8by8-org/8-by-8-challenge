import { useEffect, useRef, useState } from 'react';
import { DateTime } from 'luxon';

export function useCountdown(seconds: number) {
  const [millisFromCountdownStart, setMillisFromCountdownStart] = useState(
    DateTime.now().plus({ seconds }).toMillis(),
  );
  const [countdown, setCountdown] = useState(seconds);
  const interval = useRef<ReturnType<typeof setInterval> | null>();

  useEffect(() => {
    if (interval.current) {
      clearInterval(interval.current);
    }

    interval.current = setInterval(() => {
      const secondsLeft = calculateDifferenceInSeconds(
        millisFromCountdownStart,
      );
      if (secondsLeft === 0 && interval.current)
        clearInterval(interval.current);

      setCountdown(secondsLeft);
    }, 1000);

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [millisFromCountdownStart]);

  const restartCountdown = () => {
    setCountdown(seconds);
    setMillisFromCountdownStart(DateTime.now().plus({ seconds }).toMillis());
  };

  return { countdown, restartCountdown };
}

function calculateDifferenceInSeconds(millis: number) {
  const now = DateTime.now().toMillis();
  const difference = Math.ceil((millis - now) / 1000);

  return Math.max(difference, 0);
}
