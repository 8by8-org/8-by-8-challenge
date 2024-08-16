import { Meta, StoryObj } from '@storybook/react';
import { MoreInfo } from '@/components/utils/more-info';
import { GlobalStylesProvider } from '@/stories/global-styles-provider';

const meta: Meta<typeof MoreInfo> = {
  component: MoreInfo,
};

export default meta;

type Story = StoryObj<typeof MoreInfo>;

export const Default: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <MoreInfo
          buttonAltText="Click for more information"
          dialogAriaLabel="More information about Lorem Ipsum"
          info={
            <p>
              Lorem ipsum odor amet, consectetuer adipiscing elit. Aeleifend
              magna dolor, nibh at metus eu habitant. Quam tempus suscipit amet
              nec ut blandit.
            </p>
          }
        />
      </GlobalStylesProvider>
    );
  },
};
