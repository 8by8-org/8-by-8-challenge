import { Meta, StoryObj } from '@storybook/react';
import { FormattedAddress } from '@/app/register/addresses/address-confirmation-modal/formatted-address';
import { GlobalStylesProvider } from '@/stories/global-styles-provider';

const meta: Meta<typeof FormattedAddress> = {
  component: FormattedAddress,
};

export default meta;

type Story = StoryObj<typeof FormattedAddress>;

export const NoEmphasizedItems: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <FormattedAddress
          address={{
            streetLine1: '123 Fake St',
            city: 'Somewhereville',
            state: 'PA',
            zip: '12345',
          }}
        />
      </GlobalStylesProvider>
    );
  },
};

export const NoEmphasizedItemsWithApt: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <FormattedAddress
          address={{
            streetLine1: '123 Fake St',
            streetLine2: 'Apt. 3',
            city: 'Somewhereville',
            state: 'PA',
            zip: '12345',
          }}
        />
      </GlobalStylesProvider>
    );
  },
};

export const AllEmphasizedItems: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <FormattedAddress
          address={{
            streetLine1: {
              text: '123 Fake St',
              isEmphasized: true,
            },
            streetLine2: {
              text: 'Apt. 3',
              isEmphasized: true,
            },
            city: {
              text: 'Somewhereville',
              isEmphasized: true,
            },
            state: {
              text: 'PA',
              isEmphasized: true,
            },
            zip: {
              text: '12345',
              isEmphasized: true,
            },
          }}
        />
      </GlobalStylesProvider>
    );
  },
};

export const SomeEmphasizedItems: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <FormattedAddress
          address={{
            streetLine1: {
              text: '123 Fake St',
              isEmphasized: true,
            },
            streetLine2: {
              text: 'Apt. 3',
              isEmphasized: false,
            },
            city: {
              text: 'Somewhereville',
              isEmphasized: false,
            },
            state: {
              text: 'PA',
              isEmphasized: true,
            },
            zip: {
              text: '12345',
              isEmphasized: true,
            },
          }}
        />
      </GlobalStylesProvider>
    );
  },
};

export const LongAddress: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <FormattedAddress
          style={{
            maxWidth: '359px',
            overflowWrap: 'break-word',
          }}
          address={{
            streetLine1: {
              text: '12345 Jean Baptiste Point du Sable Lake Shore Drive',
              isEmphasized: false,
            },
            streetLine2: {
              text: 'Apartment no. 1234',
              isEmphasized: false,
            },
            city: {
              text: 'Chargoggagoggmanchauggagoggchaubunagungamaugg',
              isEmphasized: false,
            },
            state: {
              text: 'MA',
              isEmphasized: false,
            },
            zip: {
              text: '12345',
              isEmphasized: false,
            },
          }}
        />
      </GlobalStylesProvider>
    );
  },
};
