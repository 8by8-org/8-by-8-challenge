'use client';
import { useEffect, useRef, useState } from 'react';
import { LoadingWheel } from '@/components/utils/loading-wheel';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import styles from './styles.module.scss';

const iFrameSourceDoc = `
<body style="margin: 0">
  <script
    type="text/javascript"
    src="https://register.rockthevote.com/assets/rtv-iframe.js"
  ></script>
  <script type="text/javascript">
    RtvIframe.initPledge({
      partner: 39079,
    });

    const iframe = document.getElementById("rtv-pledge-iframe");

    // scroll the window to 0, 0 when the inner IFrame loads, such as when the 
    // form is submitted but there are validation errors
    iframe.onload = (e) => {
      window.parent.scrollTo(0, 0);
    };
  </script>
</body>`;

const formHeight = 1000;

export function PledgeToVoteIFrame() {
  const iFrameRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadCompleted, setInitialLoadCompleted] = useState(false);
  const { gotElectionReminders } = useContextSafely(
    UserContext,
    'PledgeToVoteIFrame',
  );

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const contentHeight =
        iFrameRef.current!.contentWindow!.document.body.scrollHeight;
      iFrameRef.current!.height = `${contentHeight}`;

      if (contentHeight >= formHeight) {
        setIsLoading(false);
        setInitialLoadCompleted(true);
      } else if (initialLoadCompleted) {
        completeAction();
      }
    });

    async function completeAction() {
      setIsLoading(true);

      try {
        await gotElectionReminders();
      } catch (e) {
        /*
          Here, it is important to fetch the completed reminders page from the 
          server, not via client side navigation (i.e. with the useRouter hook).

          Fetching this page from the server reloads the current document, 
          so that when the user presses the back button and arrives at this page,
          the iframe is reloaded.
        */
        location.href = '/reminders/completed?hasError=true';
      }
    }

    observer.observe(iFrameRef.current!.contentWindow!.document.body);

    return () => observer.disconnect();
  }, [initialLoadCompleted, gotElectionReminders]);

  return (
    <>
      <iframe
        srcDoc={iFrameSourceDoc}
        className={styles.iframe}
        ref={iFrameRef}
        style={{ visibility: initialLoadCompleted ? 'visible' : 'hidden' }}
      />
      {isLoading && <LoadingWheel />}
    </>
  );
}
