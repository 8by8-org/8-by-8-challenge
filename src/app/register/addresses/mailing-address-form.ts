import {
  SubFormTemplate,
  Field,
  ControlledField,
  StringValidators,
  IField,
  FormFactory,
  IGroup,
  Group,
  ValidityUtils,
  type ExcludableTemplate,
} from 'fully-formed';
import { ZipCodeValidator } from '../utils/zip-code-validator';
import zipState from 'zip-state';

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

  public readonly groups: [IGroup<'addressGroup', this['fields']>];

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
        return ValidityUtils.isValid(controllerState) ?
            zipCodeToState(controllerState.value)!
          : 'AL';
      },
      controlFn: controllerState => {
        if (
          !ValidityUtils.isValid(controllerState) ||
          !controllerState.didPropertyChange('value')
        )
          return;

        const value = zipCodeToState(controllerState.value.trim());
        if (!value) return;

        return value;
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

    this.groups = [
      new Group({
        name: 'addressGroup',
        members: this.fields,
        asyncValidators: [new AddressValidator()],
        pendingMessage: 'Validating address...',
      }),
    ];
  }
}

export const MailingAddressForm = FormFactory.createExcludableSubForm(
  MailingAddressTemplate,
);
