import 'server-only';
import 'reflect-metadata';
import { Container } from 'inversify';
import { SERVICE_KEYS } from './service-keys';
import { CloudflareTurnstileTokenValidator } from './cloudflare-turnstile-token-validator';
import { isSignedInWithSupabase } from './is-signed-in-with-supabase';
import { isSignedOutFromSupabase } from './is-signed-out-from-supabase';
import { refreshSupabaseSession } from './refresh-supabase-session';
import type { CaptchaTokenValidator } from './captcha-token-validator';
import type { NextMiddleware } from 'next/server';
import { SignOut } from './signout';
import { signOutFromSupabase } from './signout-from-supabase';

const serverContainer = new Container();

serverContainer
  .bind<CaptchaTokenValidator>(SERVICE_KEYS.CaptchaTokenValidator)
  .to(CloudflareTurnstileTokenValidator);

serverContainer
  .bind<NextMiddleware>(SERVICE_KEYS.isSignedIn)
  .toConstantValue(isSignedInWithSupabase);

serverContainer
  .bind<NextMiddleware>(SERVICE_KEYS.isSignedOut)
  .toConstantValue(isSignedOutFromSupabase);

serverContainer
  .bind<NextMiddleware>(SERVICE_KEYS.refreshSession)
  .toConstantValue(refreshSupabaseSession);

serverContainer
  .bind<SignOut>(SERVICE_KEYS.signOut)
  .toConstantValue(signOutFromSupabase);

export { serverContainer };
