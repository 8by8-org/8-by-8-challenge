import { ServerError } from '@/errors/server-error';

describe('ServerError', () => {
  it('returns an error with a message and a status code.', () => {
    const serverError = new ServerError('Too many requests.', 429);
    expect(serverError.message).toBe('Too many requests.');
    expect(serverError.statusCode).toBe(429);
  });

  it(`returns an error with status code of 500 if it status was undefined in the 
  constructor.`, () => {
    const serverError = new ServerError('Unknown error');
    expect(serverError.statusCode).toBe(500);
  });
});
