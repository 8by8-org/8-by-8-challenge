'use client';
import {
  useMessages,
  type MessageBearer,
  type Field,
  type Group,
  type Validator,
} from 'fully-formed';
import { Message } from './message';
import type { CSSProperties } from 'react';
import styles from './styles.module.scss';

type MessagesProps = {
  messageBearers: MessageBearer[];
  id?: string;
  hideMessages?: boolean;
  containerClassName?: string;
  containerStyle?: CSSProperties;
};

/**
 * Renders messages produced by Fully Formed {@link MessageBearer}s, such as
 * {@link Field}s or {@link Group}s with {@link Validator}s.
 *
 * @param props - {@link MessagesProps}
 */
export function Messages({
  messageBearers,
  id,
  hideMessages,
  containerClassName,
  containerStyle,
}: MessagesProps) {
  const messages = useMessages(...messageBearers);

  return (
    <div
      className={
        containerClassName ?
          `${styles.container} ${containerClassName}`
        : styles.container
      }
      style={containerStyle}
      id={id}
    >
      {messages.map(({ text }, index) => {
        return <Message text={text} hide={hideMessages} key={index} />;
      })}
    </div>
  );
}
