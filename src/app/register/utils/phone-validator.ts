import { IValidator, ValidatorResult, Validity } from 'fully-formed';

export class PhoneValidator implements IValidator<string> {
  private phonePattern = /^\d{10}$/;

  validate(value: string): ValidatorResult {
    const trimmed = value.trim();
    if (!trimmed.length) {
      return {
        validity: Validity.Valid,
      };
    }

    const isValid = this.phonePattern.test(trimmed);

    return isValid ?
        {
          validity: Validity.Valid,
        }
      : {
          validity: Validity.Invalid,
          message: {
            text: 'Please enter a valid 10-digit phone number, or leave this field blank.',
            validity: Validity.Invalid,
          },
        };
  }
}
