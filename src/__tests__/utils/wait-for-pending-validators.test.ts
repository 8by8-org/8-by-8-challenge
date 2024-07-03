import {
  FormTemplate,
  Field,
  StringValidators,
  AsyncValidator,
  FormFactory,
  ValidityUtils,
} from 'fully-formed';
import { waitForPendingValidators } from '@/utils/client/wait-for-pending-validators';
import { FormInvalidError } from '@/utils/client/form-invalid-error';
import { PromiseScheduler } from '@/utils/test/promise-scheduler';

describe('waitForPendingValidators', () => {
  it('resolves with the value of the form, if valid.', async () => {
    class ValidFormTemplate extends FormTemplate {
      public readonly fields = [
        new Field({
          name: 'validField',
          defaultValue: '',
        }),
      ] as const;
    }

    const ValidForm = FormFactory.createForm(ValidFormTemplate);

    const form = new ValidForm();

    const value = await waitForPendingValidators(form);

    expect(value).toStrictEqual({
      validField: '',
    });
  });

  it('rejects with a FormInvalidError if the form is invalid.', async () => {
    class InvalidFormTemplate extends FormTemplate {
      public readonly fields = [
        new Field({
          name: 'invalidField',
          defaultValue: '',
          validators: [StringValidators.required()],
        }),
      ] as const;
    }

    const InvalidForm = FormFactory.createForm(InvalidFormTemplate);
    const form = new InvalidForm();
    let error: FormInvalidError | null = null;

    try {
      await waitForPendingValidators(form);
    } catch (e) {
      if (e instanceof FormInvalidError) {
        error = e;
      }
    }

    expect(error).toBeInstanceOf(FormInvalidError);
  });

  it('returns a Promise is rejected once the form becomes invalid.', async () => {
    const promiseScheduler = new PromiseScheduler();

    class PendingFormTemplate extends FormTemplate {
      public readonly fields = [
        new Field({
          name: 'pendingField',
          defaultValue: '',
          asyncValidators: [
            new AsyncValidator<string>({
              predicate: () => {
                return promiseScheduler.createScheduledPromise(true);
              },
            }),
          ],
          delayAsyncValidatorExecution: 0,
        }),
      ];
    }

    const PendingForm = FormFactory.createForm(PendingFormTemplate);
    const form = new PendingForm();
    expect(ValidityUtils.isPending(form)).toBe(true);

    const promise = waitForPendingValidators(form);
    promiseScheduler.resolveAll();

    const value = await promise;
    expect(value).toStrictEqual({
      pendingField: '',
    });
  });

  it('returns a Promise that resolves once the form becomes valid.', async () => {
    const promiseScheduler = new PromiseScheduler();

    class PendingFormTemplate extends FormTemplate {
      public readonly fields = [
        new Field({
          name: 'pendingField',
          defaultValue: '',
          asyncValidators: [
            new AsyncValidator<string>({
              predicate: () => {
                return promiseScheduler.createScheduledPromise(false);
              },
            }),
          ],
          delayAsyncValidatorExecution: 0,
        }),
      ];
    }

    const PendingForm = FormFactory.createForm(PendingFormTemplate);
    const form = new PendingForm();
    expect(ValidityUtils.isPending(form)).toBe(true);

    let error: FormInvalidError | null = null;
    const promise = waitForPendingValidators(form);
    promiseScheduler.resolveAll();

    try {
      await promise;
    } catch (e) {
      if (e instanceof FormInvalidError) {
        error = e;
      }
    }

    expect(error).toBeInstanceOf(FormInvalidError);
  });
});
