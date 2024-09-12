import { Meta, StoryObj } from '@storybook/react';
import NotFound from '@/app/not-found';
import { GlobalStylesProvider } from '@/stories/global-styles-provider';

const meta: Meta<typeof NotFound> = {
  component: NotFound,
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<typeof NotFound>;

export const Default: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <NotFound></NotFound>
      </GlobalStylesProvider>
    );
  },
};
