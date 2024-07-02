import { Keys } from 'undecorated-di';
import { CaptchaTokenValidator } from './captcha-token-validator';
import { NextMiddleware } from 'next/server';

export const { keys: SERVICE_KEYS } = Keys.createKeys()
  .addKey('CaptchaTokenValidator')
  .forType<CaptchaTokenValidator>()
  .addKey('isSignedIn')
  .forType<NextMiddleware>()
  .addKey('isSignedOut')
  .forType<NextMiddleware>()
  .addKey('refreshSession')
  .forType<NextMiddleware>();
