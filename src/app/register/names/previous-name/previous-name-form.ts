import {
  FormFactory,
  PersistentExcludableSubFormTemplate,
  PersistentField,
  StringValidators,
} from 'fully-formed';

export const PreviousNameForm = FormFactory.createPersistentExcludableSubForm(
  class PreviousNameTemplate extends PersistentExcludableSubFormTemplate {
    public readonly name = 'previousName';
    public readonly key = 'names.previous';
    public readonly autoTrim = true;
    public readonly excludeByDefault = true;

    public readonly fields = [
      new PersistentField({
        name: 'title',
        id: 'previous-title',
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
        id: 'previous-first',
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
        id: 'previous-middle',
        key: this.key + '.middle',
        defaultValue: '',
      }),
      new PersistentField({
        name: 'last',
        id: 'previous-last',
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
        id: 'previous-suffix',
        key: this.key + '.suffix',
        defaultValue: '',
      }),
    ];
  },
);
