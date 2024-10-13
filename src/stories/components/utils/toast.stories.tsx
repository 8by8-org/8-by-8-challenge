import { Meta, StoryObj } from '@storybook/react';
import { Toast, useToast } from '@/components/utils/toast';
import { GlobalStylesProvider } from '@/stories/global-styles-provider';

const meta: Meta<typeof Toast> = {
  component: Toast,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Toast>;

function ShowToast() {
  const { toastRef, showToast } = useToast();

  return (
    <GlobalStylesProvider>
      <div style={{ position: 'relative' }}>
        <button onClick={() => showToast('Hi there!')}>Show Toast</button>
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            paddingTop: '16px',
          }}
        >
          <Toast ref={toastRef} />
        </div>
      </div>
    </GlobalStylesProvider>
  );
}

export const Default: Story = {
  render: ShowToast,
};
