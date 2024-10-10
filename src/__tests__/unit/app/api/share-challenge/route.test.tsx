import { PUT } from '@/app/api/share-challenge/route';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { saveActualImplementation } from '@/utils/test/save-actual-implementation';
import { Builder } from 'builder-pattern';
import { DateTime } from 'luxon';
import { UserType } from '@/model/enums/user-type';
import { Actions } from '@/model/enums/actions';
import { ServerError } from '@/errors/server-error';
import type { User } from '@/model/types/user';
import type { Auth } from '@/services/server/auth/auth';
import type { UserRepository } from '@/services/server/user-repository/user-repository';

describe('PUT', () => {
  const getActualService = saveActualImplementation(serverContainer, 'get');
  it('should award the badge if the user is authenticated', async () => {
    const user: User = {
      uid: '1',
      email: 'user@example.com',
      name: 'User',
      avatar: '0',
      type: UserType.Challenger,
      completedActions: {
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      },
      badges: [],
      contributedTo: [],
      completedChallenge: false,
      challengeEndTimestamp: DateTime.now().plus({ days: 8 }).toUnixInteger(),
      inviteCode: '',
    };

    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser(() => Promise.resolve(user))
            .build();
        } else if (key.name === SERVER_SERVICE_KEYS.UserRepository.name) {
          return Builder<UserRepository>()
            .awardSharedBadge(() =>
              Promise.resolve({
                ...user,
                badges: [
                  {
                    action: Actions.SharedChallenge,
                  },
                ],
                completedActions: {
                  ...user.completedActions,
                  sharedChallenge: true,
                },
              }),
            )
            .build();
        }

        return getActualService(key);
      });

    const response = await PUT();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.user).toEqual({
      ...user,
      badges: [
        {
          action: Actions.SharedChallenge,
        },
      ],
      completedActions: {
        ...user.completedActions,
        sharedChallenge: true,
      },
    });

    containerSpy.mockRestore();
  });

  it('should not award badge if the user is not authenticated', async () => {
    const awardBadge = jest.fn();
    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser(() => Promise.resolve(null))
            .build();
        } else if (key.name === SERVER_SERVICE_KEYS.UserRepository.name) {
          return Builder<UserRepository>().awardSharedBadge(awardBadge).build();
        }

        return getActualService(key);
      });

    const response = await PUT();
    expect(response.status).toBe(401);

    expect(awardBadge).not.toHaveBeenCalled();

    containerSpy.mockRestore();
  });

  it('returns a response with the status code of a caught ServerError.', async () => {
    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser(() =>
              Promise.reject(new ServerError('too many requests', 429)),
            )
            .build();
        }
        return getActualService(key);
      });

    const response = await PUT();
    expect(response.status).toBe(429);
    containerSpy.mockRestore();
  });
  it('returns a status of 500 for any other error', async () => {
    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser(() => Promise.reject(new Error()))
            .build();
        }
        return getActualService(key);
      });

    const response = await PUT();
    expect(response.status).toBe(500);
    containerSpy.mockRestore();
  });
});
