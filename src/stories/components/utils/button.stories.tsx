import { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../../components/utils/button';
import { GlobalStylesProvider } from '../../global-styles-provider';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const GradientLarge: Story = {
  render: () => (
    <GlobalStylesProvider>
      <Button variant="btn_gradient" size="btn_lg">
        Gradient Button
      </Button>
    </GlobalStylesProvider>
  ),
};

export const InvertedSmall: Story = {
  render: () => (
    <GlobalStylesProvider>
      <Button variant="btn_inverted" size="btn_sm">
        Inverted Button
      </Button>
    </GlobalStylesProvider>
  ),
};

export const WideGradientLarge: Story = {
  render: () => (
    <GlobalStylesProvider>
      <Button variant="btn_gradient" size="btn_lg" wide>
        Wide Gradient Button
      </Button>
    </GlobalStylesProvider>
  ),
};

export const GradientSmall: Story = {
  render: () => (
    <GlobalStylesProvider>
      <Button variant="btn_gradient" size="btn_sm">
        Gradient Button
      </Button>
    </GlobalStylesProvider>
  ),
};

export const InvertedLarge: Story = {
  render: () => (
    <GlobalStylesProvider>
      <Button variant="btn_inverted" size="btn_lg">
        Inverted Button
      </Button>
    </GlobalStylesProvider>
  ),
};

export const WideInvertedSmall: Story = {
  render: () => (
    <GlobalStylesProvider>
      <Button variant="btn_inverted" size="btn_sm" wide>
        Wide Inverted Button
      </Button>
    </GlobalStylesProvider>
  ),
};
