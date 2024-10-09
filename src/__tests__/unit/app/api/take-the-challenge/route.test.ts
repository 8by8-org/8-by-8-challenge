import { PUT } from '@/app/api/take-the-challenge/route';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { saveActualImplementation } from '@/utils/test/save-actual-implementation';
import { UserType } from '@/model/enums/user-type';
import { createId } from '@paralleldrive/cuid2';
import { v4 as uuid } from 'uuid';
import { Builder } from 'builder-pattern';
import { ServerError } from '@/errors/server-error';
import type { User } from '@/model/types/user';
import type { Auth } from '@/services/server/auth/auth';
import type { UserRepository } from '@/services/server/user-repository/user-repository';

describe('PUT', () => {
  const getActualService = saveActualImplementation(serverContainer, 'get');

  it(`returns a response whose body contains an updated User object when the 
  user's type is successfully updated to UserType.Hybrid.`, async () => {
    const player: User = {
      uid: uuid(),
      email: 'player@example.com',
      name: 'Player',
      avatar: '0',
      type: UserType.Player,
      completedActions: {
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      },
      badges: [],
      challengeEndTimestamp: 0,
      completedChallenge: false,
      contributedTo: [],
      inviteCode: createId(),
    };

    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser(() => Promise.resolve(player))
            .build();
        } else if (key.name === SERVER_SERVICE_KEYS.UserRepository.name) {
          return Builder<UserRepository>()
            .makeHybrid(() =>
              Promise.resolve({
                ...player,
                type: UserType.Hybrid,
              }),
            )
            .build();
        }

        return getActualService(key);
      });

    const response = await PUT();
    const data = await response.json();

    expect(data.user).toEqual({
      ...player,
      type: UserType.Hybrid,
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

  it(`returns a response with a status of 422 if the user is already a 
  challenger-type user.`, async () => {
    const challenger: User = {
      uid: uuid(),
      email: 'challenger@example.com',
      name: 'Challenger',
      avatar: '0',
      type: UserType.Challenger,
      completedActions: {
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      },
      badges: [],
      challengeEndTimestamp: 0,
      completedChallenge: false,
      contributedTo: [],
      inviteCode: createId(),
    };

    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser(() => Promise.resolve(challenger))
            .build();
        }

        return getActualService(key);
      });

    const response = await PUT();
    expect(response.status).toBe(422);

    containerSpy.mockRestore();
  });

  it(`returns a response with a status of 422 if the user is already a 
  hybrid-type user.`, async () => {
    const hybrid: User = {
      uid: uuid(),
      email: 'hybrid@example.com',
      name: 'Hybrid',
      avatar: '0',
      type: UserType.Hybrid,
      completedActions: {
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      },
      badges: [],
      challengeEndTimestamp: 0,
      completedChallenge: false,
      contributedTo: [],
      inviteCode: createId(),
    };

    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser(() => Promise.resolve(hybrid))
            .build();
        }

        return getActualService(key);
      });

    const response = await PUT();
    expect(response.status).toBe(422);

    containerSpy.mockRestore();
  });

  it(`returns a response with a status code matching that of a caught 
  ServerError.`, async () => {
    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser(() => {
              throw new ServerError('Too many requests.', 429);
            })
            .build();
        }

        return getActualService(key);
      });

    const response = await PUT();
    expect(response.status).toBe(429);

    containerSpy.mockRestore();
  });

  it(`returns a response with a status of 500 if an Error that is not an 
  instance of ServerError is caught.`, async () => {
    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser(() => {
              throw new Error();
            })
            .build();
        }

        return getActualService(key);
      });

    const response = await PUT();
    expect(response.status).toBe(500);

    containerSpy.mockRestore();
  });
});
