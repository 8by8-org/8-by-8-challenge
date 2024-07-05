import { readPublicEnvironmentVariables } from '@/utils/environment/read-public-environment-variables';

/**
 * Reads public environment variables and returns them as a constant value.
 * Can be imported into either client-side or server-side code.
 *
 * @remarks
 * Prefer this over calling {@link readPublicEnvironmentVariables} so that the
 * code throws a compile-time exception in the event that an environment
 * variable is missing. {@link readPublicEnvironmentVariables} can be called if
 * there is a need to change the value of environment variables throughout a
 * test suite, etc.
 */
export const PUBLIC_ENVIRONMENT_VARIABLES = readPublicEnvironmentVariables();
