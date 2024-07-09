import Image from 'next/image';
import { useContextSafely } from '../../../hooks/use-context-safely';
import { FaBars } from 'react-icons/fa';
import { HeaderContext } from '../header-context';
import { HamburgerMenuState } from '../header-context';
import feedback from '../../../../public/static/images/components/header/feedback-icon.svg';
import styles from './styles.module.scss';

export function IconsTray() {
  const { hamburgerMenuState, openHamburgerMenu, openHamburgerMenuBtnRef } =
    useContextSafely(HeaderContext, 'IconsTray');

  return (
    <div
      className={
        hamburgerMenuState !== HamburgerMenuState.open ?
          styles.icons_tray
        : 'hidden'
      }
    >
      <button
        onClick={() =>
          window.open('https://forms.gle/r33L2NAKT69MrvsZ7', '_blank')
        }
        className={styles.feedback_btn}
        aria-label="open feedback form"
      >
        <Image
          src={feedback}
          alt="feedback icon"
          className={styles.feedback_btn_icon}
        />
      </button>
      <button
        className={styles.hamburger_btn}
        onClick={openHamburgerMenu}
        aria-label="open navigation menu"
        ref={openHamburgerMenuBtnRef}
      >
        <FaBars />
      </button>
    </div>
  );
}
