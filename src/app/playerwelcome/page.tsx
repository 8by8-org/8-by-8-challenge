import { PageContainer } from '@/components/utils/page-container';
import { UserContext } from '@/contexts/user-context';
import { useContextSafely } from '@/hooks/use-context-safely';

import styles from './styles.module.scss';

export default function PlayerWelcome() {
  const { invitedBy } = useContextSafely(UserContext, 'UserContext');

  return (
    <PageContainer>
      <div>
        <span>
          <h1>Support {}'s 8by8 Challenge!</h1>
        </span>
        <span>
          Help {} win their 8by8 Challenge by registering to vote or taking
          other actions to #stopasianhate!
        </span>
        <button className={styles._buttons}>Get started</button>
      </div>

      <div className={styles.welcomeColumn}>
        <div className={styles.explanation}>
          <h1>Here's how it works</h1>
          <h2>1. Choose an action to take</h2>
          <p>
            You can take any number of available actions: register to vote, get
            election reminders, or take the 8by8 challenge yourself. Pick one to
            start.
          </p>

          <h2>2. Your friend will earn a badge</h2>
          <p>
            Any of the 3 actions will helf your friend earn a badge, and get
            closer to winning the challenge.
          </p>

          <h2>3. Come back and take more actions</h2>
          <p>
            Whether it is to help the same friend or a different one, the more
            action you take, the better! Note that you can only earn one badge
            per friend.
          </p>
        </div>
        <div>
          <button className={styles._buttons}>Get started</button>
        </div>
      </div>
    </PageContainer>
  );
}
