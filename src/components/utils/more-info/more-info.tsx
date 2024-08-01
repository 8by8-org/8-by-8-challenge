'use client';
import { useState, type ReactNode, type CSSProperties } from 'react';
import Image from 'next/image';
import { Modal } from '../modal';
import { Button } from '../button';
import questionMark from '@/../public/static/images/components/more-info/question-mark.svg';
import styles from './styles.module.scss';

interface MoreInfoProps {
  /**
   * The name of the topic that the component expounds upon. Used to generate
   * `aria` attributes including the alt text for the image rendered within the
   * button and the label for the {@link Modal}.
   */
  topic: string;
  /**
   * A {@link ReactNode} that will be rendered within the {@link Modal}.
   */
  info: ReactNode;
  style?: CSSProperties;
  className?: string;
}

/**
 * Renders a button that, when clicked, opens a {@link Modal} displaying
 * additional information about a given topic. Will typically be rendered within
 * forms to provide the user with additional context about the form.
 *
 * @param props - {@link MoreInfoProps}
 */
export function MoreInfo({ topic, info, style, className }: MoreInfoProps) {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const classNames = [styles.open_more_info_button, className];

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={classNames.join(' ')}
        style={style}
      >
        <Image
          src={questionMark}
          alt={`Click for more information about ${topic}.`}
        />
      </button>
      <Modal
        ariaLabel={`More information about ${topic}.`}
        theme="light"
        isOpen={showModal}
        closeModal={closeModal}
      >
        {info}
        <Button
          size="sm"
          wide
          type="button"
          onClick={closeModal}
          className={styles.close_modal_button}
        >
          Ok, got it
        </Button>
      </Modal>
    </>
  );
}
