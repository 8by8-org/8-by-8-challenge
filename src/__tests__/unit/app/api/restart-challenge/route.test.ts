import { PUT } from '@/app/api/restart-challenge/route';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { Builder } from 'builder-pattern';
import { saveActualImplementation } from '@/utils/test/save-actual-implementation';
import { Actions } from '@/model/enums/actions';
import { UserType } from '@/model/enums/user-type';
import { ServerError } from '@/errors/server-error';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import type { Auth } from '@/services/server/auth/auth';
import type { UserRepository } from '@/services/server/user-repository/user-repository';
import type { User } from '@/model/types/user';
import type { Avatar } from '@/model/types/avatar';

describe('PUT', () => {
  const getActualService = saveActualImplementation(serverContainer, 'get');

  it(`returns a status code of 200 and the updated user if the 
  user was successfully authorized and the challenge was restarted.`, async () => {
    const user: User = {
      uid: uuid(),
      email: 'user@example.com',
      name: 'John Doe',
      avatar: '0',
      type: UserType.Challenger,
      completedActions: {
        electionReminders: true,
        registerToVote: true,
        sharedChallenge: true,
      },
      badges: [
        { action: Actions.RegisterToVote },
        { action: Actions.SharedChallenge },
      ],
      challengeEndTimestamp: 0,
      completedChallenge: false,
      contributedTo: [],
      inviteCode: 'INVITE123',
    };

    const newTimestamp = DateTime.now().plus({ days: 8 }).toUnixInteger();

    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser((): Promise<User> => {
              return Promise.resolve(user);
            })
            .build();
        } else if (key.name === SERVER_SERVICE_KEYS.UserRepository.name) {
          return Builder<UserRepository>()
            .restartChallenge(() => {
              return Promise.resolve({
                ...user,
                challengeEndTimestamp: newTimestamp,
              });
            })
            .build();
        }

        return getActualService(key);
      });

    const response = await PUT();
    expect(response.status).toBe(200);

    const responseBody = await response.json();
    expect(responseBody.user.challengeEndTimestamp).toBe(newTimestamp);

    containerSpy.mockRestore();
  });

  it(`returns a status code of 401 and an error message if the user is not 
  authenticated.`, async () => {
    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser(() => {
              return Promise.resolve(null);
            })
            .build();
        }

        return getActualService(key);
      });

    const response = await PUT();
    expect(response.status).toBe(401);

    const responseBody = await response.json();
    expect(responseBody.error).toBe('Unauthorized');

    containerSpy.mockRestore();
  });

  it('returns a status matching that of a caught ServerError.', async () => {
    const errorMessage = 'User not found';
    const errorCode = 400;

    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser(() => {
              throw new ServerError(errorMessage, errorCode);
            })
            .build();
        }

        return getActualService(key);
      });

    const response = await PUT();
    expect(response.status).toBe(errorCode);

    const responseBody = await response.json();
    expect(responseBody.error).toBe(errorMessage);

    containerSpy.mockRestore();
  });

  it(`returns a status code of 500 and a generic error message if an 
  unknown error is thrown.`, async () => {
    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser(() => {
              throw new Error('Unknown error');
            })
            .build();
        }

        return getActualService(key);
      });

    const response = await PUT();
    expect(response.status).toBe(500);

    const responseBody = await response.json();
    expect(responseBody.error).toBe('Internal Server Error');

    containerSpy.mockRestore();
  });
});
