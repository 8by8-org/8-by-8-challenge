import {
  SubFormTemplate,
  Field,
  FormFactory,
  StringValidators,
} from 'fully-formed';

export const OtherInfoForm = FormFactory.createSubForm(
  class OtherInfoTemplate extends SubFormTemplate {
    public readonly name = 'otherDetails';
    public readonly autoTrim = true;
    public readonly fields = [
      new Field({
        name: 'party',
        defaultValue: '',
      }),
      new Field({
        name: 'changedParties',
        defaultValue: false,
      }),
      new Field({
        name: 'race',
        defaultValue: '',
        validators: [
          StringValidators.required({
            invalidMessage: 'Please select an option.',
          }),
        ],
      }),
      new Field({
        name: 'id',
        defaultValue: '',
        validators: [
          StringValidators.required({
            invalidMessage: 'Please enter your id number.',
          }),
        ],
      }),
    ];

    public constructor() {
      super();
    }
  },
);
