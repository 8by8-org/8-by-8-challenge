import {
  SubFormTemplate,
  Field,
  FormFactory,
  StringValidators,
  ControlledExcludableField,
  Group,
  Adapter,
  type TransientField,
  type NonTransientField,
  type IField,
  type ExcludableField,
  type IAdapter,
  type IGroup,
  type Excludable,
} from 'fully-formed';

export const OtherDetailsForm = FormFactory.createSubForm(
  class OtherDetailsTemplate extends SubFormTemplate {
    public readonly name = 'otherDetails';
    public readonly autoTrim = true;
    public readonly fields: [
      TransientField<'party', string>,
      TransientField<'otherParty', string> & Excludable,
      NonTransientField<'changedParties', boolean>,
      NonTransientField<'race', string>,
      NonTransientField<'id', string>,
    ];

    public readonly groups: [
      IGroup<
        'partyGroup',
        [IField<'party', string>, ExcludableField<'otherParty', string>]
      >,
    ];

    public readonly adapters: [IAdapter<'party', string>];

    public constructor() {
      super();

      const party = new Field({
        name: 'party',
        defaultValue: '',
        transient: true,
        validators: [
          StringValidators.required({
            invalidMessage:
              'Please select a political party. If you do not see your party listed, select "Other."',
          }),
        ],
      });

      this.fields = [
        party,
        new ControlledExcludableField({
          name: 'otherParty',
          controller: party,
          initFn: ({ value }) => {
            return {
              value: '',
              exclude: value !== 'other',
            };
          },
          controlFn: ({ value }) => {
            return {
              exclude: value !== 'other',
            };
          },
          validators: [
            StringValidators.required({
              invalidMessage: 'Please enter your political party.',
            }),
          ],
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
          validators: [StringValidators.required()],
        }),
      ];

      this.groups = [
        new Group({
          name: 'partyGroup',
          members: [this.fields[0], this.fields[1]],
        }),
      ];

      this.adapters = [
        new Adapter({
          name: 'party',
          source: this.groups[0],
          adaptFn: ({ value }) => {
            if (value.otherParty) {
              return value.otherParty;
            }

            return value.party;
          },
        }),
      ];
    }
  },
);
