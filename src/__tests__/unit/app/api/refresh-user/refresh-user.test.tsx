import { POST } from '@/app/api/refresh-user/route';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { saveActualImplementation } from '@/utils/test/save-actual-implementation';
import { UserType } from '@/model/enums/user-type';
import { v4 as uuid } from 'uuid';
import { DateTime } from 'luxon';
import { createId } from '@paralleldrive/cuid2';
import { Builder } from 'builder-pattern';
import { ServerError } from '@/errors/server-error';
import type { User } from '@/model/types/user';
import type { Auth } from '@/services/server/auth/auth';

describe('POST', () => {
  const getActualService = saveActualImplementation(serverContainer, 'get');

  it('reads the user from the request and returns the user.', async () => {
    const user: User = {
      uid: uuid(),
      name: 'Bob',
      email: 'bob@example.com',
      avatar: '3',
      type: UserType.Challenger,
      completedActions: {
        registerToVote: false,
        electionReminders: false,
        sharedChallenge: false,
      },
      badges: [
        {
          playerName: 'Barbara',
          playerAvatar: '0',
        },
      ],
      challengeEndTimestamp: DateTime.now().plus({ days: 5 }).toUnixInteger(),
      completedChallenge: false,
      contributedTo: [],
      inviteCode: createId(),
    };

    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementationOnce(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser(() => Promise.resolve(user))
            .build();
        }

        return getActualService(key);
      });

    const response = await POST();
    const data = await response.json();
    expect(data.user).toEqual(user);
    containerSpy.mockRestore();
  });

  it('returns a response with a status of 401 if no user is found.', async () => {
    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementationOnce(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser(() => Promise.resolve(null))
            .build();
        }

        return getActualService(key);
      });

    const response = await POST();
    expect(response.status).toBe(401);
    containerSpy.mockRestore();
  });

  it('returns a response whose status matches that of a caught ServerError.', async () => {
    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementationOnce(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser(() => {
              throw new ServerError('Too many requests.', 429);
            })
            .build();
        }

        return getActualService(key);
      });

    /* 
      Prevent caught error from being logged as it could mislead developers into
      thinking a test failed.
    */
    jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());

    const response = await POST();
    expect(response.status).toBe(429);
    containerSpy.mockRestore();
  });

  it('returns a response with a status of 500 when any other error is caught.', async () => {
    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementationOnce(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser(() => {
              throw new Error();
            })
            .build();
        }

        return getActualService(key);
      });

    /* 
      Prevent caught error from being logged as it could mislead developers into
      thinking a test failed.
    */
    jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());

    const response = await POST();
    expect(response.status).toBe(500);
    containerSpy.mockRestore();
  });
});
