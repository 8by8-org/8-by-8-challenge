import { delay } from '@/utils/client/delay';

describe('delay', () => {
  it('should resolve Promise after specified time', async () => {
    const start = Date.now();
    await delay(100);
    const end = Date.now();
    const elapsed = end - start;
    expect(elapsed).toBeGreaterThanOrEqual(90);
  });
});
