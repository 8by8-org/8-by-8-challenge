import { PUT } from '@/app/api/award-election-reminders-badge/route';
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

  it(`returns a response containing the updated user if 
  UserRepository.awardElectionRemindersBadge succeeds.`, async () => {
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
            .awardElectionRemindersBadge(() =>
              Promise.resolve({
                ...user,
                badges: [
                  {
                    action: Actions.ElectionReminders,
                  },
                ],
                completedActions: {
                  ...user.completedActions,
                  electionReminders: true,
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
          action: Actions.ElectionReminders,
        },
      ],
      completedActions: {
        ...user.completedActions,
        electionReminders: true,
      },
    });

    containerSpy.mockRestore();
  });

  it('returns a response with a status of 401 if the user is signed out.', async () => {
    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser(() => Promise.resolve(null))
            .build();
        }

        return getActualService(key);
      });

    const response = await PUT();
    expect(response.status).toBe(401);
    containerSpy.mockRestore();
  });

  it('returns a response the status code of a caught ServerError.', async () => {
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
            .awardElectionRemindersBadge(() => {
              throw new ServerError('Too many requests.', 429);
            })
            .build();
        }

        return getActualService(key);
      });

    const response = await PUT();
    const data = await response.json();
    expect(response.status).toBe(429);
    expect(data.message).toBe('Too many requests.');

    containerSpy.mockRestore();
  });

  it('returns a response with a status of 500 if an unknown error is caught.', async () => {
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
            .awardElectionRemindersBadge(() => {
              throw new Error();
            })
            .build();
        }

        return getActualService(key);
      });

    const response = await PUT();
    const data = await response.json();
    expect(response.status).toBe(500);
    expect(data.message).toBe('An unknown error occurred.');

    containerSpy.mockRestore();
  });
});
