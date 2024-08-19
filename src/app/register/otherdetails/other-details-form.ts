import {
  SubFormTemplate,
  ControlledExcludableField,
  ExcludableField,
  Field,
  FormFactory,
  NonTransientField,
  StringValidators,
  type TransientField,
  type IAdapter,
} from 'fully-formed';

class OtherDetailsTemplate extends SubFormTemplate {
  public readonly name = 'otherDetails';
  public readonly autoTrim = true;

  public readonly fields = [];

  public constructor() {
    super();
  }
}

export const OtherDetailsForm = FormFactory.createSubForm(OtherDetailsTemplate);
