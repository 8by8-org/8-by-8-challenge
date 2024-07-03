import '@testing-library/jest-dom';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Builder } from 'builder-pattern';
import { IconsTray } from '@/components/header/icons-tray';
import { useRef, type PropsWithChildren } from 'react';
import {
  HamburgerMenuState,
  HeaderContext,
  HeaderContextType,
} from '@/components/header/header-context';
import styles from '@/styles/modules/components/header/icons-tray.module.scss';

describe('IconsTray', () => {
  afterEach(cleanup);

  it('renders an outer div with a class of "hidden" when hamburgerMenuState is open', () => {
    render(
      <MockHeaderCtx
        menuState={HamburgerMenuState.open}
        openHamburgerMenu={jest.fn()}
      >
        <IconsTray />
      </MockHeaderCtx>,
    );
    const hiddenElements = document.getElementsByClassName('hidden');
    expect(hiddenElements.length).toBe(1);
  });

  it(`renders an outer div with a class of ${styles.icons_tray} when hamburgerMenuState is not open`, () => {
    render(
      <MockHeaderCtx
        menuState={HamburgerMenuState.closed}
        openHamburgerMenu={jest.fn()}
      >
        <IconsTray />
      </MockHeaderCtx>,
    );
    const hiddenElements = document.getElementsByClassName(styles.icons_tray);
    expect(hiddenElements.length).toBe(1);
  });

  it('opens the feedback form when the feedback button is clicked.', async () => {
    const user = userEvent.setup();
    window.open = jest.fn();
    render(
      <MockHeaderCtx
        menuState={HamburgerMenuState.closed}
        openHamburgerMenu={jest.fn()}
      >
        <IconsTray />
      </MockHeaderCtx>,
    );
    const feedbackBtn = screen.getByLabelText('open feedback form');
    await user.click(feedbackBtn);
    expect(window.open).toHaveBeenCalledWith(
      'https://forms.gle/r33L2NAKT69MrvsZ7',
      '_blank',
    );
  });

  it('calls openHamburgerMenu when the open hamburger button is clicked.', async () => {
    const user = userEvent.setup();
    const openHamburgerMenu = jest.fn();
    render(
      <MockHeaderCtx
        menuState={HamburgerMenuState.closed}
        openHamburgerMenu={openHamburgerMenu}
      >
        <IconsTray />
      </MockHeaderCtx>,
    );
    const openHamburgerMenuBtn = screen.getByLabelText('open navigation menu');
    await user.click(openHamburgerMenuBtn);
    expect(openHamburgerMenu).toHaveBeenCalled();
  });
});

type MockHeaderCtxProps = PropsWithChildren & {
  menuState: HamburgerMenuState;
  openHamburgerMenu: () => void;
};

function MockHeaderCtx({
  menuState,
  openHamburgerMenu,
  children,
}: MockHeaderCtxProps) {
  const headerCtxValue = Builder<HeaderContextType>()
    .hamburgerMenuState(menuState)
    .openHamburgerMenuBtnRef(useRef<HTMLButtonElement>(null))
    .openHamburgerMenu(openHamburgerMenu)
    .build();

  return (
    <HeaderContext.Provider value={headerCtxValue}>
      {children}
    </HeaderContext.Provider>
  );
}
