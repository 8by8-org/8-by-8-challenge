import {
  StateManager,
  Validity,
  type FormChild,
  type FormChildState,
  type MessageBearer,
  type MessageBearerState,
  type Identifiable,
  type Submittable,
  type SubmittableState,
  type StateWithChanges,
} from 'fully-formed';

type TurnstileTokenFieldState = FormChildState<string> &
  MessageBearerState &
  SubmittableState;

/**
 * A field that can be included in a Fully Formed form and passed as a prop to
 * the Turnstile component to capture the state of that component and include
 * the token it generates in the value of the form.
 *
 * For more information on Cloudflare Turnstile, please see
 * {@link https://developers.cloudflare.com/turnstile}.
 *
 */
export class TurnstileTokenField
  implements
    FormChild<'captchaToken', string>,
    MessageBearer,
    Identifiable,
    Submittable
{
  public readonly name = 'captchaToken';
  public readonly id = 'turnstile-widget';
  public readonly transient = false;

  private stateManager: StateManager<TurnstileTokenFieldState> =
    new StateManager({
      value: '',
      validity: Validity.Pending,
      messages: [],
      submitted: false,
    });

  public get state(): StateWithChanges<TurnstileTokenFieldState> {
    return this.stateManager.state;
  }

  public subscribeToState(
    cb: (state: StateWithChanges<TurnstileTokenFieldState>) => void,
  ) {
    return this.stateManager.subscribeToState(cb);
  }

  public setSubmitted(): void {
    this.stateManager.updateProperties({
      submitted: true,
    });
  }

  public onVerify(token: string): void {
    this.stateManager.updateProperties({
      value: token,
      validity: Validity.Valid,
      messages: [],
    });
  }

  public onExpire(): void {
    this.stateManager.updateProperties({
      value: '',
      validity: Validity.Pending,
      messages: [],
    });
  }

  public onBeforeInteractive(): void {
    this.stateManager.updateProperties({
      value: '',
      validity: Validity.Invalid,
      messages: [
        {
          text: "Please let us know that you're a human.",
          validity: Validity.Invalid,
        },
      ],
    });
  }

  public onError(): void {
    this.stateManager.updateProperties({
      value: '',
      validity: Validity.Invalid,
      messages: [
        {
          text: `Something went wrong when trying to verify that you're a human. Please click on the "having trouble?" link above for help.`,
          validity: Validity.Invalid,
        },
      ],
    });
  }
}
