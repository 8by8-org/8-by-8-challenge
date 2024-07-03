import { MockReactTurnstile } from '@/utils/test/mock-react-turnstile';
import { getErrorThrownByComponent } from '@/utils/test/get-error-thrown-by-component';

describe('MockReactTurnstile', () => {
  it(`throws an error if it does not receive a known dummy site key.`, () => {
    expect(
      getErrorThrownByComponent(<MockReactTurnstile sitekey="" />),
    ).toBeInstanceOf(Error);
  });
});
