import { Meta, StoryObj } from '@storybook/react';
import SignIn from '@/app/signin/page';
import { Builder } from 'builder-pattern';
import { UserContext, UserContextType } from '@/contexts/user-context';
import { GlobalStylesProvider } from '../global-styles-provider';
import { Header } from '@/components/header';

const meta: Meta<typeof SignIn> = {
  component: SignIn,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof SignIn>;

export const Default: Story = {
  render: () => {
    const userContextValue = Builder<UserContextType>()
      .sendOTPToEmail(() => {
        throw new Error();
      })
      .build();

    return (
      <GlobalStylesProvider>
        <UserContext.Provider value={userContextValue}>
          <Header />
          <SignIn />
        </UserContext.Provider>
      </GlobalStylesProvider>
    );
  },
};
