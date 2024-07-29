import { waitForPendingValidators } from './wait-for-pending-validators';

/**
 * An error thrown when {@link waitForPendingValidators} fails.
 */
export class FormInvalidError extends Error {
  public readonly name = 'FormInvalidError';
  public readonly message: string;

  public constructor() {
    super();
    this.message = 'The form has invalid fields.';
  }
}
