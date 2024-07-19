import { POST } from '@/app/api/signin-with-otp/route';
import { NextRequest } from 'next/server';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { UserType } from '@/model/enums/user-type';
import { ServerError } from '@/errors/server-error';
import { Builder } from 'builder-pattern';
import { DateTime } from 'luxon';
import { saveActualImplementation } from '@/utils/test/save-actual-implementation';
import type { Auth } from '@/services/server/auth/auth';
import type { User } from '@/model/types/user';
import type { ICookies } from '@/services/server/cookies/i-cookies';

describe('POST', () => {
  const getActualService = saveActualImplementation(serverContainer, 'get');

  it(`clears the cookie in which the email for sign in was stored and then 
  returns the User when authentication is successful.`, async () => {
    const user: User = {
      uid: '0',
      email: 'user@example.com',
      name: 'User',
      avatar: '0',
      type: UserType.Challenger,
      completedActions: {
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      },
      completedChallenge: false,
      badges: [],
      contributedTo: [],
      challengeEndTimestamp: DateTime.now().plus({ days: 8 }).toUnixInteger(),
      inviteCode: 'test-invite-code',
    };

    const clearEmailForSignIn = jest.fn();

    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .signInWithEmailAndOTP(() => Promise.resolve(user))
            .build();
        } else if (key.name === SERVER_SERVICE_KEYS.Cookies.name) {
          return Builder<ICookies>()
            .clearEmailForSignIn(clearEmailForSignIn)
            .build();
        }

        return getActualService(key);
      });

    const request = new NextRequest(
      'https://challenge.8by8.us/signin-with-otp',
      {
        method: 'POST',
        body: JSON.stringify({ email: user.email, otp: '123456' }),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.user).toEqual(user);

    expect(clearEmailForSignIn).toHaveBeenCalled();

    containerSpy.mockRestore();
  });

  it(`returns a response with a status code of 400 when the request body 
  could not be parsed.`, async () => {
    const request = new NextRequest(
      'https://challenge.8by8.us/signin-with-otp',
      {
        method: 'POST',
        body: JSON.stringify({}),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it(`returns a response with a status code matching that of a ServerError 
  thrown by the Auth service.`, async () => {
    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .signInWithEmailAndOTP(() => {
              throw new ServerError('Incorrect email or password.', 401);
            })
            .build();
        }

        return getActualService(key);
      });

    const request = new NextRequest(
      'https://challenge.8by8.us/signin-with-otp',
      {
        method: 'POST',
        body: JSON.stringify({ email: 'user@example.com', otp: '123456' }),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(401);

    const responseBody = await response.json();
    expect(responseBody.error).toBe('Incorrect email or password.');

    containerSpy.mockRestore();
  });
});
