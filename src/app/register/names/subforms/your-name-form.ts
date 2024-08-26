import { FormFactory } from 'fully-formed';
import { NameTemplate } from './name-template';

class YourNameTemplate extends NameTemplate<'yourName'> {
  public constructor() {
    super('yourName');
  }
}

export const YourNameForm = FormFactory.createSubForm(YourNameTemplate);
