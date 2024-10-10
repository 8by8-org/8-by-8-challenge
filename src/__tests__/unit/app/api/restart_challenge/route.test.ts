import { PUT } from '@/app/api/restart-challenge/route';
import { NextRequest } from 'next/server';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { Builder } from 'builder-pattern';
import { saveActualImplementation } from '@/utils/test/save-actual-implementation';
import type { Auth } from '@/services/server/auth/auth';
import type { UserRepository } from '@/services/server/user-repository/user-repository';
import type { User } from '@/model/types/user';
import type { Avatar } from '@/model/types/avatar';
import { Actions } from '@/model/enums/actions';
import { UserType } from '@/model/enums/user-type';
import { ServerError } from '@/errors/server-error';

describe('PUT /restart_challenge', () => {
  const getActualService = saveActualImplementation(serverContainer, 'get');

  it(`returns a status code of 200 and the new challenge end timestamp if the user was successfully authorized and the challenge was restarted.`, async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const newTimestamp = Date.now();

    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser((): Promise<User> => {
              return Promise.resolve({
                uid: userId,
                email: 'user@example.com',
                name: 'John Doe',
                avatar: 'https://example.com/avatar.png' as Avatar,
                type: UserType.Challenger,
                completedActions: {
                  electionReminders: true,
                  registerToVote: true,
                  sharedChallenge: true,
                },
                badges: [
                  { action: Actions.RegisterToVote }, // Removed type casting to ActionBadge
                  { action: Actions.SharedChallenge },
                ],
                challengeEndTimestamp: newTimestamp,
                completedChallenge: true,
                contributedTo: [
                  {
                    challengerInviteCode: 'INVITECODE123',
                    challengerName: 'Jane Doe',
                    challengerAvatar: '0',
                  },
                ],
                inviteCode: 'INVITE123',
                invitedBy: {
                  challengerInviteCode: 'INVITECODE123',
                  challengerName: 'Jane Doe',
                  challengerAvatar: '0',
                },
              });
            })
            .build();
        } else if (key.name === SERVER_SERVICE_KEYS.UserRepository.name) {
          return Builder<UserRepository>()
            .restartChallenge(() => {
              return Promise.resolve(newTimestamp);
            })
            .build();
        }

        return getActualService(key);
      });

    const request = new NextRequest(
      'https://challenge.8by8.us/api/restart_challenge',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
        }),
      },
    );

    const response = await PUT(request);
    expect(response.status).toBe(200);

    const responseBody = await response.json();
    expect(responseBody.challengeEndTimestamp).toBe(newTimestamp);

    containerSpy.mockRestore();
  });

  it('returns a status code of 401 and an error message if the user is not authenticated', async () => {
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

    const request = new NextRequest(
      'https://challenge.8by8.us/api/restart_challenge',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'invalid-user-id',
        }),
      },
    );

    const response = await PUT(request);
    expect(response.status).toBe(401);

    const responseBody = await response.json();
    expect(responseBody.error).toBe('Unauthorized');

    containerSpy.mockRestore();
  });

  it('returns a status code of 400 and the error message if a ServerError is thrown', async () => {
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

    const request = new NextRequest(
      'https://challenge.8by8.us/api/restart_challenge',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'invalid-user-id',
        }),
      },
    );

    const response = await PUT(request);
    expect(response.status).toBe(errorCode);

    const responseBody = await response.json();
    expect(responseBody.error).toBe(errorMessage);

    containerSpy.mockRestore();
  });

  it('returns a status code of 500 and a generic error message if an unknown error is thrown', async () => {
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

    const request = new NextRequest(
      'https://challenge.8by8.us/api/restart_challenge',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'invalid-user-id',
        }),
      },
    );

    const response = await PUT(request);
    expect(response.status).toBe(500);

    const responseBody = await response.json();
    expect(responseBody.error).toBe('Internal Server Error');

    containerSpy.mockRestore();
  });
});
