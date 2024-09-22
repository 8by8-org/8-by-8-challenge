import { useEffect, useRef, useState } from 'react';
import { ProgressBarContext } from '../progress-bar-context';
import { calculateColorStopOffset } from './util/calculate-color-stop-offset';
import { useContextSafely } from '@/hooks/use-context-safely';

interface AnimatedColorStopProps {
  color: string;
}

interface AnimatedColorStopState {
  offset: number;
  animationValues: string;
  willAnimate: boolean;
}

export function AnimatedColorStop({ color }: AnimatedColorStopProps) {
  const progressBarCtx = useContextSafely(
    ProgressBarContext,
    'AnimatedColorStop',
  );
  const progressBarState = progressBarCtx;

  const animateTagRef = useRef<SVGElement>(null);

  const [state, setState] = useState<AnimatedColorStopState>({
    offset: calculateColorStopOffset(progressBarState.progressPercent),
    animationValues: `${calculateColorStopOffset(progressBarState.progressPercent)};${calculateColorStopOffset(progressBarState.progressPercent)}`,
    willAnimate: false,
  });

  useEffect(() => {
    const willAnimate =
      progressBarState.progressPercent >
      progressBarState.previousProgressPercent;
    const offset =
      willAnimate ?
        calculateColorStopOffset(progressBarState.previousProgressPercent)
      : calculateColorStopOffset(progressBarState.progressPercent);
    const animationValues = `${offset};${calculateColorStopOffset(progressBarState.progressPercent)}`;

    setState({
      offset,
      animationValues,
      willAnimate,
    });
  }, [progressBarState]);

  useEffect(() => {
    if (state.willAnimate && animateTagRef.current) {
      (animateTagRef.current as any).beginElement();
    }
  }, [state]);

  return state.willAnimate ?
      <stop offset={state.offset} stopColor={color}>
        <animate
          attributeName="offset"
          values={state.animationValues}
          dur="1s"
          repeatCount={1}
          fill="freeze"
          calcMode="spline"
          keyTimes="0; 1"
          keySplines="1, 0, 0.75, 1"
          ref={animateTagRef}
        />
      </stop>
    : <stop offset={state.offset} stopColor={color}></stop>;
}
