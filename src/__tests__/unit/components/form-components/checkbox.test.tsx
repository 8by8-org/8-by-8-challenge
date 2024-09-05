import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Field, useValue } from 'fully-formed';
import { Checkbox } from '@/components/form-components/checkbox';

describe('Checkbox', () => {
  afterEach(cleanup);

  it(`is toggled when clicked.`, async () => {
    const field = new Field({
      name: 'testField',
      defaultValue: false,
    });

    function TestComponent() {
      const checked = useValue(field);

      return (
        <Checkbox
          name={field.name}
          labelContent={checked ? 'Uncheck me' : 'Check me'}
          checked={checked}
          onChange={() => {
            field.setValue(!checked);
          }}
        />
      );
    }

    const user = userEvent.setup();
    render(<TestComponent />);

    expect(field.state.value).toBe(false);

    await user.click(screen.getByLabelText('Check me'));
    expect(field.state.value).toBe(true);

    await user.click(screen.getByLabelText('Uncheck me'));
    expect(field.state.value).toBe(false);
  });

  it('applies the className it received through props to its container.', () => {
    const className = 'test-classname';

    render(
      <Checkbox
        name=""
        checked={false}
        onChange={() => {}}
        labelContent=""
        containerClassName={className}
      />,
    );

    expect(document.getElementsByClassName(className).length).toBe(1);
  });

  it('applies the styles it received through props to its container.', () => {
    const className = 'test-classname';
    const styles = {
      display: 'flex',
      alignItems: 'center',
      margin: '8px',
    };

    render(
      <Checkbox
        name=""
        checked={false}
        onChange={() => {}}
        labelContent=""
        containerClassName={className}
        containerStyle={styles}
      />,
    );

    const container = document.getElementsByClassName(
      className,
    )[0] as HTMLDivElement;

    for (const [CSSProperty, value] of Object.entries(styles)) {
      expect(container.style[CSSProperty as keyof typeof container.style]).toBe(
        value,
      );
    }
  });
});
