import { Meta, StoryObj } from '@storybook/react';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import Share from '@/app/share/share'; 
import { Builder } from 'builder-pattern';
import { GlobalStylesProvider } from '../global-styles-provider';
import { Header } from '@/components/header';
import { AlertsContextProvider } from '@/contexts/alerts-context';
import { Footer } from '@/components/footer';
import type { User } from '@/model/types/user';

 
const meta: Meta<typeof Share> = {
    component: Share,
    parameters: {
      layout: 'fullscreen',
      nextjs: {
        appDirectory: true,
      },
    },
  };


  export default meta;

type Story = StoryObj<typeof Share>;
  

export const Default: Story = {
  render: () => {
        const userContextValue = Builder<UserContextType>()
            .user(Builder<User>().inviteCode('testeruser').build())
            .shareChallenge(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                       resolve()
                   }, 1000)
                }) 
            })
      .build();
    return (
      <GlobalStylesProvider>
        <AlertsContextProvider>
          <UserContext.Provider value={userContextValue}>
          
                    <Share shareLink={'http://localhost:3000/SHARE'} />
                <Footer/>
          </UserContext.Provider>
        </AlertsContextProvider>
      </GlobalStylesProvider>
    );
  },
};
