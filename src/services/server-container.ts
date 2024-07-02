import 'server-only';
import { SERVICE_KEYS } from './service-keys';
import CloudflareTurnstileTokenValidator from './cloudflare-turnstile-token-validator';
import isSignedInWithSupabase from './is-signed-in-with-supabase';
import isSignedOutFromSupabase from './is-signed-out-from-supabase';
import refreshSupabaseSession from './refresh-supabase-session';
import { ContainerBuilder } from 'undecorated-di';

export const serverContainer = ContainerBuilder.createBuilder()
  .registerClass(
    SERVICE_KEYS.CaptchaTokenValidator,
    CloudflareTurnstileTokenValidator,
  )
  .registerFunction(SERVICE_KEYS.isSignedIn, isSignedInWithSupabase)
  .registerFunction(SERVICE_KEYS.isSignedOut, isSignedOutFromSupabase)
  .registerFunction(SERVICE_KEYS.refreshSession, refreshSupabaseSession)
  .build();
