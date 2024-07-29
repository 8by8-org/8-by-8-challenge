import { startConfettiTimer } from '@/components/utils/confetti-animation/start-confetti-timer';

describe('startConfettiTimer', () => {
  it('should setShowConfetti to false after delay.', async () => {
    const setShowConfetti = jest.fn();
    await startConfettiTimer(100, setShowConfetti);
    expect(setShowConfetti).toHaveBeenCalledWith(false);
  });
});
