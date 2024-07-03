import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TurnstileTokenField } from '@/components/form-components/turnstile/turnstile-token-field';
import { CLOUDFLARE_TURNSTILE_DUMMY_SITE_KEYS } from '@/constants/cloudflare-turnstile-dummy-site-keys';
import { Validity, ValidityUtils } from 'fully-formed';
import {
  MockReactTurnstile,
  DUMMY_TOKEN,
  CHALLENGE_BTN_TEST_ID,
} from '@/utils/test/mock-react-turnstile';
import { Turnstile } from '@/components/form-components/turnstile';

jest.mock('react-turnstile', () => MockReactTurnstile);

describe('Turnstile', () => {
  afterEach(cleanup);

  it(`renders a Cloudflare Turnstile widget that sets the value of the underlying
  field to the newly created token and the validity of the field to valid when
  the challenge succeeds.`, async () => {
    const field = new TurnstileTokenField();

    render(
      <Turnstile
        field={field}
        sitekey={CLOUDFLARE_TURNSTILE_DUMMY_SITE_KEYS.ALWAYS_PASSES}
      />,
    );
    expect(ValidityUtils.isPending(field)).toBe(true);

    await waitFor(() => {
      expect(field.state).toStrictEqual({
        value: DUMMY_TOKEN,
        validity: Validity.Valid,
        messages: [],
        submitted: false,
        didPropertyChange: expect.any(Function),
      });
    });
  });

  it(`renders a Cloudflare Turnstile widget that sets the value of the
  underlying field to an empty string and its validity to invalid when the
  challenge fails.`, async () => {
    const field = new TurnstileTokenField();

    render(
      <Turnstile
        field={field}
        sitekey={CLOUDFLARE_TURNSTILE_DUMMY_SITE_KEYS.ALWAYS_BLOCKS}
      />,
    );
    expect(ValidityUtils.isPending(field)).toBe(true);

    await waitFor(() => {
      expect(field.state).toStrictEqual({
        value: '',
        validity: Validity.Invalid,
        messages: [
          {
            text: `Something went wrong when trying to verify that you're a human. Please click on the "having trouble?" link above for help.`,
            validity: Validity.Invalid,
          },
        ],
        submitted: false,
        didPropertyChange: expect.any(Function),
      });
    });
  });

  it(`renders a Cloudflare Turnstile widget that sets the value of the
  underlying field to an empty string and its validity to pending when the
  challenge result expires.`, async () => {
    const field = new TurnstileTokenField();

    render(
      <Turnstile
        field={field}
        sitekey={CLOUDFLARE_TURNSTILE_DUMMY_SITE_KEYS.ALWAYS_PASSES}
      />,
    );
    expect(ValidityUtils.isPending(field)).toBe(true);

    await waitFor(() => {
      expect(field.state).toStrictEqual({
        value: DUMMY_TOKEN,
        validity: Validity.Valid,
        messages: [],
        submitted: false,
        didPropertyChange: expect.any(Function),
      });
    });

    await waitFor(() => {
      expect(field.state).toStrictEqual({
        value: '',
        validity: Validity.Pending,
        messages: [],
        submitted: false,
        didPropertyChange: expect.any(Function),
      });
    });
  });

  it(`renders a Cloudflare Turnstile widget that sets the value of the 
  underlying field to an empty string and its validity to invalid when an 
  interactive challenge is forced, and then sets the sets the state of the field
  again once the challenge is passed.`, async () => {
    const field = new TurnstileTokenField();
    const user = userEvent.setup();
    render(
      <Turnstile
        field={field}
        sitekey={CLOUDFLARE_TURNSTILE_DUMMY_SITE_KEYS.FORCES_CHALLENGE}
      />,
    );
    expect(ValidityUtils.isPending(field)).toBe(true);

    await waitFor(() => {
      expect(field.state).toStrictEqual({
        value: '',
        validity: Validity.Invalid,
        messages: [
          {
            text: "Please let us know that you're a human.",
            validity: Validity.Invalid,
          },
        ],
        submitted: false,
        didPropertyChange: expect.any(Function),
      });
    });

    const challengeButton = screen.getByTestId(CHALLENGE_BTN_TEST_ID);
    await user.click(challengeButton);
    await waitFor(() => {
      expect(field.state).toStrictEqual({
        value: DUMMY_TOKEN,
        validity: Validity.Valid,
        messages: [],
        submitted: false,
        didPropertyChange: expect.any(Function),
      });
    });
  });
});
