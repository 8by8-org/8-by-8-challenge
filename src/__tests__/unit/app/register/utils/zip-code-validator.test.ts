import { ZipCodeValidator } from '@/app/register/utils/zip-code-validator';
import { Validity } from 'fully-formed';

describe('ZipCodeValidator', () => {
  it(`returns an object with a validity property of Validity.Valid when it 
  receives a 5 digit ZIP code.`, () => {
    const zipCodeValidator = new ZipCodeValidator();
    expect(zipCodeValidator.validate('12345')).toStrictEqual({
      validity: Validity.Valid,
    });
  });

  it(`returns an object with a validity property of Validity.Invalid together 
  with a message indicating that the field is required when it receives an empty 
  string.`, () => {
    const validator = new ZipCodeValidator();
    expect(validator.validate('')).toStrictEqual({
      validity: Validity.Invalid,
      message: {
        text: 'Please enter your ZIP code.',
        validity: Validity.Invalid,
      },
    });
  });

  it(`returns an object with a validity property of Validity.Invalid together 
  with a message indicating that the provided value is not a valid ZIP code when 
  it receives a non-numerical value.`, () => {
    const validator = new ZipCodeValidator();
    const nonNumericalCharacters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ `~!@#$%^&*()_+[]{}\\|;:\'",<.>/?😎 \n\t';

    for (let i = 0; i < nonNumericalCharacters.length; i++) {
      const value = '1234' + nonNumericalCharacters[i];
      expect(validator.validate(value)).toStrictEqual({
        validity: Validity.Invalid,
        message: {
          text: 'Please enter a 5-digit ZIP code.',
          validity: Validity.Invalid,
        },
      });
    }
  });

  it(`returns an object with a validity property of Validity.Invalid together 
  with a message indicating that the provided value is not a valid ZIP code when 
  it receives a numerical string that is less than 5 characters long.`, () => {
    const validator = new ZipCodeValidator();
    expect(validator.validate('1234')).toStrictEqual({
      validity: Validity.Invalid,
      message: {
        text: 'Please enter a 5-digit ZIP code.',
        validity: Validity.Invalid,
      },
    });
  });

  it(`returns an object with a validity property of Validity.Invalid together 
  with a message indicating that the provided value is not a valid ZIP code when 
  it receives a numerical string that is more than 5 characters long.`, () => {
    const validator = new ZipCodeValidator();
    expect(validator.validate('123456')).toStrictEqual({
      validity: Validity.Invalid,
      message: {
        text: 'Please enter a 5-digit ZIP code.',
        validity: Validity.Invalid,
      },
    });
  });

  it('trims the value before validating if trimBeforeValidation is true.', () => {
    const validator = new ZipCodeValidator({ trimBeforeValidation: true });
    expect(validator.validate(' 12345 ')).toStrictEqual({
      validity: Validity.Valid,
    });
  });

  it(`does not trim the value before validating if trimBeforeValidation is 
  false.`, () => {
    const validator = new ZipCodeValidator({ trimBeforeValidation: false });
    expect(validator.validate(' 12345 ')).toStrictEqual({
      validity: Validity.Invalid,
      message: {
        text: 'Please enter a 5-digit ZIP code.',
        validity: Validity.Invalid,
      },
    });
  });

  it(`initializes trimBeforeValidation to false by default.`, () => {
    const validator = new ZipCodeValidator();
    expect(validator.validate(' 12345 ')).toStrictEqual({
      validity: Validity.Invalid,
      message: {
        text: 'Please enter a 5-digit ZIP code.',
        validity: Validity.Invalid,
      },
    });
  });
});
