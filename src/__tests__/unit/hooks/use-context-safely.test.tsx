import { NullContextError } from '@/errors/null-context-error';
import { createNamedContext } from '@/hooks/create-named-context';
import { useContextSafely } from '@/hooks/use-context-safely';
import { getErrorThrownByComponent } from '@/utils/test/get-error-thrown-by-component';

describe('useContextSafely', () => {
  const TestContext = createNamedContext<string>('TestContext');

  function TestConsumer() {
    useContextSafely(TestContext, 'TestConsumer');

    return null;
  }

  it('throws a NullContextError when called outside of a context provider.', () => {
    expect(getErrorThrownByComponent(<TestConsumer />)).toBeInstanceOf(
      NullContextError,
    );
  });

  it('does not throw an error when called within a component that is a child of a context provider whose value is not null.', () => {
    expect(
      getErrorThrownByComponent(
        <TestContext.Provider value="test">
          <TestConsumer />
        </TestContext.Provider>,
      ),
    ).toBeNull();
  });
});
