import { redirectIfSupabaseUserCompletedAction } from '@/services/server/redirect-if-completed-action/redirect-if-supabase-user-completed-action';
import { willBeRedirected } from '@/utils/shared/will-be-redirected';
import { resetAuthAndDatabase } from '@/utils/test/reset-auth-and-database';
import { NextRequest } from 'next/server';
import { getSignedInRequestWithUser } from '@/utils/test/get-signed-in-request-with-user';
import { SupabaseUserRecordBuilder } from '@/utils/test/supabase-user-record-builder';
import { Actions } from '@/model/enums/actions';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';

describe('redirectIfSupabaseUserCompletedAction', () => {
  afterEach(() => {
    return resetAuthAndDatabase();
  });

  it(`returns a response that redirects a user if they have completed the 
  specified action.`, async () => {
    const user = await new SupabaseUserRecordBuilder('user@example.com')
      .completedActions({
        electionReminders: true,
        registerToVote: false,
        sharedChallenge: false,
      })
      .build();

    const request = await getSignedInRequestWithUser(
      user,
      'https://challenge.8by8.us/reminders',
      {
        method: 'GET',
      },
    );

    const userRepo = serverContainer.get(SERVER_SERVICE_KEYS.UserRepository);

    const response = await redirectIfSupabaseUserCompletedAction(
      userRepo,
      request,
      {
        action: Actions.ElectionReminders,
        redirectTo: '/',
      },
    );

    expect(willBeRedirected(response)).toBe(true);
  });

  it(`returns a response that does not redirect the user if they have not
  completed the specified action.`, async () => {
    const user = await new SupabaseUserRecordBuilder('user@example.com')
      .completedActions({
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      })
      .build();

    const request = await getSignedInRequestWithUser(
      user,
      'https://challenge.8by8.us/reminders',
      {
        method: 'GET',
      },
    );

    const userRepo = serverContainer.get(SERVER_SERVICE_KEYS.UserRepository);

    const response = await redirectIfSupabaseUserCompletedAction(
      userRepo,
      request,
      {
        action: Actions.ElectionReminders,
        redirectTo: '/',
      },
    );

    expect(willBeRedirected(response)).toBe(false);
  });

  it(`returns a response that does not redirect the user if they are signed out.`, async () => {
    const request = new NextRequest('https://challenge.8by8.us/reminders', {
      method: 'GET',
    });

    const userRepo = serverContainer.get(SERVER_SERVICE_KEYS.UserRepository);

    const response = await redirectIfSupabaseUserCompletedAction(
      userRepo,
      request,
      {
        action: Actions.ElectionReminders,
        redirectTo: '/',
      },
    );

    expect(willBeRedirected(response)).toBe(false);
  });
});
