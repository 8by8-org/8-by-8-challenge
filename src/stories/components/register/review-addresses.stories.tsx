import { Meta, StoryObj } from '@storybook/react';
import { Modal } from '@/components/utils/modal';
import { ReviewAddresses } from '@/app/register/addresses/address-confirmation-modal/review-addresses';
import { GlobalStylesProvider } from '@/stories/global-styles-provider';

const meta: Meta<typeof ReviewAddresses> = {
  component: ReviewAddresses,
};

export default meta;

type Story = StoryObj<typeof ReviewAddresses>;

export const AllAddresses: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <Modal
          ariaLabel="Review the addresses you entered."
          isOpen={true}
          closeModal={() => {}}
          theme="light"
        >
          <ReviewAddresses
            homeAddress={{
              streetLine1: '123 Fake St.',
              streetLine2: 'Apt. 3',
              city: 'Somewhereville',
              state: 'PA',
              zip: '12345',
            }}
            mailingAddress={{
              streetLine1: '123 Fake St.',
              streetLine2: 'Apt. 3',
              city: 'Somewhereville',
              state: 'PA',
              zip: '12345',
            }}
            previousAddress={{
              streetLine1: '123 Fake St.',
              streetLine2: 'Apt. 3',
              city: 'Somewhereville',
              state: 'PA',
              zip: '12345',
            }}
            returnToEditing={() => {}}
            continueToNextPage={() => {}}
          />
        </Modal>
      </GlobalStylesProvider>
    );
  },
};

export const HomeAddressOnly: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <Modal
          ariaLabel="Review the addresses you entered."
          isOpen={true}
          closeModal={() => {}}
          theme="light"
        >
          <ReviewAddresses
            homeAddress={{
              streetLine1: '123 Fake St.',
              streetLine2: 'Apt. 3',
              city: 'Somewhereville',
              state: 'PA',
              zip: '12345',
            }}
            returnToEditing={() => {}}
            continueToNextPage={() => {}}
          />
        </Modal>
      </GlobalStylesProvider>
    );
  },
};

export const HomeAndMailing: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <Modal
          ariaLabel="Review the addresses you entered."
          isOpen={true}
          closeModal={() => {}}
          theme="light"
        >
          <ReviewAddresses
            homeAddress={{
              streetLine1: '123 Fake St.',
              streetLine2: 'Apt. 3',
              city: 'Somewhereville',
              state: 'PA',
              zip: '12345',
            }}
            mailingAddress={{
              streetLine1: '123 Fake St.',
              streetLine2: 'Apt. 3',
              city: 'Somewhereville',
              state: 'PA',
              zip: '12345',
            }}
            returnToEditing={() => {}}
            continueToNextPage={() => {}}
          />
        </Modal>
      </GlobalStylesProvider>
    );
  },
};

export const HomeAndPrevious: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <Modal
          ariaLabel="Review the addresses you entered."
          isOpen={true}
          closeModal={() => {}}
          theme="light"
        >
          <ReviewAddresses
            homeAddress={{
              streetLine1: '123 Fake St.',
              streetLine2: 'Apt. 3',
              city: 'Somewhereville',
              state: 'PA',
              zip: '12345',
            }}
            previousAddress={{
              streetLine1: '123 Fake St.',
              streetLine2: 'Apt. 3',
              city: 'Somewhereville',
              state: 'PA',
              zip: '12345',
            }}
            returnToEditing={() => {}}
            continueToNextPage={() => {}}
          />
        </Modal>
      </GlobalStylesProvider>
    );
  },
};
