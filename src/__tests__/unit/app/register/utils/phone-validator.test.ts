import { PhoneValidator } from '@/app/register/utils/phone-validator';
import { Validity } from 'fully-formed';

describe('PhoneValidator', () => {
  it(`returns an object with a validity property of Validity.Valid when it 
  receives an empty string.`, () => {
    const validator = new PhoneValidator();
    expect(validator.validate('')).toStrictEqual({
      validity: Validity.Valid,
    });
  });

  it(`returns an object with a validity property of Validity.Valid when it 
  receives a 10-digit phone number.`, () => {
    const validator = new PhoneValidator();
    expect(validator.validate('0123456789')).toStrictEqual({
      validity: Validity.Valid,
    });
  });

  it(`returns an object with a validity property of Validity.Invalid together 
  with a message indicating that the phone number is invalid when it receives a 
  numerical string with fewer than 10 digits.`, () => {
    const validator = new PhoneValidator();
    expect(validator.validate('0'.repeat(9))).toStrictEqual({
      validity: Validity.Invalid,
      message: {
        text: 'Please enter a valid 10-digit phone number, or leave this field blank.',
        validity: Validity.Invalid,
      },
    });
  });

  it(`returns an object with a validity property of Validity.Invalid together 
  with a message indicating that the phone number is invalid when it receives a 
  numerical string with more than 10 digits.`, () => {
    const validator = new PhoneValidator();
    expect(validator.validate('0'.repeat(11))).toStrictEqual({
      validity: Validity.Invalid,
      message: {
        text: 'Please enter a valid 10-digit phone number, or leave this field blank.',
        validity: Validity.Invalid,
      },
    });
  });

  it(`returns an object with a validity property of Validity.Invalid together 
  with a message indicating that the phone number is invalid when it receives a 
  string containing a non-numerical character.`, () => {
    const validator = new PhoneValidator();
    const nonNumericalCharacters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ `~!@#$%^&*()_+[]{}\\|;:\'",<.>/?😎 \n\t';

    for (let i = 0; i < nonNumericalCharacters.length; i++) {
      const value = '0'.repeat(9).concat(nonNumericalCharacters[i]);

      expect(validator.validate(value)).toStrictEqual({
        validity: Validity.Invalid,
        message: {
          text: 'Please enter a valid 10-digit phone number, or leave this field blank.',
          validity: Validity.Invalid,
        },
      });
    }
  });
});
