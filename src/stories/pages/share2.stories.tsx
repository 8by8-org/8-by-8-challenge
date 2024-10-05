import { Meta, StoryObj } from '@storybook/react'; 
import { UserContext,  type UserContextType} from '@/contexts/user-context';
import { GlobalStylesProvider } from '../global-styles-provider';
import { AlertsContextProvider } from '@/contexts/alerts-context';
import { Builder } from 'builder-pattern'; 
import { createId } from '@paralleldrive/cuid2';
import { SearchParams } from '@/constants/search-params';
import { Footer } from '@/components/footer'; 
import type { User } from '@/model/types/user';
import { Share2 } from '@/app/share2/share'; 


const meta: Meta<typeof Share2> = {
    component: Share2,
    parameters: {
      layout: 'fullscreen',
      nextjs: {
        appDirectory: true,
      },
    },
  };


  export default meta;

type Story = StoryObj<typeof Share2>;
  

export const ShowShareButton: Story = {
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
          
                    <Share2 shareLink={'http://localhost:3000/SHARE'} />
                <Footer/>
          </UserContext.Provider>
        </AlertsContextProvider>
      </GlobalStylesProvider>
    );
  },
};

export const HideShareButton: Story = {
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
          
                    <Share2 shareLink={'http://localhost:3000/SHARE'} hideShareButton />
                <Footer/>
          </UserContext.Provider>
        </AlertsContextProvider>
      </GlobalStylesProvider>
    );
  },
};
