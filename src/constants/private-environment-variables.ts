import 'server-only';
import { readPrivateEnvironmentVariables } from '@/utils/environment/read-private-environment-variables';

/**
 * Reads private environment variables and returns them as a constant value.
 * Can only be imported into server-side code.
 *
 * @remarks
 * Prefer this over calling {@link readPrivateEnvironmentVariables} so that the
 * code throws a compile-time exception in the event that an environment
 * variable is missing. {@link readPrivateEnvironmentVariables} can be called if
 * there is a need to change the value of environment variables throughout a
 * test suite, etc.
 */
export const PRIVATE_ENVIRONMENT_VARIABLES = readPrivateEnvironmentVariables();
