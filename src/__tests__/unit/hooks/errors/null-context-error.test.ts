import { NullContextError } from '@/hooks/errors/null-context-error';

describe('NullContextError', () => {
  it('has a message property describing the failure of the consumer to access the context.', () => {
    const consumerName = 'TestConsumer';
    const contextName = 'TestContext';
    const nullContextError = new NullContextError(contextName, consumerName);
    expect(nullContextError.message).toBe(
      `${consumerName} could not read properties of null ${contextName}. ${consumerName} must be a child of ${contextName}.Provider.`,
    );
  });
});
