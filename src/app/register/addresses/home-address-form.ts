import {
  SubFormTemplate,
  Field,
  ControlledField,
  StringValidators,
  IField,
  FieldOfType,
  FormFactory,
  ValidityUtils,
} from 'fully-formed';
import { ZipCodeValidator } from '../utils/zip-code-validator';
import zipState from 'zip-state';

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
          return ValidityUtils.isValid(controllerState) ?
              zipState(controllerState.value)!
            : 'AL';
        },
        controlFn: controllerState => {
          if (
            !ValidityUtils.isValid(controllerState) ||
            !controllerState.didPropertyChange('value')
          )
            return;

          const value = zipState(controllerState.value.trim());
          if (!value) return;

          return value;
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
      ];
    }
  },
);
