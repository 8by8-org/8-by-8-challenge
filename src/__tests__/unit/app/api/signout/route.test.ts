import { DELETE } from '@/app/api/signout/route';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { saveActualImplementation } from '@/utils/test/save-actual-implementation';
import { Builder } from 'builder-pattern';
import { ServerError } from '@/errors/server-error';
import type { Auth } from '@/services/server/auth/auth';

describe('DELETE', () => {
  const getActualService = saveActualImplementation(serverContainer, 'get');

  it('returns a response with a status code of 200 when signout is successful.', async () => {
    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .signOut(() => Promise.resolve())
            .build();
        }

        return getActualService(key);
      });

    const response = await DELETE();
    expect(response.status).toBe(200);

    containerSpy.mockRestore();
  });

  it(`returns a response with a status code matching that of a ServerError 
  thrown by the Auth service.`, async () => {
    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .signOut(() => {
              throw new ServerError('Too many requests.', 429);
            })
            .build();
        }

        return getActualService(key);
      });

    const response = await DELETE();
    expect(response.status).toBe(429);

    const responseBody = await response.json();
    expect(responseBody.error).toBe('Too many requests.');

    containerSpy.mockRestore();
  });

  it(`returns a response with a status code of 500 if it encounters an 
  unknown error.`, async () => {
    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .signOut(() => {
              throw new Error('Unknown error');
            })
            .build();
        }

        return getActualService(key);
      });

    const response = await DELETE();
    expect(response.status).toBe(500);

    const responseBody = await response.json();
    expect(responseBody.error).toBe('There was a problem signing out.');

    containerSpy.mockRestore();
  });
});
