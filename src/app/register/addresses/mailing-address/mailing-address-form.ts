import {
  PersistentExcludableSubFormTemplate,
  PersistentField,
  PersistentControlledField,
  StringValidators,
  NonTransientField,
  FormFactory,
  ValidityUtils,
} from 'fully-formed';
import zipState from 'zip-state';
import { ZipCodeValidator } from '../../utils/zip-code-validator';
import { US_STATE_ABBREVIATIONS } from '@/constants/us-state-abbreviations';

export const MailingAddressForm = FormFactory.createPersistentExcludableSubForm(
  class MailingAddressTemplate extends PersistentExcludableSubFormTemplate {
    public readonly name = 'mailingAddress';
    public readonly key = 'addresses.mailing';
    public readonly autoTrim = true;

    public readonly fields: [
      NonTransientField<'streetLine1', string>,
      NonTransientField<'streetLine2', string>,
      NonTransientField<'city', string>,
      NonTransientField<'zip', string>,
      NonTransientField<'state', string>,
    ];

    public readonly excludeByDefault = true;

    public constructor() {
      super();
      const zip = new PersistentField({
        name: 'zip',
        key: this.key + '.zip',
        id: 'mailing-zip',
        defaultValue: '',
        validators: [new ZipCodeValidator()],
      });

      const state = new PersistentControlledField({
        name: 'state',
        id: 'mailing-state',
        key: this.key + '.state',
        controller: zip,
        initFn: () => 'AL',
        controlFn: controllerState => {
          if (
            !ValidityUtils.isValidOrCaution(controllerState) ||
            !controllerState.didPropertyChange('value')
          )
            return;

          const state = zipState(controllerState.value.trim());
          if (!state || !Object.values(US_STATE_ABBREVIATIONS).includes(state))
            return;

          return state;
        },
      });

      this.fields = [
        new PersistentField({
          name: 'streetLine1',
          id: 'mailing-street-line-1',
          key: this.key + '.streetLine1',
          defaultValue: '',
          validators: [
            StringValidators.required({
              invalidMessage: 'Please enter your street address.',
              trimBeforeValidation: true,
            }),
          ],
        }),
        new PersistentField({
          name: 'streetLine2',
          id: 'mailing-street-line-2',
          key: this.key + '.streetLine2',
          defaultValue: '',
        }),
        new PersistentField({
          name: 'city',
          id: 'mailing-city',
          key: this.key + '.city',
          defaultValue: '',
          validators: [
            StringValidators.required({
              invalidMessage: 'Please enter your city.',
              trimBeforeValidation: true,
            }),
          ],
        }),
        zip,
        state,
      ];
    }
  },
);
