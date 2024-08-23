import {
  SubFormTemplate,
  Field,
  ControlledField,
  StringValidators,
  IField,
  FormFactory,
  ValidityUtils,
  type ExcludableTemplate,
} from 'fully-formed';
import zipState from 'zip-state';
import { ZipCodeValidator } from '../utils/zip-code-validator';
import { US_STATE_ABBREVIATIONS } from '@/constants/us-state-abbreviations';

export const MailingAddressForm = FormFactory.createExcludableSubForm(
  class MailingAddressTemplate
    extends SubFormTemplate
    implements ExcludableTemplate
  {
    public readonly name = 'mailingAddress';
    public readonly autoTrim = {
      include: ['unit', 'city', 'zip'],
    };

    public readonly fields: [
      IField<'streetLine1', string, true>,
      IField<'streetLine2', string, true>,
      IField<'unit', string, false>,
      IField<'city', string, false>,
      IField<'state', string, false>,
      IField<'zip', string, false>,
    ];

    public readonly excludeByDefault = true;

    public constructor() {
      super();
      const zip = new Field({
        name: 'zip',
        id: 'mailing-zip',
        defaultValue: '',
        validators: [new ZipCodeValidator()],
      });

      const state = new ControlledField({
        name: 'state',
        controller: zip,
        initFn: controllerState => {
          if (!ValidityUtils.isValid(controllerState)) {
            return 'AL';
          }

          const state = zipState(controllerState.value);
          if (!state || !Object.values(US_STATE_ABBREVIATIONS).includes(state))
            return 'AL';

          return state;
        },
        controlFn: controllerState => {
          if (
            !ValidityUtils.isValid(controllerState) ||
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
        new Field({
          name: 'streetLine1',
          id: 'mailing-street-line-1',
          defaultValue: '',
          validators: [
            StringValidators.required({
              invalidMessage: 'Please enter your street address.',
            }),
          ],
        }),
        new Field({
          name: 'streetLine2',
          id: 'mailing-street-line-2',
          defaultValue: '',
        }),
        new Field({
          name: 'unit',
          id: 'mailing-unit',
          defaultValue: '',
        }),
        new Field({
          name: 'city',
          id: 'mailing-city',
          defaultValue: '',
          validators: [
            StringValidators.required({
              invalidMessage: 'Please enter your city.',
            }),
          ],
        }),
        state,
        zip,
      ];
    }
  },
);
