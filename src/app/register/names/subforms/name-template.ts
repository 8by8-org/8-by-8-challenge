import {
  SubFormTemplate,
  Field,
  NonTransientField,
  StringValidators,
} from 'fully-formed';

export class NameTemplate<T extends string> extends SubFormTemplate {
  public readonly name: T;
  public readonly autoTrim = true;
  public readonly fields: [
    NonTransientField<'title', string>,
    NonTransientField<'first', string>,
    NonTransientField<'middle', string>,
    NonTransientField<'last', string>,
    NonTransientField<'suffix', string>,
  ];

  public constructor(name: T, idPrefix?: string) {
    super();
    this.name = name;
    this.fields = [
      new Field({
        name: 'title',
        id: this.applyIdPrefix('title', idPrefix),
        defaultValue: '',
        validators: [
          StringValidators.required({
            invalidMessage: 'Please select a title.',
          }),
        ],
      }),
      new Field({
        name: 'first',
        id: this.applyIdPrefix('first', idPrefix),
        defaultValue: '',
        validators: [
          StringValidators.required({
            invalidMessage: 'Please enter your first name.',
            trimBeforeValidation: true,
          }),
        ],
      }),
      new Field({
        name: 'middle',
        id: this.applyIdPrefix('middle', idPrefix),
        defaultValue: '',
      }),
      new Field({
        name: 'last',
        id: this.applyIdPrefix('last', idPrefix),
        defaultValue: '',
        validators: [
          StringValidators.required({
            invalidMessage: 'Please enter your last name.',
            trimBeforeValidation: true,
          }),
        ],
      }),
      new Field({
        name: 'suffix',
        id: this.applyIdPrefix('suffix', idPrefix),
        defaultValue: '',
      }),
    ];
  }

  private applyIdPrefix(id: string, idPrefix?: string) {
    return idPrefix ? `${idPrefix}_${id}` : id;
  }
}
