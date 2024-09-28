import '@testing-library/jest-dom'
import { render, screen, cleanup } from '@testing-library/react'
import SharePage from '@/app/share/share';
import { UserContext, type UserContextType  } from '@/contexts/user-context';
import { Builder } from 'builder-pattern'; 
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';
import type { User } from '@/model/types/user';
import "@testing-library/jest-dom" 
import userEvent from '@testing-library/user-event';
import { SearchParams  } from '@/constants/search-params';
import { createId } from '@paralleldrive/cuid2';


jest.mock('next/navigation', () => require('next-router-mock'));


describe('SharePage', () => {
  mockDialogMethods()
  afterEach(cleanup);
  it('renders a heading', () => {
    const user = Builder<User>().inviteCode("").build();
    const userContextValue = Builder<UserContextType>().user(user).shareChallenge(jest.fn()).build();
    render(
      <UserContext.Provider value={userContextValue}>    <SharePage shareLink="test" /> </UserContext.Provider>
    )
    expect(screen.getAllByText(/invite friends/i).length).toBeGreaterThan(0)
  })

  it('should copy the link if the user clicks on the copylink button', async () => {
    const sharelink = `https://challenge.8by8.us/share?${SearchParams.InviteCode}=`;
    const inviteCode = createId()
    const user = userEvent.setup();
    const userContextValue = Builder<UserContextType>().user(Builder<User>().inviteCode(inviteCode).build()).shareChallenge(jest.fn()).build();
    render(
      <UserContext.Provider value={userContextValue}>    <SharePage shareLink={sharelink} /> </UserContext.Provider>
    )
    const copyLinkbutton = screen.getByAltText("copy-link")
    await user.click(copyLinkbutton); 
    const copiedLink = await navigator.clipboard.readText();
    console.log(copiedLink)
    expect(copiedLink).toBe(sharelink +  inviteCode)
  })
})




