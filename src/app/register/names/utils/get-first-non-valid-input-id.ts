import { NamesForm } from '../names-form';
import { ValidityUtils } from 'fully-formed';

export function getFirstNonValidInputId(
  namesForm: InstanceType<typeof NamesForm>,
): string | null {
  const { yourName, previousName } = namesForm.fields;

  if (!ValidityUtils.isValid(yourName.fields.title)) {
    return yourName.fields.title.id;
  }

  if (!ValidityUtils.isValid(yourName.fields.first)) {
    return yourName.fields.first.id;
  }

  if (!ValidityUtils.isValid(yourName.fields.last)) {
    return yourName.fields.last.id;
  }

  if (!previousName.state.exclude) {
    if (!ValidityUtils.isValid(previousName.fields.title)) {
      return previousName.fields.title.id;
    }

    if (!ValidityUtils.isValid(previousName.fields.first)) {
      return previousName.fields.first.id;
    }

    if (!ValidityUtils.isValid(previousName.fields.last)) {
      return previousName.fields.last.id;
    }
  }

  return null;
}
