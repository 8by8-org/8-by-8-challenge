import 'server-only';
import { ContainerBuilder } from 'undecorated-di';
import { SERVER_SERVICE_KEYS } from './keys';
import { CloudflareTurnstileValidator } from './captcha-validator/cloudflare-turnstile-validator';
import { SupabaseAuth } from './auth/supabase-auth';
import { Cookies } from './cookies/cookies';
import { createSupabaseSSRClient } from './create-supabase-client/create-supabase-ssr-client';
import { UserRecordParser } from './user-record-parser/user-record-parser';
import { Middleware } from './middleware/middleware';
import { redirectIfOTPNotSent } from './redirect-if-otp-not-sent/redirect-if-otp-not-sent';
import { redirectIfSignedInWithSupabase } from './redirect-if-signed-in/redirect-if-signed-in-with-supabase';
import { redirectIfSignedOutFromSupabase } from './redirect-if-signed-out/redirect-if-signed-out-from-supabase';
import { refreshSupabaseSession } from './refresh-session/refresh-supabase-session';
import { SupabaseUserRepository } from './user-repository/supabase-user-repository';
import { WebCryptoSubtleEncryptor } from './encryptor/web-crypto-subtle-encryptor';
import { VoterRegistrationRepository } from './voter-registration-repository/voter-registration-repository';
import { createSupabaseServiceRoleClient } from './create-supabase-client/create-supabase-service-role-client';

/**
 * An inversion of control container that should be used to obtain instances of
 * service classes, functions, etc. The container is designated server-only and
 * can only be imported into backend code, such as API routes, middleware and
 * server components. This container provides a layer of abstraction between
 * vender-specific code and application code, creating a more loosely-coupled
 * architecture.
 *
 * @example
 * ```
 * // An API route that obtains a service from the container
 * import { serverContainer } from '@/services/server/container';
 * import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
 *
 * export function POST(request: NextRequest) {
 *   const auth = serverContainer.get(SERVER_SERVICE_KEYS.Auth);
 *
 *   // invoke methods of auth and return a response
 * }
 * ```
 */
export const serverContainer = ContainerBuilder.createBuilder()
  .registerClass(SERVER_SERVICE_KEYS.Auth, SupabaseAuth)
  .registerClass(
    SERVER_SERVICE_KEYS.CaptchaValidator,
    CloudflareTurnstileValidator,
  )
  .registerClass(SERVER_SERVICE_KEYS.Cookies, Cookies)
  .registerFunction(
    SERVER_SERVICE_KEYS.createSupabaseSSRClient,
    createSupabaseSSRClient,
  )
  .registerFunction(
    SERVER_SERVICE_KEYS.createSupabaseServiceRoleClient,
    createSupabaseServiceRoleClient,
  )
  .registerClass(SERVER_SERVICE_KEYS.UserRecordParser, UserRecordParser)
  .registerClass(SERVER_SERVICE_KEYS.Middleware, Middleware)
  .registerFunction(
    SERVER_SERVICE_KEYS.redirectIfOTPNotSent,
    redirectIfOTPNotSent,
  )
  .registerFunction(
    SERVER_SERVICE_KEYS.redirectIfSignedIn,
    redirectIfSignedInWithSupabase,
  )
  .registerFunction(
    SERVER_SERVICE_KEYS.redirectIfSignedOut,
    redirectIfSignedOutFromSupabase,
  )
  .registerFunction(SERVER_SERVICE_KEYS.refreshSession, refreshSupabaseSession)
  .registerClass(SERVER_SERVICE_KEYS.UserRepository, SupabaseUserRepository)
  .registerClass(SERVER_SERVICE_KEYS.Encryptor, WebCryptoSubtleEncryptor)
  .registerClass(
    SERVER_SERVICE_KEYS.VoterRepository,
    VoterRegistrationRepository,
  )

  .build();
