import { delay } from '@/utils/client/delay';
import { Dispatch, SetStateAction } from 'react';

export async function startConfettiTimer(
  time: number,
  setShowConfetti: Dispatch<SetStateAction<boolean>>,
) {
  await delay(time);
  setShowConfetti(false);
}
