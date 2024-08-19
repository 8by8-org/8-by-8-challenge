import { ExcludableTemplate, FormFactory } from 'fully-formed';
import { NameTemplate } from './name-template';

class PreviousNameTemplate
  extends NameTemplate<'previousName'>
  implements ExcludableTemplate
{
  public readonly excludeByDefault = true;

  public constructor() {
    super('previousName', 'prev');
  }
}

export const PreviousNameForm =
  FormFactory.createExcludableSubForm(PreviousNameTemplate);
