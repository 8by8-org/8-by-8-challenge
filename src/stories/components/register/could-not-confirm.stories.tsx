import { Meta, StoryObj } from '@storybook/react';
import { UnconfirmedComponents } from '@/app/register/addresses/address-confirmation-modal/unconfirmed-components/unconfirmed-components';
import { Modal } from '@/components/utils/modal';
import { GlobalStylesProvider } from '@/stories/global-styles-provider';

const meta: Meta<typeof UnconfirmedComponents> = {
  component: UnconfirmedComponents,
};

export default meta;

type Story = StoryObj<typeof UnconfirmedComponents>;

export const Default: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <Modal
          ariaLabel="Could not confirm address"
          theme="light"
          isOpen={true}
          closeModal={() => {}}
        >
          <UnconfirmedComponents
            unconfirmedComponents={{
              streetLine1: {
                value: '1600 Hamilton Parkway',
                hasIssue: true,
              },
              city: {
                value: 'Mountain View',
                hasIssue: false,
              },
              state: {
                value: 'CA',
                hasIssue: true,
              },
              zip: {
                value: '12345',
                hasIssue: true,
              },
            }}
            errorNumber={1}
            errorCount={1}
            returnToEditing={() => {}}
            nextOrContinue={() => {}}
          />
        </Modal>
      </GlobalStylesProvider>
    );
  },
};
