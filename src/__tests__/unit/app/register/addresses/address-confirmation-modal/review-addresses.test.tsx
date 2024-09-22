import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReviewAddresses } from '@/app/register/addresses/address-confirmation-modal/review-addresses';

describe('ReviewAddresses', () => {
  afterEach(cleanup);

  const addresses = [
    {
      streetLine1: '123 Elm Street',
      streetLine2: 'Apt 4B',
      city: 'Springfield',
      state: 'IL',
      zip: '62704',
    },
    {
      streetLine1: '456 Maple Avenue',
      city: 'Riverside',
      state: 'CA',
      zip: '92501',
    },
    {
      streetLine1: '789 Oak Drive',
      streetLine2: 'Suite 300',
      city: 'Dallas',
      state: 'TX',
      zip: '75201',
    },
  ];

  it(`renders all the addresses it receives.`, () => {
    render(
      <ReviewAddresses
        homeAddress={addresses[0]}
        mailingAddress={addresses[1]}
        previousAddress={addresses[2]}
        returnToEditing={jest.fn()}
        continueToNextPage={jest.fn()}
      />,
    );

    for (const address of addresses) {
      for (const addressComponent of Object.values(address)) {
        expect(screen.queryByText(addressComponent)).toBeInTheDocument();
      }
    }
  });

  it('renders different text depending on the number of addresses it received.', () => {
    render(
      <ReviewAddresses
        homeAddress={addresses[0]}
        returnToEditing={jest.fn()}
        continueToNextPage={jest.fn()}
      />,
    );

    expect(
      screen.queryByText(/this is the address you entered/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/these are the addresses you entered/i),
    ).not.toBeInTheDocument();

    cleanup();
    render(
      <ReviewAddresses
        homeAddress={addresses[0]}
        mailingAddress={addresses[1]}
        returnToEditing={jest.fn()}
        continueToNextPage={jest.fn()}
      />,
    );

    expect(
      screen.queryByText(/these are the addresses you entered/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/this is the address you entered/i),
    ).not.toBeInTheDocument();

    cleanup();
    render(
      <ReviewAddresses
        homeAddress={addresses[0]}
        previousAddress={addresses[2]}
        returnToEditing={jest.fn()}
        continueToNextPage={jest.fn()}
      />,
    );

    expect(
      screen.queryByText(/these are the addresses you entered/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/this is the address you entered/i),
    ).not.toBeInTheDocument();

    cleanup();
    render(
      <ReviewAddresses
        homeAddress={addresses[0]}
        mailingAddress={addresses[1]}
        previousAddress={addresses[2]}
        returnToEditing={jest.fn()}
        continueToNextPage={jest.fn()}
      />,
    );

    expect(
      screen.queryByText(/these are the addresses you entered/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/this is the address you entered/i),
    ).not.toBeInTheDocument();
  });
});
