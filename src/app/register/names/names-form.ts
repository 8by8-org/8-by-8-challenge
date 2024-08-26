import { YourNameForm } from './subforms/your-name-form';
import { PreviousNameForm } from './subforms/previous-name-form';
import { SubFormTemplate, FormFactory } from 'fully-formed';

class NameTemplate extends SubFormTemplate {
  public readonly name = 'names';
  public readonly fields = [new YourNameForm(), new PreviousNameForm()];
}

export const NamesForm = FormFactory.createSubForm(NameTemplate);
