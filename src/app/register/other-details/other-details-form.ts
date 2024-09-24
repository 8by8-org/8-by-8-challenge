import {
  SubFormTemplate,
  FormFactory,
  Field,
  PersistentField,
  PersistentControlledExcludableField,
  StringValidators,
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

    private readonly key = 'otherDetails';

    public constructor() {
      super();

      const party = new PersistentField({
        name: 'party',
        key: this.key + '.party',
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
        new PersistentControlledExcludableField({
          name: 'otherParty',
          key: this.key + '.otherParty',
          controller: party,
          initFn: ({ value }) => {
            return {
              value: '',
              exclude: !/^other$/i.test(value),
            };
          },
          controlFn: ({ value }) => {
            return {
              exclude: !/^other$/i.test(value),
            };
          },
          validators: [
            StringValidators.required({
              invalidMessage: 'Please enter your political party.',
            }),
          ],
        }),
        new PersistentField({
          name: 'changedParties',
          key: this.key + '.changedParties',
          defaultValue: false,
        }),
        new PersistentField({
          name: 'race',
          key: this.key + '.race',
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
