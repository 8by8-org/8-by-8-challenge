import '@testing-library/jest-dom';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import ShareButton from '@/app/share/share-button/share-button';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { Builder } from 'builder-pattern';
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';
import type { User } from '@/model/types/user';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { SearchParams } from '@/constants/search-params';
import { createId } from '@paralleldrive/cuid2';


jest.mock('next/navigation', () => require('next-router-mock'));


describe('ShareButton', () => {
    mockDialogMethods();
    afterEach(cleanup);
    it('should render the share button if the Share API is available in the browser',  async () => { 
   
        jest.spyOn(navigator, 'share').mockImplementation(jest.fn())
        jest.spyOn(navigator, 'canShare').mockImplementation(() => true) 
         
        const sharelink = `https://challenge.8by8.us/share?${SearchParams.InviteCode}=`;
        const inviteCode = createId();
        
        const userContextValue = Builder<UserContextType>()
          .user(Builder<User>().inviteCode(inviteCode).build())
          .shareChallenge(jest.fn())
          .build();
      
        render(
          <AlertsContextProvider>
            <UserContext.Provider value={userContextValue}>
              <SharePage shareLink={sharelink} />
            </UserContext.Provider>
          </AlertsContextProvider>
        );
    
    
        // Check if the share button is rendered automatically
        const shareButton = await screen.findByTestId('share-button');
        expect(shareButton).toBeInTheDocument();
    
      });
})