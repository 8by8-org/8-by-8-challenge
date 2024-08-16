import { WidthSetter } from '@/components/form-components/select/width-setter';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('WidthSetter', () => {
  afterEach(cleanup);

  it('renders the text of all options it receives, plus the label.', () => {
    const label = 'Select a political party';

    const politicalParties = [
      {
        text: 'Democratic',
        value: 'democratic',
      },
      {
        text: 'Republican',
        value: 'republican',
      },
      {
        text: 'Green',
        value: 'green',
      },
      {
        text: 'Libertarian',
        value: 'libertarian',
      },
      {
        text: 'Other',
        value: 'other',
      },
    ];

    render(
      <WidthSetter
        label={label}
        options={politicalParties}
        hasMoreInfo={false}
      />,
    );

    expect(screen.queryByText(label)).toBeInTheDocument();

    for (const { text: party } of politicalParties) {
      expect(screen.queryByText(party)).toBeInTheDocument();
    }
  });

  it(`does not apply the class "width_setter_with_more_info" when 
  props.hasMoreInfo is false.`, () => {
    render(<WidthSetter label="" options={[]} hasMoreInfo={false} />);

    expect(
      document.getElementsByClassName('width_setter_with_more_info').length,
    ).toBe(0);
  });

  it(`applies the class "width_setter_with_more_info" when props.hasMoreInfo is 
  true.`, () => {
    render(<WidthSetter label="" options={[]} hasMoreInfo={true} />);

    expect(
      document.getElementsByClassName('width_setter_with_more_info').length,
    ).toBe(1);
  });
});
