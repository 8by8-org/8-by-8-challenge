import '@testing-library/jest-dom';
import { useContext } from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { createNamedContext } from '@/hooks/functions/create-named-context';

describe('createNamedContext', () => {
  afterEach(cleanup);

  it('returns a Context object with a displayName property set to the string it receives as an argument.', () => {
    const contextName = 'TestContext';
    const TestContext = createNamedContext(contextName);
    expect(TestContext.displayName).toBe(contextName);
  });

  it('returns a Context object whose default value is null.', () => {
    const TestContext = createNamedContext('TestContext');

    function TestComponent() {
      const value = useContext(TestContext);

      return (
        <div>{value === null ? 'Value is null' : 'Value is not null.'}</div>
      );
    }

    render(<TestComponent />);

    expect(screen.getByText('Value is null')).toBeInTheDocument();
  });
});
