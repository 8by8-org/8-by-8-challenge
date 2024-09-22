import { Keys } from 'undecorated-di';
import type { Auth } from './auth/auth';
import type { CaptchaValidator } from './captcha-validator/captcha-validator';
import type { ICookies } from './cookies/i-cookies';
import type { IMiddleware } from './middleware/i-middleware.interface';
import type { NextMiddleware } from 'next/server';
import type { UserRepository } from './user-repository/user-repository';
import type { IUserRecordParser } from './user-record-parser/i-user-record-parser';
import type { Encryptor } from './encryptor/encryptor';
import type { VoterRegistrationDataRepository } from './voter-registration-data-repository/voter-registration-data-repository';
import type { CreateSupabaseClient } from './create-supabase-client/create-supabase-client';
import type { USStateInformation } from './us-state-information/us-state-information';
import type { ValidateAddresses } from './validate-addresses/validate-addresses';
import type { InvitationsRepository } from './invitations-repository/invitations-repository';
import type { RedirectIfCompletedAction } from './redirect-if-completed-action/redirect-if-completed-action';

const { keys } = Keys.createKeys()
  .addKey('Auth')
  .forType<Auth>()
  .addKey('CaptchaValidator')
  .forType<CaptchaValidator>()
  .addKey('Cookies')
  .forType<ICookies>()
  .addKey('createSupabaseSSRClient')
  .forType<CreateSupabaseClient>()
  .addKey('createSupabaseServiceRoleClient')
  .forType<CreateSupabaseClient>()
  .addKey('UserRecordParser')
  .forType<IUserRecordParser>()
  .addKey('Middleware')
  .forType<IMiddleware>()
  .addKey('redirectIfOTPNotSent')
  .forType<NextMiddleware>()
  .addKey('redirectIfSignedIn')
  .forType<NextMiddleware>()
  .addKey('redirectIfSignedOut')
  .forType<NextMiddleware>()
  .addKey('refreshSession')
  .forType<NextMiddleware>()
  .addKey('UserRepository')
  .forType<UserRepository>()
  .addKey('Encryptor')
  .forType<Encryptor>()
  .addKey('USStateInformation')
  .forType<USStateInformation>()
  .addKey('validateAddresses')
  .forType<ValidateAddresses>()
  .addKey('setInviteCodeCookie')
  .forType<NextMiddleware>()
  .addKey('InvitationsRepository')
  .forType<InvitationsRepository>()
  .addKey('VoterRegistrationDataRepository')
  .forType<VoterRegistrationDataRepository>()
  .addKey('redirectIfCompletedAction')
  .forType<RedirectIfCompletedAction>();

/**
 * Keys that can be used to retrieve service classes, functions, etc. from an
 * inversion of control container. Each key is linked to a specific interface,
 * making retrieval type-safe.
 */
export const SERVER_SERVICE_KEYS = keys;
