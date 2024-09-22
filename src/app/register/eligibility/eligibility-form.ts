import {
  SubFormTemplate,
  Adapter,
  Field,
  PersistentField,
  FormFactory,
  IAdapter,
  IField,
  Validator,
  ValidityUtils,
} from 'fully-formed';
import { ZipCodeValidator } from '../utils/zip-code-validator';

class EligibilityTemplate extends SubFormTemplate {
  public readonly name = 'eligibility';
  public readonly autoTrim = {
    include: ['email', 'zip'],
  };

  public readonly fields: [
    IField<'email', string, false>,
    IField<'zip', string, false>,
    IField<'dob', string, true>,
    IField<'eighteenPlus', boolean, true>,
    IField<'isCitizen', boolean, true>,
  ];

  public readonly adapters: [
    IAdapter<'dob', string>,
    IAdapter<'eighteenPlus', string>,
    IAdapter<'isCitizen', string>,
  ];

  private readonly key = 'eligibility';

  public constructor(email: string) {
    super();
    this.fields = [
      new Field({
        name: 'email',
        defaultValue: email,
      }),
      new PersistentField({
        name: 'zip',
        key: this.key + '.zip',
        defaultValue: '',
        validators: [new ZipCodeValidator()],
      }),
      new PersistentField({
        name: 'dob',
        key: this.key + '.dob',
        defaultValue: '',
        validators: [
          new Validator({
            predicate: value => {
              value = value.trim();
              const millis = new Date(value).getMilliseconds();
              return !Number.isNaN(millis);
            },
            invalidMessage: 'Please enter a valid date.',
          }),
        ],
        transient: true,
      }),
      new PersistentField({
        name: 'eighteenPlus',
        key: this.key + '.eighteenPlus',
        defaultValue: false,
        transient: true,
        validatorTemplates: [
          {
            predicate: value => {
              return value;
            },
            invalidMessage:
              'You must be at least 18 years old by the next election to vote.',
          },
        ],
      }),
      new PersistentField({
        name: 'isCitizen',
        key: this.key + '.isCitizen',
        defaultValue: false,
        transient: true,
        validatorTemplates: [
          {
            predicate: value => {
              return value;
            },
            invalidMessage: 'You must be a US Citizen to vote.',
          },
        ],
      }),
    ];

    this.adapters = [
      new Adapter({
        name: 'dob',
        source: this.fields[2],
        adaptFn: ({ value, validity }) => {
          if (!ValidityUtils.isValid(validity)) return '';

          const [year, month, day] = value.trim().split('-');

          return `${month}/${day}/${year}`;
        },
      }),
      new Adapter({
        name: 'eighteenPlus',
        source: this.fields[3],
        adaptFn: ({ value }) => {
          return value ? 'yes' : '';
        },
      }),
      new Adapter({
        name: 'isCitizen',
        source: this.fields[4],
        adaptFn: ({ value }) => {
          return value ? 'yes' : '';
        },
      }),
    ];
  }
}

export const EligibilityForm = FormFactory.createSubForm(EligibilityTemplate);
