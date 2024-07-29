import { render, screen, cleanup, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Label } from '@/components/form-components/label';
import { Input } from '@/components/form-components/input';
import { Field } from 'fully-formed';

describe('Label', () => {
  afterEach(cleanup);

  it(`renders a label element whose htmlFor attribute is set to the id of 
  the field it receives.`, () => {
    const field = new Field({
      name: 'testField',
      id: 'test-field',
      defaultValue: '',
    });

    render(
      <Label field={field} variant="stationary">
        Test Label
      </Label>,
    );

    const label = screen.getByText('Test Label') as HTMLLabelElement;
    expect(label.htmlFor).toBe(field.id);
  });

  it(`renders a label element whose classList contains 
  styles.pristine_floating_label if the variant prop it received was 'floating' 
  and the input is not in focus, has not been blurred, and has not been 
  submitted.`, () => {
    const field = new Field({
      name: 'testField',
      defaultValue: '',
    });

    render(
      <Label field={field} variant="floating">
        Test Label
      </Label>,
    );

    const label = screen.getByText('Test Label');
    expect(label.classList.contains('pristine_floating_label')).toBe(true);
  });

  it(`removes styles.pristine_floating_label from the classList of the label 
  element when the corresponding input element receives focus. This className 
  remains removed when the input is blurred.`, async () => {
    const field = new Field({
      name: 'testField',
      defaultValue: '',
    });

    const user = userEvent.setup();
    render(
      <form>
        <Label field={field} variant="floating">
          Test Label
        </Label>
        <Input field={field} type="text" />
      </form>,
    );

    const label = screen.getByText('Test Label');
    expect(label.classList.contains('pristine_floating_label')).toBe(true);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await waitFor(() =>
      expect(label.classList.contains('pristine_floating_label')).toBe(false),
    );

    act(() => input.blur());
    await waitFor(() =>
      expect(label.classList.contains('pristine_floating_label')).toBe(false),
    );
  });

  it(`removes styles.pristine_floating_label from the classList of the label 
  element when the underlying field has been submitted.`, async () => {
    const field = new Field({
      name: 'testField',
      defaultValue: '',
    });

    render(
      <Label field={field} variant="floating">
        Test Label
      </Label>,
    );

    const label = screen.getByText('Test Label');
    expect(label.classList.contains('pristine_floating_label')).toBe(true);

    act(() => field.setSubmitted());
    await waitFor(() =>
      expect(label.classList.contains('pristine_floating_label')).toBe(false),
    );
  });
});
