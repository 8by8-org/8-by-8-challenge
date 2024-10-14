'use client';
import { useRef, useEffect, useState } from 'react';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { AlertsContext } from '@/contexts/alerts-context';
import { RTV_PARTNER_ID } from '@/constants/rtv-partner-id';
import { LoadingWheel } from '@/components/utils/loading-wheel';
import styles from './styles.module.scss';

export function PledgeToVoteForm() {
  const iFrameRef = useRef<HTMLIFrameElement>(null);
  const [srcDoc, setSrcDoc] = useState('');
  const [isFormLoading, setIsFormLoading] = useState(true);
  const [isAPIRequestInProgress, setIsAPIRequestInProgress] = useState(false);
  const { gotElectionReminders } = useContextSafely(
    UserContext,
    'PledgeToVoteForm',
  );
  const { showAlert } = useContextSafely(AlertsContext, 'PledgeToVoteForm');

  useEffect(() => {
    /*
      Here, we need to handle messages posted to the window by the RTV page 
      rendered in the IFrame. After this behavior is set up, we add the 
      srcDoc property to the IFrame, triggering these events.
    */
    const handleMessage = async (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;

      switch (e.data) {
        case 'loaded':
          setIsFormLoading(false);
          break;
        case 'submitted':
          setIsFormLoading(true);
          break;
        case 'confirmed':
          /*
            The window rendered by the IFrame will refresh the form, a message
            will sent to the window and isFormLoading will be set to false,
            making it unnecessary for us to setIsFormLoading here.
          */
          setIsAPIRequestInProgress(true);

          try {
            await gotElectionReminders();
          } catch (e) {
            showAlert(
              "Oops! We couldn't award you a badge. Please try again later.",
              'error',
            );
            setIsAPIRequestInProgress(false);
          }

          break;
      }
    };

    window.addEventListener('message', handleMessage);

    /*
      srcDoc is used to call the Rock the Vote script to render the election 
      reminders form, which internally calls document.write. This would 
      fail if called directly by a Script component. Calling the script is
      necessary to get the IFrame to be sized properly for the device.
    */
    setSrcDoc(
      `<body style="margin: 0">
          <script type="text/javascript">
            window.addEventListener('message', (e) => {
              if(e.origin !== 'https://register.rockthevote.com') {
                return;
              }
              
              window.parent.postMessage(e.data);
            });
          </script>
          <script
            type="text/javascript"
            src="https://register.rockthevote.com/assets/rtv-iframe.js"
          ></script>
          <script type="text/javascript">
            RtvIframe.initPledge({
              partner: ${RTV_PARTNER_ID},
            });

            const iframe = document.getElementById("rtv-pledge-iframe");

          // scroll the window to 0, 0 when the inner IFrame loads, such as when the 
          // form is submitted but there are validation errors
          iframe.onload = (e) => {
            window.parent.scrollTo(0, 0);
          };
        </script>
      </body>`,
    );

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [gotElectionReminders, showAlert]);

  return (
    <>
      <iframe ref={iFrameRef} srcDoc={srcDoc} className={styles.iframe} />
      {(isFormLoading || isAPIRequestInProgress) && <LoadingWheel />}
    </>
  );
}
