import { IValidator, ValidatorResult, Validity } from 'fully-formed';

export class ZipCodeValidator implements IValidator<string> {
  private trimBeforeValidation: boolean;
  private pattern = /^\d{5}$/;

  public constructor(trimBeforeValidation?: boolean) {
    this.trimBeforeValidation = !!trimBeforeValidation;
  }

  validate(value: string): ValidatorResult {
    if (this.trimBeforeValidation) value = value.trim();

    if (!value.length) {
      return {
        validity: Validity.Invalid,
        message: {
          text: 'Please enter your zip code.',
          validity: Validity.Invalid,
        },
      };
    }

    const isValid = this.pattern.test(value);

    if (!isValid) {
      return {
        validity: Validity.Invalid,
        message: {
          text: 'Please enter a 5-digit zip code.',
          validity: Validity.Invalid,
        },
      };
    }

    return {
      validity: Validity.Valid,
    };
  }
}
