import {
  FormFactory,
  SubFormTemplate,
  PersistentField,
  StringValidators,
} from 'fully-formed';

export const YourNameForm = FormFactory.createSubForm(
  class YourNameTemplate extends SubFormTemplate {
    public readonly name = 'yourName';
    public readonly autoTrim = true;
    private readonly key = 'names.yourName';

    public readonly fields = [
      new PersistentField({
        name: 'title',
        key: this.key + '.title',
        defaultValue: '',
        validators: [
          StringValidators.required({
            invalidMessage: 'Please select a title.',
          }),
        ],
      }),
      new PersistentField({
        name: 'first',
        key: this.key + '.first',
        defaultValue: '',
        validators: [
          StringValidators.required({
            invalidMessage: 'Please enter your first name.',
            trimBeforeValidation: true,
          }),
        ],
      }),
      new PersistentField({
        name: 'middle',
        key: this.key + '.middle',
        defaultValue: '',
      }),
      new PersistentField({
        name: 'last',
        key: this.key + '.last',
        defaultValue: '',
        validators: [
          StringValidators.required({
            invalidMessage: 'Please enter your last name.',
            trimBeforeValidation: true,
          }),
        ],
      }),
      new PersistentField({
        name: 'suffix',
        key: this.key + '.suffix',
        defaultValue: '',
      }),
    ];
  },
);
