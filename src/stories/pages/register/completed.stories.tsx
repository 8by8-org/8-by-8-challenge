import { Meta, StoryObj } from '@storybook/react';
import { RegistrationCompleted } from '@/app/register/completed/completed';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { AlertsContextProvider } from '@/contexts/alerts-context';
import { GlobalStylesProvider } from '@/stories/global-styles-provider';
import { Builder } from 'builder-pattern';
import { UserType } from '@/model/enums/user-type';
import { PageContainer } from '@/components/utils/page-container';
import type { User } from '@/model/types/user';

const meta: Meta<typeof RegistrationCompleted> = {
  component: RegistrationCompleted,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;

type Story = StoryObj<typeof RegistrationCompleted>;

export const LoadedPDFUrl: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <AlertsContextProvider>
          <UserContext.Provider
            value={Builder<UserContextType>()
              .user(Builder<User>().type(UserType.Challenger).build())
              .build()}
          >
            <PageContainer>
              <div style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                <RegistrationCompleted pdfUrl="https://example.com" />
              </div>
            </PageContainer>
          </UserContext.Provider>
        </AlertsContextProvider>
      </GlobalStylesProvider>
    );
  },
};

export const CouldNotLoadPDFUrl: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <AlertsContextProvider>
          <UserContext.Provider
            value={Builder<UserContextType>()
              .user(Builder<User>().type(UserType.Challenger).build())
              .build()}
          >
            <PageContainer>
              <div style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                <RegistrationCompleted pdfUrl="" />
              </div>
            </PageContainer>
          </UserContext.Provider>
        </AlertsContextProvider>
      </GlobalStylesProvider>
    );
  },
};
