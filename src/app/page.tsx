'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isSignedOut } from '@/components/guards/is-signed-out';
import { PageContainer } from '@/components/utils/page-container';
import { Button } from '@/components/utils/button';
import logo from '../../public/static/images/shared/8by8-logo.svg';
import yellowCurve from '../../public/static/images/pages/home/yellow-curve.svg';
import tealCurve from '../../public/static/images/pages/home/teal-curve.svg';
import blackCurve from '../../public/static/images/pages/home/black-curve.svg';
import speechBubble1 from '../../public/static/images/pages/home/speech-bubble-1.png';
import speechBubble2 from '../../public/static/images/pages/home/speech-bubble-2.png';
import speechBubble3 from '../../public/static/images/pages/home/speech-bubble-3.png';
import fatherAndDaughterWithSign from '../../public/static/images/pages/home/father-and-daughter-with-sign.png';
import speakerWithMicAndSign from '../../public/static/images/pages/home/speaker-with-mic-and-sign.png';
import styles from './styles.module.scss';

export default isSignedOut(function Home() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/challengerwelcome');
  }, [router]);

  return (
    <PageContainer>
      <section className={styles.section_1}>
        <div className={styles.content_container}>
          <Image className={styles.logo} src={logo} alt="8by8 Logo" />
          <h1 className="color_white">
            GET <u className="underline">8 AAPI FRIENDS</u> TO REGISTER TO VOTE
            IN <u className="underline">8 DAYS</u>
          </h1>
          <Button
            onClick={() => router.push('/challengerwelcome')}
            className={styles.challenge_btn}
            wide
          >
            Take the Challenge
          </Button>
          <Link href="/why8by8" className={styles.link}>
            See why others are doing it
          </Link>
        </div>
      </section>

      <div className={styles.curve_container}>
        <Image
          className={styles.curve_1}
          id="why8by8"
          src={yellowCurve}
          alt="yellow curve"
          priority={true}
        />
      </div>

      <section className={styles.section_2}>
        <Image
          className={styles.speech_bubble}
          src={speechBubble1}
          alt="why 8by8?"
        />
        <Image
          className={styles.sign}
          src={fatherAndDaughterWithSign}
          alt="sign"
        />
      </section>

      <section className={styles.section_3}>
        <p>
          In 2020, we saw an unprecedented{' '}
          <b>
            150% spike in anti-AAPI (Asian American Pacific Islander) hate
            crimes
          </b>
          , a trend that is already continuing into 2021. This is both a
          national and a local problem.
        </p>
      </section>

      <div className={styles.curve_container}>
        <Image className={styles.curve} src={tealCurve} alt="teal curve" />
      </div>

      <section className={styles.section_4}>
        <h2 className="h2">
          <span className={styles.bold_shadow_text}>150%</span> spike in
          anti-Asian and anti-AAPI hate crimes in 2020
        </h2>
      </section>

      <section className={styles.section_5}>
        <Image
          className={styles.speech_bubble}
          src={speechBubble2}
          alt="solution?"
        />
        <h1 className={styles.section_heading}>
          We need
          <br /> more aapi
          <br /> voters
        </h1>
        <Image className={styles.mic} src={speakerWithMicAndSign} alt="mic" />
      </section>

      <section className={styles.section_6}>
        <h2 className={styles.section_heading}>
          the path to fixing this problem starts with{' '}
          <u className="underline">closing the representation gap</u> In
          Asian-American communities.
        </h2>
        <h3 className={styles.stat_text}>
          Asian American voter turnout rate has remained Below
        </h3>
        <div className={styles.stat_percentage_container_1}>
          <div className={styles.bold_shadow}>60%</div>
        </div>
        <h3 className={styles.stat_text}>Asian-Americans make up</h3>
        <div className={styles.stat_percentage_container_2}>
          <div className={styles.bold_shadow}>7%</div>
        </div>
        <h3 className={styles.stat_text_bottom}>of the population </h3>
        <h3 className={styles.stat_text}>but only</h3>
        <div className={styles.stat_percentage_container_3}>
          <div className={styles.bold_shadow}>3%</div>
        </div>
        <h3 className={styles.stat_text_bottom}>
          of Congress is Asian or AAPI{' '}
        </h3>
      </section>

      <div className={styles.curve_container}>
        <Image className={styles.curve} src={blackCurve} alt="black curve" />
      </div>

      <section className={styles.section_7}>
        <Image
          className={styles.speech_bubble}
          src={speechBubble3}
          alt="we need your help!"
        />
        <h2 className={styles.section_heading}>
          we&apos;re asking everyone to join us in{' '}
          <u className="underline">taking the #8by8challenge</u> and registering
          8 of their friends to vote in 8 days.
        </h2>
        <Button onClick={() => router.push('/challengerwelcome')} wide>
          Take the Challenge
        </Button>
        <div className={styles.content_container}>
          <p className="b2 color_white">
            The 8by8 mission aims to build civic participation and bring
            awareness to the struggles of AAPI citizens, while encouraging
            community involvement and investment. Our approach involves working
            with community, business, and tech leaders to create voter
            registration solutions that work.
          </p>
          <a
            href="https://www.8by8.us/"
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            Learn more about 8by8
          </a>
        </div>
      </section>
    </PageContainer>
  );
});
