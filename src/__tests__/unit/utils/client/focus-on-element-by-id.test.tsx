import { render, cleanup } from '@testing-library/react';
import { focusOnElementById } from '@/utils/client/focus-on-element-by-id';

describe('focusOnElementById', () => {
  afterEach(cleanup);

  it(`calls the focus() method of an element with the provided id, if it exists 
  in the document.`, () => {
    render(<input id="input" />);

    const input = document.getElementById('input');
    expect(document.activeElement).not.toBe(input);

    focusOnElementById('input');
    expect(document.activeElement).toBe(input);
  });

  it(`removes the 'disabled' attribute from an element with the provided id, if 
  it exists in the document.`, () => {
    render(<input id="input" disabled />);

    const input = document.getElementById('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);

    focusOnElementById('input');
    expect(input.disabled).toBe(false);
  });
});
