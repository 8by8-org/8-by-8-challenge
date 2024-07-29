import ReactTurnstile from 'react-turnstile';
import { useSubmitted } from 'fully-formed';
import { TurnstileTokenField } from './turnstile-token-field';
import { Messages } from '../messages';
import styles from './styles.module.scss';
import { readPublicEnvironmentVariables } from '@/utils/environment/read-public-environment-variables';

interface TurnstileProps {
  /**
   * The field whose state will be controlled by the component.
   */
  field: TurnstileTokenField;
  /**
   * A public site key from Cloudflare. If omitted, the component will
   * look up the env variable `NEXT_PUBLIC_TURNSTILE_SITE_KEY` to get the value.
   */
  sitekey?: string;
}

/**
 * Renders a Cloudflare Turnstile Captcha component. Accepts a field whose
 * state the component will control, and a Cloudflare Turnstile site key.
 *
 * If the site key is omitted, the component will look up the env variable
 * `NEXT_PUBLIC_TURNSTILE_SITE_KEY` to get the value.
 *
 * @param props - {@link TurnstileProps}
 *
 * @returns A Cloudflare Turnstile widget.
 */
export function Turnstile({ field, sitekey }: TurnstileProps) {
  return (
    <div className={styles.center_content}>
      <div className={styles.content}>
        <ReactTurnstile
          id={field.id}
          sitekey={
            sitekey ??
            readPublicEnvironmentVariables().NEXT_PUBLIC_TURNSTILE_SITE_KEY
          }
          onVerify={token => {
            field.onVerify(token);
          }}
          onBeforeInteractive={() => {
            field.onBeforeInteractive();
          }}
          onExpire={() => {
            field.onExpire();
          }}
          onError={() => {
            field.onError();
          }}
          refreshExpired="auto"
          theme="light"
          fixedSize
        />
        <div className={styles.messages_wrapper}>
          <Messages
            messageBearers={[field]}
            containerClassName={styles.messages}
            hideMessages={!useSubmitted(field)}
          />
        </div>
      </div>
    </div>
  );
}
