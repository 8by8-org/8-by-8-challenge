import { IValidator, ValidatorResult, Validity } from 'fully-formed';

interface ZipCodeValidatorOpts {
  trimBeforeValidation?: boolean;
}

export class ZipCodeValidator implements IValidator<string> {
  private trimBeforeValidation: boolean;
  private pattern = /^\d{5}$/;

  public constructor(opts?: ZipCodeValidatorOpts) {
    this.trimBeforeValidation = !!opts?.trimBeforeValidation;
  }

  validate(value: string): ValidatorResult {
    if (this.trimBeforeValidation) value = value.trim();

    if (!value.length) {
      return {
        validity: Validity.Invalid,
        message: {
          text: 'Please enter your ZIP code.',
          validity: Validity.Invalid,
        },
      };
    }

    const isValid = this.pattern.test(value);

    if (!isValid) {
      return {
        validity: Validity.Invalid,
        message: {
          text: 'Please enter a 5-digit ZIP code.',
          validity: Validity.Invalid,
        },
      };
    }

    return {
      validity: Validity.Valid,
    };
  }
}
