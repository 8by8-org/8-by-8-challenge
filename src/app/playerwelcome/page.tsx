'use client';
import { PageContainer } from '@/components/utils/page-container';
import Image from 'next/image';
import { UserContext } from '@/contexts/user-context';
import { useContextSafely } from '@/hooks/use-context-safely';
import styles from './styles.module.scss';
import { Button } from '@/components/utils/button';

export default function PlayerWelcome() {
  const { invitedBy } = useContextSafely(UserContext, 'UserContext');
  const challengerName = invitedBy?.challengerName ?? 'your challenger';

  return (
    <PageContainer>
      <div className={styles.maincontent}>
        <span>
          <h1>Support {challengerName}'s 8by8 Challenge!</h1>
        </span>
        <p>
          Help {challengerName} win their 8by8 Challenge by registering to vote
          or taking other actions to #stopasianhate!
        </p>
        <Button className={styles.Button}>Get started</Button>
        <span className={styles.signin_link}>
          Already have an account? Sign In
        </span>

        <div id="welcomecolumn">
          <h1 className={styles.centeredtext}>Here's how it works</h1>
          <h2>1. Choose an action to take</h2>
          <p>
            You can take any number of available actions: register to vote, get
            election reminders, or take the 8by8 challenge yourself. Pick one to
            start.
          </p>
          <Image
            src="/static/images/pages/player-welcome/person-with-take-action-sign.png"
            width={120}
            height={120}
            alt="person holding a take action sign"
            className={styles.person_with_sign}
          />
          <br />

          <h2>2. Your friend will earn a badge</h2>
          <p>
            Any of the 3 actions will helf your friend earn a badge, and get
            closer to winning the challenge.
          </p>
          <Image
            src="/static/images/pages/player-welcome/cell-phone.png"
            width={120}
            height={120}
            alt="cell phone with a crown image on the screen"
            className={styles.cell_phone}
          />
          <br />

          <h2>3. Come back and take more actions</h2>
          <p>
            Whether it is to help the same friend or a different one, the more
            action you take, the better! Note that you can only earn one badge
            per friend.
          </p>
          <Image
            src="/static/images/pages/player-welcome/person-with-we-need-your-help-sign.png"
            width={120}
            height={120}
            alt="person holding a sign saying we need your help"
            className={styles.help_sign}
          />
          <br />

          <div>
            <Button className={styles.Button}>Get started</Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
