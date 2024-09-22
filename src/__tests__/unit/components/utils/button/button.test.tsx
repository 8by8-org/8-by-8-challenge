import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '@/components/utils/button';

describe('Button component', () => {
  afterEach(cleanup);

  it('renders correctly with default props', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByText(/Click Me/i);
    expect(buttonElement).toBeInTheDocument();
  });

  it('renders correctly with wide prop set to true', () => {
    render(<Button wide>Click Me</Button>);
    const buttonElement = screen.getByText(/Click Me/i);
    expect(buttonElement).toBeInTheDocument();
  });

  it('renders correctly with variant set to btn_inverted', () => {
    render(<Button variant="inverted">Click Me</Button>);
    const buttonElement = screen.getByText(/Click Me/i);
    expect(buttonElement).toBeInTheDocument();
  });

  it('renders correctly with size set to btn_sm', () => {
    render(<Button size="sm">Click Me</Button>);
    const buttonElement = screen.getByText(/Click Me/i);
    expect(buttonElement).toBeInTheDocument();
  });

  it('renders 100 Button components correctly', () => {
    render(
      <>
        {Array.from({ length: 100 }, (_, i) => (
          <Button key={i} variant="inverted" size="lg" wide>
            Button {i + 1}
          </Button>
        ))}
      </>,
    );

    const buttons = screen.getAllByText(/Button \d+/);
    expect(buttons).toHaveLength(100);
    buttons.forEach((button, index) => {
      expect(button).toHaveTextContent(`Button ${index + 1}`);
    });
  });

  it('appends a className it receives as prop to its className.', () => {
    const className = 'test';
    render(<Button className={className}>Click Me</Button>);
    const button = document.getElementsByTagName('button')[0];
    expect(button.classList).toContain(className);
  });
});
