import { POST } from '@/app/api/register-to-vote/route';
import { NextRequest } from 'next/server';
import { ServerError } from '@/errors/server-error';
import { serverContainer } from '@/services/server/container';
import { saveActualImplementation } from '@/utils/test/save-actual-implementation';
import { Builder } from 'builder-pattern';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import type { Auth } from '@/services/server/auth/auth';
import type { User } from '@/model/types/user';
import type { UserRepository } from '@/services/server/user-repository/user-repository';
import type { VoterRepository } from '@/services/server/voter-registration-repository/voter-registration';
import { DateTime } from 'luxon';
import { UserType } from '@/model/enums/user-type';
import { AuthError } from '@supabase/supabase-js';

describe('POST', () => {
  const getActualService = saveActualImplementation(serverContainer, 'get');

  it('takes voter registration information, calls /registertovote api, updates completed task, awards badge, and updates user', async () => {
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
    const awardAndUpdateVoterRegistrationBadgeAndAction = jest.fn();

    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser(() => Promise.resolve(user))
            .build();
        } else if (key.name === SERVER_SERVICE_KEYS.UserRepository.name) {
          return Builder<UserRepository>()
            .getUserById(() => Promise.resolve(user))
            .awardAndUpdateVoterRegistrationBadgeAndAction(
              awardAndUpdateVoterRegistrationBadgeAndAction,
            )
            .build();
        } else if (key.name === SERVER_SERVICE_KEYS.VoterRepository.name) {
          return Builder<VoterRepository>()
            .insertVoterRegistrationInfo(insertVoterRegistrationInfo)
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
  }, 100_000);

  it('calls the route with a null user', async () => {
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

  it('calls the route and throws a server error', async () => {
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
        } else if (key.name === SERVER_SERVICE_KEYS.VoterRepository.name) {
          return Builder<VoterRepository>()
            .insertVoterRegistrationInfo(() => {
              throw new ServerError('User already exists.', 403);
            })
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
  }, 100_000);

  it('calls the route with faulty data in the register body, causing the /registertovote api fetch to fail', async () => {
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
  }, 100_000);

  it('calls the route with invalid register body, causing the parsing to fail', async () => {
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

    //mising state key
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
});
