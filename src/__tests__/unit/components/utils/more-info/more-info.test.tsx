import { MoreInfo } from '@/components/utils/more-info';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';

describe('MoreInfo', () => {
  let user: UserEvent;

  beforeEach(() => {
    mockDialogMethods();
    user = userEvent.setup();
  });

  afterEach(cleanup);

  it('renders a button that opens a dialog element when clicked.', async () => {
    const buttonAltText = 'Click for more information.';

    render(
      <MoreInfo
        buttonAltText={buttonAltText}
        dialogAriaLabel="More information"
        info={<></>}
      />,
    );

    await user.click(screen.getByAltText(buttonAltText));
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
  });

  it(`displays the ReactNode passed in through the moreInfo prop in the
  dialog.`, () => {
    const info = 'Lorem ipsum dolor est';

    render(
      <MoreInfo
        buttonAltText="Click for more information."
        dialogAriaLabel="More information"
        info={<p>{info}</p>}
      />,
    );

    expect(screen.queryByText(info)).toBeInTheDocument();
  });

  it(`calls the close method of the dialog when the "Ok, got it" button is 
  clicked.`, async () => {
    render(
      <MoreInfo
        buttonAltText="Click for more information"
        dialogAriaLabel="More information"
        info={<></>}
      />,
    );

    await user.click(screen.getByText('Ok, got it'));
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalledTimes(1);
  });
});
