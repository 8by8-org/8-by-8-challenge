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
              value: '123 Fake St',
              hasIssue: true,
            },
            streetLine2: {
              value: 'Apt. 3',
              hasIssue: true,
            },
            city: {
              value: 'Somewhereville',
              hasIssue: true,
            },
            state: {
              value: 'PA',
              hasIssue: true,
            },
            zip: {
              value: '12345',
              hasIssue: true,
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
              value: '123 Fake St',
              hasIssue: true,
            },
            streetLine2: {
              value: 'Apt. 3',
              hasIssue: false,
            },
            city: {
              value: 'Somewhereville',
              hasIssue: false,
            },
            state: {
              value: 'PA',
              hasIssue: true,
            },
            zip: {
              value: '12345',
              hasIssue: true,
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
              value: '12345 Jean Baptiste Point du Sable Lake Shore Drive',
              hasIssue: false,
            },
            streetLine2: {
              value: 'Apartment no. 1234',
              hasIssue: false,
            },
            city: {
              value: 'Chargoggagoggmanchauggagoggchaubunagungamaugg',
              hasIssue: false,
            },
            state: {
              value: 'MA',
              hasIssue: false,
            },
            zip: {
              value: '12345',
              hasIssue: false,
            },
          }}
        />
      </GlobalStylesProvider>
    );
  },
};
