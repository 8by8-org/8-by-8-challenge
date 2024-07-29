import '@testing-library/jest-dom';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Builder } from 'builder-pattern';
import { HamburgerLink } from '@/components/header/hamburger-menu/links/hamburger-link';
import {
  HeaderContext,
  HeaderContextType,
} from '@/components/header/header-context';

describe('HamburgerLink', () => {
  afterEach(cleanup);
  it('renders a link inside an li', () => {
    const headerCtxValue = Builder<HeaderContextType>().build();
    render(
      <HeaderContext.Provider value={headerCtxValue}>
        <HamburgerLink href={'/'}>Test Link</HamburgerLink>
      </HeaderContext.Provider>,
    );
    const li = screen.queryByRole('listitem');
    const link = screen.queryByRole('link');
    expect(li).toContainElement(link);
  });

  it('calls closeHamburgerMenu when clicked', async () => {
    const closeHamburgerMenu = jest.fn();
    const headerCtxValue = Builder<HeaderContextType>()
      .closeHamburgerMenu(closeHamburgerMenu)
      .build();
    const user = userEvent.setup();
    render(
      <HeaderContext.Provider value={headerCtxValue}>
        <HamburgerLink href={'/'}>Test Link</HamburgerLink>
      </HeaderContext.Provider>,
    );
    const link = screen.getByRole('link');
    await user.click(link);
    expect(closeHamburgerMenu).toHaveBeenCalled();
  });
});
