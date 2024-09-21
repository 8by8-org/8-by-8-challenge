import { POST } from '@/app/api/register-to-vote/route';
import { NextRequest } from 'next/server';
import { ServerError } from '@/errors/server-error';
import { serverContainer } from '@/services/server/container';
import { saveActualImplementation } from '@/utils/test/save-actual-implementation';
import { Builder } from 'builder-pattern';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { DateTime } from 'luxon';
import { UserType } from '@/model/enums/user-type';
import type { Auth } from '@/services/server/auth/auth';
import type { User } from '@/model/types/user';
import type { UserRepository } from '@/services/server/user-repository/user-repository';
import type { VoterRegistrationDataRepository } from '@/services/server/voter-registration-data-repository/voter-registration-data-repository';

describe('POST', () => {
  const getActualService = saveActualImplementation(serverContainer, 'get');

  it(`accepts voter registration data, saves this data in the database, and
  awards the user a badge.`, async () => {
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

    const insertVoterRegistrationInfo = jest.fn();
    const awardVoterRegistrationBadge = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(user));

    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser(() => Promise.resolve(user))
            .build();
        } else if (key.name === SERVER_SERVICE_KEYS.UserRepository.name) {
          return Builder<UserRepository>()
            .awardRegisterToVoteBadge(awardVoterRegistrationBadge)
            .build();
        } else if (
          key.name === SERVER_SERVICE_KEYS.VoterRegistrationDataRepository.name
        ) {
          return Builder<VoterRegistrationDataRepository>()
            .insertVoterRegistrationData(insertVoterRegistrationInfo)
            .build();
        }
        return getActualService(key);
      });

    const fetchSpy = jest
      .spyOn(globalThis, 'fetch')
      .mockImplementationOnce(() => {
        return Promise.resolve(
          new Response(JSON.stringify({ status: 'email sent' }), {
            status: 200,
          }),
        );
      });

    const registerBody = {
      user_id: '0',
      state: 'FL',
      city: 'Davie',
      street: '2161 SW 152 Ter',
      name_first: 'John',
      name_last: 'Doe',
      dob: '09/20/2003',
      zip: '33027',
      email: 'test@me.com',
      citizen: 'yes',
      eighteenPlus: 'yes',
      party: 'Democrat',
      idNumber: '123',
    };

    const request = new NextRequest(
      'https://challenge.8by8.us/register-to-vote',
      {
        method: 'POST',
        body: JSON.stringify(registerBody),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(200);
    containerSpy.mockRestore();
    fetchSpy.mockRestore();
  });

  it('returns a response with a status of 401 when the user is signed out.', async () => {
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

    const registerBody = {
      user_id: '0',
      state: 'FL',
      city: 'Davie',
      street: '2161 SW 152 Ter',
      name_first: 'John',
      name_last: 'Doe',
      dob: '09/20/2003',
      zip: '33027',
      email: 'test@me.come',
      citizen: 'yes',
      eighteenPlus: 'yes',
      party: 'Democrat',
      idNumber: '123',
    };

    const request = new NextRequest(
      'https://challenge.8by8.us/register-to-vote',
      {
        method: 'POST',
        body: JSON.stringify(registerBody),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(401);
    containerSpy.mockRestore();
  });

  it(`returns a response with a status code matching that of a caught
  ServerError when one is thrown while attempting to insert voter registration
  data.`, async () => {
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

    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser(() => Promise.resolve(user))
            .build();
        } else if (
          key.name === SERVER_SERVICE_KEYS.VoterRegistrationDataRepository.name
        ) {
          return Builder<VoterRegistrationDataRepository>()
            .insertVoterRegistrationData(() => {
              throw new ServerError('User already exists.', 403);
            })
            .build();
        }
        return getActualService(key);
      });

    const fetchSpy = jest
      .spyOn(globalThis, 'fetch')
      .mockImplementationOnce(() => {
        return Promise.resolve(
          new Response(JSON.stringify({ status: 'email sent' }), {
            status: 200,
          }),
        );
      });

    const registerBody = {
      user_id: '0',
      state: 'FL',
      city: 'Davie',
      street: '2161 SW 152 Ter',
      name_first: 'John',
      name_last: 'Doe',
      dob: '09/20/2003',
      zip: '33027',
      email: 'test@me.com',
      citizen: 'yes',
      eighteenPlus: 'yes',
      party: 'Democrat',
      idNumber: '123',
    };

    const request = new NextRequest(
      'https://challenge.8by8.us/register-to-vote',
      {
        method: 'POST',
        body: JSON.stringify(registerBody),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(403);

    const responseBody = await response.json();
    expect(responseBody.error).toBe('User already exists.');
    containerSpy.mockRestore();
    fetchSpy.mockRestore();
  });

  it(`returns a response with a status of 400 when the request body contains 
  invalid data.`, async () => {
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

    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser(() => Promise.resolve(user))
            .build();
        }
        return getActualService(key);
      });

    const registerBody = {
      user_id: '0',
      state: 'FL',
      city: 'Davie',
      street: '2161 SW 152 Ter',
      name_first: 'John',
      name_last: 'Doe',
      dob: '09/20/2003',
      zip: '33027',
      email: 'test@me.come',
      citizen: true, // citizen should be a string
      eighteenPlus: 'yes',
      party: 'Democrat',
      idNumber: '123',
    };

    const request = new NextRequest(
      'https://challenge.8by8.us/register-to-vote',
      {
        method: 'POST',
        body: JSON.stringify(registerBody),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(400);
    containerSpy.mockRestore();
  });

  it(`returns a response with a status of 400 when the request body is missing a
  required property.`, async () => {
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

    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser(() => Promise.resolve(user))
            .build();
        }
        return getActualService(key);
      });

    // missing state key
    const registerBody = {
      user_id: '0',
      city: 'Davie',
      street: '2161 SW 152 Ter',
      name_first: 'John',
      name_last: 'Doe',
      dob: '09/20/2003',
      zip: '33027',
      email: 'test@me.come',
      citizen: 'InvalidData',
      eighteenPlus: 'InvalidData',
      party: 'Democrat',
      idNumber: '123',
    };

    const request = new NextRequest(
      'https://challenge.8by8.us/register-to-vote',
      {
        method: 'POST',
        body: JSON.stringify(registerBody),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(400);
    containerSpy.mockRestore();
  });

  it(`returns a response with the status returned by the fetch request to the 
  registration endpoint when the request is unsuccessful.`, async () => {
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

    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser(() => Promise.resolve(user))
            .build();
        }

        return getActualService(key);
      });

    const fetchSpy = jest
      .spyOn(globalThis, 'fetch')
      .mockImplementationOnce(() => {
        return Promise.resolve(
          new Response(
            JSON.stringify({ error: 'dob must be in the form mm/dd/yyyy' }),
            {
              status: 400,
            },
          ),
        );
      });

    const registerBody = {
      user_id: '0',
      state: 'FL',
      city: 'Davie',
      street: '2161 SW 152 Ter',
      name_first: 'John',
      name_last: 'Doe',
      dob: '2003-20-09',
      zip: '33027',
      email: 'test@me.com',
      citizen: 'yes',
      eighteenPlus: 'yes',
      party: 'Democrat',
      idNumber: '123',
    };

    const request = new NextRequest(
      'https://challenge.8by8.us/register-to-vote',
      {
        method: 'POST',
        body: JSON.stringify(registerBody),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(400);
    containerSpy.mockRestore();
    fetchSpy.mockRestore();
  });

  it(`returns a response with a status of 500 if any type of error other than a
  ServerError or ZodError is caught.`, async () => {
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

    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser(() => Promise.resolve(user))
            .build();
        } else if (key.name === SERVER_SERVICE_KEYS.UserRepository.name) {
          return Builder<UserRepository>().build();
        } else if (
          key.name === SERVER_SERVICE_KEYS.VoterRegistrationDataRepository.name
        ) {
          return Builder<VoterRegistrationDataRepository>().build();
        }
        return getActualService(key);
      });

    const request = Builder<NextRequest>()
      .json(() => {
        throw new Error('Badly formatted JSON');
      })
      .build();

    const response = await POST(request);
    expect(response.status).toBe(500);

    containerSpy.mockRestore();
  });
});
