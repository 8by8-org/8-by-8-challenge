'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ProgressIndicatorSVG } from './svg/progress-indicator-svg';
import { ProgressBarContextProvider } from './progress-bar-context';
import { getProgressPercent } from './get-progress-percent';

export function ProgressBar() {
  const pathname = usePathname();
  const [progressPercent, setProgressPercent] = useState(
    getProgressPercent(pathname),
  );

  useEffect(() => {
    setProgressPercent(getProgressPercent(pathname));
  }, [pathname]);

  return (
    <ProgressBarContextProvider progressPercent={progressPercent}>
      <ProgressIndicatorSVG />
    </ProgressBarContextProvider>
  );
}
