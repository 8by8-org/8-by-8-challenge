import { useRef } from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Alert, useAlert } from '@/components/utils/alert';

describe('Alert', () => {
  afterEach(cleanup);

  it('updates its message when showAlert is called.', async () => {
    const messages = ['first', 'second', 'third'];

    function TestComponent() {
      const { alertRef, showAlert } = useAlert();
      const message = useRef('');

      const showNextMessage = () => {
        const current = messages.indexOf(message.current);
        let next = current + 1;
        if (next >= messages.length) next = 0;

        message.current = messages[next];
        showAlert(message.current, 'error');
      };

      return (
        <>
          <Alert ref={alertRef} />
          <button onClick={showNextMessage}>Show next message</button>
        </>
      );
    }

    const user = userEvent.setup();

    render(<TestComponent />);

    const showNextMessage = screen.getByText('Show next message');

    for (const message of messages) {
      await user.click(showNextMessage);
      await waitFor(() =>
        expect(screen.queryByText(message)).toBeInTheDocument(),
      );
    }
  });

  it('updates its className when show alert is called.', async () => {
    const variants: Array<'error' | 'success'> = [
      'error',
      'error',
      'success',
      'success',
      'error',
    ];

    function TestComponent() {
      const { alertRef, showAlert } = useAlert();
      const variant = useRef(-1);

      const showNextVariant = () => {
        variant.current = variant.current + 1;
        if (variant.current >= variants.length) variant.current = 0;

        showAlert('', variants[variant.current]);
      };

      return (
        <>
          <Alert ref={alertRef} />
          <button onClick={showNextVariant}>Show next variant</button>
        </>
      );
    }

    const user = userEvent.setup();

    render(<TestComponent />);

    const showNextVariant = screen.getByText('Show next variant');

    for (const variant of variants) {
      await user.click(showNextVariant);

      /* 
        the 'slide_out' class should be removed and then added in order to 
        restart the animation.
      */
      await waitFor(() => {
        expect(document.getElementsByClassName(variant)[0]).toBeInstanceOf(
          HTMLDivElement,
        );
        expect(document.getElementsByClassName('slide_out')[0]).toBeFalsy();
      });

      await waitFor(() =>
        expect(document.getElementsByClassName('slide_out')[0]).toBeInstanceOf(
          HTMLDivElement,
        ),
      );
    }
  });
});
