import '@testing-library/jest-dom';
import {
  render,
  screen,
  cleanup,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Modal } from '@/components/utils/modal';
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';

describe('Modal', () => {
  mockDialogMethods();
  afterEach(cleanup);

  it('renders a child component', () => {
    render(
      <Modal
        ariaLabel="test modal"
        theme="dark"
        isOpen={true}
        closeModal={() => {}}
      >
        <div data-testid="test"></div>
      </Modal>,
    );
    const modal = screen.queryByTestId('test');
    expect(modal).toBeInTheDocument();
  });

  it('calls HTMLDialogElement.prototype.showModal() and HTMLDialogElement.prototype.close() as the open prop is updated.', async () => {
    function ModalWrapper() {
      const [isOpen, setIsOpen] = useState(true);
      const closeModal = () => setIsOpen(false);
      return (
        <Modal
          ariaLabel="test modal"
          theme="dark"
          isOpen={isOpen}
          closeModal={closeModal}
        ></Modal>
      );
    }
    const user = userEvent.setup();
    jest.spyOn(HTMLDialogElement.prototype, 'showModal');
    jest.spyOn(HTMLDialogElement.prototype, 'close');
    render(<ModalWrapper />);
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    const closeBtn = screen.getByLabelText('close dialog');
    await user.click(closeBtn);
    await waitFor(() =>
      expect(HTMLDialogElement.prototype.close).toHaveBeenCalled(),
    );
  });

  it('calls closeModal() when the escape key is pressed.', async () => {
    const closeModal = jest.fn();
    render(
      <Modal
        ariaLabel="test modal"
        theme="light"
        isOpen={true}
        closeModal={closeModal}
      ></Modal>,
    );
    const dialog = document.querySelector('dialog');
    if (dialog) {
      fireEvent.keyDown(dialog, {
        key: 'Escape',
      });
    }
    expect(closeModal).toHaveBeenCalled();
  });
});
