import { getFirstNonValidInputId } from '@/app/register/names/utils/get-first-non-valid-input-id';
import { NamesForm } from '@/app/register/names/names-form';

describe('getFirstNonValidInputId', () => {
  it(`returns the first non-valid field id and null if all fields are valid.`, () => {
    const namesForm = new NamesForm();
    expect(getFirstNonValidInputId(namesForm)).toBe(
      namesForm.fields.yourName.fields.title.id,
    );

    namesForm.fields.yourName.fields.title.setValue('Ms.');
    expect(getFirstNonValidInputId(namesForm)).toBe(
      namesForm.fields.yourName.fields.first.id,
    );

    namesForm.fields.yourName.fields.first.setValue('Test');
    expect(getFirstNonValidInputId(namesForm)).toBe(
      namesForm.fields.yourName.fields.last.id,
    );

    namesForm.fields.yourName.fields.last.setValue('User');
    expect(getFirstNonValidInputId(namesForm)).toBe(null);

    namesForm.fields.previousName.setExclude(false);
    expect(getFirstNonValidInputId(namesForm)).toBe(
      namesForm.fields.previousName.fields.title.id,
    );

    namesForm.fields.previousName.fields.title.setValue('Ms.');
    expect(getFirstNonValidInputId(namesForm)).toBe(
      namesForm.fields.previousName.fields.first.id,
    );

    namesForm.fields.previousName.fields.first.setValue('Test');
    expect(getFirstNonValidInputId(namesForm)).toBe(
      namesForm.fields.previousName.fields.last.id,
    );

    namesForm.fields.previousName.fields.last.setValue('User');
    expect(getFirstNonValidInputId(namesForm)).toBe(null);
  });
});
