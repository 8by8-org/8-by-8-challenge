import { Meta, StoryObj } from '@storybook/react';
import { Alert, useAlert } from '@/components/utils/alert';
import { GlobalStylesProvider } from '@/stories/global-styles-provider';

const meta: Meta<typeof Alert> = {
  component: Alert,
};

export default meta;

type Story = StoryObj<typeof Alert>;

function ShowAlerts() {
  const { alertRef, showAlert } = useAlert();

  const showErrorAlert = () => {
    showAlert('Your error message here.', 'error');
  };

  const showSuccessAlert = () => {
    showAlert('Your success message here.', 'success');
  };

  return (
    <GlobalStylesProvider>
      <Alert ref={alertRef} />
      <button onClick={showErrorAlert}>Show Error Alert</button>
      <button onClick={showSuccessAlert}>Show Success Alert</button>
    </GlobalStylesProvider>
  );
}

export const Default: Story = {
  render: ShowAlerts,
};
