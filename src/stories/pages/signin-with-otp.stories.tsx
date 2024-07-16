import { Meta, StoryObj } from '@storybook/react';
import SignInWithOTP from '@/app/signin-with-otp/page';
import { Builder } from 'builder-pattern';
import { UserContext, UserContextType } from '@/contexts/user-context';
import { AlertsContextProvider } from '@/contexts/alerts-context';
import { GlobalStylesProvider } from '../global-styles-provider';
import { Header } from '@/components/header';

const meta: Meta<typeof SignInWithOTP> = {
  component: SignInWithOTP,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;

type Story = StoryObj<typeof SignInWithOTP>;

export const Default: Story = {
  render: () => {
    const userContextValue = Builder<UserContextType>()
      .emailForSignIn('user@example.com')
      .signInWithOTP(async () => {
        return new Promise((_resolve, reject) => {
          setTimeout(() => {
            reject();
          }, 1000);
        });
      })
      .resendOTP(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
      })
      .build();

    return (
      <GlobalStylesProvider>
        <AlertsContextProvider>
          <UserContext.Provider value={userContextValue}>
            <Header />
            <SignInWithOTP />
          </UserContext.Provider>
        </AlertsContextProvider>
      </GlobalStylesProvider>
    );
  },
};
