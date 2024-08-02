import { Meta, StoryObj } from '@storybook/react';
import { PageContainer } from '@/components/utils/page-container';
import { GlobalStylesProvider } from '@/stories/global-styles-provider';
import { UserContext } from '@/contexts/user-context';
import { AlertsContextProvider} from '@/contexts/alerts-context';
import { UserContextType } from '@/contexts/user-context/user-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const meta: Meta<typeof PageContainer> = {
    component : PageContainer,
    parameters: {
        layout : 'fullscreen'

    }
};

export default meta;

type Story = StoryObj<typeof PageContainer>;

export const  empty : Story = {
    render : () => {
        return (
            <GlobalStylesProvider>
                <AlertsContextProvider>
                    <UserContext.Provider 
                              value={
                                {
                                  user: null,
                                } as UserContextType
                              }>
                        <Header/>
                        <PageContainer/>
                        <Footer/>
                    </UserContext.Provider>
                </AlertsContextProvider>
            </GlobalStylesProvider>
        )
    }
}