import { isHuman } from '@/utils/server/is-human';

describe('isHuman()', () => {
  it(`returns true when the response returned from the token verification 
  endpoint indicates success.`, async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() => {
      const response = {
        json: () => ({
          success: true,
        }),
      } as unknown as Response;

      return Promise.resolve(response);
    });

    const result = await isHuman('test-token');
    expect(result).toBe(true);

    fetchSpy.mockRestore();
  });

  it(`returns false when the response returned from the token verification 
  endpoint indicates failure.`, async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() => {
      const response = {
        json: () => ({
          success: false,
        }),
      } as unknown as Response;

      return Promise.resolve(response);
    });

    const result = await isHuman('test-token');
    expect(result).toBe(false);

    fetchSpy.mockRestore();
  });
});
