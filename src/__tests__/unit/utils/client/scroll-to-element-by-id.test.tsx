import { render, screen, cleanup } from '@testing-library/react';
import { scrollToElementById } from '@/utils/client/scroll-to-element-by-id';

describe('scrollToElementById', () => {
  afterEach(cleanup);

  test(`If an element with the provided id exists in the document, 
  window.scrollTo() is called with the offsetTop of the element.`, () => {
    jest.spyOn(window, 'scrollTo').mockImplementation(jest.fn());
    const id = 'test-id';
    render(<div id={id} data-testid={id}></div>);
    scrollToElementById(id);

    const divElement = screen.getByTestId(id);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: divElement.offsetTop,
    });
  });
});
