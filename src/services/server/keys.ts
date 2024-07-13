import { Keys } from 'undecorated-di';
import type { Auth } from './auth/auth';
import type { CaptchaValidator } from './captcha-validator/captcha-validator';
import type { ICookies } from './cookies/i-cookies';
import type { IMiddleware } from './middleware/i-middleware.interface';
import type { NextMiddleware } from 'next/server';
import type { UserRepository } from './user-repository/user-repository';
import type { IUserRecordParser } from './user-record-parser/i-user-record-parser';
import type { CreateSupabaseClient } from './create-supabase-client/create-supabase-client';

export const { keys: SERVER_SERVICE_KEYS } = Keys.createKeys()
  .addKey('Auth')
  .forType<Auth>()
  .addKey('CaptchaValidator')
  .forType<CaptchaValidator>()
  .addKey('Cookies')
  .forType<ICookies>()
  .addKey('createSupabaseClient')
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
  .forType<UserRepository>();
