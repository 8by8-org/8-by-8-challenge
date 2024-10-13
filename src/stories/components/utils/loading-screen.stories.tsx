import { Meta, StoryObj } from '@storybook/react';
import { LoadingScreen } from '@/components/utils/loading-screen';
import { GlobalStylesProvider } from '@/stories/global-styles-provider';
import { AlertsContextProvider } from '@/contexts/alerts-context';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const meta: Meta<typeof LoadingScreen> = {
  component: LoadingScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof LoadingScreen>;

export const Default: Story = {
  render: () => (
    <GlobalStylesProvider>
      <AlertsContextProvider>
        <UserContext.Provider
          value={
            {
              user: null,
            } as UserContextType
          }
        >
          <Header />
          <LoadingScreen />
          <Footer />
        </UserContext.Provider>
      </AlertsContextProvider>
    </GlobalStylesProvider>
  ),
};
