'use client';
import { PageContainer } from '@/components/utils/page-container';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserContext } from '@/contexts/user-context';
import { useContextSafely } from '@/hooks/use-context-safely';
import styles from './styles.module.scss';
import { Button } from '@/components/utils/button';

export default function PlayerWelcome() {
  const { invitedBy } = useContextSafely(UserContext, 'UserContext');
  const challengerName =
    invitedBy?.challengerName ? `${invitedBy.challengerName}'s` : 'the';
  const subtitleText =
    invitedBy ?
      `Help ${invitedBy.challengerName} win their 8by8 Challenge by registering to vote or taking other actions to #stopasianhate!`
    : 'Help support the AAPI community by registering to vote or taking other actions to #stopasianhate!';

  const router = useRouter();
  useEffect(() => {
    router.prefetch('/signup');
  }, [router]);

  return (
    <PageContainer>
      <div className={styles.banner}>
        <h1 className="mt_md mb_md">
          <span className="underline">Support</span> {challengerName}
          <br /> 8by8 Challenge!
        </h1>
        <p className={styles.subtitle}>{subtitleText}</p>
        <Button
          size="lg"
          wide
          onClick={() => {
            router.push('/signup');
          }}
        >
          Get started
        </Button>
        <p className={styles.signin_link}>
          Already have an account?{' '}
          <Link href="/signin" className="link--teal">
            Sign In
          </Link>
        </p>
      </div>

      <div className={styles.curve}></div>

      <div className={styles.explanation}>
        <h1 className={styles.title}>
          <span className="underline">Here&apos;s how it works</span>
        </h1>
        <div>
          <h3>1. Choose an action to take</h3>
          <p className={styles.b2_extend}>
            You can take any number of available actions: register to vote, get
            election reminders, or take the 8by8 challenge yourself. Pick one to
            start.
          </p>
          <div className={styles.images}>
            <Image
              src="/static/images/pages/playerwelcome/person-with-take-action-sign.png"
              width={206}
              height={139}
              alt="person holding a take action sign"
            />
          </div>

          <h3>2. Your friend will earn a badge</h3>
          <p className={styles.b2_extend}>
            Any of the 3 actions will helf your friend earn a badge, and get
            closer to winning the challenge.
          </p>
          <div className={styles.images}>
            <Image
              src="/static/images/pages/playerwelcome/cell-phone.png"
              width={128}
              height={127}
              alt="cell phone with a crown image on the screen"
            />
          </div>

          <h3>3. Come back and take more actions</h3>
          <p className={styles.b2_extend}>
            Whether it is to help the same friend or a different one, the more
            action you take, the better! Note that you can only earn one badge
            per friend.
          </p>
          <div className={styles.image_last}>
            <Image
              src="/static/images/pages/playerwelcome/person-with-we-need-your-help-sign.png"
              width={141}
              height={141}
              alt="person holding a sign saying we need your help"
            />
          </div>

          <div>
            <Button
              size="lg"
              wide
              onClick={() => {
                router.push('/signup');
              }}
            >
              Get started
            </Button>
          </div>
          <p className={styles.signin_link}>
            Already have an account?{' '}
            <Link href="/signin" className="link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
