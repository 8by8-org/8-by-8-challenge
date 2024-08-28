import {
  FormFactory,
  SubFormTemplate,
  Field,
  ControlledField,
  StringValidators,
  ValidityUtils,
  type IField,
  type FieldOfType,
} from 'fully-formed';
import zipState from 'zip-state';
import { ZipCodeValidator } from '../../utils/zip-code-validator';
import { PhoneValidator } from '../../utils/phone-validator';
import { US_STATE_ABBREVIATIONS } from '@/constants/us-state-abbreviations';

export const HomeAddressForm = FormFactory.createSubForm(
  class HomeAddressTemplate extends SubFormTemplate {
    public readonly name = 'homeAddress';
    public readonly autoTrim = true;
    public readonly fields: [
      IField<'streetLine1', string, true>,
      IField<'streetLine2', string, true>,
      IField<'unit', string, false>,
      IField<'city', string, false>,
      IField<'state', string, false>,
      IField<'zip', string, false>,
      IField<'phone', string, false>,
      IField<'phoneType', string, false>,
    ];

    public constructor(externalZipCodeField: FieldOfType<string>) {
      super();

      const zip = new ControlledField({
        name: 'zip',
        controller: externalZipCodeField,
        initFn: controllerState => {
          return controllerState.value;
        },
        controlFn: controllerState => controllerState.value,
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
          if (
            !state ||
            !Object.values(US_STATE_ABBREVIATIONS).includes(state)
          ) {
            return;
          }
          return state;
        },
      });

      this.fields = [
        new Field({
          name: 'streetLine1',
          defaultValue: '',
          validators: [
            StringValidators.required({
              invalidMessage: 'Please enter your street address.',
            }),
          ],
        }),
        new Field({
          name: 'streetLine2',
          defaultValue: '',
        }),
        new Field({
          name: 'unit',
          defaultValue: '',
        }),
        new Field({
          name: 'city',
          defaultValue: '',
          validators: [
            StringValidators.required({
              invalidMessage: 'Please enter your city.',
            }),
          ],
        }),
        state,
        zip,
        new Field({
          name: 'phone',
          defaultValue: '',
          validators: [new PhoneValidator()],
        }),
        new Field({
          name: 'phoneType',
          defaultValue: 'Mobile',
        }),
      ];
    }
  },
);
