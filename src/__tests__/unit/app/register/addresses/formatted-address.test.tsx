import { render, screen, cleanup } from '@testing-library/react';
import { FormattedAddress } from '@/app/register/addresses/address-confirmation-modal/formatted-address';

describe('FormattedAddress', () => {
  afterEach(cleanup);

  it('applies the emphasized class to any address components with issues.', () => {
    const address = {
      streetLine1: {
        value: '123 Fake St',
        hasIssue: true,
      },
      streetLine2: {
        value: 'Apartment 10000',
        hasIssue: true,
      },
      city: {
        value: 'Nowhereville',
        hasIssue: true,
      },
      state: {
        value: 'SK',
        hasIssue: true,
      },
      zip: {
        value: '00000',
        hasIssue: true,
      },
    };

    render(<FormattedAddress address={address} />);

    for (const { value } of Object.values(address)) {
      const addressElement = screen.getByText(value);
      expect(addressElement.classList.contains('emphasized_text')).toBe(true);
    }
  });

  it('does not apply the emphasized class to address components without issues.', () => {
    const address = {
      streetLine1: {
        value: '123 Some Real St',
        hasIssue: false,
      },
      streetLine2: {
        value: 'Apartment A',
        hasIssue: false,
      },
      city: {
        value: 'Philadelphia',
        hasIssue: false,
      },
      state: {
        value: 'PA',
        hasIssue: false,
      },
      zip: {
        value: '19122',
        hasIssue: false,
      },
    };

    render(<FormattedAddress address={address} />);

    for (const { value } of Object.values(address)) {
      const addressElement = screen.getByText(value);
      expect(addressElement.classList.contains('normal_text')).toBe(true);
    }
  });

  it('does not apply the emphasized class to string-type address components.', () => {
    const address = {
      streetLine1: '123 Some Real St',
      streetLine2: 'Apartment A',
      city: 'Philadelphia',
      state: 'PA',
      zip: '19122',
    };

    render(<FormattedAddress address={address} />);

    for (const value of Object.values(address)) {
      const addressElement = screen.getByText(value);
      expect(addressElement.classList.contains('normal_text')).toBe(true);
    }
  });

  it('applies the classname it receives to the address element.', () => {
    const address = {
      streetLine1: '123 Some Real St',
      streetLine2: 'Apartment A',
      city: 'Philadelphia',
      state: 'PA',
      zip: '19122',
    };

    const className = 'test';
    render(<FormattedAddress address={address} className={className} />);
    expect(document.getElementsByClassName(className).length).toBe(1);
  });
});
