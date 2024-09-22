import { isProcessableResponse } from '@/services/server/validate-addresses/validate-addresses-with-google-maps/utils/is-processable-response';
import { getValidGoogleMapsAddressValidationResponse } from '@/utils/test/get-valid-google-maps-address-validation-response';
import type { Address } from '@/model/types/addresses/address';

describe('isProcessableResponse', () => {
  const address: Address = {
    streetLine1: '1600 Amphitheatre Pkwy',
    streetLine2: 'Suite 100',
    city: 'Mountain View',
    state: 'CA',
    zip: '94043',
  };

  it('returns true if the response body contains all required properties.', () => {
    expect(
      isProcessableResponse(
        getValidGoogleMapsAddressValidationResponse(address),
      ),
    ).toBe(true);
  });

  it('returns false if the result property is missing.', () => {
    const missingResult = {};

    expect(isProcessableResponse(missingResult)).toBe(false);
  });

  it('returns false if result.verdict is missing.', () => {
    const missingVerdict = getValidGoogleMapsAddressValidationResponse(
      address,
    ) as any;
    delete missingVerdict.result!.verdict;

    expect(isProcessableResponse(missingVerdict)).toBe(false);
  });

  it('returns false if result.verdict is null.', () => {
    const nullVerdict = getValidGoogleMapsAddressValidationResponse(
      address,
    ) as any;
    nullVerdict.result.verdict = null;

    expect(isProcessableResponse(nullVerdict)).toBe(false);
  });

  it('returns false if result.verdict is not an object.', () => {
    const invalidVerdict = getValidGoogleMapsAddressValidationResponse(
      address,
    ) as any;
    invalidVerdict.result.verdict = 'not an object';

    expect(isProcessableResponse(invalidVerdict)).toBe(false);
  });

  it('returns false if result.address is missing.', () => {
    const missingAddress = getValidGoogleMapsAddressValidationResponse(
      address,
    ) as any;
    delete missingAddress.result!.address;

    expect(isProcessableResponse(missingAddress)).toBe(false);
  });

  it('returns false if result.address is null.', () => {
    const nullAddress = getValidGoogleMapsAddressValidationResponse(
      address,
    ) as any;
    nullAddress.result.address = null;

    expect(isProcessableResponse(nullAddress)).toBe(false);
  });

  it('returns false if result.address is not an object.', () => {
    const invalidAddress = getValidGoogleMapsAddressValidationResponse(
      address,
    ) as any;
    invalidAddress.result.address = 'not an object';

    expect(isProcessableResponse(invalidAddress)).toBe(false);
  });

  it('returns false if result.address.postalAddress is missing.', () => {
    const missingPostalAddress = getValidGoogleMapsAddressValidationResponse(
      address,
    ) as any;
    delete missingPostalAddress.result.address.postalAddress;

    expect(isProcessableResponse(missingPostalAddress)).toBe(false);
  });

  it('returns false if result.address.postalAddress is null.', () => {
    const nullPostalAddress = getValidGoogleMapsAddressValidationResponse(
      address,
    ) as any;
    nullPostalAddress.result.address.postalAddress = null;

    expect(isProcessableResponse(nullPostalAddress)).toBe(false);
  });

  it('returns false if result.address.postalAddress is not an object.', () => {
    const invalidPostalAddress = getValidGoogleMapsAddressValidationResponse(
      address,
    ) as any;
    invalidPostalAddress.result.address.postalAddress = 'not an object';

    expect(isProcessableResponse(invalidPostalAddress)).toBe(false);
  });

  it(`returns false if any properties of result.address.postalAddress are 
  missing, null, or otherwise invalid.`, () => {
    const postalAddressProperties = [
      'administrativeArea',
      'locality',
      'postalCode',
    ];

    for (const property of postalAddressProperties) {
      const missingProperty = getValidGoogleMapsAddressValidationResponse(
        address,
      ) as any;
      delete missingProperty.result.address.postalAddress[property];

      expect(isProcessableResponse(missingProperty)).toBe(false);

      const nullProperty = getValidGoogleMapsAddressValidationResponse(
        address,
      ) as any;
      nullProperty.result.address.postalAddress[property] = null;

      expect(isProcessableResponse(nullProperty)).toBe(false);

      const invalidProperty = getValidGoogleMapsAddressValidationResponse(
        address,
      ) as any;
      invalidProperty.result.address.postalAddress[property] = {};

      expect(isProcessableResponse(invalidProperty)).toBe(false);
    }
  });

  it(`returns false if result.address.postalAddress.addressLines is not an array 
  of strings.`, () => {
    const missingAddressLines = getValidGoogleMapsAddressValidationResponse(
      address,
    ) as any;
    delete missingAddressLines.result.address.postalAddress.addressLines;

    expect(isProcessableResponse(missingAddressLines)).toBe(false);

    const nullAddressLines = getValidGoogleMapsAddressValidationResponse(
      address,
    ) as any;
    nullAddressLines.result.address.postalAddress.addressLines = null;

    expect(isProcessableResponse(nullAddressLines)).toBe(false);

    const addressLinesIsNotArray = getValidGoogleMapsAddressValidationResponse(
      address,
    ) as any;
    addressLinesIsNotArray.result.address.postalAddress.addressLines = {};

    expect(isProcessableResponse(addressLinesIsNotArray)).toBe(false);

    const addressLinesContainsNonStrings =
      getValidGoogleMapsAddressValidationResponse(address) as any;
    addressLinesContainsNonStrings.result.address.postalAddress.addressLines = [
      {},
    ];

    expect(isProcessableResponse(addressLinesContainsNonStrings)).toBe(false);
  });

  it('returns false if result.address.addressComponents is missing.', () => {
    const missingAddressComponents =
      getValidGoogleMapsAddressValidationResponse(address) as any;
    delete missingAddressComponents.result.address.addressComponents;

    expect(isProcessableResponse(missingAddressComponents)).toBe(false);
  });

  it('returns false if result.address.addressComponents is null.', () => {
    const nullAddressComponents = getValidGoogleMapsAddressValidationResponse(
      address,
    ) as any;
    nullAddressComponents.result.address.addressComponents = null;

    expect(isProcessableResponse(nullAddressComponents)).toBe(false);
  });

  it('returns false if result.address.addressComponents is not an array.', () => {
    const addressComponentsIsNotArray =
      getValidGoogleMapsAddressValidationResponse(address) as any;
    addressComponentsIsNotArray.result.address.addressComponents = {};

    expect(isProcessableResponse(addressComponentsIsNotArray)).toBe(false);
  });

  it('returns false if result.address.addressComponents contains invalid components.', () => {
    const invalidComponents = {
      missingAllProperties: {},
      missingName: {
        componentType: 'locality',
        confirmationLevel: 'CONFIRMED',
      },
      nameIsNull: {
        componentName: null,
        componentType: 'locality',
        confirmationLevel: 'CONFIRMED',
      },
      nameIsNotObject: {
        componentName: 'not an object',
        componentType: 'locality',
        confirmationLevel: 'CONFIRMED',
      },
      missingNameDotText: {
        componentName: {},
        componentType: 'locality',
        confirmationLevel: 'CONFIRMED',
      },
      missingComponentType: {
        componentName: {
          text: address.city,
        },
        confirmationLevel: 'CONFIRMED',
      },
      componentTypeIsNotString: {
        componentName: {
          text: address.city,
        },
        componentType: {},
        confirmationLevel: 'CONFIRMED',
      },
      missingConfirmationLevel: {
        componentName: {
          text: address.city,
        },
        componentType: 'locality',
      },
      confirmationLevelIsNotString: {
        componentName: {
          text: address.city,
        },
        componentType: 'locality',
        confirmationLevel: {},
      },
    };

    for (const component of Object.values(invalidComponents)) {
      const hasInvalidAddressComponent =
        getValidGoogleMapsAddressValidationResponse(address) as any;
      hasInvalidAddressComponent.result.address.addressComponents = [component];

      expect(isProcessableResponse(hasInvalidAddressComponent)).toBe(false);
    }
  });

  it(`returns false if result.address.missingComponentTypes is present but null 
  or undefined.`, () => {
    const missingComponentTypesIsNullOrUndefined =
      getValidGoogleMapsAddressValidationResponse(address) as any;
    missingComponentTypesIsNullOrUndefined.result.address.missingComponentTypes =
      null;
    expect(isProcessableResponse(missingComponentTypesIsNullOrUndefined)).toBe(
      false,
    );

    missingComponentTypesIsNullOrUndefined.result.address.missingComponentTypes =
      undefined;
    expect(isProcessableResponse(missingComponentTypesIsNullOrUndefined)).toBe(
      false,
    );
  });

  it('returns false if result.address.missingComponentTypes is not an array.', () => {
    const missingComponentTypesIsNotArray =
      getValidGoogleMapsAddressValidationResponse(address) as any;
    missingComponentTypesIsNotArray.result.address.missingComponentTypes = {};

    expect(isProcessableResponse(missingComponentTypesIsNotArray)).toBe(false);
  });

  it('it returns false any items in result.address.missingComponentTypes are not strings.', () => {
    const missingComponentTypesContainsNonStrings =
      getValidGoogleMapsAddressValidationResponse(address) as any;
    missingComponentTypesContainsNonStrings.result.address.missingComponentTypes =
      [{}];

    expect(isProcessableResponse(missingComponentTypesContainsNonStrings)).toBe(
      false,
    );
  });
});
