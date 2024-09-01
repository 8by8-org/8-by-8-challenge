import { Meta, StoryObj } from '@storybook/react';
import { CouldNotConfirm } from '@/app/register/addresses/address-confirmation-modal/could-not-confirm/could-not-confirm';
import { Modal } from '@/components/utils/modal';
import { GlobalStylesProvider } from '@/stories/global-styles-provider';

const meta: Meta<typeof CouldNotConfirm> = {
  component: CouldNotConfirm,
};

export default meta;

type Story = StoryObj<typeof CouldNotConfirm>;

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
          <CouldNotConfirm
            enteredAddress={{
              streetLine1: {
                text: '1600 Hamilton Parkway',
                isEmphasized: true,
              },
              city: {
                text: 'Mountain View',
                isEmphasized: false,
              },
              state: {
                text: 'CA',
                isEmphasized: true,
              },
              zip: {
                text: '12345',
                isEmphasized: true,
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
